'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaDiscord, FaFacebook, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-950 relative overflow-hidden">
      {/* Spotlight Gradient */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-t from-gray-900 via-gray-950 to-transparent opacity-70" />
      </div>

      <div className="container px-6 py-8 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">
          <Link href="#">
            <Image src="/pcc_logo.png" alt="PCC Logo" width={48} height={48} />
          </Link>

          <div className="flex flex-wrap justify-center mt-6 -mx-4">
            <Link href="#" className="mx-4 text-sm text-gray-300 transition-colors duration-300 hover:text-blue-500" aria-label="Home">
              Home
            </Link>

            <Link href="" className="mx-4 text-sm text-gray-300 transition-colors duration-300 hover:text-blue-500" aria-label="About">
              About
            </Link>

            <Link href="#" className="mx-4 text-sm text-gray-300 transition-colors duration-300 hover:text-blue-500" aria-label="Privacy">
              Privacy
            </Link>

            <Link href="#" className="mx-4 text-sm text-gray-300 transition-colors duration-300 hover:text-blue-500" aria-label="Cookies">
              Cookies
            </Link>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500">© Copyright 2025. All Rights Reserved.</p>
          <p className="text-sm text-gray-500">
            Design & Develop by <Link href="#" className="text-blue-500 hover:underline">Yeakin Iqra & Samiul Bashir</Link>
          </p>
          <div className="flex -mx-2">
            <Link href="https://www.linkedin.com/company/uap-programming-contest-club" className="mx-2 text-gray-300 transition-colors duration-300 hover:text-blue-500 sm:mt-2" aria-label="LinkedIn">
              <FaLinkedinIn className="w-5 h-5" />
            </Link>

            <Link href="https://www.facebook.com/profile.php?id=61555006221358" className="mx-2 text-gray-300 transition-colors duration-300 hover:text-blue-500 sm:mt-2" aria-label="Facebook">
              <FaFacebook className="w-5 h-5" />
            </Link>

            <Link href="https://discord.gg/2dCwwDQT" className="mx-2 text-gray-300 transition-colors duration-300 hover:text-blue-500 sm:mt-2" aria-label="GitHub">
              <FaDiscord className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
