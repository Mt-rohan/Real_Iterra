// src/app/api/generate-feedback/route.ts

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminAuth, adminDB, adminFieldValue } from '@/lib/firebase-admin';
import { OpenAI } from "openai";

// OpenAI config
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DATE_KEY = () => new Date().toISOString().split("T")[0];

// Firestore-based rate limiter
async function checkAndIncrement(
  col: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>,
  id: string
) {
  const ref = col.doc(id);
  await adminDB.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = (snap.data()?.count as number) || 0;
    if (count >= 20) throw new Error("Rate limit exceeded");
    tx.set(ref, {
      count: count + 1,
      last: adminFieldValue.serverTimestamp(),
    });
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) throw new Error("Unauthorized");

    const { uid } = await adminAuth.verifyIdToken(match[1]);

    const logs = adminDB.collection("usage-logs").doc(DATE_KEY());
    await checkAndIncrement(logs.collection("uids"), uid);

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.ip ||
      "unknown";
    await checkAndIncrement(logs.collection("ips"), ip);

    // 🆕 Accept pose breakdown fields
    const {
      mode,
      shotType,
      stance,
      videoDuration,
      kneeAngle,
      elbowAngle,
      torsoRotation,
      wristLagTiming,
      weightTransferScore,
      footworkScore,
      headStability,
      detectedIssues,
    } = await req.json();

    // Basic validation
    if (!shotType || typeof kneeAngle !== "number" || typeof elbowAngle !== "number") {
      throw new Error("Missing required pose metrics");
    }

    const elitePrompt = `
You are a world-class tennis coach and biomechanics analyst working with an elite ATP-level player.

---

## VIDEO-BASED DATA (INPUT):

- Shot Type: ${shotType}
- Player Stance: ${stance}
- Video Duration: ${videoDuration}s
- Knee Bend Depth (avg): ${kneeAngle}°
- Elbow Extension Angle (peak): ${elbowAngle}°
- Torso Rotation (max): ${torsoRotation}°
- Wrist Lag Timing: ${wristLagTiming}s after load
- Weight Transfer Efficiency: ${weightTransferScore}/10
- Footwork Quality: ${footworkScore}/10
- Head Stability: ${headStability}
- Error Flags: ${detectedIssues}

---

## INSTRUCTIONS:

Analyze the player’s stroke using elite tennis coaching principles and biomechanics. Format your response like this:

1. **Form Summary**
2. **Why It Matters**
3. **Strategic Consideration**
4. **Actionable Drills**
5. **Quantitative Suggestions**

- Tone: high-performance, professional (ATP level)
- Use biomechanics terms (kinetic chain, rotational torque, etc.)
- Be direct, precise, no filler
- Limit response to 500 words max
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a tennis coach giving elite-level, practical advice based on pose estimation data.",
        },
        { role: "user", content: elitePrompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const fullResponse = completion.choices[0]?.message?.content || "";

    // Structured tip extraction (optional, keeps your UI behavior the same)
    const matches = fullResponse.match(/(?:^|\n)(\d\..*?)(?=(?:\n\d\.|\n*$))/gs);
    const tips = matches?.map((t) => t.trim()) || [];

    return NextResponse.json({ tips, fullResponse });
  } catch (err: any) {
    console.error("❌ GPT route error:", err.message || err);
    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err.message?.includes("Rate limit")) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
