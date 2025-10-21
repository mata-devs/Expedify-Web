import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import AuthLayout from "../components/AuthLayout";

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [email] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        email,
        gender,
        fullName: "",
        userType: "Client",
        photoURL: "",
        createdAt: serverTimestamp(),
        averageRating: 0,
        clients: 0,
        isBook: false,
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-sm text-left space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Create your profile
        </h2>

        <input
          type="email"
          value={email}
          readOnly
          className="w-full p-2 border rounded-lg bg-gray-100 text-gray-600"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full p-2 border rounded-lg"
        />

        <div>
          <p className="font-medium mb-2">Gender</p>
          <div className="flex space-x-2">
            {["Male", "Female", "Prefer not to say"].map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGender(g)}
                className={`px-4 py-1 rounded-full border transition ${
                  gender === g
                    ? "bg-expedify-gold text-black border-expedify-gold"
                    : "border-gray-400 text-gray-700 hover:border-expedify-gold"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-expedify-gold text-black font-semibold rounded-full py-2 hover:scale-105 transition"
        >
          Next
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </AuthLayout>
  );
};

export default CreateProfile;
