import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ position: 'fixed', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-around', background: '#fff', padding: '10px', borderTop: '1px solid #ccc' }}>
            <Link to="/">Home</Link>
            <Link to="/earn">Earn</Link>
            <Link to="/save">Save</Link>
            <Link to="/spend">Spend</Link>
            <Link to="/wallet">Wallet</Link>
        </nav>
    );
};

export default Navbar;
