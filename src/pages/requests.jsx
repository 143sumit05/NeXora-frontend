import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../utils/axios";
import Icons from "../components/Icons";
import Avatar from "../components/Avatar";

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionInProgress, setActionInProgress] = useState({});

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get("/user/pendingRequest");
            setRequests(res.data.data || []);
        } catch (err) {
            console.log("Error fetching requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const reviewRequest = async (status, requestId) => {
        try {
            setActionInProgress((prev) => ({ ...prev, [requestId]: status }));
            await axiosClient.patch(`/recieve/${status}/${requestId}`);

            // Remove the reviewed request from UI
            setRequests((prev) =>
                prev.filter((request) => request._id !== requestId)
            );
        } catch (err) {
            console.log("Error reviewing request:", err);
        } finally {
            setActionInProgress((prev) => {
                const updated = { ...prev };
                delete updated[requestId];
                return updated;
            });
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
            
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Icons.UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                            <span>Pending Requests</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                                {requests.length}
                            </span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-0.5">
                            People who are interested in connecting with you
                        </p>
                    </div>
                </div>
            </div>

            {/* Skeleton Loading State */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                        <div key={idx} className="rounded-2xl glass-card p-5 space-y-4 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-slate-800/80" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-32 bg-slate-800/80 rounded" />
                                    <div className="h-3 w-20 bg-slate-800/60 rounded" />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <div className="h-9 flex-1 bg-slate-800/60 rounded-xl" />
                                <div className="h-9 flex-1 bg-slate-800/60 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : requests.length === 0 ? (
                /* Empty State */
                <div className="max-w-md mx-auto text-center py-14 px-6 rounded-3xl glass-panel border border-white/10 my-8">
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-emerald-600/20 to-teal-600/20 text-emerald-400 mb-4 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                        <Icons.CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-white">
                        All Caught Up!
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        You have no pending connection requests at the moment. Explore more profiles in Discover to connect with new people!
                    </p>
                    <Link
                        to="/feed"
                        className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-[1.02]"
                    >
                        <Icons.Compass className="w-4 h-4" />
                        <span>Discover People</span>
                    </Link>
                </div>
            ) : (
                /* Requests Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {requests.map((request) => {
                        const from = request.fromUserId || {};
                        const isActing = !!actionInProgress[request._id];

                        return (
                            <div
                                key={request._id}
                                className="rounded-2xl glass-card p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-200 flex flex-col justify-between"
                            >
                                <div className="flex items-start gap-4">
                                    <Avatar
                                        src={from.photoUrl}
                                        firstName={from.firstName}
                                        lastName={from.lastName}
                                        size="lg"
                                        isPremium={from.isPremium}
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h2 className="font-bold text-base text-white truncate">
                                                {from.firstName} {from.lastName}
                                            </h2>
                                            {from.isPremium && (
                                                <Icons.Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mt-1">
                                            {from.age && (
                                                <span className="text-xs text-slate-400">
                                                    {from.age} yrs
                                                </span>
                                            )}
                                            {from.gender && (
                                                <>
                                                    <span className="text-slate-600 text-xs">•</span>
                                                    <span className="text-xs text-slate-400 capitalize">
                                                        {from.gender}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <span className="inline-block mt-2 text-[11px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                                            Wants to connect
                                        </span>
                                    </div>
                                </div>

                                {/* Accept and Decline Actions */}
                                <div className="flex gap-2.5 mt-5 pt-4 border-t border-white/5">
                                    <button
                                        disabled={isActing}
                                        onClick={() => reviewRequest("accepted", request._id)}
                                        className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 text-white font-semibold text-xs transition-all shadow-[0_2px_10px_rgba(16,185,129,0.2)] disabled:opacity-50 flex items-center justify-center gap-1.5"
                                    >
                                        <Icons.Check className="w-4 h-4" />
                                        <span>Accept</span>
                                    </button>

                                    <button
                                        disabled={isActing}
                                        onClick={() => reviewRequest("rejected", request._id)}
                                        className="py-2 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 font-semibold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                                    >
                                        <Icons.X className="w-4 h-4" />
                                        <span>Decline</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default Requests;
