// src/pages/api/generate-feedback.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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
    } = req.body;

    if (!shotType || typeof kneeAngle !== 'number' || typeof elbowAngle !== 'number') {
      return res.status(400).json({ message: 'Missing or invalid pose metrics' });
    }

    const prompt = `
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

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a tennis coach giving elite-level, practical advice based on pose estimation data.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    res.status(200).json({
      fullResponse: response.choices[0].message?.content || '',
    });

  } catch (error) {
    console.error("GPT error:", error);
    res.status(500).json({ message: 'Failed to generate feedback' });
  }
}
