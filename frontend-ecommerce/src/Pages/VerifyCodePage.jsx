import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyCodePage = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get email & password from SignupPage
  const email = location.state?.email || "";
  const password = location.state?.password || "";

  const handleVerify = async () => {
    if (!code) return setMessage("Enter the verification code");
    setLoading(true);
    try {
      // Step 1: Verify the OTP
      await axios.post("http://localhost:8080/api/auth/verify-code", { email, code });
      setMessage("Verification successful! Logging you in...");

      // Step 2: Auto-login using email & password
      const loginRes = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      // Step 3: Store tokens
      localStorage.setItem("accessToken", loginRes.data.accessToken);
      localStorage.setItem("refreshToken", loginRes.data.refreshToken);
      localStorage.setItem("role", loginRes.data.role);

      // Step 4: Redirect to dashboard
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setMessage(error.response?.data || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/resend-code", { email });
      setMessage("Verification code resent successfully.");
    } catch (error) {
      setMessage(error.response?.data || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          We sent a 6-digit verification code to <b>{email}</b>. Please enter it below.
        </p>

        <input
          type="text"
          maxLength="6"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          className="border rounded w-full p-2 mb-4 text-center text-lg tracking-widest"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>

        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full bg-gray-300 text-black p-2 rounded mt-3 hover:bg-gray-400"
        >
          Resend Code
        </button>

        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyCodePage;
