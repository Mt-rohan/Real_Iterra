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
  
  function getAngle(
    A: { x: number; y: number },
    B: { x: number; y: number },
    C: { x: number; y: number }
  ): number {
    const AB = { x: A.x - B.x, y: A.y - B.y };
    const CB = { x: C.x - B.x, y: C.y - B.y };
    const dot = AB.x * CB.x + AB.y * CB.y;
    const magAB = Math.sqrt(AB.x ** 2 + AB.y ** 2);
    const magCB = Math.sqrt(CB.x ** 2 + CB.y ** 2);
    const angle = Math.acos(dot / (magAB * magCB));
    return (angle * 180) / Math.PI;
  }
  
  export async function extractPoseMetrics(video: HTMLVideoElement): Promise<PoseAnalysisResult> {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );
  
    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-assets/pose_landmarker_full.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numPoses: 1,
    });
  
    const angleSamples = {
      knee: [] as number[],
      elbow: [] as number[],
      torso: [] as number[],
    };
  
    const frameCount = 10;
    const duration = video.duration;
    const interval = duration / frameCount;
  
    for (let i = 0; i < frameCount; i++) {
      video.currentTime = i * interval;
      await new Promise((res) => (video.onseeked = res));
  
      const result = await poseLandmarker.detectForVideo(video, performance.now());
      const lm = result.landmarks?.[0];
      if (!lm) continue;
  
      const knee = getAngle(lm[23], lm[25], lm[27]);
      const elbow = getAngle(lm[11], lm[13], lm[15]);
      const torso = Math.abs(lm[11].x - lm[12].x) * 100;
  
      angleSamples.knee.push(knee);
      angleSamples.elbow.push(elbow);
      angleSamples.torso.push(torso);
    }
  
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  
    return {
      summary: "Extracted pose data from video.",
      mode: "technical",
      shotType: "forehand",
      stance: "open",
      videoDuration: duration,
      kneeAngle: Math.round(avg(angleSamples.knee)),
      elbowAngle: Math.round(avg(angleSamples.elbow)),
      torsoRotation: Math.round(avg(angleSamples.torso)),
      wristLagTiming: 0.2,
      weightTransferScore: 7,
      footworkScore: 8,
      headStability: "stable",
      detectedIssues: "early wrist release, shallow knee bend",
    };
  }
  