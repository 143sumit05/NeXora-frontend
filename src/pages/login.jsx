import { useState } from "react";
import axiosClient from "../utils/axios";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { useNavigate, Link } from "react-router-dom";
import Icons from "../components/Icons";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        if (e) e.preventDefault();

        if (!emailId.trim() || !password.trim()) {
            setError("Please fill in both email and password.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const res = await axiosClient.post("/login", {
                emailId: emailId.trim(),
                password,
            });

            dispatch(addUser(res.data.user));
            navigate("/");
        } catch (err) {
            console.log("Login Error:", err.response?.data);
            const errData = err.response?.data;
            const message = typeof errData === "string" 
                ? errData 
                : errData?.message || "Invalid email or password. Please try again.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
            <div className="w-full max-w-md">
                {/* Glow Backdrop Behind Card */}
                <div className="relative">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-sky-600/30 blur-xl opacity-75"></div>

                    <div className="relative rounded-2xl glass-panel p-6 sm:p-8 shadow-2xl border border-white/10">
                        {/* Header Branding */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.25)] mb-4">
                                <Icons.Logo className="w-10 h-10" />
                            </div>
                            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                Welcome Back
                            </h1>
                            <p className="text-slate-400 text-sm mt-1.5">
                                Log in to continue connecting on NeXora
                            </p>
                        </div>

                        {/* Error Notification */}
                        {error && (
                            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm animate-in fade-in duration-200">
                                <Icons.AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Icons.Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="you@domain.com"
                                        value={emailId}
                                        onChange={(e) => setEmailId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Icons.Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        autoComplete="current-password"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <Icons.EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Icons.Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <Icons.ArrowLeft className="w-4 h-4 rotate-180" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-slate-400 text-sm">
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="font-semibold text-purple-400 hover:text-purple-300 transition-colors ml-1"
                                >
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
