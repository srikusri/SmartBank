import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStorage, setStorage } from '../utils/storage';

const MarketContext = createContext();

const INITIAL_STOCKS = [
    { id: 'robo', name: 'RoboPets', price: 50, description: 'Cute robot companions', trend: 'stable' },
    { id: 'zoom', name: 'Zoomy Wheels', price: 80, description: 'Fastest bikes in town', trend: 'up' },
    { id: 'mango', name: 'MangoFizz', price: 20, description: 'Delicious mango soda', trend: 'down' },
    { id: 'sky', name: 'SkySend', price: 120, description: 'Drone delivery service', trend: 'stable' },
    { id: 'giga', name: 'GigaGames', price: 60, description: 'Video game creators', trend: 'up' },
    { id: 'farm', name: 'GreenLeaf', price: 40, description: 'Organic farm produce', trend: 'stable' },
];

const BUILDINGS = [
    { id: 'hut', name: 'Small Hut', cost: 50, level: 1, unlockDesc: 'Basic Buy/Sell' },
    { id: 'farm_plot', name: 'Farm Plot', cost: 80, level: 1, unlockDesc: 'Risk meter' },
    { id: 'well', name: 'Water Well', cost: 100, level: 1, unlockDesc: 'Daily News' },
    { id: 'school', name: 'School', cost: 150, level: 2, unlockDesc: 'Diversification lessons' },
    { id: 'library', name: 'Library', cost: 180, level: 2, unlockDesc: 'Company Profiles' },
    { id: 'store', name: 'General Store', cost: 200, level: 2, unlockDesc: 'Portfolio screen' },
    { id: 'hospital', name: 'Hospital', cost: 250, level: 3, unlockDesc: 'EPS concept' },
    { id: 'mall', name: 'Shopping Mall', cost: 300, level: 3, unlockDesc: 'P/E ratio' },
    { id: 'park', name: 'City Park', cost: 350, level: 3, unlockDesc: 'Risk-reward challenges' },
    { id: 'stadium', name: 'Stadium', cost: 450, level: 4, unlockDesc: 'Volatility lessons' },
    { id: 'metro', name: 'Metro Station', cost: 550, level: 4, unlockDesc: 'Long-term investing' },
    { id: 'airport', name: 'Airport', cost: 750, level: 5, unlockDesc: 'Global events' },
    { id: 'monument', name: 'Grand Monument', cost: 1000, level: 5, unlockDesc: 'Game Mastery Badge' },
];

const NEWS_EVENTS = [
    { day: 1, title: "Heatwave!", effect: "MangoFizz +8%", impacts: { mango: 0.08 } },
    { day: 2, title: "Factory Upgrade", effect: "RoboPets +10%", impacts: { robo: 0.10 } },
    { day: 3, title: "Heavy Rains", effect: "GreenLeaf -6%", impacts: { farm: -0.06 } },
    { day: 4, title: "School Partnership", effect: "Zoomy Wheels +7%", impacts: { zoom: 0.07 } },
    { day: 5, title: "Viral Trailer", effect: "GigaGames +9%", impacts: { giga: 0.09 } },
    { day: 6, title: "Drone Regulations", effect: "SkySend -8%", impacts: { sky: -0.08 } },
    { day: 7, title: "Festival Week", effect: "MangoFizz +6%, Zoomy +4%", impacts: { mango: 0.06, zoom: 0.04 } },
    // Week 2
    { day: 8, title: "Prototype Fail", effect: "RoboPets -10%", impacts: { robo: -0.10 } },
    { day: 9, title: "Great Weather", effect: "GreenLeaf +7%", impacts: { farm: 0.07 } },
    { day: 10, title: "Competitor Launch", effect: "Zoomy Wheels -6%", impacts: { zoom: -0.06 } },
    { day: 11, title: "Game Delayed", effect: "GigaGames -9%", impacts: { giga: -0.09 } },
    { day: 12, title: "E-commerce Sale", effect: "SkySend +12%", impacts: { sky: 0.12 } },
    { day: 13, title: "Warehouse Fire", effect: "MangoFizz -7%", impacts: { mango: -0.07 } },
    { day: 14, title: "Weekend Demand", effect: "All Stocks +3%", impacts: { all: 0.03 } },
    // Week 3
    { day: 15, title: "Cheaper RoboCat", effect: "RoboPets +15%", impacts: { robo: 0.15 } },
    { day: 16, title: "Stormy Weather", effect: "SkySend -10%", impacts: { sky: -0.10 } },
    { day: 17, title: "Beta Success", effect: "GigaGames +8%", impacts: { giga: 0.08 } },
    { day: 18, title: "Poor Soil", effect: "GreenLeaf -5%", impacts: { farm: -0.05 } },
    { day: 19, title: "School Races", effect: "Zoomy Wheels +10%", impacts: { zoom: 0.10 } },
    { day: 20, title: "New Flavor", effect: "MangoFizz +12%", impacts: { mango: 0.12 } },
    { day: 21, title: "Market Dip", effect: "All Stocks -4%", impacts: { all: -0.04 } },
    // Week 4
    { day: 22, title: "Strong Results", effect: "RoboPets +9%", impacts: { robo: 0.09 } },
    { day: 23, title: "Sugar Shortage", effect: "MangoFizz -6%", impacts: { mango: -0.06 } },
    { day: 24, title: "Game Award", effect: "GigaGames +10%", impacts: { giga: 0.10 } },
    { day: 25, title: "Sustainable Farming", effect: "GreenLeaf +8%", impacts: { farm: 0.08 } },
    { day: 26, title: "Rules Relaxed", effect: "SkySend +9%", impacts: { sky: 0.09 } },
    { day: 27, title: "Slow Sales", effect: "Zoomy Wheels -7%", impacts: { zoom: -0.07 } },
    { day: 28, title: "Correction Day", effect: "All Stocks -3%", impacts: { all: -0.03 } },
    { day: 29, title: "Investor Confidence", effect: "All Stocks +5%", impacts: { all: 0.05 } },
    { day: 30, title: "Grand Finale", effect: "Mango +10%, Giga +6%", impacts: { mango: 0.10, giga: 0.06, zoom: 0.04 } },
];

