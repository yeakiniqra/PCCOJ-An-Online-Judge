'use client';

import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUsers, FaCalendarAlt, FaTrophy, FaBookOpen, FaChalkboardTeacher, FaInfoCircle } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import Button from './Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
    className={`flex border-b border-transparent text-white min-h-[70px] tracking-wide z-50 sticky top-0 transition-colors duration-300 ${
      isScrolled ? 'bg-black/40 backdrop-blur-lg' : 'bg-gray-900'
    }`}
  >
      <div className='w-full flex flex-wrap items-center justify-center gap-6 px-10 py-3 relative'>

        <div className='flex-shrink-0'>
          <Link href="/" className='flex items-start'>
            {/* Use next/image for image optimization */}
            <Image src="/pcc_logo.png" alt="PCC Logo" width={48} height={48} className="cursor-pointer"/>
          </Link>
        </div>

        {/* Menu for larger screens */}
        <div id="collapseMenu" className='hidden lg:flex lg:items-center lg:justify-center lg:flex-grow'>
          <ul className='lg:flex lg:ml-10 lg:gap-x-12'>
          
            <li>
              <Link href="/problem" className='hover:text-blue-600 text-white font-bold text-[15px] flex items-center'>
                <FaUsers className='mr-2' /> Problem
              </Link>
            </li>
            <li>
              <Link href="/contest" className='hover:text-blue-600 text-white font-bold text-[15px] flex items-center'>
                <FaCalendarAlt className='mr-2' /> Contests
              </Link>
            </li>
            <li>
              <Link href="/challenge" className='hover:text-blue-600 text-white font-bold text-[15px] flex items-center'>
                <FaTrophy className='mr-2' /> Challenge
              </Link>
            </li>
            <li>
              <Link href="/leaderboard" className='hover:text-blue-600 text-white font-bold text-[15px] flex items-center'>
                <FaBookOpen className='mr-2' /> Leaderboard
              </Link>
            </li>
            <li>
              <Link href="/training" className='hover:text-blue-600 text-white font-bold text-[15px] flex items-center'>
                <FaChalkboardTeacher className='mr-2' /> Training
              </Link>
            </li>
            <li>
              <Link href="/about-pcc" className='hover:text-blue-600 text-white font-bold text-[15px] flex items-center'>
                <FaInfoCircle className='mr-2' /> About PCC
              </Link>
            </li>
          </ul>
        </div>

        <div className='gap-x-4 ml-auto mr-24 hidden md:flex'>
          <Button
            href="/SignUp"
            label="Sign Up" 
          />
        </div>

        {/* Hamburger menu for smaller screens */}
        <div className='flex items-center ml-auto lg:hidden'>
          <button id="toggleOpen" onClick={handleClick}>
            <FiMenu size={22} className='text-white' />
          </button>
        </div>

        {/* Responsive mobile menu */}
        <div
          className={`fixed top-0 left-0 h-full w-2/3 max-w-xs bg-black/90 backdrop-blur-lg z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <button className='fixed top-4 right-4 z-[100] rounded-full bg-gray-500 p-3' onClick={handleClick}>
            <FiX size={14} className='text-black' />
          </button>
          <ul className='space-y-6 px-6 py-10 bg-gray-900'>

            <li><Link href="/committee" className='hover:text-blue-600 text-white font-bold text-[15px] block'>Committee</Link></li>
            <li><Link href="/events-page" className='hover:text-blue-600 text-white font-bold text-[15px] block'>Events</Link></li>
            <li><Link href="/contests-pcc" className='hover:text-blue-600 text-white font-bold text-[15px] block'>Contests</Link></li>
            <li><Link href="/resources_cp" className='hover:text-blue-600 text-white font-bold text-[15px] block'>Resources</Link></li>
            <li><Link href="/training" className='hover:text-blue-600 text-white font-bold text-[15px] block'>Training</Link></li>
            <li><Link href="/about-pcc" className='hover:text-blue-600 text-white font-bold text-[15px] block'>About PCC</Link></li>


          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
