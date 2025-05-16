'use client';

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import VideoUploader from '../components/VideoUploader';
import SignInButton from '../components/SignInButton';

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur border-b border-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Iterra</h1>
        <nav className="space-x-6 text-sm font-medium">
          <a href="#upload" className="hover:underline">Upload</a>
          <a href="#how-it-works" className="hover:underline">How It Works</a>
          <a href="#testimonials" className="hover:underline">Testimonials</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
        </nav>
      </header>

      {/* Hero */}
      {/* Hero Section (cleaned up) */}
      <section className="relative bg-gradient-to-br from-slate-800 via-gray-800 to-gray-900 bg-[length:200%_200%] animate-gradient-slow text-white pt-32 pb-32">
  {/* Sign-In Button — top right inside hero */}
  <div className="absolute top-10 right-6 z-10">
    <SignInButton />
  </div>

  <div className="text-center px-4">
    <h2 className="text-4xl md:text-5xl font-extrabold mb-3 animate-fade-in-up">
      Iterra: Your Tennis Coach
    </h2>
    <p className="text-lg text-gray-200 animate-fade-in-up delay-100">
      AI-powered feedback to level up your tennis game
    </p>
  </div>
</section>

<div className="h-4 bg-gradient-to-b from-gray-800 to-gray-950" />


      {/* Upload */}
      <section id="upload" className="py-16 px-6 max-w-3xl mx-auto text-center" data-aos="fade-up">
        <h2 className="text-3xl font-semibold mb-8">Upload Your Video</h2>
        <VideoUploader />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-900 rounded-xl max-w-6xl mx-auto shadow-inner" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left text-gray-300">
          {[
            { title: '1. Upload', desc: 'Submit your tennis video in MP4 or MOV format' },
            { title: '2. Analyze', desc: 'We break down your movement, shot patterns, and form' },
            { title: '3. Improve', desc: 'Receive actionable tips, drills, and strategic coaching' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition transform duration-300 group hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent">
                {item.title}
              </h3>
              <p className="group-hover:text-white">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 max-w-5xl mx-auto text-center" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-10">What Players & Coaches Say</h2>
        <div className="grid md:grid-cols-2 gap-8 text-left text-gray-300">
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <p className="italic mb-4">"Iterra helped me fix my serve rhythm in just one week. It's like having a coach on demand!"</p>
            <p className="font-semibold text-accent">— Ashwin, USTA Junior</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow">
            <p className="italic mb-4">"I recommend Iterra to every serious junior I train. It reinforces lessons and tracks improvement."</p>
            <p className="font-semibold text-accent">— Coach Ravi, High Performance Academy</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-900 max-w-6xl mx-auto text-center rounded-xl mt-12 shadow-inner" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-10">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left text-white">
          {[
            {
              title: 'Starter',
              price: 'Free',
              features: ['10 Video Analyses / month', 'Detailed AI feedback', 'Email support'],
            },
            {
              title: 'Pro',
              price: '$5/mo',
              features: ['30 Videos / month', 'Advanced form & strategy tips', 'Priority support'],
            },
            {
              title: 'Elite',
              price: '$9/mo',
              features: ['Unlimited videos', '1-on-1 tactical review', 'Custom coaching plans'],
            },
          ].map((plan, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transition">
              <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
              <p className="text-2xl font-bold text-accent mb-4">{plan.price}</p>
              <ul className="text-sm text-gray-300 space-y-2 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j}>• {feature}</li>
                ))}
              </ul>
              <button className="bg-accent text-white px-4 py-2 rounded-full font-medium hover:bg-accent-dark transition">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee - stays at the bottom */}
      <div className="w-full bg-background-light/5 border-t border-gray-800 py-4 overflow-hidden mt-16 backdrop-blur-sm">
        <div className="whitespace-nowrap animate-marquee text-text-secondary text-base tracking-wider font-medium flex gap-12 px-6">
          <span> Helping junior players |</span>
          <span> Trusted by coaches worldwide |</span>
          <span> Affordable AI feedback |</span>
          <span> Strategic coaching insights</span>
        </div>
      </div>
    </main>
  );
}
