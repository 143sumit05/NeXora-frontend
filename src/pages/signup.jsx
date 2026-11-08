import { useState } from "react";
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

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async () => {
        setError("");

        try {
            await axiosClient.post("/signup", {
                ...formData,
                age: Number(formData.age)
            });

            navigate("/login");
        }
        catch (err) {
            setError(err.response?.data || "Signup failed");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="card bg-base-200 w-96 shadow-xl p-6">
                <h1 className="text-2xl font-bold text-center mb-5">
                    Create Account
                </h1>

                <input name="firstName" placeholder="First Name"
                    className="input input-bordered mb-3"
                    value={formData.firstName} onChange={handleChange} />

                <input name="lastName" placeholder="Last Name"
                    className="input input-bordered mb-3"
                    value={formData.lastName} onChange={handleChange} />

                <input name="emailId" type="email" placeholder="Email"
                    className="input input-bordered mb-3"
                    value={formData.emailId} onChange={handleChange} />

                <input name="password" type="password" placeholder="Password"
                    className="input input-bordered mb-3"
                    value={formData.password} onChange={handleChange} />

                <input name="age" type="number" placeholder="Age"
                    className="input input-bordered mb-3"
                    value={formData.age} onChange={handleChange} />

                <select name="gender" className="select select-bordered mb-3"
                    value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                </select>

                {error && <p className="text-error text-sm mb-3">{error}</p>}

                <button onClick={handleSignup} className="btn btn-primary">
                    Sign Up
                </button>

                <p className="text-center mt-4 text-sm">
                    Already have an account? <Link to="/login" className="link link-primary">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
