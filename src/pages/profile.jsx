import { useSelector } from "react-redux";
import { useState , useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import axiosClient from "../utils/axios";

const Profile = () => {
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((store)=> store.user);
  const [formData, setFormData] = useState({
        firstName: "",
        age: "",
        lastName: "",
        gender: ""
      });

      useEffect(() => {
        if(user){
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            age: user.age || "",
            gender: user.gender || ""            
          })
        }
      },[user])

      const handleSave = async () => {
        try {
          await axiosClient.patch("/profile/edit", {
            ...formData,
            age: Number(formData.age)
          });

          dispatch(addUser({
            ...user,
            ...formData,
            age: Number(formData.age)
          }));
          setShowToast(true);

          setTimeout(() => {
            setShowToast(false);
          }, 3000);

        } catch (err) {
          console.log("Profile update failed:", err.response?.data);
        }
};      

    return (
        <div className="flex justify-center mt-10">
            <div className="card bg-base-100 shadow-xl w-96">
                <div className="card-body">

                    <h2 className="text-2xl font-bold">
                        Edit Profile
                    </h2>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">First Name</legend>
                        <input className="input input-bordered" type="text" value = {formData.firstName}
                        onChange={(e) => setFormData({
                          ...formData,
                          firstName: e.target.value
                        })} />
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Last Name</legend>
                        <input className="input input-bordered" type="text"value = {formData.lastName}
                        onChange={(e) => setFormData({
                          ...formData,
                          lastName: e.target.value
                        })} />
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Age</legend>
                        <input className="input input-bordered" type="number" value = {formData.age}
                        onChange={(e) => setFormData({
                          ...formData,
                          age: e.target.value
                        })}/>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Gender</legend>
                        <select className="select select-bordered" value = {formData.gender}
                        onChange={(e) => setFormData({
                          ...formData,
                          gender: e.target.value
                        })} >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Others</option>
                        </select>
                    </fieldset>

                    <button className="btn btn-primary mt-4" onClick={handleSave} >
                        Save Changes
                    </button>
{showToast && (
    <div className="toast toast-top toast-center ">
        <div className="alert alert-success">
            <span>Profile changes saved successfully!</span>
        </div>
    </div>
)}
                </div>
            </div>
        </div>
    );
};

export default Profile;
