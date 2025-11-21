import React from 'react';
import { Link } from 'react-router-dom';
import { useBank, ACHIEVEMENTS } from '../context/BankContext';
import Header from '../components/Header';

const Home = () => {
    const { state } = useBank();
    const { user, savings, transactions } = state;

    const goalProgress = Math.min((savings / user.goalAmount) * 100, 100);

    return (
        <div style={{ paddingBottom: '80px' }}>
            <Header />

            <div style={{ padding: '20px' }}>
                {/* Goal Section */}
                <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '15px', boxShadow: `0 2px 5px var(--shadow-color)`, marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0 }}>🎯 My Goal: {user.goal}</h3>
                        <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>{Math.round(goalProgress)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'var(--border-color)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${goalProgress}%`, height: '100%', background: '#4CAF50', transition: 'width 0.5s ease' }}></div>
                    </div>
                    <p style={{ margin: '10px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        Saved ₹{savings} of ₹{user.goalAmount}
                    </p>
                </div>

                {/* Quick Actions */}
                <h3 style={{ marginBottom: '15px' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                    <Link to="/earn" style={{ textDecoration: 'none', color: 'white', background: '#FF9800', padding: '15px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <span style={{ fontSize: '24px', marginBottom: '5px' }}>💰</span>
                        <span style={{ fontWeight: 'bold' }}>Earn Money</span>
                    </Link>
                    <Link to="/market" style={{ textDecoration: 'none', color: 'white', background: '#673AB7', padding: '15px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <span style={{ fontSize: '24px', marginBottom: '5px' }}>🏙️</span>
                        <span style={{ fontWeight: 'bold' }}>Marketopolis</span>
                    </Link>
                    <Link to="/save" style={{ textDecoration: 'none', color: 'white', background: '#2196F3', padding: '15px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <span style={{ fontSize: '24px', marginBottom: '5px' }}>🐷</span>
                        <span style={{ fontWeight: 'bold' }}>Save & FD</span>
                    </Link>
                    <Link to="/spend" style={{ textDecoration: 'none', color: 'white', background: '#E91E63', padding: '15px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <span style={{ fontSize: '24px', marginBottom: '5px' }}>🛍️</span>
                        <span style={{ fontWeight: 'bold' }}>Spend</span>
                    </Link>
                </div>

                {/* Achievements Section */}
                <h3 style={{ marginBottom: '15px' }}>🏆 My Badges</h3>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {state.unlockedBadges.length === 0 ? (
                        <p style={{ color: '#999', fontSize: '14px' }}>Keep playing to unlock badges!</p>
                    ) : (
                        state.unlockedBadges.map(id => {
                            const badge = ACHIEVEMENTS.find(a => a.id === id);
                            return (
                                <div key={id} style={{ minWidth: '80px', background: 'var(--bg-card)', padding: '10px', borderRadius: '10px', textAlign: 'center', boxShadow: `0 2px 5px var(--shadow-color)` }}>
                                    <div style={{ fontSize: '30px' }}>{badge.icon}</div>
                                    <div style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '5px' }}>{badge.name}</div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Recent Transactions */}
                <h3 style={{ marginBottom: '15px' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {transactions.length === 0 ? (
                        <p style={{ color: '#999', textAlign: 'center' }}>No transactions yet.</p>
                    ) : (
                        transactions.slice(0, 5).map(tx => (
                            <div key={tx.id} style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${tx.type === 'credit' ? '#4CAF50' : '#F44336'}` }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{tx.description}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(tx.date).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontWeight: 'bold', color: tx.type === 'credit' ? '#4CAF50' : '#F44336' }}>
                                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
