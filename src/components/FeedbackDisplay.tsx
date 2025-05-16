'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import VideoPlayer from './VideoPlayer';

interface FeedbackDisplayProps {
  videoUrl: string;
  poseSummary: string;
  tips: string[];
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  videoUrl,
  poseSummary,
  tips,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    // Simulate loading time — you can replace with actual data fetch timing
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleUploadAnother = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-10 px-4 py-12 animate-pulse">

        {/* Video Placeholder */}
        <div>
          <div className="h-60 bg-gray-800 rounded-lg shadow" />
        </div>

        {/* Pose Summary Placeholder */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="h-5 bg-gray-700 rounded w-1/3 mb-4" />
          <div className="h-3 bg-gray-700 rounded w-full mb-2" />
          <div className="h-3 bg-gray-700 rounded w-5/6 mb-2" />
          <div className="h-3 bg-gray-700 rounded w-2/3" />
        </div>

        {/* Tips Placeholder */}
        <div className="bg-gray-800 p-6 rounded-lg shadow space-y-4">
          <div className="h-5 bg-gray-700 rounded w-1/2 mb-2" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-gray-600" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-5/6 bg-gray-700 rounded" />
                <div className="h-3 w-3/4 bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Button Placeholder */}
        <div className="h-10 w-48 bg-gray-700 rounded-full mx-auto" />
      </div>
    );
  }

  // Final content when loading is complete
  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 px-4 py-12">

      {/* Video Section */}
      <div data-aos="fade-up">
        <h2 className="text-2xl font-semibold text-white mb-4">Your Video Analysis</h2>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <VideoPlayer src={videoUrl} controls className="rounded-lg" />
        </div>
      </div>

      {/* Pose Analysis */}
      <div className="bg-gray-800 p-6 rounded-lg shadow" data-aos="fade-up" data-aos-delay="100">
        <h3 className="text-xl font-bold text-white mb-3">Pose Analysis</h3>
        <p className="text-gray-300">{poseSummary || 'No pose data available.'}</p>
      </div>

      {/* Coach's Recommendations */}
      <div className="bg-gray-800 p-6 rounded-lg shadow" data-aos="fade-up" data-aos-delay="200">
        <h3 className="text-xl font-bold text-white mb-4">Coach’s Recommendations</h3>

        {tips.length === 0 ? (
          <p className="text-gray-400">No recommendations available for this upload.</p>
        ) : (
          <ul className="space-y-5">
            {tips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start"
                data-aos="fade-up"
                data-aos-delay={300 + index * 100}
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 bg-accent text-white flex items-center justify-center rounded-full font-bold">
                    {index + 1}
                  </div>
                </div>
                <p className="text-gray-300">{tip}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upload Again Button */}
      <div className="text-center pt-4" data-aos="zoom-in" data-aos-delay="300">
        <button
          onClick={handleUploadAnother}
          className="px-6 py-3 bg-accent text-white rounded-full font-semibold hover:bg-accent-dark transition shadow-lg"
        >
          Upload Another Video
        </button>
      </div>
    </div>
  );
};

export default FeedbackDisplay;
