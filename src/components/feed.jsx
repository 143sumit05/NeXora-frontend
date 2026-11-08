
import { useEffect, useState } from "react";
import axiosClient from "../utils/axios";

const Feed = () => {
    const [users, setUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchFeed = async (cursor = null) => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const res = await axiosClient.get(
                `/feed?limit=10${cursor ? `&lastId=${cursor}` : ""}`
            );

            const newUsers = res.data.data;

            setUsers((prev) => [...prev, ...newUsers]);
            setNextCursor(res.data.nextCursor);

            if (newUsers.length < 10) {
                setHasMore(false);
            }
        }
        catch (err) {
            console.log("Error fetching feed:", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const handleRequest = async (status, toUserId) => {
        try {
            await axiosClient.post(`/request/${status}/${toUserId}`);

            if (currentIndex + 1 >= users.length && hasMore) {
                setCurrentIndex((prev) => prev + 1);
                fetchFeed(nextCursor);
            } else {
                setCurrentIndex((prev) => prev + 1);
            }
        }
        catch (err) {
            console.log("Request failed:", err);
        }
    };

    const currentUser = users[currentIndex];

    return (
        <div className="p-6 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6">
                Discover People
            </h1>

            {currentUser ? (
                <div className="card bg-base-200 w-80 shadow-xl">
                    <figure className="px-4 pt-4">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            alt="Profile"
                            className="rounded-xl w-full h-64 object-cover"
                        />
                    </figure>

                    <div className="card-body items-center text-center">
                        <h2 className="card-title">
                            {currentUser.firstName} {currentUser.lastName}
                        </h2>

                        <p>Age: {currentUser.age}</p>
                        <p>Gender: {currentUser.gender}</p>

                        <div className="flex gap-4 mt-4">
                            <button
                                className="btn btn-error"
                                onClick={() => handleRequest("ignored", currentUser._id)}
                            >
                                Ignore
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={() => handleRequest("interested", currentUser._id)}
                            >
                                Interested
                            </button>
                        </div>
                    </div>
                </div>
            ) : loading ? (
                <p>Loading users...</p>
            ) : (
                <h2 className="text-xl font-semibold">
                    No more users to discover!
                </h2>
            )}
        </div>
    );
};

export default Feed;
