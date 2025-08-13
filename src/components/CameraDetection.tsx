import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import Webcam from "react-webcam";

const CameraDetection = forwardRef((props, ref) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const animationRef = useRef<number>();

  // Expose video element to parent via ref
  useImperativeHandle(ref, () => ({
    get video() {
      return webcamRef.current?.video as HTMLVideoElement | undefined;
    },
  }));

  // Load the model
  useEffect(() => {
    cocoSsd.load().then((loadedModel) => {
      setModel(loadedModel);
      console.log("COCO-SSD model loaded");
    });
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Detection loop
  const detectObjects = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4 &&
      model
    ) {
      const video = webcamRef.current.video as HTMLVideoElement;
      const predictions = await model.detect(video);

      const canvas = canvasRef.current;
      if (canvas) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          predictions.forEach((prediction) => {
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.font = "18px Arial";
            ctx.fillStyle = "#00FFFF";
            ctx.fillText(
              `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
              x,
              y > 20 ? y - 5 : y + 20
            );
          });
        }
      }
    }
    animationRef.current = requestAnimationFrame(detectObjects);
  };

  useEffect(() => {
    if (model) {
      animationRef.current = requestAnimationFrame(detectObjects);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  return (
    <div style={{ position: "relative" }}>
      <Webcam
        ref={webcamRef}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        videoConstraints={{
          facingMode: "environment",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
});

export default CameraDetection;