import React, { useState } from 'react';
import { useBank } from '../context/BankContext';

const Subscriptions = () => {
    const { state, addSubscription, paySubscription } = useBank();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const handleAdd = () => {
        if (name && amount) {
            addSubscription(name, parseInt(amount));
            setName('');
            setAmount('');
        }
    };

    return (
        <div style={{ background: 'white', padding: '15px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>📅 Subscriptions</h3>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    placeholder="Service (e.g. Netflix)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 2 }}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
                />
                <button onClick={handleAdd} style={{ padding: '10px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px' }}>
                    +
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {state.subscriptions && state.subscriptions.map(sub => (
                    <div key={sub.id} style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: '#f9f9f9',
                        border: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ fontSize: '20px' }}>📺</div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{sub.name}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>₹{sub.amount}/mo</div>
                            </div>
                        </div>
                        <button
                            onClick={() => paySubscription(sub.id)}
                            style={{
                                padding: '5px 10px',
                                background: '#FF5722',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '12px'
                            }}
                        >
                            Pay Bill
                        </button>
                    </div>
                ))}
                {(!state.subscriptions || state.subscriptions.length === 0) && <div style={{ color: '#999', textAlign: 'center' }}>No active subscriptions</div>}
            </div>
        </div>
    );
};

export default Subscriptions;
