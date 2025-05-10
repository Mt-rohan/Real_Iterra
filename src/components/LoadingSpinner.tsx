// Loading spinner component
"use client";

import React from 'react';
import { TailSpin } from 'react-loader-spinner';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <TailSpin
        height="60"
        width="60"
        color="#4F46E5"
        ariaLabel="tail-spin-loading"
        radius="1"
        visible={true}
      />
      <p className="mt-4 text-indigo-700 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
