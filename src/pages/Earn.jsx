import React, { useState, useEffect } from 'react';
import { useBank } from '../context/BankContext';
import QuestCard from '../components/QuestCard';
import Navbar from '../components/Navbar';

const generateQuest = () => {
    const types = ['add', 'sub', 'perc'];
    const type = types[Math.floor(Math.random() * types.length)];

    let question, answer, reward, difficulty, color;

    switch (type) {
        case 'add':
            const a = Math.floor(Math.random() * 50) + 10;
            const b = Math.floor(Math.random() * 50) + 10;
            question = `What is ₹${a} + ₹${b}?`;
            answer = a + b;
            reward = 10;
            difficulty = 'Easy';
            color = '#2196F3';
            break;
        case 'sub':
            const x = Math.floor(Math.random() * 100) + 50;
            const y = Math.floor(Math.random() * 50) + 1;
            question = `You have ₹${x} and spend ₹${y}. How much is left?`;
            answer = x - y;
            reward = 15;
            difficulty = 'Medium';
            color = '#FF9800';
            break;
        case 'perc':
            const p = [10, 20, 50][Math.floor(Math.random() * 3)];
            const v = Math.floor(Math.random() * 10) * 100;
            question = `What is ${p}% of ₹${v}?`;
            answer = (p / 100) * v;
            reward = 25;
            difficulty = 'Hard';
            color = '#9C27B0';
            break;
        default:
            question = '1 + 1?';
            answer = 2;
            reward = 5;
            difficulty = 'Easy';
            color = '#ccc';
    }

    return { id: Date.now() + Math.random(), question, answer, reward, difficulty, color };
};

const Earn = () => {
    const { updateBalance } = useBank();
    const [quests, setQuests] = useState([]);

    useEffect(() => {
        // Generate 3 initial quests
        setQuests([generateQuest(), generateQuest(), generateQuest()]);
    }, []);

    const handleComplete = (id, reward) => {
        updateBalance(reward, 'Quest Reward');
        // Remove completed quest and add a new one after delay
        setTimeout(() => {
            setQuests(prev => prev.filter(q => q.id !== id).concat(generateQuest()));
        }, 1500);
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px', background: 'var(--bg-app)', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Math Quests 🧠</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>Solve math problems to earn money!</p>

            <div>
                {quests.map(quest => (
                    <QuestCard
                        key={quest.id}
                        quest={quest}
                        onComplete={(reward) => handleComplete(quest.id, reward)}
                    />
                ))}
            </div>

            <Navbar />
        </div>
    );
};

export default Earn;
