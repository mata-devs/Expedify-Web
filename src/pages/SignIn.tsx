import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import AuthLayout from "../components/AuthLayout";
import { signInWithGoogle } from "../utils/GoogleSignin";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      signInWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center w-full max-w-sm mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign In</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <div className="w-full flex justify-end">
          <Link to="/forgot" className="text-sm text-amber-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 text-white font-semibold py-2 rounded-full hover:bg-amber-600 transition-all"
        >
          Next
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 text-gray-700 hover:bg-gray-50 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <p className="text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-amber-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
