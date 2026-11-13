import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axios";
import Icons from "./Icons";
import Avatar from "./Avatar";

const Feed = () => {
    const [users, setUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [_hasMore, setHasMore] = useState(true);
    const [limitReached, setLimitReached] = useState(false);
    const [remaining, setRemaining] = useState(null);
    const [actionFeedback, setActionFeedback] = useState(null); // 'ignored' | 'interested'

    const user = useSelector((store) => store.user);

    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const fetchFeed = async (cursor = null) => {
        if (loadingRef.current || !hasMoreRef.current) return;

        loadingRef.current = true;
        setLoading(true);

        try {
            const res = await axiosClient.get(
                `/feed?limit=10${cursor ? `&lastId=${cursor}` : ""}`
            );

            const newUsers = res.data.data || [];

            setUsers(prev => [...prev, ...newUsers]);
            setNextCursor(res.data.nextCursor);
            setRemaining(res.data.remaining ?? null);
            setLimitReached(res.data.limitReached || false);

            const moreAvailable =
                newUsers.length > 0 &&
                !!res.data.nextCursor &&
                !res.data.limitReached;

            hasMoreRef.current = moreAvailable;
            setHasMore(moreAvailable);

        } catch (err) {
            console.error("Feed error:", err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const handleRequest = useCallback(async (status, toUserId) => {
        if (!toUserId) return;

        setActionFeedback(status);
        setTimeout(() => setActionFeedback(null), 400);

        try {
            await axiosClient.post(`/request/${status}/${toUserId}`);
        } catch (err) {
            const message = err.response?.data;

            if (
                typeof message === "string" &&
                message.includes("Connection request already exists")
            ) {
                console.log("Request already exists. Skipping profile.");
            } else {
                console.error("Request failed:", err);
                return;
            }
        }

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        if (nextIndex >= users.length && hasMoreRef.current) {
            await fetchFeed(nextCursor);
        }
    }, [currentIndex, users.length, nextCursor]);

    const currentUser = users[currentIndex];
    const nextUser = users[currentIndex + 1];

    // Keyboard navigation (ArrowLeft = Ignore, ArrowRight = Interested)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!currentUser) return;
            if (e.key === "ArrowLeft") {
                handleRequest("ignored", currentUser._id);
            } else if (e.key === "ArrowRight") {
                handleRequest("interested", currentUser._id);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentUser, handleRequest]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
            
            {/* Header with Remaining Count or Premium Pill */}
            <div className="w-full max-w-md flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span>Discover</span>
                        <span className="p-1 rounded-lg bg-purple-500/10 text-purple-400">
                            <Icons.Compass className="w-4 h-4" />
                        </span>
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Expand your network with creators & peers
                    </p>
                </div>

                {user?.isPremium ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-[0_0_12px_rgba(245,158,11,0.15)]">
                        <Icons.Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>Unlimited</span>
                    </div>
                ) : remaining !== null && !limitReached ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-slate-300 text-xs">
                        <Icons.Zap className="w-3.5 h-3.5 text-yellow-400" />
                        <span>{remaining} free left today</span>
                    </div>
                ) : null}
            </div>

            {/* Main Content Area */}
            {currentUser ? (
                <div className="w-full max-w-md relative">
                    
                    {/* Visual Card Stacking Underneath */}
                    {nextUser && (
                        <div className="absolute inset-x-3 top-3 bottom-0 rounded-3xl bg-slate-800/40 border border-white/5 transform scale-[0.96] opacity-60 pointer-events-none -z-10 shadow-lg" />
                    )}

                    {/* Active Profile Card */}
                    <div className="relative rounded-3xl glass-card overflow-hidden border border-white/10 shadow-2xl transition-all duration-300">
                        
                        {/* Image Showcase */}
                        <div className="relative w-full h-[420px] sm:h-[460px] bg-slate-900 overflow-hidden">
                            {currentUser.photoUrl ? (
                                <img
                                    src={currentUser.photoUrl}
                                    alt={`${currentUser.firstName} ${currentUser.lastName}`}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}

                            {/* Fallback Display if no image or image fails */}
                            <div
                                style={{ display: currentUser.photoUrl ? 'none' : 'flex' }}
                                className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-purple-900/60 via-slate-900 to-indigo-950 p-6 text-center"
                            >
                                <Avatar
                                    firstName={currentUser.firstName}
                                    lastName={currentUser.lastName}
                                    size="xl"
                                    className="mb-4"
                                />
                                <span className="text-slate-400 text-sm">
                                    No profile photo provided
                                </span>
                            </div>

                            {/* Gradient Scrim for Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/40 to-transparent pointer-events-none" />

                            {/* Feedback Overlay on Action (Ignore / Interested) */}
                            {actionFeedback === "ignored" && (
                                <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-xs flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-6 py-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xl flex items-center gap-2 shadow-2xl">
                                        <Icons.X className="w-6 h-6 text-rose-400" />
                                        <span>PASSED</span>
                                    </div>
                                </div>
                            )}

                            {actionFeedback === "interested" && (
                                <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex items-center justify-center animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xl flex items-center gap-2 shadow-2xl">
                                        <Icons.Heart className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                                        <span>INTERESTED!</span>
                                    </div>
                                </div>
                            )}

                            {/* Top Badges */}
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                                <span className="px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-slate-300 text-xs font-medium flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Active</span>
                                </span>

                                <span className="px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/10 text-slate-400 text-xs">
                                    {currentIndex + 1} of {users.length}
                                </span>
                            </div>

                            {/* Info Overlay at Bottom of Photo */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-display text-2xl font-bold text-white tracking-wide">
                                        {currentUser.firstName} {currentUser.lastName}
                                    </h2>
                                    <div className="p-0.5 rounded-full bg-sky-500/20 text-sky-400" title="Verified Member">
                                        <Icons.CheckCircle className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Demographics Tags */}
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    {currentUser.age && (
                                        <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-medium text-slate-200 border border-white/10">
                                            {currentUser.age} yrs old
                                        </span>
                                    )}

                                    {currentUser.gender && (
                                        <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-medium text-slate-200 border border-white/10 capitalize">
                                            {currentUser.gender}
                                        </span>
                                    )}

                                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 backdrop-blur-md text-xs font-medium text-purple-300 border border-purple-500/30">
                                        NeXora Member
                                    </span>
                                </div>

                                {/* Skills / Tech Stack Tags */}
                                {Array.isArray(currentUser.skills) && currentUser.skills.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                                        {currentUser.skills.map((skill, sIdx) => (
                                            <span
                                                key={sIdx}
                                                className="px-2.5 py-0.5 rounded-md bg-purple-500/25 border border-purple-500/40 backdrop-blur-md text-xs font-medium text-purple-200 shadow-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interactive Action Controls */}
                        <div className="p-5 bg-[#0b101c]/90 border-t border-white/5 flex items-center justify-center gap-6">
                            {/* Ignore Button */}
                            <button
                                onClick={() => handleRequest("ignored", currentUser._id)}
                                className="group flex-1 max-w-[140px] py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 font-semibold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-1 shadow-[0_4px_14px_rgba(244,63,94,0.1)]"
                                title="Pass on profile (or press Left Arrow)"
                            >
                                <div className="p-2 rounded-xl bg-rose-500/10 group-hover:scale-110 transition-transform">
                                    <Icons.X className="w-5 h-5 text-rose-400" />
                                </div>
                                <span>Pass</span>
                                <span className="text-[10px] text-rose-400/60 font-mono hidden sm:inline">
                                    [ ← ]
                                </span>
                            </button>

                            {/* Interested Button */}
                            <button
                                onClick={() => handleRequest("interested", currentUser._id)}
                                className="group flex-1 max-w-[140px] py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-semibold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-1 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.4)]"
                                title="Connect with user (or press Right Arrow)"
                            >
                                <div className="p-2 rounded-xl bg-white/20 group-hover:scale-110 transition-transform">
                                    <Icons.Heart className="w-5 h-5 text-white fill-white/20" />
                                </div>
                                <span>Connect</span>
                                <span className="text-[10px] text-white/70 font-mono hidden sm:inline">
                                    [ → ]
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Subtle Hint */}
                    <p className="text-center text-xs text-slate-500 mt-4">
                        Tip: Use <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-400">←</kbd> to Pass or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-slate-400">→</kbd> to Connect
                    </p>
                </div>
            ) : loading ? (
                /* Skeleton Loading State */
                <div className="w-full max-w-md">
                    <div className="rounded-3xl glass-card overflow-hidden border border-white/10 p-6 space-y-4 animate-pulse">
                        <div className="w-full h-80 rounded-2xl bg-slate-800/60 flex items-center justify-center">
                            <Icons.Compass className="w-12 h-12 text-slate-700 animate-spin" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 w-1/2 bg-slate-800/80 rounded-lg" />
                            <div className="h-4 w-1/3 bg-slate-800/60 rounded-lg" />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <div className="h-12 flex-1 bg-slate-800/60 rounded-2xl" />
                            <div className="h-12 flex-1 bg-slate-800/60 rounded-2xl" />
                        </div>
                    </div>
                    <p className="text-center text-slate-400 text-sm mt-4">
                        Discovering nearby peers...
                    </p>
                </div>
            ) : limitReached ? (
                /* Daily Limit Reached Card */
                <div className="w-full max-w-md">
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-purple-500/20 to-yellow-500/30 blur-xl opacity-80" />
                        <div className="relative rounded-3xl glass-panel p-8 text-center border border-amber-500/30 shadow-2xl">
                            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)] mb-4 animate-bounce">
                                <Icons.Crown className="w-10 h-10" />
                            </div>

                            <h2 className="font-display text-2xl font-bold text-white">
                                Daily Discovery Limit Reached
                            </h2>

                            <p className="text-slate-300 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                                You've explored your 15 free profiles for today. Upgrade to <strong className="text-amber-400">NeXora Plus</strong> to unlock unlimited discovery, priority matching, and exclusive badges!
                            </p>

                            <div className="my-6 p-3.5 rounded-xl bg-slate-900/60 border border-white/10 text-left space-y-2 text-xs text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Icons.Check className="w-4 h-4 text-emerald-400" />
                                    <span>Unlimited daily profile discovery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icons.Check className="w-4 h-4 text-emerald-400" />
                                    <span>Exclusive Gold Crown Verified badge</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icons.Check className="w-4 h-4 text-emerald-400" />
                                    <span>Priority visibility in other feeds</span>
                                </div>
                            </div>

                            <Link
                                to="/premium"
                                className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
                            >
                                <Icons.Crown className="w-4 h-4 text-slate-950" />
                                <span>Upgrade to NeXora Plus</span>
                            </Link>

                            <p className="text-xs text-slate-500 mt-4">
                                Or come back tomorrow for 15 new free profiles.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* No More Profiles Available */
                <div className="w-full max-w-md">
                    <div className="rounded-3xl glass-panel p-8 text-center border border-white/10 shadow-xl">
                        <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
                            <Icons.Compass className="w-10 h-10" />
                        </div>

                        <h2 className="font-display text-2xl font-bold text-white">
                            All Caught Up!
                        </h2>

                        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                            You've seen all available profiles right now. Check back soon as new members join every day!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setCurrentIndex(0);
                                    fetchFeed();
                                }}
                                className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-medium border border-white/10 transition-colors flex items-center justify-center gap-2"
                            >
                                <span>Refresh Feed</span>
                            </button>

                            <Link
                                to="/connections"
                                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Icons.Users className="w-4 h-4" />
                                <span>View Connections</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Feed;
