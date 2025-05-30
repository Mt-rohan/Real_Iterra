"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FeedbackDisplay from "../../components/FeedbackDisplay";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function MyUploads() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoUrl = searchParams?.get("videoUrl") || "";
  const poseSummary = searchParams?.get("poseSummary") || "";
  const tipsParam = searchParams?.get("tips") || "[]";

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
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner message="Loading your feedback..." />
      </div>
    );
  }

  if (error || !videoUrl) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center max-w-lg">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">
            {error || "Missing video data. Please upload a video first."}
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Upload</h1>
        <p className="text-lg text-gray-600">Review your personalized feedback</p>
      </div>

      <div className="w-full">
        <FeedbackDisplay
          videoUrl={videoUrl}
          poseSummary={poseSummary}
          tips={tips}
        />
      </div>
    </main>
  );
}
