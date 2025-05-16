'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FeedbackDisplay from "../../components/FeedbackDisplay";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function MyUploads() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoUrl = searchParams.get("videoUrl") || "";
  const poseSummary = searchParams.get("poseSummary") || "";
  const tipsParam = searchParams.get("tips") || "[]";

  const [tips, setTips] = useState<string[]>([]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(tipsParam);
      setTips(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("Error parsing tips JSON:", err);
      setError("Error loading feedback data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [tipsParam]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white font-sans flex items-center justify-center">
        <LoadingSpinner message="Loading your feedback..." />
      </main>
    );
  }

  if (error || !videoUrl) {
    return (
      <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-red-500 text-center max-w-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300 mb-4">
            {error || "Missing video data. Please upload a video first."}
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-accent text-white rounded-full font-medium hover:bg-accent-dark transition"
          >
            ← Back to Dashboard
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center justify-start py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Upload</h1>
        <p className="text-lg text-gray-300">Review your personalized feedback</p>
      </div>

      <div className="w-full">
        <FeedbackDisplay
          videoUrl={videoUrl}
          poseSummary={poseSummary}
          tips={tips}
        />
      </div>

      {/* Marquee */}
      <div className="w-full mt-12 bg-background-light/5 border-t border-gray-800 py-4 overflow-hidden backdrop-blur-sm">
        <div className="whitespace-nowrap animate-marquee text-text-secondary text-base tracking-wider font-medium flex gap-12 px-6">
          <span>Helping junior players |</span>
          <span>Trusted by coaches worldwide |</span>
          <span>Affordable AI feedback |</span>
          <span>Strategic coaching insights</span>
        </div>
      </div>
    </main>
  );
}
