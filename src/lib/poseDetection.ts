// src/lib/poseDetection.ts

// 1. Register the WebGL backend so TFJS uses it
import '@tensorflow/tfjs-backend-webgl';

import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { PoseAnalysisResult } from '@/types';

/**
 * Initialize TF.js and ensure we’re using WebGL.
 */
export const initializeTF = async (): Promise<void> => {
  await tf.ready();
  await tf.setBackend('webgl');
  console.log('[poseDetection] TF ready on backend:', tf.getBackend());
};

/**
 * Load a BlazePose detector in TFJS mode.
 */
export const loadPoseDetectionModel = async (): Promise<poseDetection.PoseDetector> => {
  const model = poseDetection.SupportedModels.BlazePose;
  const config: poseDetection.BlazePoseModelConfig = {
    runtime: 'tfjs',
    modelType: 'full',
  };
  const detector = await poseDetection.createDetector(model, config);
  console.log('[poseDetection] Loaded BlazePose detector');
  return detector;
};

/**
 * Grab N evenly-spaced frames from a video element,
 * waiting for a valid duration before proceeding.
 */
export const extractVideoFrames = async (
  video: HTMLVideoElement,
  numFrames = 50
): Promise<HTMLCanvasElement[]> => {
  console.log('[poseDetection] Waiting for valid video.duration…');

  // Wait up to 2s for `video.duration` to populate
  const timeout = 2000;
  const interval = 100;
  let waited = 0;
  while ((!video.duration || isNaN(video.duration)) && waited < timeout) {
    await new Promise((r) => setTimeout(r, interval));
    waited += interval;
  }

  if (!video.duration || isNaN(video.duration)) {
    throw new Error('Video metadata (duration) not loaded.');
  }
  console.log(`[poseDetection] video.duration = ${video.duration}s`);

  const frames: HTMLCanvasElement[] = [];
  const step = video.duration / numFrames;

  for (let i = 0; i < numFrames; i++) {
    // Seek to the frame time (clamped just before the end)
    video.currentTime = Math.min(i * step, video.duration - 0.01);
    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
    });

    // Draw that frame into a canvas
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    frames.push(canvas);
  }

  console.log(`[poseDetection] Extracted ${frames.length} frames`);
  return frames;
};

/**
 * Run pose estimation on each frame and collate the first pose only.
 */
export const analyzePoses = async (
  detector: poseDetection.PoseDetector,
  frames: HTMLCanvasElement[]
): Promise<PoseAnalysisResult> => {
  console.log('[poseDetection] Estimating poses…');
  const poses: poseDetection.Pose[] = [];

  for (const frame of frames) {
    try {
      const predictions = await detector.estimatePoses(frame);
      if (predictions.length > 0) {
        poses.push(predictions[0]);
      }
    } catch (e) {
      console.warn('[poseDetection] estimatePoses error on frame:', e);
    }
  }

  if (poses.length === 0) {
    console.warn('[poseDetection] No poses detected — falling back');
    return {
      summary:
        "Could not detect any poses. Make sure your entire body is visible in the video.",
    };
  }

  return analyzePoseSequence(poses);
};

/**
 * Simplified analysis: average confidence of knees & elbows
 */
const analyzePoseSequence = (poses: poseDetection.Pose[]): PoseAnalysisResult => {
  let kneeScore = 0;
  let elbowScore = 0;

  poses.forEach((pose) => {
    pose.keypoints.forEach((kp) => {
      if (kp.name === 'left_knee' || kp.name === 'right_knee') {
        kneeScore += kp.score ?? 0;
      }
      if (kp.name === 'left_elbow' || kp.name === 'right_elbow') {
        elbowScore += kp.score ?? 0;
      }
    });
  });

  const totalJoints = poses.length * 2; // two knees, two elbows per pose
  kneeScore = kneeScore / totalJoints;
  elbowScore = elbowScore / totalJoints;

  const summary = `
    Player analysis:
    - Knees are ${kneeScore < 0.6 ? 'too straight' : 'properly bent'}.
    - Elbows are ${elbowScore < 0.5 ? 'stiff' : 'fluid'}.
  `
    .replace(/\s+/g, ' ')
    .trim();

  console.log('[poseDetection] Summary:', summary);
  return { summary };
};
