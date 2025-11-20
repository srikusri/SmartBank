import React from 'react';
import { useBank } from '../context/BankContext';
import Navbar from '../components/Navbar';

const Passbook = () => {
    const { state } = useBank();
    const { transactions } = state;

    return (
        <div style={{ padding: '20px', paddingBottom: '80px', background: '#f5f5f5', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>📒 Passbook</h1>

            <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                {transactions.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No transactions yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#eee', textAlign: 'left' }}>
                                <th style={{ padding: '15px', fontSize: '14px', color: '#666' }}>Date</th>
                                <th style={{ padding: '15px', fontSize: '14px', color: '#666' }}>Description</th>
                                <th style={{ padding: '15px', fontSize: '14px', color: '#666', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px', fontSize: '12px', color: '#666' }}>
                                        {new Date(tx.date).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '15px', fontSize: '14px' }}>
                                        {tx.description}
                                    </td>
                                    <td style={{ padding: '15px', fontSize: '14px', fontWeight: 'bold', textAlign: 'right', color: tx.type === 'credit' ? '#4CAF50' : '#F44336' }}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Navbar />
        </div>
    );
};

export default Passbook;
