import React from 'react';
import { useNavigate } from 'react-router-dom';
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

const Help = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'home',
      title: 'Home',
      icon: <FaHome />,
      color: '#FF6B6B',
      description: 'Your main dashboard where you can see everything at a glance.',
      example: 'Check your total balance and see quick shortcuts to other places.'
    },
    {
      id: 'earn',
      title: 'Earn',
      icon: <FaCoins />,
      color: '#4ECDC4',
      description: 'The place to make money by doing tasks and chores.',
      example: 'Complete "Clean your room" to earn ₹50!'
    },
    {
      id: 'save',
      title: 'Save',
      icon: <FaPiggyBank />,
      color: '#FFD93D',
      description: 'Put money aside for things you really want to buy later.',
      example: 'Save ₹10 every week to buy a new toy or game.'
    },
    {
      id: 'spend',
      title: 'Spend',
      icon: <FaShoppingCart />,
      color: '#FF8E72',
      description: 'Use your money to buy things or pay for expenses.',
      example: 'Buy a snack or pay for a movie ticket.'
    },
    {
      id: 'wallet',
      title: 'Wallet',
      icon: <FaWallet />,
      color: '#6C5CE7',
      description: 'Send and receive money from friends or family.',
      example: 'Scan a QR code to pay your friend for lunch.'
    },
    {
      id: 'passbook',
      title: 'Passbook',
      icon: <FaBook />,
      color: '#A8E6CF',
      description: 'A history of all your money movements.',
      example: 'See that you earned ₹50 yesterday and spent ₹20 today.'
    },
    {
      id: 'learn',
      title: 'Learn',
      icon: <FaGraduationCap />,
      color: '#FD79A8',
      description: 'Learn cool things about money and banking.',
      example: 'Read about how banks keep your money safe.'
    },
    {
      id: 'market',
      title: 'Market',
      icon: <FaCity />,
      color: '#0984E3',
      description: 'Visit Marketopolis to trade and build your city.',
      example: 'Buy stocks or build a new shop in your city.'
    }
  ];

  return (
    <div className="help-container" style={{ padding: '20px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1.5rem', 
            cursor: 'pointer', 
            marginRight: '10px' 
          }}
        >
          ⬅️
        </button>
        <h1 style={{ margin: 0, fontSize: '2rem', color: '#2d3436' }}>Help & Guide</h1>
      </div>
      
      <p style={{ fontSize: '1.1rem', color: '#636e72', marginBottom: '30px' }}>
        Welcome to SmartBank! Here is what each section does. Click on a card to go there!
      </p>

      <div className="help-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {sections.map((section) => (
          <div 
            key={section.id} 
            onClick={() => navigate(section.id === 'home' ? '/' : `/${section.id}`)}
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '15px', 
              padding: '20px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              borderTop: `5px solid ${section.color}`,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '15px',
              color: section.color 
            }}>
              <span style={{ fontSize: '2rem', marginRight: '10px' }}>{section.icon}</span>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{section.title}</h2>
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '1rem', color: '#2d3436', marginBottom: '10px', fontWeight: 'bold' }}>
                {section.description}
              </p>
              <div style={{ 
                backgroundColor: `${section.color}20`, 
                padding: '10px', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3436'
              }}>
                <strong>Example:</strong> {section.example}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;
