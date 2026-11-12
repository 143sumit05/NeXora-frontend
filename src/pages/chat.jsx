
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axios";
import { connectSocket } from "../utils/socket";

const Chat = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const currentUser = useSelector((store) => store.user);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const socket = connectSocket();

        let active = true;

        const handleReceiveMessage = (message) => {
            if (!active) return;

            setMessages((prev) => {
                const alreadyExists = prev.some(
                    (msg) => msg._id === message._id
                );

                if (alreadyExists) return prev;

                return [...prev, message];
            });
        };

        const joinConversation = () => {
            socket.emit("joinChat", { targetUserId: userId }, async (response) => {
                if (!active) return;

                if (response?.error) {
                    setError(response.error);
                    setLoading(false);
                    return;
                }

                try {
                    const res = await axiosClient.get(`/messages/${userId}`);

                    if (active) {
                        setMessages((prev) => {
                            const allMessages = [...res.data, ...prev];
                            const uniqueMessages = Array.from(
                                new Map(
                                    allMessages.map((msg) => [msg._id, msg])
                                ).values()
                            );

                            return uniqueMessages.sort(
                                (a, b) =>
                                    new Date(a.createdAt) -
                                    new Date(b.createdAt)
                            );
                        });

                        setLoading(false);
                    }
                } catch (err) {
                    console.error("Message fetch error:", err);
                    if (active) {
                        setError("Could not load previous messages");
                        setLoading(false);
                    }
                }
            });
        };

        socket.on("receiveMessage", handleReceiveMessage);

        if (socket.connected) {
            joinConversation();
        }

        socket.on("connect", joinConversation);

        return () => {
            active = false;
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("connect", joinConversation);
        };
    }, [userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim() || sending) return;

        const socket = connectSocket();

        if (!socket.connected) {
            setError("Connecting to chat server. Please try again.");
            return;
        }

        setSending(true);
        setError("");

        socket.emit(
            "sendMessage",
            {
                receiverId: userId,
                message: newMessage.trim()
            },
            (response) => {
                setSending(false);

                if (response?.error) {
                    setError(response.error);
                    return;
                }

                setNewMessage("");
            }
        );
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="card bg-base-100 shadow-xl h-[75vh] flex flex-col">

                <div className="p-4 border-b border-base-300 flex items-center gap-3">
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate("/connections")}
                    >
                        ← Back
                    </button>

                    <div>
                        <h2 className="font-bold text-lg">Chat</h2>
                        <p className="text-xs opacity-60">
                            Real-time conversation
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">

                    {loading && (
                        <p className="text-center opacity-60">
                            Loading messages...
                        </p>
                    )}

                    {!loading && messages.length === 0 && (
                        <p className="text-center opacity-60 mt-10">
                            No messages yet. Say hello!
                        </p>
                    )}

                    {messages.map((msg) => {
                        const isMine =
                            String(msg.senderId) ===
                            String(currentUser?._id);

                        return (
                            <div
                                key={msg._id}
                                className={`chat ${
                                    isMine ? "chat-end" : "chat-start"
                                }`}
                            >
                                <div className="chat-bubble">
                                    {msg.message}
                                </div>

                                <div className="chat-footer opacity-50 text-xs">
                                    {new Date(msg.createdAt).toLocaleTimeString(
                                        [],
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        }
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div ref={messagesEndRef} />
                </div>

                {error && (
                    <p className="text-error text-sm px-4">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-base-300 flex gap-2"
                >
                    <input
                        type="text"
                        className="input input-bordered flex-1"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!newMessage.trim() || sending}
                    >
                        {sending ? "Sending..." : "Send"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Chat;
