import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../utils/axios";
import Icons from "../components/Icons";

const Signup = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        age: "",
        gender: ""
    });

    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadStep, setUploadStep] = useState("");

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setError("Only JPG, PNG and WEBP images are allowed");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5 MB");
            return;
        }

        setError("");
        setPhoto(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleRemovePhoto = () => {
        if (preview) URL.revokeObjectURL(preview);
        setPhoto(null);
        setPreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSignup = async (e) => {
        if (e) e.preventDefault();
        setError("");

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError("Please provide your first and last name.");
            return;
        }

        if (!formData.emailId.trim()) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            setLoading(true);
            let photoUrl = "";

            // Upload selected image to Cloudinary
            if (photo) {
                setUploadStep("Uploading profile photo...");
                const imageData = new FormData();
                imageData.append("photo", photo);

                const uploadRes = await axiosClient.post(
                    "/upload/profile-photo",
                    imageData
                );

                photoUrl = uploadRes.data.photoUrl;
            }

            setUploadStep("Creating your account...");
            // Create user account
            await axiosClient.post("/signup", {
                ...formData,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                emailId: formData.emailId.trim(),
                age: Number(formData.age) || 0,
                photoUrl
            });

            navigate("/login");

        } catch (err) {
            console.error("Signup failed:", err);
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : err.response?.data?.message || "Signup failed. Please try again."
            );
        } finally {
            setLoading(false);
            setUploadStep("");
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
            <div className="w-full max-w-xl">
                <div className="relative">
                    {/* Background glow */}
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-sky-600/30 blur-xl opacity-75"></div>

                    <div className="relative rounded-2xl glass-panel p-6 sm:p-8 shadow-2xl border border-white/10">
                        {/* Header Branding */}
                        <div className="text-center mb-6">
                            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-indigo-600/20 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.25)] mb-3">
                                <Icons.Logo className="w-8 h-8" />
                            </div>
                            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                Join NeXora
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Discover inspiring people and build meaningful connections
                            </p>
                        </div>

                        {/* Error Notification */}
                        {error && (
                            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm animate-in fade-in duration-200">
                                <Icons.AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSignup} className="space-y-4">
                            {/* Profile Photo Upload Zone */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-white/10">
                                <div className="relative group">
                                    <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-purple-500/40 bg-slate-800 flex items-center justify-center">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Icons.User className="w-10 h-10 text-slate-500" />
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                                        title="Change photo"
                                    >
                                        <Icons.Camera className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 transition-all flex items-center gap-1.5"
                                        >
                                            <Icons.UploadCloud className="w-3.5 h-3.5" />
                                            <span>{photo ? "Change Photo" : "Upload Photo"}</span>
                                        </button>
                                        {photo && (
                                            <button
                                                type="button"
                                                onClick={handleRemovePhoto}
                                                className="px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1.5">
                                        JPG, PNG or WEBP (Max 5 MB) • Optional but recommended
                                    </p>
                                </div>
                            </div>

                            {/* Name Fields (2 Columns) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        name="firstName"
                                        required
                                        placeholder="Alex"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        name="lastName"
                                        required
                                        placeholder="Morgan"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Icons.Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        name="emailId"
                                        type="email"
                                        required
                                        placeholder="alex@domain.com"
                                        value={formData.emailId}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                                    Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                        <Icons.Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="Minimum 6 characters"
                                        value={formData.password}
                                        onChange={handleChange}
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

                            {/* Age and Gender (2 Columns) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                                        Age
                                    </label>
                                    <input
                                        name="age"
                                        type="number"
                                        min="16"
                                        max="120"
                                        placeholder="e.g. 24"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    >
                                        <option value="" className="bg-slate-900 text-slate-400">Select Gender</option>
                                        <option value="male" className="bg-slate-900 text-white">Male</option>
                                        <option value="female" className="bg-slate-900 text-white">Female</option>
                                        <option value="others" className="bg-slate-900 text-white">Others</option>
                                    </select>
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
                                        <span>{uploadStep || "Creating Account..."}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <Icons.Sparkles className="w-4 h-4 text-amber-300" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div className="mt-6 pt-5 border-t border-white/10 text-center">
                            <p className="text-slate-400 text-sm">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-semibold text-purple-400 hover:text-purple-300 transition-colors ml-1"
                                >
                                    Log In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
