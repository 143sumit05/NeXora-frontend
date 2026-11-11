
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { removeUser } from "../redux/userSlice";
import axiosClient from "../utils/axios";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((store) => store.user);

    const handleLogout = async () => {
        try {
            await axiosClient.post("/logout");
            dispatch(removeUser());
            navigate("/login");
        } catch (err) {
            console.log("Logout failed", err);
        }
    };

    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <Link
                    to={user ? "/" : "/login"}
                    className="btn btn-ghost text-xl"
                >
                    NeXora
                </Link>
            </div>

            <div className="flex gap-2 items-center">
                {user && (
                    <>
                        {user.isPremium ? (
                            <span className="badge badge-warning gap-1">
                                <span>✓</span> PREMIUM
                            </span>
                        ) : (
                            <Link
                                to="/premium"
                                className="btn btn-primary btn-sm"
                            >
                                Upgrade
                            </Link>
                        )}

                        <span className="font-semibold">
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
                                        src={
                                            user.photoUrl ||
                                            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                        }
                                    />
                                </div>
                            </div>

                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                            >
                                <li><Link to="/profile">Profile</Link></li>
                                <li><Link to="/connections">Connections</Link></li>
                                <li><Link to="/requests">Requests</Link></li>
                                {!user.isPremium && (
                                    <li><Link to="/premium">Upgrade to Premium</Link></li>
                                )}
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
