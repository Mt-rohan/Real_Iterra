// Video player component
"use client";

import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  onLoadedData?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = false,
  muted = true,
  controls = true,
  className = '',
  onLoadedData
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && onLoadedData) {
      const handleLoadedData = () => {
        onLoadedData();
      };

      videoElement.addEventListener('loadeddata', handleLoadedData);
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [onLoadedData]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        controls={controls}
        className={`w-full h-auto ${className}`}
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
