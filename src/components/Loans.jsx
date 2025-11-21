import React, { useState } from 'react';
import { useBank } from '../context/BankContext';

const Loans = () => {
    const { state, takeLoan, repayLoan } = useBank();
    const [loanAmount, setLoanAmount] = useState(100);

    const handleTakeLoan = () => {
        takeLoan(parseInt(loanAmount));
        alert(`Loan of ₹${loanAmount} taken!`);
    };

    return (
        <div style={{ background: 'white', padding: '15px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>🏦 Bank Loans</h3>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
                />
                <button onClick={handleTakeLoan} style={{ padding: '10px 20px', background: '#673AB7', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Take Loan
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {state.loans && state.loans.map(loan => (
                    <div key={loan.id} style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: loan.isPaid ? '#E8F5E9' : '#FFF3E0',
                        border: loan.isPaid ? '1px solid #4CAF50' : '1px solid #FF9800',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Loan #{loan.id.toString().slice(-4)}</div>
                            <div style={{ fontSize: '12px' }}>Due: {new Date(loan.dueDate).toLocaleDateString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 'bold', color: loan.isPaid ? 'green' : 'orange' }}>
                                {loan.isPaid ? 'PAID' : `Due: ₹${loan.totalRepayment}`}
                            </div>
                            {!loan.isPaid && (
                                <button
                                    onClick={() => repayLoan(loan.id)}
                                    disabled={state.balance < loan.totalRepayment}
                                    style={{
                                        marginTop: '5px',
                                        padding: '5px 10px',
                                        background: state.balance >= loan.totalRepayment ? '#4CAF50' : '#ccc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        fontSize: '12px'
                                    }}
                                >
                                    Repay
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {(!state.loans || state.loans.length === 0) && <div style={{ color: '#999', textAlign: 'center' }}>No active loans</div>}
            </div>
        </div>
    );
};

export default Loans;
