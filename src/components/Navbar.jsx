import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/earn', label: 'Earn', icon: '💰' },
        { path: '/save', label: 'Save', icon: '🐷' },
        { path: '/spend', label: 'Spend', icon: '🛍️' },
        { path: '/wallet', label: 'Wallet', icon: '💸' },
        { path: '/passbook', label: 'Passbook', icon: '📒' },
        { path: '/learn', label: 'Learn', icon: '🎓' },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            background: 'var(--nav-bg)',
            padding: '10px 5px',
            borderTop: '1px solid var(--nav-border)',
            boxShadow: `0 -2px 10px var(--shadow-color)`,
            zIndex: 1000
        }}>
            {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            textDecoration: 'none',
                            color: isActive ? '#673AB7' : 'var(--text-secondary)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '5px 10px',
                            borderRadius: '15px',
                            background: isActive ? '#EDE7F6' : 'transparent',
                            transition: 'all 0.3s ease',
                            minWidth: isActive ? '80px' : '40px'
                        }}
                    >
                        <span style={{ fontSize: '28px', lineHeight: '1' }}>{item.icon}</span>
                        {isActive && (
                            <span style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>
                                {item.label}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
};

export default Navbar;
