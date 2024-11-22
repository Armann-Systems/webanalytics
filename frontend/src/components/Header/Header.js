import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Key, LogOut, Globe, Shield, Activity, Mail, Code, Book } from 'lucide-react';
import AuthService from '../../api/services/AuthService';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();

    const navigation = [
        {
            name: 'DNS',
            icon: Globe,
            items: [
                { name: 'DNS Checker', href: '/dns' },
                { name: 'DNS Guide', href: '/wiki/dns' }
            ]
        },
        {
            name: 'SMTP',
            icon: Mail,
            items: [
                { name: 'SMTP Tester', href: '/smtp' },
                { name: 'SMTP Guide', href: '/wiki/smtp' }
            ]
        },
        {
            name: 'SSL',
            icon: Shield,
            items: [
                { name: 'SSL Checker', href: '/ssl' },
                { name: 'SSL Guide', href: '/wiki/ssl' }
            ]
        },
        {
            name: 'Blacklist',
            icon: Activity,
            items: [
                { name: 'Blacklist Check', href: '/blacklist' },
                { name: 'Blacklist Guide', href: '/wiki/blacklist' }
            ]
        },
        {
            name: 'API',
            href: '/api',
            icon: Code
        }
    ];

    const handleLogout = () => {
        AuthService.logout();
        navigate('/');
        setUserMenuOpen(false);
    };

    const toggleMobileMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleDropdownToggle = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    return (
        <header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/[0.03]">
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/[0.05] to-transparent pointer-events-none"></div>
            
            {/* Subtle light effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent pointer-events-none"></div>
            
            <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
                <div className="w-full py-5 flex items-center justify-between">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="text-2xl font-bold text-black hover:opacity-80 transition-all duration-200 hover:-translate-y-0.5 hover:drop-shadow-sm"
                    >
                        WebAnalytics
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-10">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            if (item.items) {
                                return (
                                    <div key={item.name} className="relative">
                                        <button
                                            onClick={() => handleDropdownToggle(item.name)}
                                            className="group inline-flex items-center text-base font-medium text-black/70 hover:text-black transition-all duration-200 hover:-translate-y-0.5"
                                        >
                                            <div className="mr-2 p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04] group-hover:from-black/[0.03] group-hover:to-black/[0.06] transition-all duration-200 group-hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] border border-black/[0.02]">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            {item.name}
                                            <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                                        </button>
                                        {activeDropdown === item.name && (
                                            <div className="absolute left-0 mt-3 w-48 rounded-xl bg-white/95 backdrop-blur-xl shadow-[0_8px_16px_rgb(0_0_0/0.08)] transform transition-all duration-200 border border-black/[0.03]">
                                                <div className="py-1.5" role="menu">
                                                    {item.items.map((subItem) => (
                                                        <Link
                                                            key={subItem.name}
                                                            to={subItem.href}
                                                            className="flex items-center px-4 py-3 text-sm text-black/70 hover:text-black hover:bg-black/[0.03] transition-all duration-200"
                                                            onClick={() => setActiveDropdown(null)}
                                                        >
                                                            {subItem.name.includes('Guide') ? (
                                                                <Book className="h-4 w-4 mr-2" />
                                                            ) : (
                                                                <Icon className="h-4 w-4 mr-2" />
                                                            )}
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="group inline-flex items-center text-base font-medium text-black/70 hover:text-black transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <div className="mr-2 p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04] group-hover:from-black/[0.03] group-hover:to-black/[0.06] transition-all duration-200 group-hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] border border-black/[0.02]">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-6">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center text-sm font-medium text-black/70 hover:text-black transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    <div className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04] mr-2 border border-black/[0.02]">
                                        <User className="h-4 w-4" />
                                    </div>
                                    {user.firstName || user.email}
                                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-48 rounded-xl bg-white/95 backdrop-blur-xl shadow-[0_8px_16px_rgb(0_0_0/0.08)] transform transition-all duration-200 origin-top-right border border-black/[0.03]">
                                        <div className="py-1.5" role="menu">
                                            <Link
                                                to="/dashboard"
                                                className="flex items-center px-4 py-3 text-sm text-black/70 hover:text-black hover:bg-black/[0.03] transition-all duration-200"
                                                onClick={() => setUserMenuOpen(false)}
                                            >
                                                <Key className="h-4 w-4 mr-2" />
                                                API-Schlüssel
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center px-4 py-3 text-sm text-black/70 hover:text-black hover:bg-black/[0.03] transition-all duration-200"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Abmelden
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-base font-medium text-black/70 hover:text-black transition-all duration-200 hover:-translate-y-0.5"
                                >
                                    Anmelden
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-b from-black to-black/90 hover:from-black/95 hover:to-black/85 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgb(0_0_0/0.1)] border border-white/[0.01]"
                                >
                                    Registrieren
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04] hover:from-black/[0.03] hover:to-black/[0.06] transition-all duration-200 hover:shadow-[0_4px_8px_rgba(0,0,0,0.05)] border border-black/[0.02]"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6 text-black" />
                            ) : (
                                <Menu className="h-6 w-6 text-black" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div 
                    className={`lg:hidden fixed inset-x-0 top-[73px] bg-white/95 backdrop-blur-xl transform transition-all duration-300 ease-in-out ${
                        mobileMenuOpen 
                            ? 'translate-y-0 opacity-100 shadow-[0_8px_16px_rgb(0_0_0/0.08)] border-t border-black/[0.03]' 
                            : '-translate-y-full opacity-0 pointer-events-none'
                    }`}
                >
                    <div className="p-4 space-y-3 max-h-[calc(100vh-73px)] overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            if (item.items) {
                                return (
                                    <div key={item.name}>
                                        <button
                                            onClick={() => handleDropdownToggle(item.name)}
                                            className="flex w-full items-center px-3 py-3 text-base font-medium text-black/70 hover:text-black hover:bg-black/[0.03] rounded-lg transition-all duration-200"
                                        >
                                            <div className="mr-3 p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04] border border-black/[0.02]">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            {item.name}
                                            <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                                        </button>
                                        {activeDropdown === item.name && (
                                            <div className="ml-12 mt-2 space-y-2">
                                                {item.items.map((subItem) => (
                                                    <Link
                                                        key={subItem.name}
                                                        to={subItem.href}
                                                        className="flex items-center px-3 py-2 text-sm text-black/70 hover:text-black hover:bg-black/[0.03] rounded-lg transition-all duration-200"
                                                        onClick={() => {
                                                            setMobileMenuOpen(false);
                                                            setActiveDropdown(null);
                                                        }}
                                                    >
                                                        {subItem.name.includes('Guide') ? (
                                                            <Book className="h-4 w-4 mr-2" />
                                                        ) : (
                                                            <Icon className="h-4 w-4 mr-2" />
                                                        )}
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="flex items-center px-3 py-3 text-base font-medium text-black/70 hover:text-black hover:bg-black/[0.03] rounded-lg transition-all duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04] border border-black/[0.02]">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    {item.name}
                                </Link>
                            );
                        })}
                        
                        {/* Mobile Auth */}
                        {!user && (
                            <div className="pt-4 mt-4 border-t border-black/[0.03] space-y-3">
                                <Link
                                    to="/login"
                                    className="flex items-center px-3 py-3 text-base font-medium text-black/70 hover:text-black hover:bg-black/[0.03] rounded-lg transition-all duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-b from-black/[0.02] to-black/[0.04] border border-black/[0.02]">
                                        <User className="w-4 h-4" />
                                    </div>
                                    Anmelden
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center px-3 py-3 text-base font-medium text-white bg-gradient-to-b from-black to-black/90 hover:from-black/95 hover:to-black/85 rounded-lg transition-all duration-200 border border-white/[0.01]"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="mr-3 p-2 rounded-lg bg-white/10">
                                        <Key className="w-4 h-4" />
                                    </div>
                                    Registrieren
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
