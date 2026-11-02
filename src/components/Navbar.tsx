'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, User } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
}

export default function Navbar({ onOpenLogin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#171717]/95 backdrop-blur-md border-b border-neutral-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Título */}
          <Link
            href="/"
            className="flex items-center gap-3 text-white font-extrabold text-xl tracking-wider hover:text-red-400 transition"
          >
            <div className="relative w-10 h-10">
              <Image
                src="/assets/banda.png"
                alt="Logo Banda de Coimbrões"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span>BANDA DE COIMBRÕES</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-7 text-sm font-semibold uppercase tracking-wider">
            <Link href="#quemsomos" className="text-gray-300 hover:text-red-400 transition">
              Quem somos
            </Link>
            <Link href="#portfolio" className="text-gray-300 hover:text-red-400 transition">
              Direção
            </Link>
            <Link href="#escola" className="text-gray-300 hover:text-red-400 transition">
              Escola
            </Link>
            <Link href="#footer" className="text-gray-300 hover:text-red-400 transition">
              Contacto
            </Link>
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-lg shadow-md shadow-red-900/40 transition active:scale-95"
            >
              <User className="w-4 h-4" />
              <span>Área Reservada</span>
            </button>
          </div>

          {/* Botão Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none"
              aria-label="Abrir Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-[#171717] px-4 pt-2 pb-6 space-y-3 text-base font-semibold border-t border-neutral-800">
          <Link
            href="#quemsomos"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-red-400 py-2"
          >
            Quem somos
          </Link>
          <Link
            href="#portfolio"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-red-400 py-2"
          >
            Direção
          </Link>
          <Link
            href="#escola"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-red-400 py-2"
          >
            Escola
          </Link>
          <Link
            href="#footer"
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-red-400 py-2"
          >
            Contacto
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenLogin();
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded-lg shadow-md shadow-red-900/40 transition mt-2"
          >
            <User className="w-5 h-5" />
            <span>Área Reservada</span>
          </button>
        </div>
      )}
    </nav>
  );
}
