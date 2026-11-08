import { useEffect, useState } from "react";
import axiosClient from "../utils/axios";

const Requests = () => {
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const res = await axiosClient.get("/user/pendingRequest");
            setRequests(res.data.data);
        }
        catch (err) {
            console.log("Error fetching requests:", err);
        }
    };
    const reviewRequest = async (status, requestId) => {
    try {
        await axiosClient.patch(`/recieve/${status}/${requestId}`);

        // Remove the reviewed request from the UI
        setRequests((prev) =>
            prev.filter((request) => request._id !== requestId)
        );
    }
    catch (err) {
        console.log("Error reviewing request:", err);
    }
};

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">
                Connection Requests ({requests.length})
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requests.map((request) => (
                    <div
                        key={request._id}
                        className="card bg-base-100 shadow-md p-4 flex-row items-center gap-4"
                    >
                        <div className="avatar">
                            <div className="w-16 rounded-full">
                                <img
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    alt="Profile"
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="font-bold text-lg">
                                {request.fromUserId?.firstName} {request.fromUserId?.lastName}
                            </h2>
                            <div className="flex gap-2 mt-3">
    <button
        className="btn btn-success btn-sm"
        onClick={() => reviewRequest("accepted", request._id)}
    >
        Accept
    </button>

    <button
        className="btn btn-error btn-sm"
        onClick={() => reviewRequest("rejected", request._id)}
    >
        Reject
    </button>
</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Requests;