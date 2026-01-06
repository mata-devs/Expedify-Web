import TokoHand from "../../assets/gecko1.png";
import appgallery from "../../assets/get download icon/appgallery.png";
import appstore from "../../assets/get download icon/appstore.png";
import playstore from "../../assets/get download icon/playstore.png";
import MobilePreview from "../../assets/get download icon/MobilePreview.png";

export default function LandingPage() {
    const links = [
        { src: appgallery, url: "/", label: "App Gallery" },
        { src: appstore, url: "/", label: "App Store" },
        { src: playstore, url: "/", label: "Play Store" },
    ];

    return (
        <section className="w-full text-center py-16 px-5">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-20">

                {/* Left Text / CTA */}
                <div className="flex flex-col flex-1 items-center md:items-start px-2 md:px-5">
                    <img
                        className="max-w-[240px] md:max-w-[300px] border-b-4 border-[#F5AB00] my-5"
                        src={TokoHand}
                        alt="TokoHand"
                    />
                    <h1 className="text-[#CA7F00] text-3xl sm:text-4xl lg:text-5xl font-bold text-center md:text-left leading-snug">
                        Book Trusted Filipino Photographers in an Instant.
                    </h1>

                    {/* App Store Links */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-5">
                        {links.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.url}
                                className="group relative"
                                aria-label={item.label}
                            >
                                <img
                                    src={item.src}
                                    alt={item.label}
                                    className="h-10 cursor-pointer transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                    {item.label}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex-1 flex justify-center md:justify-end px-2">
                    <img
                        className="max-w-[250px] sm:max-w-[300px] md:max-w-[400px] h-auto"
                        src={MobilePreview}
                        alt="Mobile Preview"
                    />
                </div>

            </div>
        </section>
    );
}
