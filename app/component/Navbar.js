"use client"
import React, {useState,useEffect} from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const { data: session } = useSession()
  const [showdropdown, setshowdropdown] = useState(false)
  

  

  
  return (
    <nav className="p-4 bg-gray-900 text-white justify-between flex items-center px-8 flex-col md:flex-row">
      <div className="logo text-lg font-bold flex justify-center items-center">
        <Link href={"/"} className='flex justify-center items-center gap-2'>
        <img className='inverting' src="single_egg.gif" width={44} alt="" />
        <span>HatchFund</span>
        </Link>
      </div>

      <div className='relative'>
        {session && <>
          <button  id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className=" cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none mx-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" onClick={() => setshowdropdown(!showdropdown)}>Welcome {session.user.email} <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
          </button>


          <div id="dropdown" className={`z-10 ${showdropdown?"block":"hidden"} absolute left-[125px] bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700`}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</Link>
              </li>
              <li>
                <Link href={`/${session.user.username}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Your Page</Link>
              </li>
              
              <li>
                <Link onClick={() => signOut()} href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</Link>
              </li>
            </ul>
          </div></>
        }
       
        {!session &&
          <Link href={"/login"}>
            <button type="button" className={` cursor-pointer text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`}>Login</button>
          </Link>}
      </div>
    </nav>
  )
}

export default Navbar
