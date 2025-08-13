import React, { useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const CameraDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }, // back camera if on mobile
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      }
    };

    const runDetection = async () => {
      const model = await cocoSsd.load();
      setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const predictions = await model.detect(videoRef.current);

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // Clear previous drawings
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw video frame
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw predictions
        predictions.forEach(prediction => {
          if (prediction.class === "billboard" || prediction.score > 0.6) {
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 2;
            ctx.strokeRect(...(prediction.bbox as [number, number, number, number]));
            ctx.font = "16px Arial";
            ctx.fillStyle = "#00FF00";
            ctx.fillText(
              `${prediction.class} ${(prediction.score * 100).toFixed(1)}%`,
              prediction.bbox[0],
              prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
            );
          }
        });
      }, 200);
    };

    startCamera();
    runDetection();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ border: "2px solid #000" }}
      />
    </div>
  );
};

export default CameraDetection;
