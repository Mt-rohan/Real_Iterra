// src/lib/extractPoseMetrics.ts

import {
    FilesetResolver,
    PoseLandmarker,
  } from "@mediapipe/tasks-vision";
  
  export interface PoseMetrics {
    mode: "technical" | "tactical";
    shotType: string;
    stance: string;
    videoDuration: number;
    kneeAngle: number;
    elbowAngle: number;
    torsoRotation: number;
    wristLagTiming: number;
    weightTransferScore: number;
    footworkScore: number;
    headStability: string;
    detectedIssues: string;
  }
  
  export interface PoseAnalysisResult extends PoseMetrics {
    summary: string;
  }
  
  // Helper function to calculate the angle between three points
  function getAngle(
    A: { x: number; y: number }, // Point A
    B: { x: number; y: number }, // Point B (vertex of the angle)
    C: { x: number; y: number }  // Point C
  ): number {
    // Calculate vectors AB and CB
    const AB = { x: A.x - B.x, y: A.y - B.y };
    const CB = { x: C.x - B.x, y: C.y - B.y };
  
    // Calculate dot product of AB and CB
    const dot = AB.x * CB.x + AB.y * CB.y;
  
    // Calculate magnitudes of AB and CB
    const magAB = Math.sqrt(AB.x ** 2 + AB.y ** 2);
    const magCB = Math.sqrt(CB.x ** 2 + CB.y ** 2);
  
    // Calculate the angle in radians using the dot product formula
    const angleRad = Math.acos(dot / (magAB * magCB));
  
    // Convert the angle from radians to degrees
    return (angleRad * 180) / Math.PI;
  }
  
  // Main function to extract pose metrics from a video element
  export async function extractPoseMetrics(video: HTMLVideoElement): Promise<PoseAnalysisResult> {
    // Initialize the FilesetResolver for MediaPipe vision tasks
    // This points to the location of the Wasm binaries and other assets
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm" // Using @latest to get the newest stable version
    );
  
    // Create the PoseLandmarker instance
    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        // *** THIS IS THE CORRECTED PART ***
        // The modelAssetPath needs to be a string (in quotes)
        // and followed by a comma.
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        delegate: "GPU", // Use GPU for processing if available
      },
      runningMode: "VIDEO", // Set to process video input
      numPoses: 1,          // Detect only one pose (the primary player)
    });
  
    // Object to store samples of angles over several frames
    const angleSamples = {
      knee: [] as number[],
      elbow: [] as number[],
      torso: [] as number[],
    };
  
    const frameCount = 10; // Number of frames to sample from the video
    const duration = video.duration; // Total duration of the video
    const interval = duration / frameCount; // Time interval between sampled frames
  
    // Loop through the specified number of frames
    for (let i = 0; i < frameCount; i++) {
      video.currentTime = i * interval; // Set the video to the current frame time
      // Wait for the video to seek to the correct time
      await new Promise<void>((resolve) => {
        // It's safer to remove the listener after it fires or use `once: true` if available
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          resolve();
        };
        video.addEventListener('seeked', onSeeked);
      });
  
      // Detect pose landmarks for the current video frame
      const result = await poseLandmarker.detectForVideo(video, performance.now());
      const landmarks = result.landmarks?.[0]; // Get landmarks for the first detected pose
      
      // If no landmarks are detected, skip to the next frame
      if (!landmarks) continue;
  
      // Calculate angles for knee, elbow, and torso
      // The indices (e.g., 23, 25, 27) correspond to specific MediaPipe pose landmarks
      const knee = getAngle(landmarks[23], landmarks[25], landmarks[27]); // Example: LeftKnee, LeftAnkle, LeftHip
      const elbow = getAngle(landmarks[11], landmarks[13], landmarks[15]); // Example: LeftShoulder, LeftElbow, LeftWrist
      
      // Torso rotation can be more complex; this is a simplified example
      // It might represent the horizontal distance between shoulders as a proxy
      const torso = Math.abs(landmarks[11].x - landmarks[12].x) * 100; 
  
      // Add calculated angles to their respective sample arrays
      angleSamples.knee.push(knee);
      angleSamples.elbow.push(elbow);
      angleSamples.torso.push(torso);
    }
  
    // Helper function to calculate the average of an array of numbers
    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  
    // Return the analysis result with calculated metrics
    // Some values are placeholders and would need more sophisticated calculation
    return {
      summary: "Extracted pose data from video.",
      mode: "technical",
      shotType: "forehand", // Placeholder
      stance: "open",       // Placeholder
      videoDuration: duration,
      kneeAngle: Math.round(avg(angleSamples.knee)),
      elbowAngle: Math.round(avg(angleSamples.elbow)),
      torsoRotation: Math.round(avg(angleSamples.torso)),
      wristLagTiming: 0.2,  // Placeholder
      weightTransferScore: 7, // Placeholder
      footworkScore: 8,       // Placeholder
      headStability: "stable",// Placeholder
      detectedIssues: "early wrist release, shallow knee bend", // Placeholder
    };
  }
