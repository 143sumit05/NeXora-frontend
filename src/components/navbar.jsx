import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { removeUser } from "../redux/userSlice";
import axiosClient from "../utils/axios";
import Icons from "./Icons";
import Avatar from "./Avatar";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((store) => store.user);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        try {
            await axiosClient.post("/logout");
            dispatch(removeUser());
            setDropdownOpen(false);
            navigate("/login");
        } catch (err) {
            console.log("Logout failed", err);
            // Even if network fails, ensure state clean up
            dispatch(removeUser());
            setDropdownOpen(false);
            navigate("/login");
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isActive = (path) => {
        if (path === "/feed" && (location.pathname === "/" || location.pathname === "/feed")) return true;
        return location.pathname.startsWith(path);
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070b13]/80 backdrop-blur-xl transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                
                {/* Brand Logo */}
                <div className="flex items-center gap-8">
                    <Link
                        to={user ? "/feed" : "/login"}
                        className="flex items-center gap-2.5 group focus:outline-none"
                    >
                        <div className="relative p-1.5 rounded-xl bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-sky-500/30 border border-purple-500/30 group-hover:border-purple-400/60 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                            <Icons.Logo className="w-7 h-7 transform group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                                NeXora
                            </span>
                            <span className="text-[9px] font-semibold text-purple-400/80 -mt-1 tracking-widest uppercase">
                                Social
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    {user && (
                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                to="/feed"
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    isActive("/feed")
                                        ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Icons.Compass className="w-4 h-4" />
                                <span>Discover</span>
                            </Link>

                            <Link
                                to="/connections"
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    isActive("/connections")
                                        ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Icons.Users className="w-4 h-4" />
                                <span>Connections</span>
                            </Link>

                            <Link
                                to="/requests"
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    isActive("/requests")
                                        ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Icons.UserPlus className="w-4 h-4" />
                                <span>Requests</span>
                            </Link>
                        </nav>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            {/* Premium Status / Upgrade CTA */}
                            {user.isPremium ? (
                                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                                    <Icons.Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                    <span>NEXORA PLUS</span>
                                </div>
                            ) : (
                                <Link
                                    to="/premium"
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Icons.Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                    <span>Upgrade</span>
                                </Link>
                            )}

                            {/* User Menu Trigger */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen((prev) => !prev)}
                                    className="flex items-center gap-2.5 p-1 rounded-full hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    aria-expanded={dropdownOpen}
                                >
                                    <Avatar
                                        src={user.photoUrl}
                                        firstName={user.firstName}
                                        lastName={user.lastName}
                                        size="sm"
                                        isPremium={user.isPremium}
                                    />
                                    <span className="hidden md:inline-block text-sm font-semibold text-slate-200">
                                        {user.firstName}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                            dropdownOpen ? "rotate-180" : ""
                                        }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e1422]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.6)] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                        {/* User Header */}
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={user.photoUrl}
                                                    firstName={user.firstName}
                                                    lastName={user.lastName}
                                                    size="md"
                                                    isPremium={user.isPremium}
                                                />
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-bold text-white truncate">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <p className="text-xs text-slate-400 truncate">
                                                        {user.emailId || "NeXora Member"}
                                                    </p>
                                                </div>
                                            </div>
                                            {user.isPremium ? (
                                                <div className="mt-2 text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                                                    <Icons.Crown className="w-3 h-3 text-amber-400" />
                                                    <span>Premium Membership Active</span>
                                                </div>
                                            ) : (
                                                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                                                    <span>Free Tier</span>
                                                    <Link
                                                        to="/premium"
                                                        onClick={() => setDropdownOpen(false)}
                                                        className="text-purple-400 hover:text-purple-300 font-medium"
                                                    >
                                                        Upgrade →
                                                    </Link>
                                                </div>
                                            )}
                                        </div>

                                        {/* Navigation Links */}
                                        <div className="p-1 space-y-0.5">
                                            <Link
                                                to="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                            >
                                                <Icons.User className="w-4 h-4 text-purple-400" />
                                                <span>Edit Profile</span>
                                            </Link>

                                            <Link
                                                to="/connections"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                            >
                                                <Icons.Users className="w-4 h-4 text-sky-400" />
                                                <span>My Connections</span>
                                            </Link>

                                            <Link
                                                to="/requests"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                                            >
                                                <Icons.UserPlus className="w-4 h-4 text-emerald-400" />
                                                <span>Pending Requests</span>
                                            </Link>

                                            {!user.isPremium && (
                                                <Link
                                                    to="/premium"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-amber-300 hover:bg-amber-500/10 rounded-xl transition-colors"
                                                >
                                                    <Icons.Crown className="w-4 h-4 text-amber-400" />
                                                    <span>Get NeXora Plus</span>
                                                </Link>
                                            )}
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-white/10 my-1" />

                                        {/* Logout Button */}
                                        <div className="p-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                                            >
                                                <Icons.LogOut className="w-4 h-4" />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all hover:scale-[1.02]"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Navbar;
