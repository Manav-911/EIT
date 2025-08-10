import React from 'react';
import { useState } from 'react'
import Webcam from 'react-webcam';
import './css/App.css'
import  {TryOn}  from './components/try-on.jsx';
import  {Camera} from './components/Camera.jsx';

export default function MyApp() {
  const [showCamera, setShowCamera] = useState(false);

  return (
    <div className='class-container'>
      {showCamera ? (
        <Camera/>
      ) : (
        <TryOn onTryOn = {() => setShowCamera(true)} />
      )}
    </div>
  );
}

