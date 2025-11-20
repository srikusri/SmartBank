import React, { useState } from 'react';

const QuestCard = ({ quest, onComplete }) => {
    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState('pending'); // pending, correct, wrong

    const handleSubmit = (e) => {
        e.preventDefault();
        if (parseFloat(answer) === quest.answer) {
            setStatus('correct');
            onComplete(quest.reward);
        } else {
            setStatus('wrong');
            setTimeout(() => setStatus('pending'), 1000);
        }
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '15px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            borderLeft: `5px solid ${quest.color}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ background: quest.color, color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                    {quest.difficulty}
                </span>
                <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>+₹{quest.reward}</span>
            </div>

            <h3 style={{ margin: '0 0 15px' }}>{quest.question}</h3>

            {status === 'correct' ? (
                <div style={{ color: '#4CAF50', fontWeight: 'bold', textAlign: 'center', padding: '10px' }}>
                    🎉 Correct! Reward Added.
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="number"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="?"
                        step="0.01"
                        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: `1px solid ${status === 'wrong' ? 'red' : '#ccc'}` }}
                    />
                    <button type="submit" style={{ background: quest.color, color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                        Check
                    </button>
                </form>
            )}
        </div>
    );
};

export default QuestCard;
