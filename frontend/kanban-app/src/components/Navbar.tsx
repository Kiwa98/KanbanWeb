import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export const Navbar: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-logo">📦</span>
                <span className="navbar-title">Kanban</span>
            </div>

            <div className="navbar-links">
                <Link
                    to="/"
                    className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                >
                    <span className="link-icon">📊</span>
                    Dashboard
                </Link>
                <Link
                    to="/operacao"
                    className={`navbar-link ${isActive('/operacao') ? 'active' : ''}`}
                >
                    <span className="link-icon">📱</span>
                    Operação
                </Link>
                <Link
                    to="/gerar-qrcode"
                    className={`navbar-link ${isActive('/gerar-qrcode') ? 'active' : ''}`}
                >
                    <span className="link-icon">🏷️</span>
                    Gerar QR Code
                </Link>
                <Link
                    to="/produtos"
                    className={`navbar-link ${isActive('/produtos') ? 'active' : ''}`}
                >
                    <span className="link-icon">📝</span>
                    Produtos
                </Link>
            </div>
        </nav>
    );
};
