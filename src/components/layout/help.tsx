import gecko1 from "../../assets/gecko1.png";

import gecko3 from "../../assets/gecko3.png";


export default function Help() {
  return (
    <div className="bg-[#EDB03B]  flex flex-1 relative">
      <div className="flex-1 grid-cols-3 grid relative">
        <div className="h-150 relative">
          <img src={gecko1} className="w-80 absolute bottom-0"></img>
        </div>
        <div className="p-5 h-150 relative flex flex-col items-center justify-center">
          <h3 className="text-4xl text-white font-bold">How can we help you?</h3>
          <div className="flex bg-white rounded-full m-5">
            <p className="flex p-2 text-[#EDB03B]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

            </p>
            <input type="text" className="p-5 text-[#EDB03B] w-100 text-2xl" placeholder="Search"></input>
          </div>
        </div>
        <div className="h-150 relative">
          <img src={gecko3} className="w-100 absolute top-0 right-0"></img>
        </div>
      </div>
    </div>
  );
}
