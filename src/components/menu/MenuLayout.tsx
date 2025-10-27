import { useExpedifyStore } from "../../utils/useExpedifyStore"

export default function MenuLayout() {
    const { userData } = useExpedifyStore();

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

            <div className="flex flex-col bg-[#FFF4CF] items-center h-full text-gray-600 p-5">

                <div className="flex-row flex w-full">
                    <input type="text" placeholder="Search" className="flex-1 p-3 mt-5 bg-[#F6F6F6] rounded-full"></input>

                </div>
            </div>

        </div>
    )
}