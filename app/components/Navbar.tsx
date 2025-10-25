"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="bg-primary text-background flex justify-between items-center p-2 px-8">
      <div className="flex items-center gap-4">
        <Image src={Logo} alt="Logo" className="w-16 h-16" />
        <Link href="/" className="text-2xl tracking-wide" onClick={closeMenu}>
          UBC BIONICS | Admin Portal
        </Link>
      </div>

      <nav className="hidden md:flex space-x-4 tracking-wide">
        <Link href="/edit-blog">EDIT BLOG</Link>
        <Link href="/edit-members">EDIT MEMBERS</Link>
      </nav>

      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-2xl focus:outline-none">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open && (
        <nav className="absolute top-16 left-0 w-full bg-primary flex flex-col items-center space-y-4 p-8 md:hidden z-50 tracking-wide">
          <Link href="/edit-blog" onClick={closeMenu}>EDIT BLOG</Link>
          <Link href="/edit-members" onClick={closeMenu}>EDIT MEMBERS</Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
