
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axiosClient from "../utils/axios";
import { updatePremium } from "../redux/userSlice";

function Premium() {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((store) => store.user);

    // Redirect existing Premium users to Feed
    useEffect(() => {
        if (user?.isPremium) {
            navigate("/feed", { replace: true });
        }
    }, [user?.isPremium, navigate]);

    // Load Razorpay SDK
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };

    // Handle Premium Payment
    const handlePayment = async () => {
        try {
            setLoading(true);

            const loaded = await loadRazorpay();

            if (!loaded) {
                alert("Razorpay SDK failed to load");
                setLoading(false);
                return;
            }

            // Create payment order
            const { data: order } = await axiosClient.post(
                "/payment/create-order"
            );

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "NeXora",
                description: "NeXora Premium Membership",
                order_id: order.orderId,

                handler: async function (response) {
                    try {
                        // Verify payment with backend
                        const { data } = await axiosClient.post(
                            "/payment/verify",
                            response
                        );

                        // Update Redux Premium state
                        dispatch(updatePremium());

                        alert(data.message);

                        // Redirect to Feed
                        navigate("/feed", { replace: true });

                    } catch (error) {
                        console.error(
                            "Payment verification error:",
                            error
                        );

                        alert(
                            error.response?.data?.message ||
                            "Payment verification failed"
                        );
                    } finally {
                        setLoading(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    }
                },

                theme: {
                    color: "#6366f1"
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {
                alert(
                    response.error.description ||
                    "Payment failed"
                );

                setLoading(false);
            });

            razorpay.open();

        } catch (error) {
            console.error("Payment initiation error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to initiate payment"
            );

            setLoading(false);
        }
    };

    // Don't show purchase card to Premium users
    if (user?.isPremium) return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-base-200">
            <div className="card bg-base-100 shadow-xl w-full max-w-md">
                <div className="card-body items-center text-center">

                    <div className="text-5xl">👑</div>

                    <h1 className="text-3xl font-bold">
                        NeXora Plus
                    </h1>

                    <p className="text-gray-500">
                        Unlock the complete NeXora experience.
                    </p>

                    <h2 className="text-5xl font-bold my-4">
                        ₹199
                    </h2>

                    <div className="text-left w-full space-y-3">
                        <p>✓ Unlimited profile discovery</p>
                        <p>✓ Exclusive Premium badge</p>
                        <p>✓ Priority feed visibility</p>
                    </div>

                    <button
                        className="btn btn-primary w-full mt-6"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : "Upgrade to Premium"}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Premium;
