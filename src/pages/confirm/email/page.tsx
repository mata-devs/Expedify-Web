import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, applyActionCode } from "firebase/auth";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const ranRef = useRef(false);

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");

    if (!oobCode) {
      setStatus("error");
      return;
    }

    const auth = getAuth();

    applyActionCode(auth, oobCode)
      .then(async () => {
        await auth.currentUser?.reload();
        setStatus("success");

        setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 2500);
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        {status === "loading" && (
          <>
            <h2>Verifying your email…</h2>
            <p>Please wait a moment</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 style={{ color: "green" }}>Email verified 🎉</h2>
            <p>Redirecting you to login…</p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 style={{ color: "red" }}>Verification failed</h2>
            <p>This link may be expired or already used.</p>
          </>
        )}
      </div>
    </div>
  );
}
