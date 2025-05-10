// src/app/page.tsx
"use client";

import React from "react";
import VideoUploader from "@/components/VideoUploader";
import SignInButton from "@/components/SignInButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      {/* ────────────────────────────────────────────────────── */}
      {/* Header with logo/title and Sign-In / Sign-Out */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-primary">Iterra</h1>
        <SignInButton />
      </header>

      {/* ────────────────────────────────────────────────────── */}
      {/* Hero / Landing Section (optional) */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white text-center py-16 px-4">
        <h2 className="text-4xl font-extrabold mb-4">Iterra: Your Computer-Vision Coach</h2>
        <p className="max-w-xl mx-auto mb-6 text-lg text-indigo-100">
          Get instant, personalized feedback on your tennis form—powered by cutting-edge vision 
          analysis and pro-level insight.
        </p>
      </section>

      {/* ────────────────────────────────────────────────────── */}
      {/* Uploader */}
      <main id="upload" className="flex-grow flex flex-col items-center justify-start py-12 px-4">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <VideoUploader />
          </div>
        </div>
      </main>

      {/* ────────────────────────────────────────────────────── */}
      {/* How It Works */}
      <footer className="bg-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-text-primary mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                {/* upload icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">Upload</h4>
              <p className="text-sm text-gray-600">MP4 or MOV video of your swing or rally.</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                {/* analyze icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">Analyze</h4>
              <p className="text-sm text-gray-600">Vision-driven pose detection & AI coaching tips.</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                {/* improve icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-800 mb-1">Improve</h4>
              <p className="text-sm text-gray-600">Actionable drills & strategy to power-up your game.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