const INITIAL_GAME_STATE = {
    day: 1,
    buildPoints: 0,
    cityLevel: 1, // 1: Village, 2: Town, 3: City, 4: Metro, 5: Capital
    unlockedBuildings: [],
    portfolio: {}, // { robo: 10, zoom: 5 }
    history: [], // [{ day: 1, stocks: [...] }]
    news: NEWS_EVENTS[0]
};

export const MarketProvider = ({ children }) => {
    const [stocks, setStocks] = useState(INITIAL_STOCKS);
    const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
    const [loading, setLoading] = useState(true);

    // Load from storage on mount
    useEffect(() => {
        const savedMarket = getStorage('market_data');
        if (savedMarket) {
            setStocks(savedMarket.stocks);
            setGameState(savedMarket.gameState);
        }
        setLoading(false);
    }, []);

    // Save to storage on change
    useEffect(() => {
        if (!loading) {
            setStorage({ stocks, gameState }, 'market_data');
        }
    }, [stocks, gameState, loading]);

    const buyStock = (stockId, quantity, currentBalance, updateBalance) => {
        const stock = stocks.find(s => s.id === stockId);
        const cost = stock.price * quantity;

        if (currentBalance >= cost) {
            updateBalance(cost, `Bought ${quantity} ${stock.name}`, 'debit');
            setGameState(prev => ({
                ...prev,
                portfolio: {
                    ...prev.portfolio,
                    [stockId]: (prev.portfolio[stockId] || 0) + quantity
                }
            }));
            return true;
        }
        return false;
    };

    const sellStock = (stockId, quantity, updateBalance) => {
        const stock = stocks.find(s => s.id === stockId);
        const currentQty = gameState.portfolio[stockId] || 0;

        if (currentQty >= quantity) {
            const revenue = stock.price * quantity;
            // Profit calculation (simplified: 10% of revenue becomes Build Points)
            const buildPointsEarned = Math.floor(revenue * 0.1);

            updateBalance(revenue, `Sold ${quantity} ${stock.name}`, 'credit');
            setGameState(prev => ({
                ...prev,
                portfolio: {
                    ...prev.portfolio,
                    [stockId]: currentQty - quantity
                },
                buildPoints: prev.buildPoints + buildPointsEarned
            }));
            return buildPointsEarned;
        }
        return 0;
    };

    const advanceDay = () => {
        const nextDay = gameState.day + 1;
        const newsEvent = NEWS_EVENTS.find(n => n.day === nextDay) || { title: "Quiet Day", effect: "Market stable", impacts: {} };

        const newStocks = stocks.map(stock => {
            let changePercent = 0;

            // Apply specific impact
            if (newsEvent.impacts[stock.id]) {
                changePercent = newsEvent.impacts[stock.id];
            } else if (newsEvent.impacts.all) {
                changePercent = newsEvent.impacts.all;
            } else {
                // Random fluctuation if no specific news
                changePercent = (Math.random() * 10 - 5) / 100; // +/- 5%
            }

            const newPrice = Math.max(1, Math.round(stock.price * (1 + changePercent)));
            return {
                ...stock,
                price: newPrice,
                trend: changePercent > 0 ? 'up' : (changePercent < 0 ? 'down' : 'stable')
            };
        });

        setStocks(newStocks);
        setGameState(prev => ({
            ...prev,
            day: nextDay,
            news: newsEvent,
            history: [...prev.history, { day: prev.day, stocks: stocks }]
        }));
    };

    const upgradeCity = (cost, buildingId) => {
        if (gameState.buildPoints >= cost && !gameState.unlockedBuildings.includes(buildingId)) {
            const newUnlocked = [...gameState.unlockedBuildings, buildingId];

            // Check if all buildings of current level are unlocked
            const currentLevelBuildings = BUILDINGS.filter(b => b.level === gameState.cityLevel);
            const allCurrentUnlocked = currentLevelBuildings.every(b => newUnlocked.includes(b.id));

            let newLevel = gameState.cityLevel;
            if (allCurrentUnlocked && gameState.cityLevel < 5) {
                newLevel += 1;
                alert(`🎉 CITY LEVEL UP! Welcome to Level ${newLevel}!`);
            }

            setGameState(prev => ({
                ...prev,
                buildPoints: prev.buildPoints - cost,
                unlockedBuildings: newUnlocked,
                cityLevel: newLevel
            }));
            return true;
        }
        return false;
    };

    return (
        <MarketContext.Provider value={{ stocks, gameState, buyStock, sellStock, advanceDay, upgradeCity, loading, BUILDINGS }}>
            {children}
        </MarketContext.Provider>
    );
};

export const useMarket = () => useContext(MarketContext);
