
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../utils/axios";

const Feed = () => {
    const [users, setUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextCursor, setNextCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [limitReached, setLimitReached] = useState(false);
    const [remaining, setRemaining] = useState(null);

    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    const fetchFeed = async (cursor = null) => {
        if (loadingRef.current || !hasMoreRef.current) return;

        loadingRef.current = true;
        setLoading(true);

        try {
            const res = await axiosClient.get(
                `/feed?limit=10${cursor ? `&lastId=${cursor}` : ""}`
            );

            const newUsers = res.data.data || [];

            setUsers(prev => [...prev, ...newUsers]);
            setNextCursor(res.data.nextCursor);
            setRemaining(res.data.remaining ?? null);
            setLimitReached(res.data.limitReached || false);

            const moreAvailable =
                newUsers.length > 0 &&
                !!res.data.nextCursor &&
                !res.data.limitReached;

            hasMoreRef.current = moreAvailable;
            setHasMore(moreAvailable);

        } catch (err) {
            console.error("Feed error:", err);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const handleRequest = async (status, toUserId) => {
        try {
            await axiosClient.post(`/request/${status}/${toUserId}`);
        } catch (err) {
            const message = err.response?.data;

            if (
                typeof message === "string" &&
                message.includes("Connection request already exists")
            ) {
                console.log("Request already exists. Skipping profile.");
            } else {
                console.error("Request failed:", err);
                return;
            }
        }

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        if (nextIndex >= users.length && hasMoreRef.current) {
            await fetchFeed(nextCursor);
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

                        <p>Age: {currentUser.age || "Not provided"}</p>
                        <p>Gender: {currentUser.gender || "Not provided"}</p>

                        <div className="flex gap-4 mt-4">
                            <button
                                className="btn btn-error"
                                onClick={() =>
                                    handleRequest("ignored", currentUser._id)
                                }
                            >
                                Ignore
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={() =>
                                    handleRequest("interested", currentUser._id)
                                }
                            >
                                Interested
                            </button>
                        </div>
                    </div>
                </div>
            ) : loading ? (
                <p>Loading users...</p>
            ) : limitReached ? (
                <div className="card bg-base-200 shadow-xl w-full max-w-sm text-center">
                    <div className="card-body items-center">
                        <h2 className="card-title text-xl">
                            Daily Limit Reached!
                        </h2>

                        <p>
                            You've discovered 15 profiles today.
                            Upgrade to Premium for unlimited discovery!
                        </p>

                        <Link to="/premium" className="btn btn-primary mt-3">
                            Upgrade to Premium
                        </Link>
                    </div>
                </div>
            ) : (
                <h2 className="text-xl font-semibold">
                    No more users to discover!
                </h2>
            )}

            {remaining !== null && !limitReached && (
                <p className="mt-4 text-sm opacity-70">
                    Free profiles remaining today: {remaining}
                </p>
            )}
        </div>
    );
};

export default Feed;
