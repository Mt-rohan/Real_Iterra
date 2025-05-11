// Feedback display component
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import VideoPlayer from './VideoPlayer';

interface FeedbackDisplayProps {
  videoUrl: string;
  poseSummary: string;
  tips: string[];
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
  videoUrl,
  poseSummary,
  tips
}) => {
  const router = useRouter();
  
  const handleUploadAnother = () => {
    router.push('/');
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Video Analysis</h2>
        <VideoPlayer 
          src={videoUrl} 
          controls={true}
          className="rounded-xl shadow-lg"
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Pose Analysis</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700">{poseSummary}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Coach's Recommendations</h3>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <ul className="space-y-4">
            {tips.map((tip, index) => (
              <li key={index} className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="pt-1">
                  <p className="text-gray-700">{tip}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleUploadAnother}
          className="px-6 py-3 bg-indigo-600 rounded-md text-white font-medium hover:bg-indigo-700 shadow-md"
        >
          Upload Another Video
        </button>
      </div>
    </div>
  );
};

export default FeedbackDisplay;
