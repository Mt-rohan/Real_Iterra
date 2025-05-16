// src/app/page.tsx
"use client";

import React from "react";
import VideoUploader from "../components/VideoUploader";
import SignInButton from "../components/SignInButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-light text-text-primary">
      <header className="bg-gradient-to-r from-primary to-accent py-12 text-center text-white">
        <h1 className="text-4xl font-bold">Iterra: Your Tennis Coach</h1>
        <p className="mt-2 text-lg">
          Personalized feedback to improve your game
        </p>
        <div className="mt-4">
          <SignInButton />
        </div>
      </header>

      <section id="upload" className="py-12 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">Upload Your Video</h2>
        <VideoUploader />
      </section>

      <section className="py-12 px-4 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <h3 className="font-semibold text-lg mb-1">1. Upload</h3>
            <p>Submit your tennis video in MP4 or MOV format</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">2. Analyze</h3>
            <p>We break down your movement, shot patterns, and form</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">3. Improve</h3>
            <p>Receive actionable tips, drills, and strategic coaching</p>
          </div>
        </div>
      </section>

      {/* 🚀 Scrolling Info Marquee */}
      <div className="w-full bg-black py-4 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee text-white text-lg font-medium tracking-wide">
          <span className="mx-8">We’ve helped junior players</span>
          <span className="mx-8">Supported coaches worldwide</span>
          <span className="mx-8">Affordable AI feedback training</span>
          <span className="mx-8">Tactical coaching for competitive juniors</span>
          <span className="mx-8">Boost your game with smart video analysis</span>
        </div>
      </div>
    </main>
  );
}
