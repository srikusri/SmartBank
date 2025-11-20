import React from 'react';
import { useBank } from '../context/BankContext';

const Header = () => {
    const { state, resetApp } = useBank();
    const { user, balance } = state;

    if (!user) return null;

    return (
        <header style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '0 0 20px 20px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '40px', background: 'white', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user.avatar}
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>Hi, {user.name} 👋</h2>
                    <p style={{ margin: '5px 0 0', opacity: 0.9, fontSize: '14px' }}>{user.accountNo}</p>
                </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Total Balance</p>
                    <h1 style={{ margin: '5px 0 0', fontSize: '36px' }}>₹{balance.toFixed(2)}</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>{user.bankName}</p>
                    <button onClick={resetApp} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', marginTop: '5px', cursor: 'pointer', marginRight: '5px' }}>
                        Reset App
                    </button>
                    <button onClick={() => {
                        const text = `I just earned ₹${balance.toFixed(0)} on SmartBank! 🏆 Check it out: https://github.com/srramamu/SmartBank`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }} style={{ background: '#25D366', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', marginTop: '5px', cursor: 'pointer' }}>
                        Share 📱
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
