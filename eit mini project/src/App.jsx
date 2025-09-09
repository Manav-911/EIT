import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Buypage from './components/Buypage';
import Footer from './components/Footer';
import Tryon from './components/TryOn';



import './App.css';

function App() {
    const [isSignedUp, setIsSignedUp] = useState(() => {
        return localStorage.getItem('isSignedUp') === 'false';
    });

    const handleSignup = () => {
        setIsSignedUp(true);
        localStorage.setItem('isSignedUp', 'true');
    };

    return (
        <>
            {isSignedUp && <Navbar />}
            <main>
                <Routes>
                    {/* Default route -> Signup/Login */}
                    <Route path="/" element={isSignedUp ? <Navigate to="/homepage" replace /> : <Signup onSignup={handleSignup} />} />

                    {/* Protected routes */}
                    <Route path="/homepage" element={isSignedUp ? <Homepage /> : <Navigate to="/" replace />} />
                    <Route path="/buypage" element={isSignedUp ? <Buypage /> : <Navigate to="/" replace />} />
                    <Route path="/tryon" element={isSignedUp ? <Tryon /> : <Navigate to="/" replace />} />
                    
                </Routes>
            </main>
            {isSignedUp && <Footer />}
        </>
    );
}

export default App;
