// src/components/VideoUploader.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage, auth, db } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  initializeTF,
  loadPoseDetectionModel,
} from "@/lib/poseDetection";
import { extractPoseMetrics, PoseAnalysisResult } from "@/lib/extractPoseMetrics";
import { generateAIFeedback } from "@/lib/openai";
import VideoPlayer from "./VideoPlayer";
import LoadingSpinner from "./LoadingSpinner";

const VideoUploader: React.FC = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);

  const [mode, setMode] = useState<"technical" | "tactical">("technical");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [metadataLoaded, setMetadataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMetadataLoaded(false);
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!videoEl) return;
    const onLoaded = () => setMetadataLoaded(true);
    videoEl.addEventListener("loadedmetadata", onLoaded);
    videoEl.load();
    return () => videoEl.removeEventListener("loadedmetadata", onLoaded);
  }, [videoEl, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setRateLimitExceeded(false);
    const sel = e.target.files?.[0] ?? null;
    if (sel && !["video/mp4", "video/quicktime"].includes(sel.type)) {
      setError("Please upload an MP4 or MOV file");
      setFile(null);
      return;
    }
    setFile(sel);
  };

  const handleSubmit = async () => {
    if (!file) return setError("Select a file first");
    if (!metadataLoaded) return setError("Waiting for video to load");
    if (!user) return setError("Please sign in to analyze");

    try {
      setError(null);
      setLoading(true);

      setLoadingMessage("Uploading video...");
      const downloadUrl = await uploadVideo(file);

      setLoadingMessage("Analyzing tennis form...");
      if (!videoEl) throw new Error("Video element not available");
      await initializeTF();
      await loadPoseDetectionModel();
      const poseResult: PoseAnalysisResult = await extractPoseMetrics(videoEl);

      setLoadingMessage("Generating coaching tips...");
      const aiFeedback = await generateAIFeedback({
        ...poseResult,
        mode,
      });

      const uploadRef = doc(db, "users", user.uid, "uploads", Date.now().toString());
      await setDoc(uploadRef, {
        mode,
        videoUrl: downloadUrl,
        summary: poseResult.summary,
        tips: aiFeedback.tips,
        createdAt: serverTimestamp(),
      });

      const params = new URLSearchParams({
        videoUrl: downloadUrl,
        poseSummary: poseResult.summary,
        tips: JSON.stringify(aiFeedback.tips),
        mode,
      });
      router.push(`/feedback?${params.toString()}`);
    } catch (err: any) {
      if (err.message?.includes("Rate limit exceeded")) {
        setRateLimitExceeded(true);
        return;
      }
      console.error(err);
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const ref = storageRef(storage, `videos/${Date.now()}-${file.name}`);
      const task = uploadBytesResumable(ref, file);
      task.on(
        "state_changed",
        (snap) => setUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100),
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        }
      );
    });

  const reset = () => {
    setFile(null);
    setError(null);
    setRateLimitExceeded(false);
    setUploadProgress(0);
    setMetadataLoaded(false);
    fileInputRef.current && (fileInputRef.current.value = "");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {loading ? (
        <div className="text-center">
          <LoadingSpinner message={loadingMessage} />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 mb-6">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      ) : rateLimitExceeded ? (
        <div className="text-center bg-yellow-100 text-yellow-800 border border-yellow-300 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Upload Limit Reached</h2>
          <p>You’ve used your 5 free uploads today.</p>
          <p className="mt-2">
            Upgrade to unlock unlimited feedback and advanced coaching.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="mode"
                value="technical"
                checked={mode === "technical"}
                onChange={() => setMode("technical")}
              />
              <span>Form Feedback</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="mode"
                value="tactical"
                checked={mode === "tactical"}
                onChange={() => setMode("tactical")}
              />
              <span>Rally Analysis</span>
            </label>
          </div>

          <div className="mb-6">
            <label htmlFor="video-upload" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Tennis Video (MP4 or MOV)
            </label>
            <input
              ref={fileInputRef}
              id="video-upload"
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {previewUrl && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Video Preview</h3>
              <VideoPlayer src={previewUrl} controls muted />
              <video
                ref={(el) => setVideoEl(el)}
                src={previewUrl}
                className="hidden"
                preload="auto"
              />
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              disabled={!file || !metadataLoaded}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                !file || !metadataLoaded
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Analyze {mode === "technical" ? "Form" : "Rally"}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 font-medium hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoUploader;
