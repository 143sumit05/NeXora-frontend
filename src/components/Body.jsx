import Navbar from "./navbar";
import Footer from "./footer";
import MobileNav from "./MobileNav";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axios";
import { addUser, removeUser } from "../redux/userSlice";
import {
    connectSocket,
    disconnectSocket
} from "../utils/socket";

const Body = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const userData = useSelector((store) => store.user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosClient.get("/profile");
                dispatch(addUser(res.data.user));
            } catch (err) {
                dispatch(removeUser());
                navigate("/login");
                console.log(err);
            }
        };

        if (!userData) {
            fetchUser();
        }
    }, []);

    // Connect socket after user authentication
    useEffect(() => {
        if (userData) {
            const socket = connectSocket();

            socket.on("connect", () => {
                console.log("Socket connected:", socket.id);
            });

            socket.on("connect_error", (err) => {
                console.log("Socket connection error:", err.message);
            });

            return () => {
                socket.off("connect");
                socket.off("connect_error");
            };
        } else {
            disconnectSocket();
        }
    }, [userData]);

    // Check if current route is auth page or chat to optimize padding
    const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
    const isChatPage = location.pathname.startsWith("/chat");

    return (
        <div className="min-h-screen flex flex-col bg-[#080c15] text-slate-100 relative overflow-x-hidden selection:bg-purple-500/30">
            {/* Subtle Ambient Glowing Mesh Backdrops */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse-subtle" />
                <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse-subtle" style={{ animationDelay: "2s" }} />
                <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-sky-600/8 rounded-full blur-[120px] animate-pulse-subtle" style={{ animationDelay: "4s" }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.06),transparent_60%)]" />
            </div>

            <Navbar />

            <main className={`flex-1 flex flex-col ${isAuthPage ? "" : isChatPage ? "pb-4" : "pb-24 md:pb-12"}`}>
                <Outlet />
            </main>

            {userData && !isChatPage && <MobileNav />}

            {!isAuthPage && !isChatPage && <Footer />}
        </div>
    );
};

export default Body;
