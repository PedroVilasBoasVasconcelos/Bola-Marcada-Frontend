"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomeNavbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-20">
      <div className="grid grid-cols-3 items-center px-8 py-5">
        {/* Coluna 1 (vazia pra centralizar via grid) */}
        <div />

        {/* Coluna 2: Logo centralizada */}
        <div className="justify-self-center">
          <Link href="/">
            <Image
              src="/images/Logo.png"
              alt="Logo Bola Marcada"
              width={140}
              height={194}
              priority
              className="object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </Link>
        </div>

        {/* Coluna 3: Link alinhado à direita - SEMPRE mostra CADASTRAR/ENTRAR na home */}
        <div className="justify-self-end">
          <div className="mb-10">
            <Link
              href="rotas/login"
              className="text-gray-300 hover:text-white font-bebas text-2xl racking-wide leading-none mb-20"
            >
              CADASTRAR / ENTRAR
            </Link>{" "}
          </div>
        </div>
      </div>
    </nav>
  );
}
