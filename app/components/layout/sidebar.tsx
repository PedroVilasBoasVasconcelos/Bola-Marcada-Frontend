"use client";

import Link from "next/link";
import { useState } from "react";
import { FiHome, FiSearch, FiHeart, FiMenu, FiPlusCircle } from "react-icons/fi";
import { IoExitOutline } from "react-icons/io5";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BOTÃO HAMBÚRGUER - MOBILE */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-[9999] p-2 bg-white rounded-lg shadow-lg"
      >
        <FiMenu size={24} className="text-gray-800" />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full bg-white border-r border-gray-200 p-8 w-64 transform transition-transform duration-300 z-[999]
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <h2 className="text-xl font-bold mb-10">Bola Marcada</h2>

        <ul className="space-y-6 text-gray-700 font-medium">
          <li>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-[#f4efe8] hover:text-[#EFA23B] font-medium"
              onClick={() => setOpen(false)}
            >
              <FiHome size={18} />
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/rotas/campos"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-[#f4efe8] hover:text-[#EFA23B] font-medium"
              onClick={() => setOpen(false)}
            >
              <FiSearch size={18} />
              Explorar
            </Link>
          </li>

          <li>
            <Link
              href="/rotas/cadastrar-campo"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-[#f4efe8] hover:text-[#EFA23B] font-medium"
              onClick={() => setOpen(false)}
            >
              <FiPlusCircle size={18} />
              Cadastrar Campo
            </Link>
          </li>

          <li>
            <Link
              href="/rotas/favoritos"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-[#f4efe8] hover:text-[#EFA23B] font-medium"
              onClick={() => setOpen(false)}
            >
              <FiHeart size={18} />
              Favoritos
            </Link>
          </li>

          <li>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-[#f4efe8] hover:text-[#EFA23B] font-medium"
              onClick={() => setOpen(false)}
            >
              <IoExitOutline size={18} />
              Sair
            </Link>
          </li>
        </ul>
      </aside>

      {/* FUNDO ESCURO QUANDO O MENU ESTÁ ABERTO (MOBILE) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-[998]"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
