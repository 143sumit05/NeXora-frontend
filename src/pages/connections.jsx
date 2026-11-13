import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../utils/axios";
import { addConnections } from "../redux/connectionSlice";
import Icons from "../components/Icons";
import Avatar from "../components/Avatar";

const selectConnections = (store) => store.connection;

const Connections = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const rawConnections = useSelector(selectConnections);
    const connections = rawConnections || [];
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get("/user/connections");
            dispatch(addConnections(res.data.data || []));
        } catch (err) {
            console.log("Error fetching connections:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    // Filter connections client-side based on search query
    const filteredConnections = useMemo(() => {
        if (!searchQuery.trim()) return connections;
        const q = searchQuery.toLowerCase().trim();
        return connections.filter((c) => {
            const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
            return fullName.includes(q);
        });
    }, [rawConnections, searchQuery]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
            
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                        <span>My Connections</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                            {connections.length}
                        </span>
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        People you are connected with and can message directly
                    </p>
                </div>

                {/* Instant Search Bar */}
                {connections.length > 0 && (
                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Icons.Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search connections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                            >
                                <Icons.X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Loading Skeleton */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                        <div key={idx} className="rounded-2xl glass-card p-4 flex items-center gap-4 animate-pulse">
                            <div className="w-14 h-14 rounded-full bg-slate-800/80" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-28 bg-slate-800/80 rounded" />
                                <div className="h-3 w-16 bg-slate-800/60 rounded" />
                            </div>
                            <div className="w-16 h-8 rounded-xl bg-slate-800/70" />
                        </div>
                    ))}
                </div>
            ) : connections.length === 0 ? (
                /* Empty State: No Connections Yet */
                <div className="max-w-md mx-auto text-center py-12 px-6 rounded-3xl glass-panel border border-white/10 my-8">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-sky-600/20 text-purple-400 mb-4 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <Icons.Users className="w-10 h-10" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white">
                        No Connections Yet
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        Discover new people, express interest, and once they connect back, they will appear right here ready to chat!
                    </p>
                    <Link
                        to="/feed"
                        className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-[1.02]"
                    >
                        <Icons.Compass className="w-4 h-4" />
                        <span>Discover People</span>
                    </Link>
                </div>
            ) : filteredConnections.length === 0 ? (
                /* No Results for Search Query */
                <div className="text-center py-12 px-4 rounded-2xl glass-panel border border-white/10 my-6">
                    <p className="text-slate-400 text-sm">
                        No connections found matching "<span className="text-white font-medium">{searchQuery}</span>"
                    </p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="mt-3 text-xs text-purple-400 hover:text-purple-300 font-semibold"
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                /* Connections Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredConnections.map((connection) => (
                        <div
                            key={connection._id}
                            className="rounded-2xl glass-card p-4 flex items-center gap-4 hover:border-purple-500/30 transition-all duration-200 group"
                        >
                            <Avatar
                                src={connection.photoUrl}
                                firstName={connection.firstName}
                                lastName={connection.lastName}
                                size="lg"
                                isPremium={connection.isPremium}
                                showOnlineBadge={true}
                            />

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <h2 className="font-bold text-base text-white truncate">
                                        {connection.firstName} {connection.lastName}
                                    </h2>
                                    {connection.isPremium && (
                                        <Icons.Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    {connection.age && (
                                        <span className="text-[11px] text-slate-400">
                                            {connection.age} yrs
                                        </span>
                                    )}
                                    {connection.gender && (
                                        <>
                                            <span className="text-slate-600 text-xs">•</span>
                                            <span className="text-[11px] text-slate-400 capitalize">
                                                {connection.gender}
                                            </span>
                                        </>
                                    )}
                                    <span className="text-slate-600 text-xs">•</span>
                                    <span className="text-[11px] text-emerald-400 font-medium">
                                        Connected
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate(`/chat/${connection._id}`)}
                                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold transition-all group-hover:scale-[1.02]"
                                >
                                    <Icons.MessageSquare className="w-3.5 h-3.5" />
                                    <span>Send Message</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Connections;
