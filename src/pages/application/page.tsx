import CreatorApplicationForm from "../../components/CreatorApplicationForm";
import Footer from "../../components/layout/footer";
import Header from "../../components/layout/header";
import LandingPage from "../Landing/LandingPage";

import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import type { UserData } from "../../utils/type";

export default function CreatorApplication() {


  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const uuid = params.get("id");
  const userId = params.get("user");

  console.log("UUID:", uuid);
  console.log("User ID:", userId);


  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      const ref = doc(db, "users", userId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData({ ...snap.data(), id: snap.id } as UserData);
        setIsLoaded(true);
      } else {
        console.log("User not found");
        setIsLoaded(true);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (userData)
      if (userData?.portfolio?.id != uuid) {
        setUserData(null);

      }
  }, [userData, uuid]);
  return userData && isLoaded ? (
    <main className="w-full min-h-screen flex flex-col">
      <Header></Header>
      {/* Hero */}
      <LandingPage></LandingPage>
      <section className="w-full text-center py-16">
        <h1 className="text-4xl font-bold text-yellow-600">
          Join As A Creator
        </h1>
        <p className="mt-4 text-gray-600">
          Become part of the Expedify community.
        </p>
      </section>

      {/* Form */}
      {userData.portfolio?.approvedDate ? 
        <div className="flex flex-1 flex-col items-center py-15 my-15">
          <h2 className="p-5 text-5xl">Application Approved</h2>
          <h3 className="p-5 text-4xl">You have now photographer access </h3>
        </div> : userData.portfolio?.applicationDate ?
        <div className="flex flex-1 flex-col items-center py-15 my-15">
          <h2 className="p-5 text-5xl">Application Submitted</h2>
          <h3 className="p-5 text-4xl">Waiting For Approval</h3>
        </div>
        :
        <CreatorApplicationForm userData={userData} />}
      <Footer></Footer>
    </main>
  ) : isLoaded && (
    <div className="flex flex-1 items-center justify-center h-screen">
      <h1 className="text-3xl">Page Expired</h1>
    </div>
  );
}
