// src/components/SnapshotButton.jsx
import React from "react";

export default function SnapshotButton({ webcamRef, canvasRef }) {
  const handleSnapshot = () => {
    const videoEl = webcamRef.current?.video;
    const overlay = canvasRef.current;
    if (!videoEl || !overlay) return;

    // create temp canvas sized to video
    const temp = document.createElement("canvas");
    temp.width = videoEl.videoWidth;
    temp.height = videoEl.videoHeight;
    const tctx = temp.getContext("2d");

    // draw mirrored video correctly: because stage is mirrored via CSS,
    // we must flip video horizontally when capturing to produce a natural selfie image.
    tctx.save();
    tctx.scale(-1, 1);
    tctx.translate(-temp.width, 0);
    tctx.drawImage(videoEl, 0, 0, temp.width, temp.height);
    tctx.restore();

    // draw overlay (shirts + HUD) on top
    tctx.drawImage(overlay, 0, 0, temp.width, temp.height);

    const dataUrl = temp.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "virtual-tryon.png";
    link.click();
  };

  return (
    <button className="snapshot-btn" onClick={handleSnapshot}>
      📸 Snapshot
    </button>
  );
}
