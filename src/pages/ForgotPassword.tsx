import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent! Check your email.");
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleReset}>
        <h2>Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary">Send Reset Link</button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <p className="small">
          Back to <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
