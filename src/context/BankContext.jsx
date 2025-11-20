import React, { createContext, useState, useEffect, useContext } from 'react';
import { getStorage, setStorage } from '../utils/storage';

const BankContext = createContext();



import { clearStorage } from '../utils/storage';

export const ACHIEVEMENTS = [
    { id: 'first_save', name: 'First Saver', icon: '🐷', description: 'Deposit money into savings' },
    { id: 'big_spender', name: 'Big Spender', icon: '🛍️', description: 'Buy an item costing ₹100+' },
    { id: 'math_whiz', name: 'Math Whiz', icon: '🤓', description: 'Complete 5 Math Quests' },
    { id: 'social_butterfly', name: 'Social Butterfly', icon: '🦋', description: 'Send money to a friend' }
];

const INITIAL_STATE = {
    user: null,
    balance: 0,
    savings: 0,
    transactions: [],
    unlockedBadges: [],
    stats: {
        questsCompleted: 0,
        moneySent: 0
    }
};

export const BankProvider = ({ children }) => {
    const [state, setState] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadedData = getStorage();
        if (loadedData) {
            // Merge with initial state to ensure new fields (stats) exist if loading old data
            setState(prev => ({ ...INITIAL_STATE, ...loadedData, stats: { ...INITIAL_STATE.stats, ...(loadedData.stats || {}) } }));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            setStorage(state);
            checkAchievements();
        }
    }, [state, loading]);

    const checkAchievements = () => {
        const newBadges = [];
        const { savings, stats, unlockedBadges } = state;

        if (savings > 0 && !unlockedBadges.includes('first_save')) newBadges.push('first_save');
        if (stats.questsCompleted >= 5 && !unlockedBadges.includes('math_whiz')) newBadges.push('math_whiz');
        if (stats.moneySent > 0 && !unlockedBadges.includes('social_butterfly')) newBadges.push('social_butterfly');

        // Check transactions for big spender
        const bigPurchase = state.transactions.find(t => t.type === 'debit' && t.amount >= 100 && t.description.startsWith('Bought'));
        if (bigPurchase && !unlockedBadges.includes('big_spender')) newBadges.push('big_spender');

        if (newBadges.length > 0) {
            setState(prev => ({
                ...prev,
                unlockedBadges: [...prev.unlockedBadges, ...newBadges]
            }));
            // Alert user (could be a toast, but alert is simple for now)
            const badgeNames = newBadges.map(id => ACHIEVEMENTS.find(a => a.id === id).name).join(', ');
            setTimeout(() => alert(`🏆 New Achievement Unlocked: ${badgeNames}!`), 500);
        }
    };

    const login = (userData) => {
        setState(prev => ({ ...prev, user: userData, balance: 100 }));
    };

    const updateBalance = (amount, description, type = 'credit') => {
        setState(prev => {
            const newBalance = type === 'credit' ? prev.balance + amount : prev.balance - amount;
            const newTransaction = {
                id: Date.now(),
                type,
                amount,
                description,
                date: new Date().toISOString(),
            };

            const newStats = { ...prev.stats };
            if (description === 'Quest Reward') newStats.questsCompleted += 1;
            if (description === 'Sent to Friend') newStats.moneySent += 1;

            return {
                ...prev,
                balance: newBalance,
                transactions: [newTransaction, ...prev.transactions],
                stats: newStats
            };
        });
    };

    const depositToSavings = (amount) => {
        setState(prev => {
            if (prev.balance < amount) return prev;
            return {
                ...prev,
                balance: prev.balance - amount,
                savings: prev.savings + amount,
                transactions: [
                    { id: Date.now(), type: 'debit', amount, description: 'Deposit to Savings', date: new Date().toISOString() },
                    ...prev.transactions
                ]
            };
        });
    };

    const withdrawFromSavings = (amount) => {
        setState(prev => {
            if (prev.savings < amount) return prev;
            return {
                ...prev,
                balance: prev.balance + amount,
                savings: prev.savings - amount,
                transactions: [
                    { id: Date.now(), type: 'credit', amount, description: 'Withdraw from Savings', date: new Date().toISOString() },
                    ...prev.transactions
                ]
            }
        })
    }

    const resetApp = () => {
        if (window.confirm("Are you sure you want to reset everything? This cannot be undone.")) {
            clearStorage();
            setState(INITIAL_STATE);
            window.location.href = '/'; // Force reload to clear any other state
        }
    };

    return (
        <BankContext.Provider value={{ state, login, updateBalance, depositToSavings, withdrawFromSavings, resetApp, loading }}>
            {children}
        </BankContext.Provider>
    );
};

export const useBank = () => useContext(BankContext);
