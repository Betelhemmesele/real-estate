// import React from 'react'
import {FaSearch} from 'react-icons/fa';
import {Link} from 'react-router-dom';
export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
       <div className="flex justify-between  max-w-6xl mx-auto">
        <Link to='/'>
       <h1 className="font-bold text-sm sm:text-xl mt-4 flex flex-wrap">
            <span className='text-slate-600'>Sabela</span>
            <span className='text-slate-700'>Estate</span>
        </h1>
        </Link>
        <form className="bg-slate-100 p-3 mt-2 rounded-lg flex">
            <input type="text" className="bg-transparent focus:outline-none w-24 sm:w-64" placeholder="Search..."/>
            <FaSearch className="text-slate-500"/>
        </form>
        <ul className='flex gap-4 mt-3' >
            <Link to='/'>
            <li className='hidden sm:inline text-slate-600 hover:underline'>Home</li>
            </Link>
            <Link to='/signin'>
            <li className='hidden sm:inline text-slate-600 hover:underline'>SignIn</li>
            </Link>
            <Link to='/about'>
            <li className='hidden sm:inline text-slate-600 hover:underline'>About</li>
            </Link>
        </ul>
       </div>
    </header>
  )
}
