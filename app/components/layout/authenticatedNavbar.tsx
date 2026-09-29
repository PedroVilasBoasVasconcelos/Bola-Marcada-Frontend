"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthenticatedNavbar() {
  const router = useRouter();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/Logo.png"
              alt="Logo Bola Marcada"
              width={50}
              height={50}
              priority
              className="object-contain"
            />
            <span className="ml-3 font-bebas text-2xl text-gray-800">
              Bola Marcada
            </span>
          </Link>

          {/* Menu de navegação */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-[#EFA23B] font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/rotas/campos"
              className="text-gray-700 hover:text-[#EFA23B] font-medium transition-colors duration-200"
            >
              Explorar
            </Link>
            <Link
              href="/meus-espacos"
              className="text-gray-700 hover:text-[#EFA23B] font-medium transition-colors duration-200"
            >
              Meus Espaços
            </Link>
            <Link
              href="/mensagens"
              className="text-gray-700 hover:text-[#EFA23B] font-medium transition-colors duration-200"
            >
              Mensagens
            </Link>

            {/* Avatar do usuário */}
            <button
              onClick={() => router.push("/rotas/profile")}
              className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden hover:ring-2 hover:ring-[#EFA23B] transition-all duration-200"
            >
              <Image
                src="/images/default-avatar.png"
                alt="Avatar do usuário"
                width={40}
                height={40}
                className="object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
