import React from 'react';
import { useBank } from '../context/BankContext';
import { useMarket } from '../context/MarketContext';

const Leaderboard = () => {
    const { state } = useBank();
    const { gameState, stocks } = useMarket();

    // Calculate User Net Worth
    const userCash = state.balance + state.savings;
    const userStockValue = Object.entries(gameState.portfolio).reduce((total, [stockId, qty]) => {
        const stock = stocks.find(s => s.id === stockId);
        return total + (stock ? stock.price * qty : 0);
    }, 0);
    const userNetWorth = userCash + userStockValue;

    // Mock NPC Data
    const npcs = [
        { name: "Richie Rich", netWorth: 5000, avatar: "🎩" },
        { name: "Penny Saver", netWorth: 2500, avatar: "🐷" },
        { name: "Elon Tusk", netWorth: 10000, avatar: "🚀" },
        { name: "Warren Buffet", netWorth: 8000, avatar: "📈" },
        { name: "Broke Barry", netWorth: 100, avatar: "💸" }
    ];

    // Combine and Sort
    const leaderboard = [
        ...npcs,
        { name: "You", netWorth: userNetWorth, avatar: "👤", isUser: true }
    ].sort((a, b) => b.netWorth - a.netWorth);

    return (
        <div style={{ background: 'white', padding: '15px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>🏆 Rich List</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leaderboard.map((player, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px',
                        borderRadius: '10px',
                        background: player.isUser ? '#E3F2FD' : '#f9f9f9',
                        border: player.isUser ? '2px solid #2196F3' : '1px solid #eee'
                    }}>
                        <div style={{ width: '30px', fontWeight: 'bold', color: '#666' }}>#{index + 1}</div>
                        <div style={{ fontSize: '24px', marginRight: '10px' }}>{player.avatar}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold' }}>{player.name}</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#4CAF50' }}>₹{player.netWorth}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
