import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/slices/authSlice";
import { showToast } from "../store/slices/uiSlices";

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  const initializePayment = async (plan) => {
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");

      // Create order
      const { data: orderData } = await axios.post(
        "/api/payment/create-order",
        { plan },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "ResumeForge",
        description: `${plan} Subscription`,
        order_id: orderData.order.id,
        handler: async (response) => {
          // Verify payment
          try {
            const { data: verifyData } = await axios.post(
              "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            if (verifyData.success) {
              // Update user in Redux
              dispatch(
                updateUser({
                  subscription: "premium",
                  subscriptionExpiry: verifyData.subscription.expiryDate,
                }),
              );

              dispatch(
                showToast({
                  message: "Payment successful! You are now Premium.",
                  type: "success",
                }),
              );

              window.location.href = "/dashboard";
            }
          } catch (error) {
            dispatch(
              showToast({
                message: "Payment verification failed",
                type: "error",
              }),
            );
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      dispatch(
        showToast({
          message: "Failed to initialize payment",
          type: "error",
        }),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    initializePayment,
    isProcessing,
  };
};
