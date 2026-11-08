
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../redux/userSlice";
import axiosClient from "../utils/axios";
import { Link } from 'react-router-dom';

const Navbar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async() =>{
    try{
      await axiosClient.post("/logout");
      dispatch(removeUser());
      navigate("/login");
    }
    catch(err){
      console.log("Logout failed ", err);
      
    }
  }



  const user = useSelector((store) => store.user);
  
  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to = "/" className="btn btn-ghost text-xl">NeXora</Link>
      </div>

      <div className="flex gap-2">
        {user && (
          <>
            <span className="font-semibold flex items-center">
              {user.firstName}
            </span>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar w-16 mr-4"
              >
                <div className="w-20 rounded-full">
                  <img
                    alt="Profile"
                    src={user.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li><Link to = "/profile">Profile</Link></li>
                <li><a>Settings</a></li>
                <li><button onClick = {handleLogout}>Logout</button></li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
