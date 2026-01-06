
import { useEffect, useRef, useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Levels, type Photographer, type PhotographerLevel, type UserData } from "../utils/type";
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
export const TierLevel = [
  "entry",
  "medium",
  "pro"
] as PhotographerLevel[];

export default function CreatorApplicationForm({ userData }: { userData: UserData }) {
  const [name, setName] = useState(userData.fullname);
  const [location, setLocation] = useState(userData.address);
  const [about, setAbout] = useState(userData.portfolio?.bio);
  const [levels, setLevels] = useState<string[]>(userData.portfolio?.expertise || []);
  const [tiers, setTiers] = useState<PhotographerLevel[]>(userData.portfolio?.level || []);
  const [priceRangeSelected, setPriceRangeSelected] = useState<PriceRnageType | null>(null);
  const [linkPortfolio, setLinkPortfolio] = useState(userData.portfolio?.linkPortfolio);
  useEffect(() => {
    if (userData.portfolio?.priceMin)
      setPriceRangeSelected(priceRange.find((p) => p.min == userData.portfolio?.priceMin && p.max == userData.portfolio?.priceMax) || null);
  }, [userData])
  // Profile image preview + file + progress
  const [image, setImage] = useState<string | null>(null);
  const [equiptments, setEquiptments] = useState<string>(userData.portfolio?.equipments || "");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profileProgress, setProfileProgress] = useState(0);

  // Portfolio images preview, files, progress bars
  const [images5, setImages5] = useState<(string | null)[]>(Array(5).fill(null));

  const [files5, setFiles5] = useState<(File | null)[]>(Array(5).fill(null));
  const [progress5, setProgress5] = useState<number[]>(Array(5).fill(0));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!userData?.portfolio?.images) return;

    setImages5(userData.portfolio.images.map((img) => img.url));
  }, [userData]);

  // Toggle functions
  const toggleLevel = (lvl: string) => {
    setLevels(prev => (prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]));
  };
  const toggleTier = (lvl: PhotographerLevel) => {
    setTiers(prev => (prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]));
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
    if (tiers.length == 0) {
      setResult({ type: 'error', message: "Tier Required" });
      return;
    }

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
      console.log("uploadedPortfolio", uploadedPortfolio.length);
      // -------------------------
      // Save to Firestore
      // -------------------------
      await updateDoc(doc(db, "users", userData.id), {
        portfolio: {
          id: userData.portfolio?.id,
          applicationDate: serverTimestamp(),
          declinedDate: null,
          level: tiers as PhotographerLevel[],
          priceMin: priceRangeSelected.min,
          priceMax: priceRangeSelected.max,
          expertise: levels,
          bio: about,
          images: uploadedPortfolio.length > 0 ? uploadedPortfolio : userData.portfolio?.images,
          equipments: equiptments,
          linkPortfolio: linkPortfolio || ""
        } as Photographer,
        address: location,
        photoURL: uploadedProfileURL || userData.photoURL,
      } as UserData);
      setResult({ type: "success", message: "Application Sent Successfuly" });
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setResult({ type: "error", message: "Application Error:" + err });
      setIsSubmitting(false);
    }

  };

  useEffect(() => {
    if (!result) return;

    const timeout = setTimeout(() => {
      setResult(null);
    }, 2000);

    return () => clearTimeout(timeout);  // IMPORTANT
  }, [result]);

  // -----------------------------
  //  UI
  // -----------------------------
  return (<form
    className="flex flex-col md:flex-row w-full max-w-5xl mx-auto px-4 md:px-0 gap-8 py-10"
    onSubmit={handleSubmit}
  >
    {result && (
      <div
        className={`${result?.type === "error" ? "bg-red-800" : "bg-green-700"
          } p-3 fixed bottom-20 right-5 z-50 text-white font-bold rounded-xl animate-bounce`}
      >
        Message: {result?.message}
      </div>
    )}

    {/* PROFILE IMAGE */}
    <div className="flex flex-col items-center md:items-start flex-shrink-0">
      {image || userData.photoURL ? (
        <div className="relative">
          <img
            onClick={openFileDialog}
            src={image || userData.photoURL}
            className={`w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full ${isSubmitting ||
              (!userData.portfolio?.declinedDate &&
                userData.portfolio?.applicationDate != null)
              ? "cursor-not-allowed"
              : "cursor-pointer"
              }`}
          />

          {profileProgress > 0 && profileProgress < 100 && (
            <div
              className="absolute bottom-0 left-0 bg-yellow-600 h-2 rounded"
              style={{ width: `${profileProgress}%` }}
            />
          )}
        </div>
      ) : (
        <div
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={allowDrop}
          className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-[#FFF4CF] text-center flex items-center justify-center cursor-pointer"
        >
          <p className="text-[#B56600] text-lg sm:text-xl md:text-2xl">Add Photo</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={
          isSubmitting ||
          (!userData.portfolio?.declinedDate &&
            userData.portfolio?.applicationDate != null)
        }
        onChange={handleFileChange}
      />
    </div>

    {/* FORM CONTENT */}
    <div className="flex-1 w-full bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left">
        Join As A Creator
      </h2>

      {userData.portfolio?.declinedDate && (
        <div className="bg-amber-700 p-5 text-white my-5 rounded-xl">
          <p>Application Declined</p>
          <p>
            Reason: <b className="capitalize">{userData.portfolio?.reason}</b>
          </p>
        </div>
      )}

      {/* Name */}
      <label className="block mb-2 font-semibold">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={
          isSubmitting ||
          (!userData.portfolio?.declinedDate &&
            userData.portfolio?.applicationDate != null)
        }
        className="border rounded-md p-2 w-full mb-4"
        required
      />

      {/* Location */}
      <label className="block mb-2 font-semibold">Location</label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        disabled={
          isSubmitting ||
          (!userData.portfolio?.declinedDate &&
            userData.portfolio?.applicationDate != null)
        }
        className="border rounded-md p-2 w-full mb-4"
        required
      />

      {/* About */}
      <label className="block mb-2 font-semibold">About</label>
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        disabled={
          isSubmitting ||
          (!userData.portfolio?.declinedDate &&
            userData.portfolio?.applicationDate != null)
        }
        className="border rounded-md p-2 w-full mb-4"
        required
      />

      {/* Expertise */}
      <label className="block mb-3 font-semibold">Photography Expertise</label>
      <div className="flex flex-wrap gap-2 mb-6">
        {PhotographyExpertise.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => toggleLevel(lvl)}
            disabled={
              isSubmitting ||
              (!userData.portfolio?.declinedDate &&
                userData.portfolio?.applicationDate != null)
            }
            className={`${isSubmitting ||
              (!userData.portfolio?.declinedDate &&
                userData.portfolio?.applicationDate != null)
              ? "cursor-not-allowed"
              : "cursor-pointer hover:scale-105"
              } transition-all px-4 py-2 rounded-full border ${levels.includes(lvl)
                ? "bg-[#FFF4CF]"
                : "bg-[#FFF4CF] border-transparent"
              }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Tier */}
      <label className="block mb-3 font-semibold">Photography Tier</label>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Levels.map((lvl) => (
          <button
            key={lvl.level}
            type="button"
            onClick={() => toggleTier(lvl.level)}
            disabled={
              isSubmitting ||
              (!userData.portfolio?.declinedDate &&
                userData.portfolio?.applicationDate != null)
            }
            className={`flex flex-col items-center   aspect-square py-2 capitalize rounded-2xl ${isSubmitting ||
              (!userData.portfolio?.declinedDate &&
                userData.portfolio?.applicationDate != null)
              ? "cursor-not-allowed"
              : "cursor-pointer hover:scale-105"
              } transition-all border ${tiers.includes(lvl.level)
                ? "bg-[#FFF4CF]"
                : "bg-[#FFF4CF] border-transparent"
              }`}
          >
            <img src={lvl.Image} className="h-16 sm:h-20 mb-2" />
            <p className="text-sm sm:text-base">{lvl.level}</p>
          </button>
        ))}
      </div>

      {/* Price Range */}
      <label className="block mb-3 font-semibold">Select your Price Range</label>
      <div className="flex flex-wrap gap-2 mb-6">
        {priceRange.map((lvl) => (
          <button
            key={lvl.id}
            type="button"
            onClick={() => togglePriceRange(lvl)}
            disabled={
              isSubmitting ||
              (!userData.portfolio?.declinedDate &&
                userData.portfolio?.applicationDate != null)
            }
            className={`px-4 py-2 rounded-full ${isSubmitting ||
              (!userData.portfolio?.declinedDate &&
                userData.portfolio?.applicationDate != null)
              ? "cursor-not-allowed"
              : "cursor-pointer hover:scale-105"
              } transition-all border ${priceRangeSelected?.id === lvl.id
                ? "bg-[#FFF4CF]"
                : "bg-[#FFF4CF] border-transparent"
              }`}
          >
            ₱{lvl.min}-₱{lvl.max}
          </button>
        ))}
      </div>

      {/* Equipments */}
      <label className="block mb-2 font-semibold">Equipments</label>
      <input
        type="text"
        value={equiptments}
        onChange={(e) => setEquiptments(e.target.value)}
        disabled={
          isSubmitting ||
          (!userData.portfolio?.declinedDate &&
            userData.portfolio?.applicationDate != null)
        }
        className="border rounded-md p-2 w-full mb-4"
      />

      {/* Portfolio */}
      <label className="block mb-2 font-semibold">Upload your 5 best photos</label>
      <PhotoUploadFive
        images={images5}
        setImages={setImages5}
        setFiles={setFiles5}
        progress={progress5}
        disabled={
          isSubmitting ||
          (!userData.portfolio?.declinedDate &&
            userData.portfolio?.applicationDate != null)
        }
      />

      {/* Portfolio Link */}
      <label className="block mb-2 font-semibold">
        Link to your portfolio (optional)
      </label>
      <input
        type="text"
        value={linkPortfolio}
        onChange={(e) => setLinkPortfolio(e.target.value)}
        disabled={
          isSubmitting ||
          (!userData.portfolio?.declinedDate &&
            userData.portfolio?.applicationDate != null)
        }
        className="border rounded-md p-2 w-full mb-4"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={
          isSubmitting ||
          (!userData.portfolio?.declinedDate &&
            userData.portfolio?.applicationDate != null)
        }
        className={`w-full py-3 ${!userData.portfolio?.declinedDate &&
          userData.portfolio?.applicationDate != null
          ? "bg-yellow-600/60 cursor-not-allowed"
          : "bg-yellow-600 hover:opacity-90"
          } text-white rounded-lg`}
      >
        {isSubmitting
          ? "Submitting..."
          : userData.portfolio?.declinedDate
            ? "Resubmit"
            : userData.portfolio?.applicationDate
              ? "Waiting for Approval"
              : "Submit"}
      </button>
    </div>
  </form>

  );
}
