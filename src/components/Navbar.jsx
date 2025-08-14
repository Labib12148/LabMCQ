import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Layout.css';
import Logo from '../assets/logo2.png';

const Navbar = ({ setSidebarOpen }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <header className="navbar">
            <div className="flex items-center">
                {/* Hamburger menu for mobile */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="navbar-button lg:hidden mr-2"
                    aria-label="Open sidebar"
                >
                    <Menu size={24} />
                </button>

                <Link to="/" className="navbar-logo flex items-center gap-2">
                <img src={Logo} alt="LabMCQ" className="h-7 w-auto inline-block select-none" draggable="false" />
                <span>LabMCQ</span>
                </Link>
            </div>

            <div className="flex items-center gap-3">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="navbar-button"
                    aria-label="Toggle theme"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Navbar;
