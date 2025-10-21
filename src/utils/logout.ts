import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useExpedifyStore } from "./useExpedifyStore";

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);

    // 🧠 Clear Zustand user state
    const { setUser, setHasProfile, setLoading } = useExpedifyStore.getState();
    setUser(null);
    setHasProfile(null);
    setLoading(false);

    // 🧹 Optionally clear onboarding/permissions
    localStorage.removeItem("expedify_onboard_done");
    localStorage.removeItem("expedify_location_permission");
    localStorage.removeItem("expedify_notif_permission");

    console.log("✅ User successfully logged out.");
  } catch (error) {
    console.error("❌ Logout error:", error);
  }
};
