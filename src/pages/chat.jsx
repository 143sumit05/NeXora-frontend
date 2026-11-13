import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axios";
import { connectSocket } from "../utils/socket";
import Icons from "../components/Icons";
import Avatar from "../components/Avatar";

const selectConnections = (store) => store.connection;

const Chat = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const currentUser = useSelector((store) => store.user);
    const rawConnections = useSelector(selectConnections);

    // Identify the chat partner from existing connections in Redux
    const partner = useMemo(() => {
        return rawConnections?.find((c) => String(c._id) === String(userId));
    }, [rawConnections, userId]);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

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
        if (e) e.preventDefault();

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
                inputRef.current?.focus();
            }
        );
    };

    const formatMessageTime = (dateString) => {
        try {
            return new Date(dateString).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return "";
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-6 flex-1 flex flex-col h-[calc(100vh-5rem)]">
            <div className="rounded-3xl glass-card flex-1 flex flex-col border border-white/10 shadow-2xl overflow-hidden">
                
                {/* Chat Top Header */}
                <div className="p-3.5 sm:p-4 border-b border-white/10 bg-[#070b14]/80 backdrop-blur-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/connections")}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            title="Back to connections"
                        >
                            <Icons.ArrowLeft className="w-5 h-5" />
                        </button>

                        <Avatar
                            src={partner?.photoUrl}
                            firstName={partner?.firstName || "U"}
                            lastName={partner?.lastName || ""}
                            size="md"
                            isPremium={partner?.isPremium}
                            showOnlineBadge={true}
                        />

                        <div>
                            <div className="flex items-center gap-1.5">
                                <h2 className="font-display font-bold text-base text-white">
                                    {partner ? `${partner.firstName} ${partner.lastName}` : "Direct Message"}
                                </h2>
                                {partner?.isPremium && (
                                    <Icons.Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                )}
                            </div>
                            <p className="text-xs text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                <span>Real-time connected</span>
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                        <span className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            Encrypted & direct
                        </span>
                    </div>
                </div>

                {/* Messages Thread Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-48 space-y-3">
                            <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                            <p className="text-slate-400 text-xs">Loading message history...</p>
                        </div>
                    )}

                    {!loading && messages.length === 0 && (
                        <div className="text-center py-16 px-4 max-w-sm mx-auto">
                            <div className="inline-flex p-3 rounded-2xl bg-purple-500/10 text-purple-400 mb-3 border border-purple-500/20">
                                <Icons.Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="font-display text-lg font-bold text-white">
                                Say hello!
                            </h3>
                            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                                This is the beginning of your conversation with {partner ? partner.firstName : "this connection"}. Send a friendly message to break the ice!
                            </p>
                        </div>
                    )}

                    {messages.map((msg, index) => {
                        const isMine = String(msg.senderId) === String(currentUser?._id);

                        return (
                            <div
                                key={msg._id || index}
                                className={`flex flex-col ${isMine ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-150`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-md px-4 py-2.5 text-sm shadow-md ${
                                        isMine
                                            ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-xs"
                                            : "bg-slate-800/90 text-slate-100 border border-white/10 rounded-2xl rounded-tl-xs backdrop-blur-md"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap break-words leading-relaxed">
                                        {msg.message}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 mt-1 px-1">
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {formatMessageTime(msg.createdAt)}
                                    </span>
                                    {isMine && (
                                        <Icons.Check className="w-3 h-3 text-purple-400" />
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div ref={messagesEndRef} />
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mx-4 mb-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={() => setError("")}
                            className="text-rose-400 hover:text-white text-xs ml-2"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Message Input Bar */}
                <form
                    onSubmit={handleSendMessage}
                    className="p-3 sm:p-4 border-t border-white/10 bg-[#070b14]/90 backdrop-blur-xl flex items-center gap-2"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={`Message ${partner?.firstName || ""}...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                    />

                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="py-2.5 px-4 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                        {sending ? (
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <span className="hidden sm:inline">Send</span>
                                <Icons.Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Chat;
