import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { addUser } from "../redux/userSlice";
import axiosClient from "../utils/axios";
import Icons from "../components/Icons";
import Avatar from "../components/Avatar";

const POPULAR_SKILLS = [
    "React", "JavaScript", "TypeScript", "Node.js", "Express",
    "MongoDB", "Python", "Java", "C++", "SQL",
    "AWS", "Docker", "Git", "Next.js", "Tailwind CSS", "Redis"
];

const Profile = () => {
    const [showToast, setShowToast] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        photoUrl: "",
        skills: []
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                age: user.age || "",
                gender: user.gender || "",
                photoUrl: user.photoUrl || "",
                skills: Array.isArray(user.skills) ? user.skills : []
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Add a skill (from input or suggestion pill)
    const handleAddSkill = (skillToAdd) => {
        const rawSkill = skillToAdd || skillInput;
        if (!rawSkill || typeof rawSkill !== "string") return;

        const trimmed = rawSkill.trim();
        if (!trimmed) return;

        // Prevent duplicates (case-insensitive)
        const alreadyExists = formData.skills.some(
            (s) => s.toLowerCase() === trimmed.toLowerCase()
        );

        if (alreadyExists) {
            setSkillInput("");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, trimmed]
        }));

        setSkillInput("");
    };

    // Remove an individual skill
    const handleRemoveSkill = (skillToRemove) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skillToRemove)
        }));
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setErrorMsg("");

        if (!formData.firstName.trim()) {
            setErrorMsg("First name is required.");
            return;
        }

        try {
            setSaving(true);
            const updatedData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                age: Number(formData.age) || 0,
                gender: formData.gender,
                photoUrl: formData.photoUrl.trim(),
                skills: formData.skills
            };

            await axiosClient.patch("/profile/edit", updatedData);

            dispatch(addUser({
                ...user,
                ...updatedData
            }));

            setShowToast(true);
            setTimeout(() => setShowToast(false), 3500);

        } catch (err) {
            console.log("Profile update failed:", err.response?.data);
            const msg = typeof err.response?.data === "string"
                ? err.response.data
                : err.response?.data?.message || "Failed to update profile. Please try again.";
            setErrorMsg(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Icons.User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                            Account Profile
                        </h1>
                        <p className="text-slate-400 text-sm mt-0.5">
                            Manage your public identity, bio details, photo, and tech skills
                        </p>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {showToast && (
                <div className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 shadow-2xl backdrop-blur-xl">
                        <Icons.CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="font-medium text-sm">Profile updated successfully!</span>
                    </div>
                </div>
            )}

            {/* Main 2-Column Grid: Form on Left, Live Card Preview on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Form: 7 columns on desktop */}
                <div className="lg:col-span-7">
                    <div className="rounded-3xl glass-card p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
                        <h2 className="text-lg font-bold text-white flex items-center justify-between">
                            <span>Edit Information</span>
                            {user?.isPremium && (
                                <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                    <Icons.Crown className="w-3.5 h-3.5" />
                                    <span>Premium Active</span>
                                </span>
                            )}
                        </h2>

                        {errorMsg && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-sm">
                                <Icons.AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-5">
                            {/* Photo URL & Quick Preview */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Profile Photo URL
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                        type="url"
                                        name="photoUrl"
                                        placeholder="https://images.unsplash.com/... or Cloudinary URL"
                                        value={formData.photoUrl}
                                        onChange={handleChange}
                                    />
                                    {formData.photoUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, photoUrl: "" })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    Paste any valid image URL or Cloudinary photo link.
                                </p>
                            </div>

                            {/* First & Last Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                        First Name *
                                    </label>
                                    <input
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Last Name
                                    </label>
                                    <input
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Age and Gender */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Age
                                    </label>
                                    <input
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                        type="number"
                                        min="16"
                                        max="120"
                                        name="age"
                                        placeholder="24"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Gender
                                    </label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="" className="bg-slate-900 text-slate-400">Select Gender</option>
                                        <option value="male" className="bg-slate-900 text-white">Male</option>
                                        <option value="female" className="bg-slate-900 text-white">Female</option>
                                        <option value="others" className="bg-slate-900 text-white">Others</option>
                                    </select>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="pt-4 border-t border-white/10">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Technical Skills & Technologies
                                </label>
                                <p className="text-[11px] text-slate-400 mb-3">
                                    Add the technologies and languages you work with. They will be highlighted on your Discover card.
                                </p>

                                {/* Active Skill Chips */}
                                <div className="flex flex-wrap gap-2 mb-3 min-h-[36px] p-2 rounded-xl bg-slate-900/40 border border-white/5">
                                    {formData.skills.length === 0 ? (
                                        <span className="text-xs text-slate-500 italic py-1 px-1">
                                            No skills added yet. Type below or select from suggestions.
                                        </span>
                                    ) : (
                                        formData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-medium shadow-sm transition-all"
                                            >
                                                <span>{skill}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="w-3.5 h-3.5 rounded-full hover:bg-white/20 flex items-center justify-center text-purple-300 hover:text-white transition-colors"
                                                    title={`Remove ${skill}`}
                                                >
                                                    <Icons.X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))
                                    )}
                                </div>

                                {/* Custom Skill Input */}
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        placeholder="e.g. React, Docker, Python..."
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddSkill();
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddSkill()}
                                        disabled={!skillInput.trim()}
                                        className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 active:scale-95 border border-purple-500/30 text-purple-200 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Add Skill
                                    </button>
                                </div>

                                {/* Quick Suggestions */}
                                <div>
                                    <span className="text-[11px] text-slate-500 block mb-1.5">
                                        Popular Suggestions:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {POPULAR_SKILLS.map((suggested) => {
                                            const isSelected = formData.skills.some(
                                                (s) => s.toLowerCase() === suggested.toLowerCase()
                                            );

                                            return (
                                                <button
                                                    key={suggested}
                                                    type="button"
                                                    onClick={() => handleAddSkill(suggested)}
                                                    disabled={isSelected}
                                                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                                                        isSelected
                                                            ? "bg-white/5 text-slate-500 border border-white/5 cursor-default"
                                                            : "bg-slate-900/80 hover:bg-purple-500/10 text-slate-300 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 cursor-pointer active:scale-95"
                                                    }`}
                                                >
                                                    {isSelected ? `✓ ${suggested}` : `+ ${suggested}`}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Save Action */}
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                <span className="text-xs text-slate-500">
                                    Changes take effect immediately
                                </span>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icons.Check className="w-4 h-4" />
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: 5 columns on desktop -> Live Preview Card */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Icons.Eye className="w-3.5 h-3.5 text-purple-400" />
                                <span>Live Card Preview</span>
                            </span>
                            <span className="text-[11px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                                How peers see you
                            </span>
                        </div>

                        {/* Preview Profile Card */}
                        <div className="rounded-3xl glass-card overflow-hidden border border-white/10 shadow-2xl">
                            <div className="relative w-full h-80 bg-slate-900 overflow-hidden">
                                {formData.photoUrl ? (
                                    <img
                                        src={formData.photoUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}

                                <div
                                    style={{ display: formData.photoUrl ? 'none' : 'flex' }}
                                    className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-purple-900/60 via-slate-900 to-indigo-950 p-6 text-center"
                                >
                                    <Avatar
                                        firstName={formData.firstName || user?.firstName}
                                        lastName={formData.lastName || user?.lastName}
                                        size="xl"
                                        isPremium={user?.isPremium}
                                        className="mb-3"
                                    />
                                    <span className="text-slate-400 text-xs">
                                        Card preview photo
                                    </span>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/40 to-transparent pointer-events-none" />

                                {/* Verified & Active Badges */}
                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] text-emerald-400 font-medium border border-white/10 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>Active Now</span>
                                    </span>

                                    {user?.isPremium && (
                                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-300 text-[11px] font-semibold border border-amber-500/40 flex items-center gap-1">
                                            <Icons.Crown className="w-3 h-3 text-amber-400" />
                                            <span>PLUS</span>
                                        </span>
                                    )}
                                </div>

                                {/* Information Overlay */}
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h3 className="font-display text-xl font-bold text-white flex items-center gap-1.5">
                                        <span>{formData.firstName || "Your Name"} {formData.lastName}</span>
                                        <Icons.CheckCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
                                    </h3>

                                    {/* Demographics */}
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                        {formData.age && (
                                            <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[11px] text-slate-200">
                                                {formData.age} yrs
                                            </span>
                                        )}
                                        {formData.gender && (
                                            <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[11px] text-slate-200 capitalize">
                                                {formData.gender}
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[11px]">
                                            NeXora Member
                                        </span>
                                    </div>

                                    {/* Live Skills Preview on Card */}
                                    {formData.skills && formData.skills.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                            {formData.skills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-0.5 rounded-md bg-purple-500/25 border border-purple-500/35 backdrop-blur-md text-[11px] font-medium text-purple-200 shadow-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-3.5 bg-slate-900/90 border-t border-white/5 text-center text-xs text-slate-500">
                                Updated card representation in the Discover feed
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
