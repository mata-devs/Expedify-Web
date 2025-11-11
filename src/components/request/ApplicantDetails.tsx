// src/components/requests/ApplicantDetails.tsx 
import type { UserData } from "../../utils/type";
import ApproveButtons from "./ApproveButtons";

export default function ApplicantDetails({ user }: { user: UserData }) {
  const portfolio = user.portfolio!;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "700" }}>{user.fullname}</h2>

      <div>
        <label>Short Bio Description</label>
        <div style={styles.box}>{portfolio.reviews?.[0]?.comment ?? "No bio"}</div>
      </div>

      <div>
        <label>Photography Expertise</label>
        <div style={styles.tagContainer}>
          {portfolio.level?.map((lvl) => (
            <span key={lvl} style={styles.tag}>{lvl}</span>
          ))}
        </div>
      </div>

      <div>
        <label>Price Range</label>
        <div style={styles.box}>
          ₱{portfolio.priceMin} - ₱{portfolio.priceMax}
        </div>
      </div>

      <div>
        <label>Best 5 photos</label>
        <div style={styles.photoContainer}>
          {portfolio.images?.map((img) => (
            <img key={img.url} src={img.url} style={styles.photo} />
          ))}
        </div>
      </div>
      {!user.portfolio?.approvedDate &&
        <ApproveButtons user={user} />}
    </div>
  );
}

const styles = {
  box: {
    background: "#F2F2F2",
    padding: "12px",
    borderRadius: "10px",
  },
  tagContainer: { display: "flex", gap: "8px" },
  tag: {
    background: "#FFD570",
    padding: "6px 12px",
    borderRadius: "8px",
  },
  photoContainer: { display: "flex", gap: "8px" },
  photo: { width: "80px", height: "80px", objectFit: "cover" as const, borderRadius: "10px" },
};
