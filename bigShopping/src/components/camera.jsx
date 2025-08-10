import Webcam from "react-webcam";
import React, { useRef, useState, useCallback } from "react";

function Camera() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);

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
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image.jepg"
                width = {400}
                height = {300}
                videoConstraints = {
                    {
                        facingMode: "user"
                    }
                }
                />

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