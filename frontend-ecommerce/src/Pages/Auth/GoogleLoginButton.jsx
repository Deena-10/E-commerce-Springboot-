import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";

const GoogleLoginButton = () => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/google", {
        token: credentialResponse.credential,
      });

      // Store tokens
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.role);

      // Redirect
      window.location.href = "/";
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => console.log('Google login failed')}
    />
  );
};

export default GoogleLoginButton;
