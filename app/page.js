import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[44vh] py-2 text-center">

        {/* TITLE + GIF */}
        <div className="flex justify-center justify-self-center items-center gap-2 mx-auto">
          <span className="text-4xl font-bold text-white     margin-left-[45vw]">HatchFund</span>
          <img className="h-20 invertimg object-contain" src="/single_egg.gif" alt="" />
        </div>

        {/* SUBTEXT */}
        <p className="mt-4 text-lg text-gray-400 max-w-sm mx-auto">
          Your one-stop solution for crowdfunding your projects.
        </p>

        {/* BUTTONS */}
        <div className="flex space-x-4 mt-6">
          <Link href="/login">
            <button className="cursor-pointer text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
              Start Here
            </button>
          </Link>

          <Link href="/about">
            <button className="text-white cursor-pointer bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
              Read More
            </button>
          </Link>
        </div>

      </div>

      <div className="bg-white h-1 opacity-12"></div>

      <div className="text-white container mx-auto">
<div className="flex flex-col md:flex-row justify-center items-center gap-3">
  <h1 className="text-2xl font-bold text-center">
    Your Fans can buy you an Egg
  </h1>

  <img
    className="h-16 w-auto md:ml-2"
    src="/egg.gif"
    alt="Buy an Egg"
  />
</div>


        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
  <div className="item flex flex-col items-center text-center max-w-xs">
    <img src="/man.gif" width={88} className="bg-slate-400 rounded-full p-2" />
    <h3 className="font-bold mt-2">Hatch Your Dream</h3>
    <p className="text-sm text-gray-300">Turn your ideas into reality — your supporters are here to help you grow.</p>
  </div>

  <div className="item flex flex-col items-center text-center max-w-xs">
    <img src="/coin.gif" width={88} className="bg-slate-400 rounded-full p-2" />
    <h3 className="font-bold mt-2">Crack Open New Opportunities</h3>
    <p className="text-sm text-gray-300">Every contribution helps your project take the next big step forward.</p>
  </div>

  <div className="item flex flex-col items-center text-center max-w-xs">
    <img src="/group.gif" width={88} className="bg-slate-400 rounded-full p-2" />
    <h3 className="font-bold mt-2">Your Community Has Your Back</h3>
    <p className="text-sm text-gray-300">People believe in you — they’re ready to support your journey.</p>
  </div>
</div>
      </div>

      {/* <div className="bg-white h-1 opacity-12 mt-6"></div> */}


    </>

  );
}
export const metadata = {
  title: 'HatchFund - Crowdfunding for Creators',
}
