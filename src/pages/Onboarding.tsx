import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import slide1 from "../assets/gecko.png";
import slide2 from "../assets/gecko1.png";
import slide3 from "../assets/gecko2.png";
import { useExpedifyStore } from "../utils/useExpedifyStore";

interface Slide {
    image: string;
    text: string;
}

const slides: Slide[] = [
    {
        image: slide1,
        text: "Expedify is a Cebu-based mobile platform for real-time photography and videography bookings.",
    },
    {
        image: slide2,
        text: "Connecting clients with vetted professionals, offering instant access, transparent pricing, and user-reviewed portfolios.",
    },
    {
        image: slide3,
        text: "With scalable systems and a focus on speed and trust, Expedify makes hiring creative services simple and reliable.",
    },
];

const Onboarding: React.FC = () => {
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    const { setOnboardingDone, onboardingDone } = useExpedifyStore();

    useEffect(() => {
        if (onboardingDone) navigate("/signin");
    }, [navigate]);

    const next = () => {
        if (index < slides.length - 1) {
            setIndex((i) => i + 1);
        } else {
            setOnboardingDone(true);
            navigate("/signin");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-expedify-dark text-white text-center px-6">
            <img
                src={slides[index].image}
                alt="Expedify Slide"
                className="w-56 h-auto mb-8 animate-float"
            />
            <p className="text-lg md:text-xl leading-relaxed max-w-lg mb-8 text-black">
                {slides[index].text}
            </p>

            {/* dots */}
            <div className="flex space-x-2 mb-8">
                {slides.map((_, i) => (
                    <span
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${i === index ? "bg-expedify-gold" : "bg-white/30"
                            }`}
                    />
                ))}
            </div>

            <button
                onClick={next}
                className="bg-expedify-gold text-black font-semibold px-10 py-3 rounded-full hover:scale-105 transition"
            >
                {index === slides.length - 1 ? "Start" : "Next"}
            </button>
        </div>
    );
};

export default Onboarding;
