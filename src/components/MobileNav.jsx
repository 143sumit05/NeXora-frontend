import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Icons from "./Icons";
import Avatar from "./Avatar";

const MobileNav = () => {
    const user = useSelector((store) => store.user);
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => {
        if (path === "/feed" && (location.pathname === "/" || location.pathname === "/feed")) return true;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="md:hidden fixed bottom-3 left-4 right-4 z-40">
            <nav className="glass-panel rounded-2xl p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.7)] border border-white/10 flex items-center justify-around">
                <Link
                    to="/feed"
                    className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
                        isActive("/feed")
                            ? "text-purple-400 bg-purple-500/10 font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <Icons.Compass className="w-5 h-5" />
                    <span className="text-[10px]">Discover</span>
                </Link>

                <Link
                    to="/connections"
                    className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
                        isActive("/connections")
                            ? "text-purple-400 bg-purple-500/10 font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <Icons.Users className="w-5 h-5" />
                    <span className="text-[10px]">Friends</span>
                </Link>

                <Link
                    to="/requests"
                    className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
                        isActive("/requests")
                            ? "text-purple-400 bg-purple-500/10 font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <Icons.UserPlus className="w-5 h-5" />
                    <span className="text-[10px]">Requests</span>
                </Link>

                {!user.isPremium ? (
                    <Link
                        to="/premium"
                        className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
                            isActive("/premium")
                                ? "text-amber-400 bg-amber-500/10 font-semibold"
                                : "text-amber-400/80 hover:text-amber-300"
                        }`}
                    >
                        <Icons.Crown className="w-5 h-5 text-amber-400" />
                        <span className="text-[10px]">Plus</span>
                    </Link>
                ) : null}

                <Link
                    to="/profile"
                    className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all ${
                        isActive("/profile")
                            ? "text-purple-400 bg-purple-500/10 font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                    <Avatar
                        src={user.photoUrl}
                        firstName={user.firstName}
                        lastName={user.lastName}
                        size="xs"
                        isPremium={user.isPremium}
                    />
                    <span className="text-[10px]">Profile</span>
                </Link>
            </nav>
        </div>
    );
};

export default MobileNav;

