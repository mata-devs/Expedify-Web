// src/components/requests/ApproveButtons.tsx 
import { db } from "../../firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { UserData, UserType } from "../../utils/type";
import { sendEmail } from "../../utils/sendNotification";
import { useEffect, useState } from "react";
import { useExpedifyStore } from "../../utils/useExpedifyStore";

export default function ApproveButtons({ user, }: { user: UserData; }) {
    const { userData } = useExpedifyStore();
    const approveDecline = async (type: "Approved" | "Declined" = "Approved") => {
        if (type == "Approved") {

            await updateDoc(doc(db, "users", user.id), {
                "portfolio.approvedDate": serverTimestamp(),
                "userType": "Photographer" as UserType,
                "approvedBy": userData?.id
            });
        } else {

            await updateDoc(doc(db, "users", user.id), {
                "portfolio.declinedDate": serverTimestamp(),
                "portfolio.reason": reason,
                "declinedBy": userData?.id
            });
        }
        sendEmail(user.email, `Your Application is ${type}`, "", `Hello ${user.fullname}, Your Application is ${type} by ${userData?.fullname}. \n ${type=="Approved"&&"You have now a Photographer Access.   "}`);
        setDecline(false);
    };
    const [isDecline, setDecline] = useState(false);
    const [reason, setReason] = useState(user.portfolio?.reason);
    useEffect(() => {
        setDecline(false);
    }, [user]);

    return (
        <div className="p-5">
            <div style={{ display: "flex", gap: "10px" }}>
                <button className={`${isDecline ? "" : ""} p-4  text-white flex-1 bg-[#EDB03B] rounded-full font-bold `} onClick={() => approveDecline("Approved")}>Accept</button>
                <button className={`${isDecline ? "" : ""} p-4 text-white flex-1 bg-[#3F3F46] rounded-full font-bold `} onClick={() => { setDecline(!isDecline); }}>{isDecline ? "Cancel" : "Decline"}</button>
            </div>
            {isDecline &&
                <div className=" flex flex-col">
                    <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter Reason for Decline"
                        className="p-5 my-5"
                    ></input>
                    <button className={`${isDecline ? "" : ""} p-4 text-white flex-1 bg-[#3F3F46] rounded-full font-bold `} onClick={() => { approveDecline("Declined") }}>Confirm</button>
                </div>
            }
        </div>
    );
}

