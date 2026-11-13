import React from "react";
import { Link } from "react-router-dom";
import Icons from "./Icons";

const CURRENT_YEAR = 2026;

const Footer = () => {
    return (
        <footer className="w-full border-t border-white/5 bg-[#070a10]/80 backdrop-blur-md py-6 px-4 md:px-8 mt-auto text-slate-400 text-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Icons.Logo className="w-5 h-5" />
                    </div>
                    <span className="font-display font-bold text-base text-white tracking-wide">
                        NeXora
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline">
                        — Connect beyond boundaries
                    </span>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-400">
                    <Link to="/feed" className="hover:text-purple-400 transition-colors">
                        Discover
                    </Link>
                    <Link to="/connections" className="hover:text-purple-400 transition-colors">
                        Connections
                    </Link>
                    <Link to="/premium" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                        <Icons.Crown className="w-3.5 h-3.5 text-amber-400" />
                        Premium
                    </Link>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white transition-colors"
                    >
                        Community
                    </a>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>All Systems Operational</span>
                    <span className="mx-2">•</span>
                    <span>© {CURRENT_YEAR} NeXora</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
