// src/components/requests/ApproveButtons.tsx 
import { db } from "../../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { UserData, UserType } from "../../utils/type";

export default function ApproveButtons({ user }: { user: UserData }) {
    const approve = async () => {
        await updateDoc(doc(db, "users", user.id), {
            "portfolio.approvedDate": serverTimestamp(),
            "userType": "Photographer" as UserType,
        });
    };

    return (
        <div style={{ display: "flex", gap: "10px" }}>
            <button style={styles.accept} onClick={approve}>Accept</button>
            <button style={styles.decline}>Decline</button>
        </div>
    );
}

const styles = {
    accept: {
        flex: 1,
        padding: "14px",
        background: "#FFCE54",
        borderRadius: "10px",
        border: "none",
        fontWeight: "bold",
        cursor: "pointer",
    },
    decline: {
        flex: 1,
        padding: "14px",
        background: "#3F3F46",
        borderRadius: "10px",
        border: "none",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
    },
};
