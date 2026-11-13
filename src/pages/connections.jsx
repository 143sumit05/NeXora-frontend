
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axios";
import { addConnections } from "../redux/connectionSlice";

const Connections = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const connections = useSelector((store) => store.connection);

    const fetchConnections = async () => {
        try {
            const res = await axiosClient.get("/user/connections");
            dispatch(addConnections(res.data.data));
        } catch (err) {
            console.log("Error fetching connections:", err);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                My Connections ({connections.length})
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((connection) => (
                    <div
                        key={connection._id}
                        className="card bg-base-100 shadow-md p-4 flex-row items-center gap-4"
                    >
                        <div className="avatar">
                            <div className="w-16 rounded-full">
                                <img
                                    src={connection.photoUrl || "https://placehold.co/100x100?text=User"}
                                    alt={connection.firstName}
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <h2 className="font-bold text-lg">
                                {connection.firstName} {connection.lastName}
                            </h2>

                            <button
                                className="btn btn-primary btn-sm mt-2"
                                onClick={() =>
                                    navigate(`/chat/${connection._id}`)
                                }
                            >
                                Chat
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Connections;
