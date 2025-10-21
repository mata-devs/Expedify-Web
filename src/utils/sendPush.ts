import { getAuth } from "firebase/auth";

/**
 * Send FCM push notification via your Express/Firebase backend
 * @param token  - Target device FCM token
 * @param title  - Notification title
 * @param body   - Notification body text
 */
export const sendPush = async (token: string, title: string, body: string) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const idToken = await currentUser?.getIdToken();

    if (!token) {
      console.error("⚠️ No FCM token found");
      return;
    }
    if (!title) {
      console.error("⚠️ No title found");
      return;
    }
    if (!body) {
      console.error("⚠️ No body found");
      return;
    }
    if (!idToken) {
      console.error("⚠️ No ID token found — user not logged in?");
      return;
    }

    const response = await fetch("http://34.171.48.119/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, title, body }),
    });

    const text = await response.text();
    console.log("🔍 Raw response:", text);

    const data = JSON.parse(text);
    console.log("✅ Server response:", data);
  } catch (error) {
    console.error("❌ Error sending push:", error);
  }
};
