import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';

const AVATARS = ['🐶', '🐱', '🦁', '🦄', '🤖', '👽'];

const Onboarding = () => {
    const { login } = useBank();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        avatar: AVATARS[0],
        goal: '',
        goalAmount: '',
        bankName: 'Smart Bank'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.goal || !formData.goalAmount) return;

        const accountNo = Math.floor(10000000 + Math.random() * 90000000).toString();
        const upiId = `${formData.name.toLowerCase().replace(/\s/g, '')}@${formData.bankName.toLowerCase().replace(/\s/g, '')}`;

        const userData = {
            ...formData,
            accountNo,
            upiId,
            joinedAt: new Date().toISOString()
        };

        login(userData);
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Welcome to {formData.bankName}! 🏦</h1>
            <p>Let's open your first bank account.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
                <div>
                    <label>Your Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                    />
                </div>

                <div>
                    <label>Choose an Avatar:</label>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '10px 0' }}>
                        {AVATARS.map(av => (
                            <button
                                key={av}
                                type="button"
                                onClick={() => setFormData({ ...formData, avatar: av })}
                                style={{
                                    fontSize: '24px',
                                    background: formData.avatar === av ? '#e0e0e0' : 'transparent',
                                    border: '1px solid #ccc',
                                    borderRadius: '50%',
                                    cursor: 'pointer'
                                }}
                            >
                                {av}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label>Name your Bank:</label>
                    <select name="bankName" value={formData.bankName} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
                        <option value="Smart Bank">Smart Bank</option>
                        <option value="Happy Bank">Happy Bank</option>
                        <option value="Future Bank">Future Bank</option>
                    </select>
                </div>

                <div>
                    <label>What are you saving for? (Goal)</label>
                    <input
                        type="text"
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        placeholder="e.g. A new Bicycle"
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label>Goal Amount (₹):</label>
                    <input
                        type="number"
                        name="goalAmount"
                        value={formData.goalAmount}
                        onChange={handleChange}
                        placeholder="500"
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button type="submit" style={{ padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', fontSize: '18px', cursor: 'pointer' }}>
                    Open Account 🚀
                </button>
            </form>
        </div>
    );
};

export default Onboarding;
