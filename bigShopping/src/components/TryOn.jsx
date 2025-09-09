// src/components/TryOn.jsx
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import * as poseDetection from "@tensorflow-models/pose-detection";

import SnapshotButton from "./SnapshotButton";
import shirtImg from "../assets/cloth/tshirt.png";
import "../css/TryOn.css";

export default function TryOn() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Smoothing refs for animated HUD
  const smoothRef = useRef({
    shoulderWidth: 0,
    torsoLength: 0,
    hipWidth: 0,
    armLength: 0
  });

  useEffect(() => {
    let detector;
    let rafId;
    const img = new Image();
    img.src = shirtImg;

    // smoothing factor for lerp (0..1), higher = faster
    const SMOOTH = 0.18;

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
          // ensure canvas matches video resolution
          const vw = videoEl.videoWidth;
          const vh = videoEl.videoHeight;
          if (canvasEl.width !== vw) canvasEl.width = vw;
          if (canvasEl.height !== vh) canvasEl.height = vh;

          const ctx = canvasEl.getContext("2d");
          // clear whole canvas first (we redraw shirt + HUD each frame)
          ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

          // Pose detection
          const [pose] = await detector.estimatePoses(videoEl, {
            flipHorizontal: false, // we're mirroring with CSS stage transform
            maxPoses: 1,
          });

          // --- DRAW SHIRT OVERLAY (same as before) ---
          if (pose && pose.keypoints) {
            const kp = (name) => pose.keypoints.find((p) => p.name === name);
            let ls = kp("left_shoulder");
            let rs = kp("right_shoulder");
            const lh = kp("left_hip");
            const rh = kp("right_hip");
            const le = kp("left_elbow");
            const re = kp("right_elbow");

            if (ls?.score > 0.3 && rs?.score > 0.3) {
              // facing detection & fix
              const facingFront = ls.x > rs.x;
              if (facingFront) [ls, rs] = [rs, ls];

              const cx = (ls.x + rs.x) / 2;
              const cy = (ls.y + rs.y) / 2;
              const shoulderWidth = Math.hypot(rs.x - ls.x, rs.y - ls.y);
              const angle = Math.atan2(rs.y - ls.y, rs.x - ls.x);

              // scale shirt by shoulderWidth
              const width = shoulderWidth * 2.3;
              const height = width * 1.0;

              // offsets (tweakable)
              const verticalOffset = -shoulderWidth * 0.4;
              const horizontalOffset = 0;

              ctx.save();
              ctx.translate(cx + horizontalOffset, cy + verticalOffset);
              ctx.rotate(angle);
              if (!facingFront) ctx.scale(-1, 1);

              if (img.complete) {
                ctx.drawImage(img, -width / 2, 0, width, height);
              } else {
                ctx.fillStyle = "rgba(0,200,255,0.35)";
                ctx.fillRect(-width / 2, 0, width, height);
              }
              ctx.restore();

              // --- MEASUREMENTS (raw) ---
              const shoulderWidthRaw = shoulderWidth;
              const torsoLengthRaw = Math.hypot(
                (ls.x + rs.x) / 2 - (lh.x + rh.x) / 2,
                (ls.y + rs.y) / 2 - (lh.y + rh.y) / 2
              );
              const hipWidthRaw = Math.hypot(rh.x - lh.x, rh.y - lh.y);
              const armLengthRaw =
                (le && re)
                  ? (Math.hypot(le.x - ls.x, le.y - ls.y) + Math.hypot(re.x - rs.x, re.y - rs.y)) / 2
                  : 0;

              // smooth (lerp)
              const s = smoothRef.current;
              s.shoulderWidth = s.shoulderWidth + (shoulderWidthRaw - s.shoulderWidth) * SMOOTH;
              s.torsoLength = s.torsoLength + (torsoLengthRaw - s.torsoLength) * SMOOTH;
              s.hipWidth = s.hipWidth + (hipWidthRaw - s.hipWidth) * SMOOTH;
              s.armLength = s.armLength + (armLengthRaw - s.armLength) * SMOOTH;
            }
          }

          // --- DRAW HUD (on top) ---
          drawHUD(ctx, canvasEl, smoothRef.current);

        } // end if video ready

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

  // Draw HUD function - keeps HUD inside canvas bounds, mirrored to match stage
  function drawHUD(ctx, canvas, smoothed) {
    if (!canvas) return;
    const cw = canvas.width;
    const ch = canvas.height;

    // HUD box size (responsive)
    const boxW = Math.min(360, Math.round(cw * 0.35));
    const boxH = 130;
    const padding = 12;
    const corner = 10;

    // choose left/top positions in canvas coordinates (these positions will be mirrored)
    const boxX = 10;
    const boxY = 10;

    // Convert measurement px values to normalized percent for bars using heuristic ranges
    // (These ranges are adjustable to your expected camera distance / subject)
    const ranges = {
      shoulder: { min: 60, max: 220 }, // px
      torso: { min: 120, max: 450 },
      hip: { min: 80, max: 300 },
      arm: { min: 60, max: 300 },
    };

    const pct = (val, range) => {
      if (!val || !range) return 0;
      const p = (val - range.min) / (range.max - range.min);
      return Math.max(0, Math.min(1, p));
    };

    const shoulderPct = pct(smoothed.shoulderWidth, ranges.shoulder);
    const torsoPct = pct(smoothed.torsoLength, ranges.torso);
    const hipPct = pct(smoothed.hipWidth, ranges.hip);
    const armPct = pct(smoothed.armLength, ranges.arm);

    // HUD drawing: we must mirror the drawing so text is readable when stage uses CSS mirror
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-cw, 0); // now coordinates behave mirrored

    // Clear HUD area (only where HUD draws) to avoid smearing
    ctx.clearRect(cw - (boxX + boxW + 6), boxY - 6, boxW + 12, boxH + 12);

    // Panel background (semi-transparent rounded rect)
    drawRoundedRect(ctx, cw - (boxX + boxW), boxY, boxW, boxH, corner, "rgba(0,0,0,0.5)");

    // Title
    ctx.fillStyle = "#00fefe";
    ctx.font = `${Math.round(cw * 0.028)}px "Segoe UI", Arial`;
    ctx.textAlign = "left";
    ctx.fillText("Fit Analytics", cw - (boxX + boxW) + padding, boxY + 24);

    // Draw lines + bars
    const labelX = cw - (boxX + boxW) + padding;
    const barX = labelX + 120;
    const barW = boxW - (padding * 2) - 120;
    const spacing = 26;
    let y = boxY + 44;

    // helper for each stat
    drawStatRow(ctx, "Shoulder", Math.round(smoothed.shoulderWidth), shoulderPct, labelX, y, barX, barW);
    y += spacing;
    drawStatRow(ctx, "Torso", Math.round(smoothed.torsoLength), torsoPct, labelX, y, barX, barW);
    y += spacing;
    drawStatRow(ctx, "Hip", Math.round(smoothed.hipWidth), hipPct, labelX, y, barX, barW);
    y += spacing;
    drawStatRow(ctx, "Arm", Math.round(smoothed.armLength), armPct, labelX, y, barX, barW);

    ctx.restore();
  }

  // rounded rect helper
  function drawRoundedRect(ctx, x, y, w, h, r, fillStyle) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  // draws a row: label, numeric, progress bar
  function drawStatRow(ctx, label, value, pct, lx, ly, bx, bw) {
    // label
    ctx.fillStyle = "#bfefff";
    ctx.font = `${Math.round(ctx.canvas.width * 0.024)}px Arial`;
    ctx.textAlign = "left";
    ctx.fillText(label, lx, ly - 4);

    // numeric (right of label)
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.round(ctx.canvas.width * 0.02)}px Arial`;
    ctx.fillText(`${value}px`, lx + 70, ly - 4);

    // bar background
    const barH = 10;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(bx, ly - barH, bw, barH);

    // animated bar fill (use pct)
    // color gradient from green to orange to red
    const grd = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    grd.addColorStop(0, "#4caf50");
    grd.addColorStop(0.6, "#ffb74d");
    grd.addColorStop(1, "#ff5252");
    ctx.fillStyle = grd;
    ctx.fillRect(bx, ly - barH, Math.max(2, Math.round(bw * pct)), barH);

    // small border
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.strokeRect(bx, ly - barH, bw, barH);
  }

  return (
    <div className="tryon-container">
      <h1 className="title">👕 Virtual Try-On</h1>

      <div className="stage">
        <Webcam
          ref={webcamRef}
          className="video"
          audio={false}
          screenshotFormat="image/jpeg"
          // keep resolution conservative to avoid excessive zoom
          videoConstraints={{ facingMode: "user", width: 640, height: 800 }}
        />
        <canvas ref={canvasRef} className="overlay" />
      </div>

      {!ready && <div className="status">Loading camera & AI…</div>}

      <div className="controls">
        <SnapshotButton webcamRef={webcamRef} canvasRef={canvasRef} />
        {/* add other control buttons here */}
      </div>
    </div>
  );
}
