import React from 'react';

const StoreItem = ({ item, onBuy, canAfford }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>{item.icon}</div>
            <h3 style={{ margin: '0 0 5px', fontSize: '16px' }}>{item.name}</h3>
            <p style={{ color: '#666', margin: '0 0 10px', fontSize: '14px' }}>₹{item.price}</p>

            <button
                onClick={() => onBuy(item)}
                disabled={!canAfford}
                style={{
                    background: canAfford ? '#E91E63' : '#ccc',
                    color: 'white',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '5px',
                    cursor: canAfford ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold'
                }}
            >
                {canAfford ? 'Buy' : 'Need ₹'}
            </button>
        </div>
    );
};

export default StoreItem;
