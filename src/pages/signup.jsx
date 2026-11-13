
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../utils/axios";

const Signup = () => {
    const navigate = useNavigate();

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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

    const handleSignup = async () => {
        setError("");

        try {
            setLoading(true);

            let photoUrl = "";

            // Upload selected image to Cloudinary
            if (photo) {
                const imageData = new FormData();
                imageData.append("photo", photo);

                const uploadRes = await axiosClient.post(
                    "/upload/profile-photo",
                    imageData
                );

                photoUrl = uploadRes.data.photoUrl;
            }

            // Create user account
            await axiosClient.post("/signup", {
                ...formData,
                age: Number(formData.age),
                photoUrl
            });

            navigate("/login");

        } catch (err) {
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : err.response?.data?.message || "Signup failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen py-8">
            <div className="card bg-base-200 w-96 shadow-xl p-6">

                <h1 className="text-2xl font-bold text-center mb-5">
                    Create Account
                </h1>

                {/* Profile Photo */}
                <div className="flex flex-col items-center mb-5">
                    <img
                        src={preview || "https://placehold.co/150x150?text=Profile"}
                        alt="Profile Preview"
                        className="w-28 h-28 rounded-full object-cover mb-3"
                    />

                    <label className="btn btn-outline btn-sm">
                        Choose Profile Photo
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </label>

                    <p className="text-xs opacity-60 mt-2">
                        JPG, PNG or WEBP (Max 5 MB)
                    </p>
                </div>

                <input
                    name="firstName"
                    placeholder="First Name"
                    className="input input-bordered mb-3"
                    value={formData.firstName}
                    onChange={handleChange}
                />

                <input
                    name="lastName"
                    placeholder="Last Name"
                    className="input input-bordered mb-3"
                    value={formData.lastName}
                    onChange={handleChange}
                />

                <input
                    name="emailId"
                    type="email"
                    placeholder="Email"
                    className="input input-bordered mb-3"
                    value={formData.emailId}
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="input input-bordered mb-3"
                    value={formData.password}
                    onChange={handleChange}
                />

                <input
                    name="age"
                    type="number"
                    placeholder="Age"
                    className="input input-bordered mb-3"
                    value={formData.age}
                    onChange={handleChange}
                />

                <select
                    name="gender"
                    className="select select-bordered mb-3"
                    value={formData.gender}
                    onChange={handleChange}
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>

                {error && (
                    <p className="text-error text-sm mb-3">{error}</p>
                )}

                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                <p className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="link link-primary">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Signup;
