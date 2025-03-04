'use client';
import React from 'react';
import Link from 'next/link';

const Button = ({ href, label, className, icon: Icon }) => {
  if (!href) {
    console.error("Button component requires a valid 'href' prop");
    return null; 
  }

  return (
    <Link href={href} className={`relative inline-block text-lg group ${className}`}>
      <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
        <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
        <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
        <span className="relative">{label}</span>
        {Icon && (
          <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
            <Icon className="w-5 h-5" /> {/* Render the icon directly */}
          </span>
        )}
      </span>

      <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0" data-rounded="rounded-lg"></span>
    </Link>
  );
};

export default Button;
