'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[#078BCF] to-[#056FAF] text-white shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="h-10 w-auto mr-2 hover:scale-105 transition-transform duration-200"/>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="hover:text-white hover:underline underline-offset-4 transition duration-200"
            >
              Website Informationen
            </Link>
            <Link
              href="/calculator"
              className="hover:text-white hover:underline underline-offset-4 transition duration-200"
            >
              Kalkulator
            </Link>
          </div>

          {/* Burger Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none transition-transform duration-200 hover:scale-110"
            >
              {menuOpen ? (
                <XMarkIcon className="h-8 w-8 cursor-pointer" />
              ) : (
                <Bars3Icon className="h-8 w-8 cursor-pointer" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-2 text-lg">
          <Link href="/" className="block hover:text-gray-100">Website Informationen</Link>
          <Link href="/calculator" className="block hover:text-gray-100">Kalkulator</Link>
        </div>
      </div>
    </nav>
  );
}
