import React, { useState, useEffect } from 'react';
import { useBank } from '../context/BankContext';
import Navbar from '../components/Navbar';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { Scanner } from '@yudiel/react-qr-scanner';

const Wallet = () => {
    const { state, updateBalance, setWalletPin, verifyWalletPin } = useBank();
    const { user, balance, pin } = state;

    // Modes: home, set_pin, receive, send, confirm_payment, scan_qr
    const [mode, setMode] = useState('home');

    // PIN Setup State
    const [mathProblem, setMathProblem] = useState({ q: '', a: 0 });
    const [mathAnswer, setMathAnswer] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    // Transaction State
    const [amount, setAmount] = useState('');
    const [qrData, setQrData] = useState(null);
    const [scannedData, setScannedData] = useState(null); // { amount, id, senderName }
    const [paymentPin, setPaymentPin] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [receiverConfirmCode, setReceiverConfirmCode] = useState('');
    const [scanError, setScanError] = useState('');

    useEffect(() => {
        if (mode === 'set_pin') {
            generateMathProblem();
        }
    }, [mode]);

    const generateMathProblem = () => {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        setMathProblem({ q: `${a} + ${b} = ?`, a: a + b });
        setMathAnswer('');
    };

    const handleSetPin = (e) => {
        e.preventDefault();
        if (parseInt(mathAnswer) !== mathProblem.a) {
            alert("Incorrect Math Answer! Try again.");
            generateMathProblem();
            return;
        }
        if (newPin.length !== 4 || isNaN(newPin)) {
            alert("PIN must be 4 digits.");
            return;
        }
        if (newPin !== confirmPin) {
            alert("PINs do not match.");
            return;
        }
        setWalletPin(newPin);
        alert("Secret Key (PIN) Set Successfully!");
        setMode('home');
    };

    const handleGenerateQR = (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;

        const data = JSON.stringify({
            type: 'smartbank_transfer',
            amount: parseFloat(amount),
            id: Date.now(),
            senderName: user?.name || 'User'
        });
        setQrData(data);
    };

    const handleScan = (result) => {
        if (result) {
            try {
                // result is an array of objects, we take the first one's rawValue
                const rawValue = result[0]?.rawValue;
                if (!rawValue) return;

                const data = JSON.parse(rawValue);
                if (data.type === 'smartbank_transfer') {
                    setScannedData(data);
                    setMode('confirm_payment');
                } else {
                    setScanError("Invalid SmartBank QR Code");
                }
            } catch (err) {
                setScanError("Invalid QR Data Format");
            }
        }
    };

    const handleSendPayment = (e) => {
        e.preventDefault();
        if (!verifyWalletPin(paymentPin)) {
            alert("Incorrect PIN!");
            return;
        }
        if (balance < scannedData.amount) {
            alert("Insufficient Balance!");
            return;
        }

        // Generate a 4-digit confirmation code
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setConfirmationCode(code);

        updateBalance(scannedData.amount, `Sent to QR ID ${scannedData.id}`, 'debit');
    };

    const handleReceiveConfirmation = (e) => {
        e.preventDefault();
        if (receiverConfirmCode.length === 4) {
            updateBalance(parseFloat(amount), `Received via QR`, 'credit');
            alert(`Payment Verified! Received ₹${amount}`);
            setMode('home');
            setAmount('');
            setQrData(null);
            setReceiverConfirmCode('');
        } else {
            alert("Invalid Code Format");
        }
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px', background: '#F3E5F5', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#7B1FA2' }}>My Wallet 💸</h1>

            {mode === 'home' && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <p style={{ margin: 0, color: '#666' }}>Available Balance</p>
                        <h2 style={{ margin: '10px 0', fontSize: '40px', color: '#9C27B0' }}>₹{balance.toFixed(2)}</h2>
                        <div style={{ marginTop: '10px' }}>
                            {pin ? (
                                <button onClick={() => setMode('set_pin')} style={{ fontSize: '12px', padding: '5px 10px', background: '#E1BEE7', border: 'none', borderRadius: '10px', color: '#4A148C' }}>Reset Secret Key 🔐</button>
                            ) : (
                                <button onClick={() => setMode('set_pin')} style={{ fontSize: '12px', padding: '5px 10px', background: '#FFCDD2', border: 'none', borderRadius: '10px', color: '#B71C1C' }}>⚠️ Set Secret Key</button>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '20px' }}>
                        <button
                            onClick={() => {
                                if (!pin) { alert("Please set a Secret Key first!"); setMode('set_pin'); }
                                else { setMode('scan_qr'); setScanError(''); }
                            }}
                            style={{ padding: '20px', fontSize: '20px', borderRadius: '15px', border: 'none', background: '#9C27B0', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            📤 Scan & Pay
                        </button>
                        <button
                            onClick={() => setMode('receive')}
                            style={{ padding: '20px', fontSize: '20px', borderRadius: '15px', border: 'none', background: '#fff', color: '#9C27B0', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            📥 Receive Money
                        </button>
                    </div>
                </div>
            )}

            {mode === 'scan_qr' && (
                <div style={{ background: 'black', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', background: 'rgba(0,0,0,0.5)' }}>
                        <h3 style={{ margin: 0 }}>Scan QR Code</h3>
                        <button onClick={() => setMode('home')} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px' }}>✕</button>
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Scanner
                            onScan={handleScan}
                            onError={(error) => console.log(error)}
                            components={{ audio: false, onOff: false, torch: false, zoom: false, finder: true }}
                            styles={{ container: { width: '100%', height: '100%' } }}
                        />
                        {scanError && (
                            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(255,0,0,0.8)', color: 'white', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                                {scanError}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {mode === 'set_pin' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '20px' }}>
                    <h3 style={{ textAlign: 'center' }}>{pin ? 'Reset' : 'Set'} Secret Key</h3>
                    <p style={{ textAlign: 'center', color: '#666' }}>Solve to prove you're human!</p>
                    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>
                        {mathProblem.q}
                    </div>
                    <form onSubmit={handleSetPin}>
                        <input
                            type="number"
                            value={mathAnswer}
                            onChange={(e) => setMathAnswer(e.target.value)}
                            placeholder="Answer"
                            style={{ width: '100%', padding: '15px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
                        />
                        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px dashed #ccc' }} />
                        <p style={{ textAlign: 'center', color: '#666' }}>Enter new 4-digit Key</p>
                        <input
                            type="password"
                            maxLength="4"
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value)}
                            placeholder="New PIN"
                            style={{ width: '100%', padding: '15px', marginBottom: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
                        />
                        <input
                            type="password"
                            maxLength="4"
                            value={confirmPin}
                            onChange={(e) => setConfirmPin(e.target.value)}
                            placeholder="Confirm PIN"
                            style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #ccc' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => setMode('home')} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #ccc', background: 'transparent' }}>Cancel</button>
                            <button type="submit" style={{ flex: 1, padding: '15px', borderRadius: '10px', border: 'none', background: '#9C27B0', color: 'white', fontWeight: 'bold' }}>Save Key</button>
                        </div>
                    </form>
                </div>
            )}

            {mode === 'receive' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '20px' }}>
                    <h3 style={{ textAlign: 'center' }}>Receive Money</h3>
                    {!qrData ? (
                        <form onSubmit={handleGenerateQR}>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Amount to receive"
                                style={{ width: '100%', padding: '15px', fontSize: '20px', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '20px' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => setMode('home')} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #ccc', background: 'transparent' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '15px', borderRadius: '10px', border: 'none', background: '#9C27B0', color: 'white', fontWeight: 'bold' }}>Generate QR</button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ background: 'white', padding: '20px', display: 'inline-block', borderRadius: '10px', border: '2px solid #eee' }}>
                                <QRCode value={qrData} size={200} />
                            </div>
                            <h2 style={{ color: '#4CAF50', margin: '10px 0' }}>₹{amount}</h2>
                            <p style={{ fontSize: '12px', color: '#666', wordBreak: 'break-all', padding: '10px', background: '#f5f5f5', borderRadius: '5px' }}>
                                <strong>Debug Data (Copy for Sender):</strong><br />
                                {qrData}
                            </p>
                            <p>Ask Sender to Scan this QR</p>

                            <hr style={{ margin: '20px 0' }} />

                            <h4>Sender Confirmed?</h4>
                            <p style={{ fontSize: '14px', color: '#666' }}>Enter the code shown on Sender's screen</p>
                            <form onSubmit={handleReceiveConfirmation}>
                                <input
                                    type="number"
                                    value={receiverConfirmCode}
                                    onChange={(e) => setReceiverConfirmCode(e.target.value)}
                                    placeholder="Enter 4-digit Code"
                                    style={{ width: '100%', padding: '15px', fontSize: '20px', textAlign: 'center', letterSpacing: '5px', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '20px' }}
                                />
                                <button type="submit" style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: '#4CAF50', color: 'white', fontWeight: 'bold' }}>Verify & Receive</button>
                            </form>
                            <button onClick={() => { setQrData(null); setAmount(''); }} style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#666' }}>Back</button>
                        </div>
                    )}
                </div>
            )}

            {mode === 'confirm_payment' && scannedData && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '20px' }}>
                    <h3 style={{ textAlign: 'center' }}>Confirm Payment</h3>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <p style={{ color: '#666' }}>Sending to</p>
                        <h2>QR Receiver</h2>
                        <h1 style={{ color: '#9C27B0', fontSize: '50px', margin: '10px 0' }}>₹{scannedData.amount}</h1>
                    </div>

                    {!confirmationCode ? (
                        <form onSubmit={handleSendPayment}>
                            <p style={{ textAlign: 'center', color: '#666' }}>Enter your Secret Key to Pay</p>
                            <input
                                type="password"
                                maxLength="4"
                                value={paymentPin}
                                onChange={(e) => setPaymentPin(e.target.value)}
                                placeholder="Enter PIN"
                                style={{ width: '100%', padding: '15px', fontSize: '20px', textAlign: 'center', letterSpacing: '5px', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '20px' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => setMode('home')} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #ccc', background: 'transparent' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '15px', borderRadius: '10px', border: 'none', background: '#9C27B0', color: 'white', fontWeight: 'bold' }}>Pay Now</button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
                            <h2 style={{ color: '#4CAF50' }}>Payment Successful!</h2>
                            <p>Show this code to Receiver:</p>
                            <div style={{ background: '#E8F5E9', padding: '20px', borderRadius: '10px', fontSize: '40px', fontWeight: 'bold', color: '#2E7D32', margin: '20px 0', letterSpacing: '5px' }}>
                                {confirmationCode}
                            </div>
                            <button onClick={() => { setMode('home'); setConfirmationCode(''); setPaymentPin(''); }} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: '#9C27B0', color: 'white', fontWeight: 'bold' }}>Done</button>
                        </div>
                    )}
                </div>
            )}

            <Navbar />
        </div>
    );
};

export default Wallet;
