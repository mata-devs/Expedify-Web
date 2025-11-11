"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore"; 
import type { PhotographerLevel } from "../utils/type";
import { db } from "../firebase";

export default function CreatorApplicationForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [levels, setLevels] = useState<PhotographerLevel[]>([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleLevel = (lvl: PhotographerLevel) => {
    setLevels(prev =>
      prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]
    );
  };

  const handleSubmit = async () => {
    if (!name || !location || levels.length < 1) {
      alert("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    await addDoc(collection(db, "photographerApplications"), {
      name,
      location,
      about,
      levels,
      priceMin,
      priceMax,
      applicationStatus: "pending",
      createdAt: serverTimestamp(),
    });

    setIsSubmitting(false);
    alert("Application submitted!");
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Join As A Creator</h2>

      <label className="block mb-2 font-semibold">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-md p-2 w-full mb-4"
        placeholder="What do we call you?"
      />

      <label className="block mb-2 font-semibold">Location</label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border rounded-md p-2 w-full mb-4"
        placeholder="Where are you based?"
      />

      <label className="block mb-2 font-semibold">About</label>
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        className="border rounded-md p-2 w-full mb-4"
        placeholder="Describe yourself"
      />

      <label className="block mb-3 font-semibold">
        Photography Expertise (pick at least 1)
      </label>
      <div className="flex flex-wrap gap-2 mb-6">
        {(["entry", "medium", "pro"] as PhotographerLevel[]).map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => toggleLevel(lvl)}
            className={`px-4 py-2 rounded-full border ${
              levels.includes(lvl) ? "bg-yellow-500 text-white" : "bg-white"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <label className="block mb-2 font-semibold">Price Range</label>
      <div className="flex gap-4 mb-4">
        <input
          type="number"
          value={priceMin}
          onChange={(e) => setPriceMin(parseInt(e.target.value))}
          placeholder="Min"
          className="border rounded-md p-2 w-full"
        />
        <input
          type="number"
          value={priceMax}
          onChange={(e) => setPriceMax(parseInt(e.target.value))}
          placeholder="Max"
          className="border rounded-md p-2 w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:opacity-90"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
