
import Footer from "../../components/layout/footer";
import Header from "../../components/layout/header";
import LandingPage from "../Landing/LandingPage";
import ImageTuko from "../../assets/gecko2.png";
import ShotsByPhotographer from "../../components/layout/ShotsByPhotographer";
import { useEffect, useState } from "react";

import lvl1 from "../../assets/levels/level1.png";
import lvl2 from "../../assets/levels/level2.png";
import lvl3 from "../../assets/levels/level3.png";
import Help from "../../components/layout/help";
export default function JoinAsCreatorPage() {
  const [activeTab, setActiveTab] = useState<"Clients" | "Photographer">("Clients");
  const categories = [{
    img: lvl1,
    title: "Smartshot",
    header: "Snap and go",
    description: "Quick, budget-friendly sessions powered by smartphone creators.",
  }, {
    img: lvl2,
    title: "Hobbyist",
    header: "Shoot with passion",
    description: "Emerging photographers bringing creativity and heart to every frame.",
  }, {
    img: lvl3,
    title: "Pro-Photographers",
    header: "Go big",
    description: "Quick, budget-friendly sessions powered by smartphone creators.",
  },
  ]
  return (
    <main className="w-full min-h-screen flex flex-col">
      <Header></Header>
      {/* Hero */}
      <LandingPage></LandingPage>
      <ShotsByPhotographer></ShotsByPhotographer>
      {/* Form */}
      <div className="flex items-center flex-col flex-1 justify-center">
        <img className=" items-center w-90 "
          src={ImageTuko}></img>
        <div className="text-[#B56600] text-2xl w-200 text-center">
          Connect with Filipino photographers who bring your vision to life— wherever you are, whenever you’re ready.
        </div>
        <div className="flex">
          <button className="border-[#B56600] border-2 rounded-full p-5 m-5 text-[#B56600]  min-w-80">Download Expedify App Now</button>
          <button className="bg-[#EDB03B] rounded-full p-5 m-5 text-white min-w-80">Join As A Creator</button>
        </div>
      </div>
      <div className="flex items-center flex-col flex-1 justify-center">
        <div className="flex items-center flex-1 m-5 w-full">
          <button className={`flex-1 ${activeTab === "Clients" ? "border-[#EDB03B] text-[#EDB03B]" : "border-[#EAEAEC] text-[#848484]"}   border-b-2 p-5 text-2xl`}
            onClick={() => setActiveTab("Clients")}>For Clients</button>
          <button className={
            `flex-1 ${activeTab === "Photographer" ? "border-[#EDB03B] text-[#EDB03B]" : "border-[#EAEAEC] text-[#848484]"}  border-b-2 p-5 text-2xl`}
            onClick={() => setActiveTab("Photographer")}>For Creators</button>
        </div>

        <div className="flex items-center flex-col flex-1 justify-center p-5">
          <h3 className="text-[#EDB03B] text-4xl p-4">Beautiful Moments Deserves the Right Creator</h3>
          <h4 className="text-[#B56600] text-2xl p-4">Expedify helps you find the perfect match for your budget and vision.</h4>
          <div className="flex">
            {categories.map((cat) => {
              return (
                <div className="flex-col flex p-5 items-center justify-center">
                  <img src={cat.img}></img>
                  <p className="text-[#EDB03B] text-lg">{cat.title}</p>
                  <p className="p-2 text-3xl text-[#B56600] font-bold">{cat.header}</p>
                  <p className="w-70 text-center text-[#B56600]">{cat.description}</p>
                </div>
              )
            }
            )}
          </div>
          <div className="flex-1 flex items-center justify-center p-5">
            <button className="border-[#EDB03B] text-[#EDB03B] rounded-full border-2 p-3 text-lg w-69">Book a Creator Now</button>
          </div>
        </div>
      </div>
      <Help></Help>
      <Footer></Footer>
    </main>
  );
}
