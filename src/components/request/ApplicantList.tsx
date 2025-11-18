// src/components/requests/ApplicantList.tsx
import type { UserData } from "../../utils/type";
import ApplicantCard from "./ApplicantCard";

type Props = {
  applicants: UserData[];
  selectedUser: UserData | null;
  onSelect: (user: UserData) => void;
};

export default function ApplicantList({ applicants, onSelect, selectedUser }: Props) {
  return (
    <div>
      <h2 style={{ padding: "16px", fontWeight: "bold" }}>Applications</h2>

      {applicants.map((user) => (
        <ApplicantCard key={user.id} user={user} onSelect={() => onSelect(user)} selectedUser={selectedUser} />
      ))}
    </div>
  );
}
