import Webcam from "react-webcam";
import React, { useRef, useState, useCallback } from "react";
import clothImg from "../assets/cloth/tshirt-black.png";
import '../css/Camera.css';

function Camera() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

    const [shirtTop, setShirtTop] = useState(10);
    const [shirtLeft, setShirtLeft] = useState(25);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [])

    const closeScreenshot = ()=> {
        setImgSrc(null);
    }

    return (
        <div className="Camera">
            <h2>Camera</h2>
            <div className="webcam-container">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints = {
                        {
                            facingMode: "user"
                        }
                    }
                    mirrored={true}
                    className="webcam-feed"
                    />
                    <img
                        src={clothImg}
                        alt="Cloth_Overlay"
                        className="cloth-overlay"
                        style={
                            {
                                top: `${shirtTop}px`,
                                left: `${shirtLeft}px`,
                            }
                        }
                    />
            </div>
            <div className="overlay-controls">
                <label>
                    Top:
                    <input
                        type="range"
                        min="50"
                        max="850"
                        value={shirtTop}
                        onChange={e => setShirtTop(Number(e.target.value))}
                    />
                </label>
                
                <label>
                    Left:
                    <input
                        type="range"
                        min="50"
                        max="850"
                        value={shirtLeft}
                        onChange={e => setShirtLeft(Number(e.target.value))}
                    />
                </label>
            </div>
            <button onClick={capture}>Capture ScreenShot</button>
            {imgSrc && (
                <div className="screenshot">
                    <img src = {imgSrc} alt = "Screenshot" />
                    <p>Screenshot taken!</p>
                </div>
            )}
            {imgSrc&& (
                <div>
                    <button onClick={closeScreenshot}>Close Screenshot</button>
                </div>
            )}
        </div>
    );
}

export { Camera };