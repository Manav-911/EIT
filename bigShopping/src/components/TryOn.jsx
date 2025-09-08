// src/components/TryOn.jsx
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";
import shirtImg from "../assets/cloth/tshirt.png";
import "../css/TryOn.css";

export default function TryOn() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let detector;
    let rafId;

    const img = new Image();
    img.src = shirtImg;

    const init = async () => {
      await tf.setBackend("webgl");
      await tf.ready();

      detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      );

      setReady(true);

      const render = async () => {
        const videoEl = webcamRef.current?.video;
        const canvasEl = canvasRef.current;

        if (videoEl && videoEl.readyState === 4 && canvasEl) {
          // Match canvas size
          const vw = videoEl.videoWidth;
          const vh = videoEl.videoHeight;
          if (canvasEl.width !== vw) canvasEl.width = vw;
          if (canvasEl.height !== vh) canvasEl.height = vh;

          const ctx = canvasEl.getContext("2d");
          ctx.clearRect(0, 0, vw, vh);

          // Estimate pose
          const [pose] = await detector.estimatePoses(videoEl, {
            flipHorizontal: false, // keypoints match mirrored video
            maxPoses: 1,
          });

          if (pose && pose.keypoints) {
            const kp = (name) => pose.keypoints.find((p) => p.name === name);

            let ls = kp("left_shoulder");
            let rs = kp("right_shoulder");
            const lh = kp("left_hip");
            const rh = kp("right_hip");

            // --- SHIRT OVERLAY (fine-tuning ready) ---
            if (ls?.score > 0.3 && rs?.score > 0.3) {
              // Detect facing direction
              const facingFront = ls.x > rs.x;
              if (facingFront) [ls, rs] = [rs, ls]; // swap for correct orientation

              // Center between shoulders
              let cx = (ls.x + rs.x) / 2;
              let cy = (ls.y + rs.y) / 2;

              // Shoulder width and rotation
              const shoulderWidth = Math.hypot(rs.x - ls.x, rs.y - ls.y);
              const angle = Math.atan2(rs.y - ls.y, rs.x - ls.x);

              // Shirt size
              const width = shoulderWidth * 2.4;
              const height = width * 1.;

              // --- Fine-tuning offsets ---
              const verticalOffset = -shoulderWidth * 0.40; // adjust up/down
              const horizontalOffset = 0;                    // adjust left/right

              ctx.save();
              ctx.translate(cx + horizontalOffset, cy + verticalOffset);
              ctx.rotate(angle);

              // Flip horizontally if back facing
              if (!facingFront) ctx.scale(-1, 1);

              if (img.complete) {
                ctx.drawImage(img, -width / 2, 0, width, height);
              } else {
                ctx.fillStyle = "rgba(0, 200, 255, 0.35)";
                ctx.fillRect(-width / 2, 0, width, height);
              }

              ctx.restore();
            }

            // --- DEBUG: keypoints + skeleton ---

            /*
            ctx.lineWidth = 2;
            ctx.strokeStyle = "lime";
            ctx.fillStyle = "red";

            pose.keypoints.forEach((p) => {
              if (p.score > 0.3) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                ctx.fill();
              }
            });

            // Skeleton lines

            const drawLine = (p1, p2) => {
              if (p1?.score > 0.3 && p2?.score > 0.3) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            };
            drawLine(ls, rs);
            drawLine(ls, lh);
            drawLine(rs, rh);

            */
          }
        }

        rafId = requestAnimationFrame(render);
      };

      rafId = requestAnimationFrame(render);
    };

    init();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      detector?.dispose?.();
    };
  }, []);

  return (
    <div className="tryon-container">
      <h1 className="title">👕 Virtual Try-On</h1>
      <div className="stage">
        <Webcam
          ref={webcamRef}
          className="video"
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user" }}
        />
        <canvas ref={canvasRef} className="overlay" />
      </div>
      {!ready && <div className="status">Loading camera & AI…</div>}
    </div>
  );
}
