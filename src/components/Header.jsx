import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="logo">BudgetTracker</Link>
        
        {currentUser && (
          <nav className="main-nav">
            <Link to="/" className={isActive('/')}>Dashboard</Link>
            <Link to="/statistieken" className={isActive('/statistieken')}>Statistieken</Link>
            <Link to="/instellingen" className={isActive('/instellingen')}>Instellingen</Link>
            <button onClick={logout} className="logout-button">Uitloggen</button>
          </nav>
        )}
      </div>
    </header>
  );
}