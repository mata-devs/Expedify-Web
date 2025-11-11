import { useExpedifyStore } from "../../utils/useExpedifyStore"
import geko3 from "../../assets/gecko3.png";
import bell from "../../assets/favicon/bell.png";
import card from "../../assets/favicon/card.png";
import chat from "../../assets/favicon/chat.png";
import box from "../../assets/favicon/box.png";
import { logout } from "../../utils/logout";

export default function MenuLayout() {
    const { userData } = useExpedifyStore();
    const menuList = [
        {
            url: chat,
            text: "Support",
            href: "/"
        },
        {
            url: bell,
            text: "Notifications",
            href: "/"
        },
        {
            url: card,
            text: "Non-cash payment",
            href: "/"
        },
        {
            url: box,
            text: "Promo codes",
            href: "/"
        },
    ]
    const secondarymenuList = [
        {
            text: "Partner offers",
            href: "/"
        },
        {
            text: "Share this app",
            href: "/"
        },
        {
            text: "About",
            href: "/"
        },
        {
            text: "Terms and Conditions",
            href: "/"
        },
        {
            text: "App Version 1.0",
            href: "/"
        },
        {
            text: "Delete Account",
            href: "/"
        },
    ]
    const logouthandler = logout;
    return (
        <div className="flex flex-row items-center h-full text-gray-600 ">

            <div className="flex flex-col flex-1 items-center h-full text-gray-600 p-5">

                <div className="flex-row flex w-full">
                    <input type="text" placeholder="Search" className="flex-1 p-3 mt-5 bg-[#F6F6F6] rounded-full"></input>

                </div>
                <div className="flex flex-row ">
                    <img src={userData?.photoURL} className="rounded-full w-20 h-20" ></img>
                    <div className="flex-1 flex-col items-center p-5 justify-center self-center">
                        <p className="font-bold text-xl capitalize  ">{userData?.fullname}</p>
                        <p className="font-light text-xl capitalize ">{userData?.phoneNumber}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col bg-[#FFF4CF] items-center h-full text-gray-600 ">

                <div className="flex-col flex w-full">
                    <div className="flex flex-row-reverse">
                        <img src={geko3} className=" w-40 h-40" ></img></div>
                    <div className="flex-col px-10 text-[#000000] font-bold ">
                        <h3 className="text-2xl">Settings</h3>
                        {menuList.map((menu) =>

                            <a href={menu.href} className="grid grid-cols-4 p-1">
                                <img className=" items-center h-5" src={menu.url}></img>
                                <p className=" items-center col-span-3">{menu.text}</p>
                            </a>
                        )}
                        <div className="my-5 border-b-2 border-[#D68501]"></div>
                        {secondarymenuList.map((menu) =>

                            <a className="grid grid-cols-4 items-center p-1">
                                <p className=" items-center col-span-3">{menu.text}</p>
                            </a>
                        )}
                    </div>
                    <button onClick={()=>logouthandler()} className="bg-[#363521] my-5  w-50 p-2 rounded-full mx-auto text-[#f5f5f5]">Log out</button>
                </div>
            </div>

        </div>
    )
}