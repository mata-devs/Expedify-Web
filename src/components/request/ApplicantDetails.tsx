// src/components/requests/ApplicantDetails.tsx 
import { Levels, type UserData } from "../../utils/type";
import ApproveButtons from "./ApproveButtons";

export default function ApplicantDetails({ user }: { user: UserData }) {
  const portfolio = user.portfolio!;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "700" }}>{user.fullname}</h2>

      <div>
        <label>Short Bio Description</label>
        <div style={styles.box}>{portfolio.bio ?? "No Bio Provided"}</div>
      </div>

      <div>
        <label>Photography Expertise</label>
        <div style={styles.tagContainer}>
          {portfolio.expertise ? portfolio.expertise.map((lvl) => (
            <span key={lvl} style={styles.tag}>{lvl}</span>
          )) : <p>No Expertise Selected</p>}
        </div>
      </div>
      <div>
        <label>Photography Tier</label>
        <div style={styles.tagContainer}>
          {portfolio?.level?.length > 0 ? Levels.map((lvl) => portfolio?.level?.includes(lvl.level) &&
            <span key={lvl.level} style={styles.tag}>{lvl.level}</span>
          ) : <p>No Tier Selected</p>}
        </div>
      </div>
      <div>
        <label>
          Equipment Details</label>
        <div style={styles.box}>
          {portfolio.equipments || "No Equipmentsc"}
        </div>
      </div>
      <div>
        <label>Price Range</label>
        <div style={styles.box}>
          ₱{portfolio.priceMin} - ₱{portfolio.priceMax}
        </div>
      </div>
      <div>
        <label>Portfolio Link</label>
        <div style={styles.box}>
          {portfolio.linkPortfolio?<a href={portfolio.linkPortfolio} className="hover:underline hover:text-blue-500">{portfolio.linkPortfolio}</a>:"No URL Provided"}
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
      {
        (!user.portfolio?.approvedDate && !user.portfolio?.declinedDate) &&
        <ApproveButtons user={user} />
      }
    </div >
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
