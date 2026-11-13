
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { addUser } from "../redux/userSlice";
import axiosClient from "../utils/axios";

const Profile = () => {
    const [showToast, setShowToast] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        photoUrl: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                age: user.age || "",
                gender: user.gender || "",
                photoUrl: user.photoUrl || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                ...formData,
                age: Number(formData.age)
            };

            await axiosClient.patch("/profile/edit", updatedData);

            dispatch(addUser({
                ...user,
                ...updatedData
            }));

            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

        } catch (err) {
            console.log("Profile update failed:", err.response?.data);
        }
    };

    return (
        <div className="flex justify-center mt-10 mb-10">
            <div className="card bg-base-100 shadow-xl w-96">
                <div className="card-body">

                    <h2 className="text-2xl font-bold">
                        Edit Profile
                    </h2>

                    {/* Profile Photo Preview */}
                    <div className="flex justify-center my-4">
                        <img
                            src={formData.photoUrl || "https://placehold.co/200x200?text=No+Photo"}
                            alt="Profile Preview"
                            className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                        />
                    </div>

                    {/* Photo URL */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            Profile Photo URL
                        </legend>

                        <input
                            className="input input-bordered w-full"
                            type="url"
                            name="photoUrl"
                            placeholder="Paste image URL"
                            value={formData.photoUrl}
                            onChange={handleChange}
                        />
                    </fieldset>

                    {/* First Name */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">First Name</legend>
                        <input
                            className="input input-bordered"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </fieldset>

                    {/* Last Name */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Last Name</legend>
                        <input
                            className="input input-bordered"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </fieldset>

                    {/* Age */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Age</legend>
                        <input
                            className="input input-bordered"
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </fieldset>

                    {/* Gender */}
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Gender</legend>
                        <select
                            className="select select-bordered"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Others</option>
                        </select>
                    </fieldset>

                    <button
                        className="btn btn-primary mt-4"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>

                    {showToast && (
                        <div className="toast toast-top toast-center">
                            <div className="alert alert-success">
                                <span>Profile updated successfully!</span>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Profile;
