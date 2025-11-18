
import { useRef, useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import type { Photographer, PhotographerLevel, UserData } from "../utils/type";
import { db } from "../firebase";
import PhotoUploadFive from "./PhotoUploadFive";
import { uploadImageWithProgress } from "../utils/uploadWithProgress";

export const priceRange = [
  { id: 1, min: 1000, max: 3999 },
  { id: 2, min: 4000, max: 7999 },
  { id: 3, min: 8000, max: 11999 },
  { id: 4, min: 12000, max: 16000 }
];

export type PriceRnageType = { id: number; min: number; max: number };

export const PhotographyExpertise = [
  "Portrait & People",
  "Landscape & Travel",
  "Product & Commercial",
  "Events",
  "Documentary & Street",
  "Architectural & Real Estate",
  "Specialized & Technical"
];

export default function CreatorApplicationForm({ userData }: { userData: UserData }) {
  const [name, setName] = useState(userData.fullname);
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [priceRangeSelected, setPriceRangeSelected] = useState<PriceRnageType | null>(null);
  const [linkPortfolio, setLinkPortfolio] = useState("");

  // Profile image preview + file + progress
  const [image, setImage] = useState<string | null>(null);
  const [equiptments, setEquiptments] = useState<string>("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileProgress, setProfileProgress] = useState(0);

  // Portfolio images preview, files, progress bars
  const [images5, setImages5] = useState<(string | null)[]>(Array(5).fill(null));
  const [files5, setFiles5] = useState<(File | null)[]>(Array(5).fill(null));
  const [progress5, setProgress5] = useState<number[]>(Array(5).fill(0));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Toggle functions
  const toggleLevel = (lvl: string) => {
    setLevels(prev => (prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]));
  };

  const togglePriceRange = (lvl: PriceRnageType) => {
    setPriceRangeSelected(lvl);
  };

  // Handle profile selection
  const openFileDialog = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileFile(file);

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setProfileFile(file);

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // -----------------------------
  //  FORM SUBMIT
  // -----------------------------
  const handleSubmit = async (e: React.DragEvent<HTMLFormElement>) => {
    if (!name || !location || !priceRangeSelected || levels.length < 1) {
      alert("Please fill all required fields.");
      return;
    }
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedProfileURL: string | null = null;

      // -------------------------
      // Upload profile image
      // -------------------------
      if (profileFile) {
        uploadedProfileURL = await uploadImageWithProgress(
          profileFile,
          `users/${userData.id}/profile.jpg`,
          (p) => setProfileProgress(p)
        );
      }

      // -------------------------
      // Upload 5 portfolio photos
      // -------------------------
      const uploadedPortfolio = [];

      for (let i = 0; i < files5.length; i++) {
        const file = files5[i];

        if (!file) {
          uploadedPortfolio.push({ isHighlighted: true, url: null });
          continue;
        }

        const url = await uploadImageWithProgress(
          file,
          `users/${userData.id}/portfolio/img_${i + 1}.jpg`,
          (percent) =>
            setProgress5((prev) => {
              const updated = [...prev];
              updated[i] = percent;
              return updated;
            })
        );

        uploadedPortfolio.push({ isHighlighted: true, url });
      }

      // -------------------------
      // Save to Firestore
      // -------------------------
      await updateDoc(doc(db, "users", userData.id), {
        portfolio: {
          applicationDate: serverTimestamp(),
          level: [] as PhotographerLevel[],
          priceMin: priceRangeSelected.min,
          priceMax: priceRangeSelected.max,
          expertise: levels,
          bio: about,
          images: uploadedPortfolio,
          equipments: equiptments
        } as Photographer,
        address: location,
        photoURL: uploadedProfileURL
      } as UserData);

      alert("Application submitted!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }

    setIsSubmitting(false);
  };

  // -----------------------------
  //  UI
  // -----------------------------
  return (
    <form className="flex flex-1 flex-row w-[80%] mx-auto" onSubmit={handleSubmit}>
      {/* Profile Image */}
      {image ? (
        <div className="relative">
          <img
            onClick={openFileDialog}
            src={image}
            className="w-50 h-50 mt-20 rounded-full cursor-pointer"
          />

          {profileProgress > 0 && profileProgress < 100 && (
            <div className="absolute bottom-0 left-0 bg-yellow-600 h-2"
              style={{ width: `${profileProgress}%` }}>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={allowDrop}
          className="w-50 h-50 mt-20 rounded-full bg-[#FFF4CF] text-center flex items-center justify-center cursor-pointer"
        >
          <p className="text-[#B56600] text-2xl">Add Photo</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* FORM CONTENT */}
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Join As A Creator</h2>

        <label className="block mb-2 font-semibold">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)}
          className="border rounded-md p-2 w-full mb-4" required />

        <label className="block mb-2 font-semibold">Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)}
          className="border rounded-md p-2 w-full mb-4" required />

        <label className="block mb-2 font-semibold">About</label>
        <textarea value={about} onChange={(e) => setAbout(e.target.value)}
          className="border rounded-md p-2 w-full mb-4" required />

        {/* Expertise */}
        <label className="block mb-3 font-semibold">Photography Expertise</label>
        <div className="flex flex-wrap gap-2 mb-6">
          {PhotographyExpertise.map((lvl) => (
            <button key={lvl} type="button"
              onClick={() => toggleLevel(lvl)}
              className={`px-4 py-2 rounded-full border ${levels.includes(lvl)
                ? "bg-[#FFF4CF]"
                : "bg-[#FFF4CF] border-transparent"
                }`}>
              {lvl}
            </button>
          ))}
        </div>

        {/* Price Range */}
        <label className="block mb-3 font-semibold">Select your Price Range</label>
        <div className="flex flex-wrap gap-2 mb-6">
          {priceRange.map((lvl) => (
            <button key={lvl.id} type="button"
              onClick={() => togglePriceRange(lvl)}
              className={`px-4 py-2 rounded-full border ${priceRangeSelected?.id === lvl.id
                ? "bg-[#FFF4CF]"
                : "bg-[#FFF4CF] border-transparent"
                }`}>
              ₱{lvl.min}-₱{lvl.max}
            </button>
          ))}
        </div>

        <label className="block mb-2 font-semibold">Equipments</label>
        <input type="text" value={equiptments}
          onChange={(e) => setEquiptments(e.target.value)}
          className="border rounded-md p-2 w-full mb-4"
        />
        {/* Portfolio */}
        <label className="block mb-2 font-semibold">Upload your 5 best photos</label>
        <PhotoUploadFive images={images5} setImages={setImages5} setFiles={setFiles5} progress={progress5} />

        {/* Portfolio Link */}
        <label className="block mb-2 font-semibold">Link to your portfolio (optional)</label>
        <input type="text" value={linkPortfolio}
          onChange={(e) => setLinkPortfolio(e.target.value)}
          className="border rounded-md p-2 w-full mb-4"
        />

        {/* Submit */}
        <button type="submit" disabled={isSubmitting}
          className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:opacity-90">
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
