import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 2 seconds
        const timer1 = setTimeout(() => {
            setFadeOut(true);
        }, 2000);

        // Call onFinish after fade out completes (e.g., 0.5s transition)
        const timer2 = setTimeout(() => {
            onFinish();
        }, 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onFinish]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
            color: 'white'
        }}>
            <div style={{
                fontSize: '80px',
                marginBottom: '20px',
                animation: 'bounce 2s infinite'
            }}>
                🏦
            </div>
            <h1 style={{
                fontSize: '40px',
                fontWeight: 'bold',
                margin: 0,
                letterSpacing: '2px'
            }}>
                SmartBank
            </h1>
            <p style={{
                fontSize: '18px',
                opacity: 0.9,
                marginTop: '10px'
            }}>
                Learn. Earn. Spend.
            </p>

            <style>
                {`
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                        40% {transform: translateY(-30px);}
                        60% {transform: translateY(-15px);}
                    }
                `}
            </style>
        </div>
    );
};

export default SplashScreen;
