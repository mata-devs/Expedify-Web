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
            <div className="flex p-12">

                <div className="flex flex-col flex-1 items-start px-5">
                    <img className="max-w-60 border-b-4 border-[#F5AB00] my-5" src={TokoHand}></img>
                    <h1 className="text-[#CA7F00] text-4xl text-left">Book Trusted Filipino Photographers in an Instant.</h1>
                    <div className="flex justify-center md:justify-end gap-4 pt-5">
                        {links.map((item, idx) => (
                            <a
                                key={idx}
                                href={item.url}
                                className="group relative"
                                aria-label={item.label}
                            >
                                {/* Icon */}
                                <img
                                    src={item.src}
                                    alt={item.label}
                                    className="h-10 cursor-pointer transition-transform duration-300 group-hover:scale-110"
                                />

                                {/* Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                    {item.label}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                <div>

                    <img className="max-w-70 p-5" src={MobilePreview}></img>
                </div>
            </div>
        </section>
    )
}