import React from 'react';
import { useBank } from '../context/BankContext';
import StoreItem from '../components/StoreItem';
import Navbar from '../components/Navbar';

const ITEMS = [
    { id: 1, name: 'Ice Cream', price: 20, icon: '🍦' },
    { id: 2, name: 'Comic Book', price: 50, icon: '📚' },
    { id: 3, name: 'Toy Car', price: 100, icon: '🏎️' },
    { id: 4, name: 'Video Game', price: 500, icon: '🎮' },
    { id: 5, name: 'Headphones', price: 250, icon: '🎧' },
    { id: 6, name: 'Skateboard', price: 800, icon: '🛹' },
];

const Spend = () => {
    const { state, updateBalance } = useBank();
    const { balance } = state;

    const handleBuy = (item) => {
        if (balance >= item.price) {
            const confirmBuy = window.confirm(`Buy ${item.name} for ₹${item.price}?`);
            if (confirmBuy) {
                updateBalance(item.price, `Bought ${item.name}`, 'debit');
                alert(`You bought ${item.name}! Enjoy! 🎉`);
            }
        }
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px', background: '#FCE4EC', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#C2185B' }}>Store 🛍️</h1>
                <div style={{ background: 'white', padding: '5px 10px', borderRadius: '10px', fontWeight: 'bold', color: '#C2185B' }}>
                    ₹{balance.toFixed(2)}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                {ITEMS.map(item => (
                    <StoreItem
                        key={item.id}
                        item={item}
                        onBuy={handleBuy}
                        canAfford={balance >= item.price}
                    />
                ))}
            </div>

            <Navbar />
        </div>
    );
};

export default Spend;
