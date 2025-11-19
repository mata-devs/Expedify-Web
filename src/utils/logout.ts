import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useExpedifyStore } from "./useExpedifyStore";

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);

    // 🧠 Clear Zustand user state
    const { setUser, setUserData, setHasProfile, setLoading } = useExpedifyStore.getState();
    setUser(null);
    setHasProfile(null);
    setUserData(null);
    setLoading(false);

    // 🧹 Optionally clear onboarding/permissions 
    console.log("✅ User successfully logged out.");
  } catch (error) {
    console.error("❌ Logout error:", error);
  }
};
