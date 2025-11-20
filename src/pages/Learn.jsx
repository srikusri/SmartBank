import React from 'react';
import Navbar from '../components/Navbar';

const Learn = () => {
    return (
        <div style={{ padding: '20px', paddingBottom: '80px', background: '#f0f4f8', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>🎓 Learn Finance</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Ancient India */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#D84315', marginTop: 0 }}>🏛️ Ancient Banking in India</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
                        Did you know? In ancient India (around 2000 years ago!), people used <strong>"Shrenis"</strong>.
                        These were like modern banks run by guilds of craftsmen! They accepted deposits and lent money to merchants for trade.
                    </p>
                </div>

                {/* Evolution of Money */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#00838F', marginTop: 0 }}>🐚 Evolution of Money</h3>
                    <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
                        <li style={{ marginBottom: '10px' }}><strong>Cowrie Shells:</strong> Used as money in ancient Bengal and Odisha!</li>
                        <li style={{ marginBottom: '10px' }}><strong>Punch-Marked Coins:</strong> The first metal coins in India (6th Century BC).</li>
                        <li style={{ marginBottom: '10px' }}><strong>Paper Money:</strong> Introduced by the British in the 18th century.</li>
                        <li><strong>Digital UPI:</strong> Today, we send money instantly with sound and QR codes! 🚀</li>
                    </ul>
                </div>

                {/* Modern Banking */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#2E7D32', marginTop: 0 }}>🏦 Modern Banking</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
                        Today, banks like SBI and HDFC help us keep money safe. The <strong>Reserve Bank of India (RBI)</strong> is the "Boss Bank" that makes rules for everyone else!
                    </p>
                </div>

            </div>

            <Navbar />
        </div>
    );
};

export default Learn;
