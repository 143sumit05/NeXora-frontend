import { useState } from "react";
import Icons from "./Icons";

const getInitials = (firstName = "", lastName = "") => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${first}${last}` || "U";
};

const sizeClasses = {
    xs: "w-7 h-7 text-xs",
    sm: "w-9 h-9 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-2xl",
    "2xl": "w-32 h-32 text-3xl"
};

const Avatar = ({
    src,
    firstName = "",
    lastName = "",
    size = "md",
    isPremium = false,
    className = "",
    showOnlineBadge = false,
    alt
}) => {
    const [imgFailed, setImgFailed] = useState(false);
    const initials = getInitials(firstName, lastName);
    const resolvedSize = sizeClasses[size] || sizeClasses.md;

    const hasValidImage = src && !imgFailed && !src.includes("placehold.co") && !src.includes("img.daisyui.com/images/stock");

    return (
        <div className={`relative inline-block select-none flex-shrink-0 ${className}`}>
            <div
                className={`${resolvedSize} rounded-full overflow-hidden flex items-center justify-center font-bold tracking-wider transition-transform duration-200 ${
                    isPremium
                        ? "ring-2 ring-amber-400/90 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
                        : "ring-1 ring-white/15"
                } ${
                    hasValidImage
                        ? "bg-slate-800"
                        : "bg-gradient-to-tr from-purple-700 via-indigo-600 to-sky-500 text-white shadow-inner"
                }`}
            >
                {hasValidImage ? (
                    <img
                        src={src}
                        alt={alt || `${firstName} ${lastName}`}
                        className="w-full h-full object-cover"
                        onError={() => setImgFailed(true)}
                    />
                ) : (
                    <span>{initials}</span>
                )}
            </div>

            {/* Premium Crown mini badge */}
            {isPremium && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 p-0.5 rounded-full shadow-md">
                    <Icons.Crown className="w-3 h-3 text-slate-950" />
                </div>
            )}

            {/* Online status indicator */}
            {showOnlineBadge && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#090d16] rounded-full"></span>
            )}
        </div>
    );
};

export default Avatar;
