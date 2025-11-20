import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { useBank } from '../context/BankContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const MarketHome = () => {
    const { stocks, gameState, buyStock, sellStock, advanceDay, upgradeCity, BUILDINGS } = useMarket();
    const { state: bankState, updateBalance } = useBank();
    const { day, buildPoints, cityLevel, news, portfolio } = gameState;
    const [selectedStock, setSelectedStock] = useState(null);
    const [qty, setQty] = useState(1);

    const handleBuy = () => {
        if (buyStock(selectedStock.id, parseInt(qty), bankState.balance, updateBalance)) {
            alert(`Bought ${qty} ${selectedStock.name}!`);
            setQty(1);
        } else {
            alert("Insufficient funds!");
        }
    };

    const handleSell = () => {
        const earned = sellStock(selectedStock.id, parseInt(qty), updateBalance);
        if (earned > 0) {
            alert(`Sold! Earned ${earned} Build Points.`);
            setQty(1);
        } else {
            alert("Not enough shares!");
        }
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px', background: '#f0f4f8', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#333' }}>🏙️ Marketopolis</h1>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Day {day}</div>
                    <div style={{ fontWeight: 'bold', color: '#673AB7' }}>{buildPoints} BP</div>
                </div>
            </div>

            {/* News Ticker with Mascot */}
            <div style={{ background: '#FFF3E0', padding: '15px', borderRadius: '15px', marginBottom: '20px', borderLeft: '5px solid #FF9800', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '40px' }}>
                    {news.effect.includes('+') ? '🐂' : '🐻'}
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#E65100' }}>
                        {news.effect.includes('+') ? 'BULL BUDDY SAYS:' : 'BEAR BUDDY SAYS:'}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>{news.title}</div>
                    <div style={{ fontSize: '14px' }}>{news.effect}</div>
                </div>
            </div>

            {/* City Builder */}
            <h3 style={{ marginBottom: '10px' }}>🏗️ City Builder (Level {cityLevel})</h3>
            <div style={{ background: 'white', padding: '15px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                    {BUILDINGS.map(b => {
                        const isUnlocked = gameState.unlockedBuildings.includes(b.id);
                        const canAfford = buildPoints >= b.cost;
                        const isNextLevel = b.level <= cityLevel + 1; // Show next level buildings

                        if (!isNextLevel && !isUnlocked) return null;

                        return (
                            <div key={b.id} style={{
                                background: isUnlocked ? '#E8F5E9' : '#f9f9f9',
                                padding: '10px',
                                borderRadius: '10px',
                                textAlign: 'center',
                                border: isUnlocked ? '2px solid #4CAF50' : '1px solid #eee',
                                opacity: isUnlocked ? 1 : 0.8
                            }}>
                                <div style={{ fontSize: '24px', marginBottom: '5px' }}>
                                    {isUnlocked ? '✅' : '🔒'}
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>{b.name}</div>
                                {isUnlocked ? (
                                    <div style={{ fontSize: '10px', color: '#4CAF50' }}>Built</div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (upgradeCity(b.cost, b.id)) {
                                                alert(`Built ${b.name}!`);
                                            } else {
                                                alert("Need more Build Points!");
                                            }
                                        }}
                                        disabled={!canAfford}
                                        style={{
                                            width: '100%',
                                            padding: '5px',
                                            background: canAfford ? '#2196F3' : '#ccc',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            fontSize: '10px',
                                            cursor: canAfford ? 'pointer' : 'not-allowed'
                                        }}
                                    >
                                        Build ({b.cost} BP)
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Stock Market */}
            <h3 style={{ marginBottom: '10px' }}>📈 Stock Market</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {stocks.map(stock => (
                    <div
                        key={stock.id}
                        onClick={() => setSelectedStock(stock)}
                        style={{
                            background: 'white',
                            padding: '15px',
                            borderRadius: '10px',
                            border: selectedStock?.id === stock.id ? '2px solid #2196F3' : 'none',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{stock.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                            <span style={{ fontSize: '16px' }}>₹{stock.price}</span>
                            <span style={{ fontSize: '12px', color: stock.trend === 'up' ? 'green' : stock.trend === 'down' ? 'red' : 'gray' }}>
                                {stock.trend === 'up' ? '▲' : stock.trend === 'down' ? '▼' : '➖'}
                            </span>
                        </div>
                        <div style={{ fontSize: '10px', color: '#999', marginTop: '5px' }}>Owned: {portfolio[stock.id] || 0}</div>
                    </div>
                ))}
            </div>

            {/* Trading Panel */}
            {selectedStock && (
                <div style={{ position: 'fixed', bottom: '70px', left: '10px', right: '10px', background: 'white', padding: '15px', borderRadius: '15px', boxShadow: '0 -5px 20px rgba(0,0,0,0.1)', zIndex: 100 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0 }}>{selectedStock.name}</h3>
                        <button onClick={() => setSelectedStock(null)} style={{ background: 'none', border: 'none', fontSize: '20px' }}>✕</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <input
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            min="1"
                            style={{ width: '60px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        <div style={{ fontSize: '14px' }}>Total: ₹{selectedStock.price * qty}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleBuy} style={{ flex: 1, padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>Buy</button>
                        <button onClick={handleSell} style={{ flex: 1, padding: '10px', background: '#F44336', color: 'white', border: 'none', borderRadius: '5px' }}>Sell</button>
                    </div>
                </div>
            )}

            <button onClick={advanceDay} style={{ width: '100%', padding: '15px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                🌙 Sleep (Next Day)
            </button>

            <Navbar />
        </div>
    );
};

export default MarketHome;
