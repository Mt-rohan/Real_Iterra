import { getAuth } from "firebase/auth";

export interface AIFeedback {
  tips: string[];
  fullResponse: string;
}

export async function generateAIFeedback(
  poseSummary: string,
  mode: "technical" | "tactical"
): Promise<AIFeedback> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("No signed-in user");

    const idToken = await user.getIdToken();

    const res = await fetch("/api/generate-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        mode,
        shotType: "serve",
        stance: "open",
        videoDuration: 4.2,
        kneeAngle: 87,
        elbowAngle: 132,
        torsoRotation: 40,
        wristLagTiming: 0.2,
        weightTransferScore: 7,
        footworkScore: 8,
        headStability: "stable",
        detectedIssues: "early wrist release, shallow knee bend",
      }),      
    });

    if (!res.ok) {
      const debug = await res.text();
      console.error("🛑 GPT route error:", res.status, debug);
      throw new Error("Failed to generate feedback");
    }

    const { tips, fullResponse } = await res.json();
    if (!tips?.length) throw new Error("GPT returned no tips");

    return { tips, fullResponse };
  } catch (error) {
    console.error("❌ generateAIFeedback failed:", error);
    return {
      tips: [
        "Unable to generate feedback right now.",
        "Please try again later.",
        "Contact support if the issue persists.",
      ],
      fullResponse: "",
    };
  }
}
