// src/components/requests/RequestLayout.tsx
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";

import ApplicantList from "./ApplicantList";
import ApplicantDetails from "./ApplicantDetails";
import ProfileSidebar from "./ProfileSidebar";
import type { UserData } from "../../utils/type";

export default function RequestLayout() {
    const [applicants, setApplicants] = useState<UserData[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    useEffect(() => {
        const clientsQuery = query(
            collection(db, "users"),
            where("userType", "==", "Client"),
            where("portfolio.applicationDate", "!=", null)
        );

        const photographersQuery = query(
            collection(db, "users"),
            where("userType", "==", "Photographer")
        );

        const unsubClients = onSnapshot(clientsQuery, (snap) => {
            const clientUsers = snap.docs.map(
                (d) => ({ ...(d.data() as UserData), id: d.id } as UserData) // assert type
            );
            setApplicants((prev) => [
                ...prev.filter((u) => u.userType !== "Client"),
                ...clientUsers,
            ]);
        });

        const unsubPhotographers = onSnapshot(photographersQuery, (snap) => {
            const photographerUsers = snap.docs.map(
                (d) => ({ ...(d.data() as UserData), id: d.id } as UserData) // assert type
            );
            setApplicants((prev) => [
                ...prev.filter((u) => u.userType !== "Photographer"),
                ...photographerUsers,
            ]);
        });

        return () => {
            unsubClients();
            unsubPhotographers();
        };
    }, []);

    return (
        <div className="flex h-screen">

            {/* LEFT COLUMN */}
            <div className="flex-1 bg-[#FAF6EC] overflow-y-scroll">
                <ApplicantList applicants={applicants} onSelect={setSelectedUser} selectedUser={selectedUser}/>
            </div>

            {/* MIDDLE COLUMN */}
            <div className="flex-[2] p-5 overflow-y-scroll">
                {selectedUser && <ApplicantDetails user={selectedUser} />}
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex-1 bg-[#FFF9E6] p-5">
                {selectedUser && <ProfileSidebar user={selectedUser} />}
            </div>

        </div>
    );
}
