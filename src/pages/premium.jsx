import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axios";
import { updatePremium } from "../redux/userSlice";
import Icons from "../components/Icons";

function Premium() {
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);

    // Redirect existing Premium users to Feed
    useEffect(() => {
        if (user?.isPremium) {
            navigate("/feed", { replace: true });
        }
    }, [user?.isPremium, navigate]);

    // Load Razorpay SDK
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    // Handle Premium Payment
    const handlePayment = async () => {
        try {
            setLoading(true);
            setStatusMessage("Initializing payment gateway...");

            const loaded = await loadRazorpay();

            if (!loaded) {
                alert("Razorpay SDK failed to load. Please check your internet connection.");
                setLoading(false);
                setStatusMessage("");
                return;
            }

            // Create payment order
            const { data: order } = await axiosClient.post(
                "/payment/create-order"
            );

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "NeXora",
                description: "NeXora Premium Membership",
                order_id: order.orderId,

                handler: async function (response) {
                    try {
                        setStatusMessage("Verifying payment...");
                        // Verify payment with backend
                        const { data } = await axiosClient.post(
                            "/payment/verify",
                            response
                        );

                        // Update Redux Premium state
                        dispatch(updatePremium());

                        alert(data.message || "Payment verified! Welcome to NeXora Plus.");

                        // Redirect to Feed
                        navigate("/feed", { replace: true });

                    } catch (error) {
                        console.error(
                            "Payment verification error:",
                            error
                        );

                        alert(
                            error.response?.data?.message ||
                            "Payment verification failed"
                        );
                    } finally {
                        setLoading(false);
                        setStatusMessage("");
                    }
                },

                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        setStatusMessage("");
                    }
                },

                theme: {
                    color: "#8b5cf6"
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {
                alert(
                    response.error.description ||
                    "Payment failed"
                );

                setLoading(false);
                setStatusMessage("");
            });

            razorpay.open();

        } catch (error) {
            console.error("Payment initiation error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to initiate payment"
            );

            setLoading(false);
            setStatusMessage("");
        }
    };

    // Don't show purchase card to Premium users
    if (user?.isPremium) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
            
            {/* Header Hero */}
            <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="relative inline-flex mb-4">
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-500/40 via-yellow-500/30 to-purple-500/40 blur-lg animate-pulse" />
                    <div className="relative p-3.5 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                        <Icons.Crown className="w-8 h-8" />
                    </div>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    Unlock <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">NeXora Plus</span>
                </h1>
                
                <p className="text-slate-400 text-sm sm:text-base mt-2.5 leading-relaxed">
                    Elevate your connections, bypass daily limits, and showcase your verified status to the entire community.
                </p>
            </div>

            {/* Pricing Card & Feature Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-4xl mx-auto">
                
                {/* Plus Tier Card (Featured) */}
                <div className="lg:col-span-7">
                    <div className="relative h-full flex flex-col">
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/30 via-purple-600/30 to-indigo-600/30 blur-xl opacity-80" />

                        <div className="relative rounded-3xl glass-card p-6 sm:p-8 border border-amber-500/30 flex-1 flex flex-col justify-between shadow-2xl">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                                        <Icons.Crown className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Lifetime VIP</span>
                                    </span>

                                    <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                                        One-time investment
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="font-display text-4xl sm:text-5xl font-extrabold text-white">
                                        ₹199
                                    </span>
                                    <span className="text-slate-400 text-sm">
                                        / lifetime access
                                    </span>
                                </div>

                                <div className="space-y-3.5 pt-4 border-t border-white/10">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                                            <Icons.Check className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Unlimited Profile Discovery</p>
                                            <p className="text-xs text-slate-400">Never get stopped by the 15/day discovery limit</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                                            <Icons.Check className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Gold Crown Verified Badge</p>
                                            <p className="text-xs text-slate-400">Stand out with a glowing crown badge on your profile and messages</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                                            <Icons.Check className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Priority Feed Placement</p>
                                            <p className="text-xs text-slate-400">Get highlighted first when other users browse the Discover feed</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                                            <Icons.Check className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Direct Real-time Chat</p>
                                            <p className="text-xs text-slate-400">Fast, direct, encrypted communication with all connections</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>{statusMessage || "Processing Payment..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icons.Crown className="w-4 h-4 text-slate-950" />
                                            <span>Upgrade to NeXora Plus for ₹199</span>
                                        </>
                                    )}
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Icons.ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>256-bit SSL</span>
                                    </span>
                                    <span>•</span>
                                    <span>Powered by Razorpay</span>
                                    <span>•</span>
                                    <span>Instant Activation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Free Tier Comparison Card */}
                <div className="lg:col-span-5">
                    <div className="rounded-3xl glass-card p-6 sm:p-8 border border-white/5 h-full flex flex-col justify-between opacity-85">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Standard Plan
                                </span>
                                <span className="text-xs text-slate-500">
                                    Current Tier
                                </span>
                            </div>

                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="font-display text-3xl font-bold text-white">
                                    Free
                                </span>
                                <span className="text-slate-400 text-xs">
                                    forever
                                </span>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-slate-400">
                                <div className="flex items-center gap-2.5">
                                    <Icons.Check className="w-4 h-4 text-slate-400" />
                                    <span>Basic profile and photo</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Icons.Check className="w-4 h-4 text-slate-400" />
                                    <span>Send and receive connection requests</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Icons.Check className="w-4 h-4 text-slate-400" />
                                    <span>Real-time direct chat</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-500 line-through">
                                    <Icons.X className="w-4 h-4 text-slate-600" />
                                    <span>15 profile discoveries per day limit</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-500 line-through">
                                    <Icons.X className="w-4 h-4 text-slate-600" />
                                    <span>No verified crown badge</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-500 line-through">
                                    <Icons.X className="w-4 h-4 text-slate-600" />
                                    <span>Standard discovery priority</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <span className="text-xs text-slate-500">
                                Active on your account
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Premium;
