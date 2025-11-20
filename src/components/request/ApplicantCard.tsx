// src/components/requests/ApplicantCard.tsx
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import type { UserData } from "../../utils/type";
import { db } from "../../firebase";
import tuko from "../../assets/gecko.png";
export default function ApplicantCard({
    user,
    onSelect,
    selectedUser
}: {
    user: UserData;
    selectedUser: UserData | null;
    onSelect: () => void;
}) {

    const review = async () => {
        console.log(user);
        onSelect()
        await updateDoc(doc(db, "users", user.id), {
            "portfolio.reviewDate": serverTimestamp(),
        });
    };

    return (
        <div
            onClick={review}
            className={`${selectedUser == user ? "bg-[#979797] " : user.portfolio?.reviewDate != null ? "bg-[#FFF4CF] " : "bg-[#E1E1E1]"} flex justify-center align-middle items-center p-3 cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition`}
        >
            <div className="relative w-14 aspect-square px-5">
                <img
                    src={user.photoURL || tuko}
                    className="absolute left-0 top-0 w-12 h-12 rounded-full object-cover"
                />
            </div>

            <div className="px-2">
                <p className={`${user.portfolio?.reviewDate != null ? "" : "font-semibold"}`}>{user.fullname}</p>
                <p className={`${user.portfolio?.reviewDate != null ? "" : "font-semibold"} text-xs text-[#B08930]`}>{user.portfolio?.approvedDate != null ? "Application Approved" :user.portfolio?.declinedDate != null ?"Application Declined": "Pending Application Sent"}</p>
            </div>
        </div>
    );
}
