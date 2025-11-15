import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "../../Api/axiosInstance";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log(
      "Google login success, credential received:",
      credentialResponse
    );

    try {
      console.log("Sending Google token to backend...");
      const res = await axiosInstance.post("/api/auth/google", {
        token: credentialResponse.credential,
      });

      console.log("Backend response:", res.data);
      const { accessToken, refreshToken, role } = res.data;

      if (accessToken && refreshToken) {
        console.log("Tokens received, logging in user...");
        login(accessToken, role, refreshToken);
        navigate("/");
      } else {
        console.error("No tokens received from Google login");
        alert("Google login failed - no tokens received");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || error.message || "Google login failed";
      alert(`Google login failed: ${errorMessage}`);
    }
  };

  const handleGoogleError = (error) => {
    console.error("Google login failed", error);
    // Suppress the GSI_LOGGER warning - it's just a warning, not blocking
    if (error?.type === 'popup_closed_by_user') {
      // User closed the popup, no need to show error
      return;
    }
    // Only show alert for actual errors
    const errorMsg = "Google login failed. Please try again.";
    alert(errorMsg);
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
      useOneTap={false}
      auto_select={false}
    />
  );
};

export default GoogleLoginButton;
