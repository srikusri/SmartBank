import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { useBank } from '../context/BankContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';

const MarketHome = () => {
    const { stocks, gameState, buyStock, sellStock, advanceDay, upgradeCity, BUILDINGS } = useMarket();
    const { state: bankState, updateBalance } = useBank();
    const { day, buildPoints, cityLevel, news, portfolio } = gameState;
    const [selectedStock, setSelectedStock] = useState(null);
    const [qty, setQty] = useState(1);
    const [showGuide, setShowGuide] = useState(false);

    // Dynamic Hint Logic
    let hint = "💡 Tip: Buy stocks low and sell high!";
    const totalOwned = Object.values(portfolio).reduce((a, b) => a + b, 0);

    if (totalOwned === 0) {
        hint = "💡 Start by clicking on a stock to buy shares!";
    } else if (buildPoints >= 50 && gameState.unlockedBuildings.length === 0) {
        hint = "🏗️ You have enough Build Points! Scroll down to build your first building.";
    } else if (news.effect.includes('+')) {
        hint = "📈 Good news! Check the green stocks for profits.";
    } else if (news.effect.includes('-')) {
        hint = "📉 Market is down. Good time to buy cheap stocks?";
    }

    const handleBuy = () => {
        if (buyStock(selectedStock.id, parseInt(qty), bankState.balance, updateBalance)) {
            setQty(1);
            setSelectedStock(null);
            alert(`Bought ${qty} ${selectedStock.name}!`);
        } else {
            alert("Insufficient funds!");
        }
    };

    const handleSell = () => {
        const earned = sellStock(selectedStock.id, parseInt(qty), updateBalance);
        if (earned > 0) {
            setQty(1);
            setSelectedStock(null);
            alert(`Sold! Earned ${earned} Build Points.`);
        } else {
            alert("Not enough shares!");
        }
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px', background: 'var(--bg-app)', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h1 style={{ margin: 0, color: 'var(--text-primary)' }}>🏙️ Marketopolis</h1>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Day {day}</div>
                    <div style={{ fontWeight: 'bold', color: '#673AB7' }}>{buildPoints} BP</div>
                </div>
            </div>

            {/* Dynamic Hint Bar */}
            <div style={{
                background: '#FFF9C4',
                padding: '10px',
                borderRadius: '10px',
                marginBottom: '20px',
                borderLeft: '5px solid #FBC02D',
                fontSize: '14px',
                color: '#F57F17',
                fontWeight: 'bold',
                animation: 'fadeIn 0.5s'
            }}>
                {hint}
            </div>

            {/* Stock Market Ticker - Moved to Top */}
            <h3 style={{ marginBottom: '10px' }}>📈 Stock Market (Live Ticker)</h3>
            <div className="ticker-container">
                <div className="ticker-content">
                    {/* Duplicate list for seamless scrolling */}
                    {[...stocks, ...stocks, ...stocks].map((stock, index) => (
                        <div
                            key={`${stock.id}-${index}`}
                            className="ticker-item"
                            onClick={() => setSelectedStock(stock)}
                            style={{
                                borderColor: selectedStock?.id === stock.id ? '#2196F3' : (stock.type === 'commodity' ? '#FFD700' : (news.impacts[stock.id] ? '#FF9800' : 'var(--border-color)')),
                                background: selectedStock?.id === stock.id ? '#E3F2FD' : (stock.type === 'commodity' ? '#FFFDE7' : (news.impacts[stock.id] ? '#FFF3E0' : 'var(--bg-card)')),
                                borderWidth: stock.type === 'commodity' || news.impacts[stock.id] ? '2px' : '1px',
                                boxShadow: stock.type === 'commodity' ? '0 0 10px rgba(255, 215, 0, 0.3)' : 'none'
                            }}
                        >
                            {stock.type === 'commodity' && <div style={{ fontSize: '10px', color: '#FBC02D', marginBottom: '2px' }}>✨ Safe Haven</div>}
                            {news.impacts[stock.id] && <div style={{ fontSize: '10px', color: '#EF6C00', marginBottom: '2px' }}>⚡ News Impact</div>}
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{stock.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                                <span style={{ fontSize: '16px' }}>₹{stock.price}</span>
                                <span style={{ fontSize: '12px', color: stock.trend === 'up' ? 'green' : stock.trend === 'down' ? 'red' : 'gray' }}>
                                    {stock.trend === 'up' ? '▲' : stock.trend === 'down' ? '▼' : '➖'}
                                </span>
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '5px' }}>Owned: {portfolio[stock.id] || 0}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* News Ticker with Mascot */}
            <div style={{ background: '#FFF3E0', padding: '15px', borderRadius: '15px', marginBottom: '20px', marginTop: '20px', borderLeft: '5px solid #FF9800', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '40px' }}>
                    {news.effect.includes('+') ? '🐂' : '🐻'}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#E65100' }}>
                        {news.effect.includes('+') ? 'BULL BUDDY SAYS:' : 'BEAR BUDDY SAYS:'}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>{news.title}</div>
                    <div style={{ fontSize: '14px' }}>{news.effect}</div>
                </div>
            </div>

            {/* Dynamic News Feed */}
            <div style={{ background: '#212121', color: '#0f0', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontFamily: 'monospace', fontSize: '12px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'inline-block', animation: 'scroll 20s linear infinite' }}>
                    {useMarket().newsTicker.map((item, i) => (
                        <span key={i} style={{ marginRight: '30px' }}>📰 {item}</span>
                    ))}
                </div>
            </div>

            {/* City Builder */}
            <h3 style={{ marginBottom: '10px' }}>🏗️ City Builder (Level {cityLevel})</h3>
            <div style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '15px', marginBottom: '20px', boxShadow: `0 4px 10px var(--shadow-color)` }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                    {BUILDINGS.map(b => {
                        const isUnlocked = gameState.unlockedBuildings.includes(b.id);
                        const canAfford = buildPoints >= b.cost;
                        const isNextLevel = b.level <= cityLevel + 1; // Show next level buildings

                        if (!isNextLevel && !isUnlocked) return null;

                        return (
                            <div key={b.id} style={{
                                background: isUnlocked ? '#E8F5E9' : 'var(--bg-app)',
                                padding: '10px',
                                borderRadius: '10px',
                                textAlign: 'center',
                                border: isUnlocked ? '2px solid #4CAF50' : '1px solid var(--border-color)',
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

            {/* Leaderboard - Moved Below City Builder */}
            <Leaderboard />

            {/* Trading Panel */}
            {selectedStock && (
                <div style={{ position: 'fixed', bottom: '70px', left: '10px', right: '10px', background: 'var(--bg-card)', padding: '15px', borderRadius: '15px', boxShadow: `0 -5px 20px var(--shadow-color)`, zIndex: 100 }}>
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
                            style={{ width: '60px', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
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

            {/* Guide Modal */}
            {showGuide && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '20px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>How to Play 🎮</h2>
                            <button onClick={() => setShowGuide(false)} style={{ background: 'none', border: 'none', fontSize: '24px' }}>✕</button>
                        </div>
                        <p><strong>Goal:</strong> Build the ultimate city by earning Build Points (BP)!</p>
                        <ul style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                            <li><strong>Buy Stocks:</strong> Use your bank money (₹) to buy stocks.</li>
                            <li><strong>Watch News:</strong> News events change stock prices every day.</li>
                            <li><strong>Sell for Profit:</strong> Sell stocks when price goes UP.</li>
                            <li><strong>Earn BP:</strong> 10% of your sale value becomes Build Points.</li>
                            <li><strong>Build City:</strong> Use BP to unlock buildings and level up!</li>
                        </ul>
                        <div style={{ background: '#E3F2FD', padding: '10px', borderRadius: '10px', marginTop: '20px' }}>
                            <strong>Strategy:</strong> Diversify! Don't put all your money in one stock.
                        </div>
                        <button onClick={() => setShowGuide(false)} style={{ width: '100%', padding: '15px', background: '#673AB7', color: 'white', border: 'none', borderRadius: '10px', marginTop: '20px', fontWeight: 'bold' }}>Got it!</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketHome;
