"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/30 backdrop-blur-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center text-white">
                <Image src="/pcc_logo.png" alt="PCC Logo" width={60} height={60} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-8">
              {['Problems', 'Challenge', 'Contests','Training', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 after:bottom-0 after:rounded-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Register Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/register"
              className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-black/30 backdrop-blur-md">
          {['Community', 'Events', 'Contest', 'Contact'].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium"
            >
              {item}
            </Link>
          ))}
          <Link
            href="/register"
            className="bg-white text-black block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 transition-colors mx-3"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;