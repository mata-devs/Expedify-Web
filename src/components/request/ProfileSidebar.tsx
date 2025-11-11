// src/components/requests/ProfileSidebar.tsx 

import type { UserData } from "../../utils/type";

export default function ProfileSidebar({ user }: { user: UserData }) {
    return (
        <div className="  " style={{ textAlign: "center" }}>
            <img src={user.photoURL} className="justify-center mx-auto my-5 items-center align-middle" style={styles.avatar} />
            <h3 className="py-2">{user.fullname}</h3>
            <p style={styles.gender}>{user.gender}</p>

            <p>{user.phoneNumber}</p>
            <p>{user.email}</p>
        </div>
    );
}

const styles = {
    avatar: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        objectFit: "cover" as const,
    },
    gender: {
        background: "#FFCE54",
        borderRadius: "6px",
        padding: "4px 10px",
        fontWeight: "600",
    },
};
