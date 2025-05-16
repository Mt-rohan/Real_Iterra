import { getAuth } from "firebase/auth";
import { PoseMetrics } from "@/lib/extractPoseMetrics";

export interface AIFeedback {
  tips: string[];
  fullResponse: string;
}

export async function generateAIFeedback(
  data: PoseMetrics
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
      body: JSON.stringify(data),
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
