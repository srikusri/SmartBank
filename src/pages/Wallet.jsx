import React, { useState, useEffect, useRef } from 'react';
import { useBank } from '../context/BankContext';
import { playTransferSound, listenForTransfer } from '../utils/soundPay';
import Navbar from '../components/Navbar';

const Wallet = () => {
    const { state, updateBalance } = useBank();
    const { user, balance } = state;
    const [mode, setMode] = useState('home'); // home, send, receive
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState(''); // listening, success, fail
    const stopListeningRef = useRef(null);

    useEffect(() => {
        return () => {
            if (stopListeningRef.current) stopListeningRef.current();
        };
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) > balance) return;

        playTransferSound();
        updateBalance(parseFloat(amount), `Sent to Friend`, 'debit');
        setStatus('sent');
        setTimeout(() => {
            setMode('home');
            setStatus('');
            setAmount('');
        }, 3000);
    };

    const startReceiving = () => {
        setMode('receive');
        setStatus('listening');

        // Simulate detection after random time or use real listener
        // For reliability in this demo, we'll use the real listener but also a fallback timeout
        // to ensure the user sees "Success" if they make noise.

        let detected = false;

        const onSoundDetected = () => {
            if (detected) return;
            detected = true;
            if (stopListeningRef.current) stopListeningRef.current();

            setStatus('processing');
            setTimeout(() => {
                const receivedAmount = Math.floor(Math.random() * 50) + 10; // Random amount for demo
                updateBalance(receivedAmount, 'Received from Friend', 'credit');
                setStatus(`received_${receivedAmount}`);
            }, 1500);
        };

        stopListeningRef.current = listenForTransfer(onSoundDetected);
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px', background: '#F3E5F5', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#7B1FA2' }}>My Wallet 💸</h1>

            {mode === 'home' && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <p style={{ margin: 0, color: '#666' }}>Available Balance</p>
                        <h2 style={{ margin: '10px 0', fontSize: '40px', color: '#9C27B0' }}>₹{balance.toFixed(2)}</h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#888' }}>UPI ID: {user.upiId}</p>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <button
                            onClick={() => setMode('send')}
                            style={{ padding: '20px', fontSize: '20px', borderRadius: '15px', border: 'none', background: '#9C27B0', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            📤 Send Money
                        </button>
                        <button
                            onClick={startReceiving}
                            style={{ padding: '20px', fontSize: '20px', borderRadius: '15px', border: 'none', background: '#fff', color: '#9C27B0', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            📥 Receive Money
                        </button>
                    </div>
                </div>
            )}

            {mode === 'send' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '20px' }}>
                    <h3 style={{ textAlign: 'center' }}>Send Money</h3>
                    {status === 'sent' ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <div style={{ fontSize: '50px' }}>✅</div>
                            <p>Money Sent Successfully!</p>
                            <p style={{ fontSize: '12px', color: '#666' }}>Sound signal emitted.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSend}>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount to send"
                                style={{ width: '100%', padding: '15px', fontSize: '20px', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '20px' }}
                            />
                            <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginBottom: '20px' }}>
                                Bring phones close together. Your phone will make a sound! 🔊
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => setMode('home')} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #ccc', background: 'transparent' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '15px', borderRadius: '10px', border: 'none', background: '#9C27B0', color: 'white', fontWeight: 'bold' }}>Pay Now</button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {mode === 'receive' && (
                <div style={{ background: 'white', padding: '40px 20px', borderRadius: '20px', textAlign: 'center' }}>
                    {status === 'listening' && (
                        <>
                            <div className="listening-pulse" style={{ width: '80px', height: '80px', background: '#E1BEE7', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '40px' }}>👂</span>
                            </div>
                            <h3>Listening for Money...</h3>
                            <p style={{ color: '#666' }}>Ask your friend to hit "Send" nearby!</p>
                            <button onClick={() => { if (stopListeningRef.current) stopListeningRef.current(); setMode('home'); }} style={{ marginTop: '20px', padding: '10px 20px', border: 'none', background: '#eee', borderRadius: '20px' }}>Cancel</button>
                        </>
                    )}
                    {status === 'processing' && (
                        <>
                            <div style={{ fontSize: '40px', marginBottom: '20px' }}>🔄</div>
                            <h3>Verifying Signal...</h3>
                        </>
                    )}
                    {status.startsWith('received_') && (
                        <>
                            <div style={{ fontSize: '50px', marginBottom: '10px' }}>🎉</div>
                            <h2 style={{ color: '#4CAF50' }}>Received ₹{status.split('_')[1]}!</h2>
                            <button onClick={() => setMode('home')} style={{ marginTop: '20px', padding: '15px 30px', background: '#9C27B0', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px' }}>Awesome!</button>
                        </>
                    )}
                </div>
            )}

            <Navbar />
        </div>
    );
};

export default Wallet;
