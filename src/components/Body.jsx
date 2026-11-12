import Navbar from "./navbar";
import { Outlet, useNavigate } from "react-router-dom";
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

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default Body;