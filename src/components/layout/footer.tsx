import appgallery from "../../assets/get download icon/appgallery.png";
import appstore from "../../assets/get download icon/appstore.png";
import playstore from "../../assets/get download icon/playstore.png";

export default function Footer() {
  const links = [
    { src: appgallery, url: "/", label: "App Gallery" },
    { src: appstore, url: "/", label: "App Store" },
    { src: playstore, url: "/", label: "Play Store" },
  ];

  return (
    <footer className="bg-[#000000] text-white z-40 px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center md:text-left">

        {/* Left */}
        <a 
          href="/terms" 
          className="hover:opacity-70 transition cursor-pointer"
        >
          Terms and Policies
        </a>

        {/* Center */}
        <p className="opacity-90 text-center font-bold">© Expedify 2025</p>

        {/* Right (Icons) */}
        <div className="flex justify-center md:justify-end gap-4">
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
                className=" h-10 cursor-pointer transition-transform duration-300 group-hover:scale-110"
              />

              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {item.label}
              </div>
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}
