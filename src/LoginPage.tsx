import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./LoginPage.css";
import mascot from "./assets/gecko.png"; // ← place your mascot image here

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, pw);
      } else {
        await signInWithEmailAndPassword(auth, email, pw);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <h2>Your ideas deserve the right creative touch.</h2>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">
            {isSignUp ? "Sign up" : "Sign in"}
          </button>
        </form>

        <button className="btn-google" onClick={handleGoogle}>
          Login with Google
        </button>

        <button className="btn-guest">Sign in as Guest</button>

        {error && <p className="error">{error}</p>}

        <p className="toggle">
          {isSignUp
            ? "Already have an account?"
            : "Don’t have an account yet?"}{" "}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign in" : "Sign up"}
          </span>
        </p>
      </div>

      <div className="right-panel">
        <img src={mascot} alt="Expedify mascot" className="mascot" />
      </div>
    </div>
  );
}
