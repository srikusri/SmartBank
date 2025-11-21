
import React, { useState, useEffect } from 'react';
import { useBank } from '../context/BankContext';
import Navbar from '../components/Navbar';

const Save = () => {
    const { state, depositToSavings, withdrawFromSavings, updateBalance, createFD, redeemFD, createSavingsGoal, contributeToGoal } = useBank();
    const { user, balance, savings } = state;
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('deposit'); // deposit or withdraw

    const goalProgress = Math.min((savings / user.goalAmount) * 100, 100);

    const handleTransaction = (e) => {
        e.preventDefault();
        const val = parseFloat(amount);
        if (!val || val <= 0) return;

        if (mode === 'deposit') {
            if (val > balance) {
                alert("Not enough balance!");
                return;
            }
            depositToSavings(val);
        } else {
            if (val > savings) {
                alert("Not enough savings!");
                return;
            }
            withdrawFromSavings(val);
        }
        setAmount('');
    };

    // Simulate interest for demo
    const addInterest = () => {
        const interest = savings * 0.01; // 1%
        if (interest > 0) {
            // We need a way to add directly to savings or balance. 
            // For now, let's add to balance as "Interest Payout" then user can save it, 
            // OR we can add a method to context to add directly to savings.
            // Let's just add to balance for simplicity in this demo or update context.
            // Actually, let's just use updateBalance but mark it as interest.
            updateBalance(interest, 'Interest Earned');
            alert(`You earned ₹${interest.toFixed(2)} interest!`);
        }
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px', background: '#E3F2FD', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#1565C0' }}>Savings Vault 🐷</h1>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
                <div style={{ fontSize: '60px', marginBottom: '10px' }}>🏦</div>
                <h2 style={{ margin: 0, fontSize: '40px', color: '#2196F3' }}>₹{savings.toFixed(2)}</h2>
                <p style={{ color: '#666' }}>Current Savings</p>

                <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px' }}>
                        <span>Goal: {user.goal}</span>
                        <span>₹{user.goalAmount}</span>
                    </div>
                    <div style={{ width: '100%', height: '15px', background: '#eee', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${goalProgress}% `, height: '100%', background: '#4CAF50', transition: 'width 0.5s ease' }}></div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>{Math.round(goalProgress)}% Reached</p>
                </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button
                        onClick={() => setMode('deposit')}
                        style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: mode === 'deposit' ? '#2196F3' : '#eee', color: mode === 'deposit' ? 'white' : '#333', fontWeight: 'bold' }}
                    >
                        Deposit ⬇️
                    </button>
                    <button
                        onClick={() => setMode('withdraw')}
                        style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: mode === 'withdraw' ? '#FF9800' : '#eee', color: mode === 'withdraw' ? 'white' : '#333', fontWeight: 'bold' }}
                    >
                        Withdraw ⬆️
                    </button>
                </div>

                <form onSubmit={handleTransaction}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>
                            {mode === 'deposit' ? 'Add to Savings (from Balance)' : 'Take from Savings (to Balance)'}
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                            step="0.01"
                            style={{ width: '100%', padding: '15px', fontSize: '20px', borderRadius: '10px', border: '1px solid #ccc' }}
                        />
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                            Available: ₹{mode === 'deposit' ? balance.toFixed(2) : savings.toFixed(2)}
                        </p>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '15px', background: mode === 'deposit' ? '#2196F3' : '#FF9800', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold' }}>
                        {mode === 'deposit' ? 'Save Money' : 'Withdraw Money'}
                    </button>
                </form>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginTop: '20px' }}>
                <h3 style={{ textAlign: 'center', color: '#1565C0' }}>Fixed Deposits (FD) 📜</h3>
                <p style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>Lock money for 1 minute to earn 5% interest!</p>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button onClick={() => createFD(100, 1)} style={{ flex: 1, padding: '10px', background: '#673AB7', color: 'white', border: 'none', borderRadius: '10px' }}>
                        Invest ₹100
                    </button>
                    <button onClick={() => createFD(500, 1)} style={{ flex: 1, padding: '10px', background: '#673AB7', color: 'white', border: 'none', borderRadius: '10px' }}>
                        Invest ₹500
                    </button>
                </div>

                <div>
                    {state.fds && state.fds.length > 0 ? (
                        state.fds.map(fd => {
                            const isMatured = new Date() >= new Date(fd.maturityDate);
                            return (
                                <div key={fd.id} style={{ background: '#f5f5f5', padding: '10px', borderRadius: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: fd.isRedeemed ? 0.5 : 1 }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>₹{fd.amount} FD</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            {fd.isRedeemed ? 'Redeemed' : (isMatured ? 'Matured! Ready to Redeem' : ` matures in ${Math.ceil((new Date(fd.maturityDate) - new Date()) / 1000)} s`)}
                                        </div>
                                    </div>
                                    {!fd.isRedeemed && (
                                        <button
                                            onClick={() => redeemFD(fd.id)}
                                            disabled={!isMatured}
                                            style={{ background: isMatured ? '#4CAF50' : '#ccc', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: isMatured ? 'pointer' : 'not-allowed' }}
                                        >
                                            Redeem
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>No active FDs.</p>
                    )}
                </div>
            </div>

            {/* Savings Goals */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginTop: '20px' }}>
                <h3 style={{ textAlign: 'center', color: '#1565C0' }}>🎯 Savings Goals</h3>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input id="goalName" placeholder="Goal Name" style={{ flex: 2, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    <input id="goalAmount" type="number" placeholder="Target" style={{ flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    <button
                        onClick={() => {
                            const name = document.getElementById('goalName').value;
                            const target = document.getElementById('goalAmount').value;
                            if (name && target) {
                                createSavingsGoal(name, parseInt(target), '🎯');
                                document.getElementById('goalName').value = '';
                                document.getElementById('goalAmount').value = '';
                            }
                        }}
                        style={{ padding: '8px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                        +
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {state.savingsGoals && state.savingsGoals.map(goal => (
                        <div key={goal.id} style={{ background: '#f9f9f9', padding: '10px', borderRadius: '10px', border: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <div style={{ fontWeight: 'bold' }}>{goal.icon} {goal.name}</div>
                                <div style={{ fontSize: '12px' }}>₹{goal.currentAmount} / ₹{goal.targetAmount}</div>
                            </div>
                            <div style={{ width: '100%', height: '10px', background: '#eee', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
                                <div style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%`, height: '100%', background: '#4CAF50' }}></div>
                            </div>
                            {goal.currentAmount < goal.targetAmount && (
                                <button
                                    onClick={() => {
                                        const amt = prompt(`Add money to ${goal.name}:`);
                                        if (amt) contributeToGoal(goal.id, parseInt(amt));
                                    }}
                                    style={{ width: '100%', padding: '5px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', fontSize: '12px' }}
                                >
                                    Contribute
                                </button>
                            )}
                            {goal.currentAmount >= goal.targetAmount && (
                                <div style={{ textAlign: 'center', color: '#4CAF50', fontWeight: 'bold', fontSize: '12px' }}>🎉 Goal Reached!</div>
                            )}
                        </div>
                    ))}
                    {(!state.savingsGoals || state.savingsGoals.length === 0) && <div style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>No active goals</div>}
                </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={addInterest} style={{ background: 'transparent', border: '1px dashed #2196F3', color: '#2196F3', padding: '10px 20px', borderRadius: '20px' }}>
                    ✨ Simulate Interest (1%)
                </button>
            </div>

            <Navbar />
        </div>
    );
};

export default Save;
