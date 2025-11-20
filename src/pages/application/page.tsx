import CreatorApplicationForm from "../../components/CreatorApplicationForm";
import Footer from "../../components/layout/footer";
import Header from "../../components/layout/header";
import LandingPage from "../Landing/LandingPage";

import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import type { UserData } from "../../utils/type";
import { useExpedifyStore } from "../../utils/useExpedifyStore";
import { logout } from "../../utils/logout";

export default function CreatorApplication() {


  const location = useLocation();
  const { userData, setUserData, setUser, user } = useExpedifyStore();
  const params = new URLSearchParams(location.search);
  const uuid = params.get("id");
  const userId = params.get("user");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // useEffect(() => {
  //   if (!userId) return;

  //   const fetchUser = async () => {
  //     const ref = doc(db, "users", userId);
  //     const snap = await getDoc(ref);

  //     if (snap.exists()) {
  //       setUserData({ ...snap.data(), id: snap.id } as UserData);
  //       setIsLoaded(true);
  //     } else {
  //       console.log("User not found");
  //       setIsLoaded(true);
  //     }
  //   };

  //   fetchUser();
  // }, [userId]);

  // useEffect(() => {
  //   if (userData && user)
  //     if (userData?.portfolio?.id != uuid) {
  //       setUserData(null);
  //       setUser(null);
  //       logout();
  //     }
  // }, [userData, uuid]);
  return userData ? (
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
      {userData.portfolio?.id != uuid ?

        <div className="flex flex-1 flex-col items-center py-15 my-15">
          <h2 className="p-5 text-5xl">Invalid Application URL</h2>
          <h3 className="p-5 text-4xl">Your Application URL not matched in current account</h3>
          <h3 className="p-5 text-4xl">Please Change Your Account To Proceed this Application</h3>
          <button onClick={logout} className="p-3 bg-white text-red-700  text-3xl cursor-pointer hover:font-bold">Logout?</button>
        </div>
        :
        userData.portfolio?.approvedDate ?
          <div className="flex flex-1 flex-col items-center py-15 my-15">
            <h2 className="p-5 text-5xl">Application Approved</h2>
            <h3 className="p-5 text-4xl">You have now photographer access </h3>
          </div>
          :
          < CreatorApplicationForm userData={userData} />
      }
      <Footer></Footer>
    </main>
  ) : isLoaded && (
    <div className="flex flex-1 items-center justify-center h-screen">
      <h1 className="text-3xl">Page Expired</h1>
    </div>
  );
}
