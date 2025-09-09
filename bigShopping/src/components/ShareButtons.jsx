import React from "react";

export default function ShareButtons({ canvasRef }) {
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "virtual_tryon.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      alert("Copied to clipboard!");
    });
  };

  return (
    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
      <button onClick={handleDownload}>Download</button>
      <button onClick={handleCopy}>Copy Image</button>
    </div>
  );
}
