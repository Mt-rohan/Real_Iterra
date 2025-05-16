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

    const { poseSummary, mode } = await req.json();
    if (!poseSummary || typeof poseSummary !== "string") {
      throw new Error("Invalid or missing pose summary");
    }

    const intro =
      mode === "tactical"
        ? `You are a world-class tennis strategy coach. Analyze the player's rally summary below and return actionable advice.`
        : `You are a world-class tennis technique coach. Analyze the player's form summary below and return actionable advice.`;

    const fullPrompt = `${intro}

Instructions:
- Identify 3 specific areas the player needs to improve
- For each area:
  - Explain why it matters at a high level
  - Say what the player is currently doing wrong
  - Suggest 1 actionable tennis drill (with constraints)
  - Optionally include a supporting fitness drill

Formatting:
- Use a numbered list
- Be concise but precise
- Avoid giving the same feedback repeatedly across sessions
- Respond like a dedicated, elite-level coach

Summary:
"${poseSummary}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a tennis coach giving elite-level, practical advice based on form or rally summaries.",
        },
        { role: "user", content: fullPrompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const fullResponse = completion.choices[0]?.message?.content || "";

    // New improved tip parser (multi-line per item)
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
