// src/components/AnalyticsOverlay.jsx
import React from "react";

export default function AnalyticsOverlay({ pose }) {
  if (!pose?.keypoints) return null;

  const kp = (name) => pose.keypoints.find((p) => p.name === name);

  const ls = kp("left_shoulder");
  const rs = kp("right_shoulder");
  const lh = kp("left_hip");
  const rh = kp("right_hip");

  if (!ls || !rs || !lh || !rh) return null;

  // Shoulder & hip width
  const shoulderWidth = Math.abs(rs.x - ls.x);
  const hipWidth = Math.abs(rh.x - lh.x);

  // Heuristic: pick suggested size based on shoulder width
  let suggestedSize = "M";
  if (shoulderWidth < 80) suggestedSize = "S";
  else if (shoulderWidth > 140) suggestedSize = "L";
  if (shoulderWidth > 180) suggestedSize = "XL";

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        color: "#00ffea",
        fontSize: "16px",
        fontWeight: "bold",
        textShadow: "1px 1px 2px #000",
        pointerEvents: "none",
      }}
    >
      <p>Shoulder Width: {shoulderWidth.toFixed(1)} px</p>
      <p>Hip Width: {hipWidth.toFixed(1)} px</p>
      <p>Suggested Size: {suggestedSize}</p>
    </div>
  );
}
