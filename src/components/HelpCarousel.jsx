import React, { useState } from 'react';
import {
    FaHome,
    FaCoins,
    FaPiggyBank,
    FaShoppingCart,
    FaWallet,
    FaBook,
    FaGraduationCap,
    FaCity
} from 'react-icons/fa';

const HelpCarousel = ({ onComplete, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            id: 'intro',
            title: 'Welcome to SmartBank! 🏦',
            icon: <span style={{ fontSize: '4rem' }}>👋</span>,
            color: '#6C5CE7',
            description: 'Let\'s take a quick tour to see what you can do here!',
            example: 'Swipe or click Next to start.'
        },
        {
            id: 'home',
            title: 'Home Dashboard',
            icon: <FaHome />,
            color: '#FF6B6B',
            description: 'Your main hub. See your balance and quick shortcuts.',
            example: 'Always come back here to see how much money you have.'
        },
        {
            id: 'earn',
            title: 'Earn Money',
            icon: <FaCoins />,
            color: '#4ECDC4',
            description: 'Complete chores and tasks to earn money.',
            example: 'Clean your room or finish homework to get paid!'
        },
        {
            id: 'save',
            title: 'Save for Goals',
            icon: <FaPiggyBank />,
            color: '#FFD93D',
            description: 'Set goals and save money for things you want.',
            example: 'Save up for a new toy or game.'
        },
        {
            id: 'spend',
            title: 'Spend Wisely',
            icon: <FaShoppingCart />,
            color: '#FF8E72',
            description: 'Buy things you need or want.',
            example: 'Track your spending here.'
        },
        {
            id: 'wallet',
            title: 'Digital Wallet',
            icon: <FaWallet />,
            color: '#6C5CE7',
            description: 'Send money to friends and family.',
            example: 'Scan a QR code to pay instantly.'
        },
        {
            id: 'market',
            title: 'Marketopolis',
            icon: <FaCity />,
            color: '#0984E3',
            description: 'Play games, trade stocks, and build your city!',
            example: 'Have fun and learn about investing.'
        }
    ];

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentSlide = slides[currentIndex];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '30px',
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                animation: 'popIn 0.3s ease-out'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#b2bec3'
                    }}
                >
                    ✖️
                </button>

                <div style={{ marginBottom: '20px', color: currentSlide.color }}>
                    <span style={{ fontSize: '4rem' }}>{currentSlide.icon}</span>
                </div>

                <h2 style={{ color: currentSlide.color, marginBottom: '10px' }}>{currentSlide.title}</h2>

                <p style={{ fontSize: '1.1rem', color: '#2d3436', marginBottom: '15px', minHeight: '50px' }}>
                    {currentSlide.description}
                </p>

                <div style={{
                    backgroundColor: `${currentSlide.color}20`,
                    padding: '10px',
                    borderRadius: '10px',
                    marginBottom: '25px',
                    fontSize: '0.9rem',
                    color: '#2d3436'
                }}>
                    <strong>Tip:</strong> {currentSlide.example}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1rem',
                            color: currentIndex === 0 ? '#dfe6e9' : '#636e72',
                            cursor: currentIndex === 0 ? 'default' : 'pointer'
                        }}
                    >
                        ⬅️ Back
                    </button>

                    <div style={{ display: 'flex', gap: '5px' }}>
                        {slides.map((_, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: idx === currentIndex ? currentSlide.color : '#dfe6e9',
                                    transition: 'background-color 0.3s'
                                }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        style={{
                            backgroundColor: currentSlide.color,
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: `0 4px 10px ${currentSlide.color}60`
                        }}
                    >
                        {currentIndex === slides.length - 1 ? "Let's Go! 🚀" : "Next ➡️"}
                    </button>
                </div>
            </div>
            <style>{`
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default HelpCarousel;
