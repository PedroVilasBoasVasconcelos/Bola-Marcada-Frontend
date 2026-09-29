"use client";

import Image from "next/image";
import Link from "next/link";

interface FieldCardProps {
  id: string;
  name: string;
  image: string;
  sportType: string;
  city: string;
  address: string;
  priceRange?: string;
}

export default function FieldCard({
  id,
  name,
  image,
  sportType,
  city,
  address,
  priceRange,
}: FieldCardProps) {
  return (
    <Link href={`/rotas/campo/${id}`}>
      <div data-testid="field-card" className="group cursor-pointer bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        {/* Imagem */}
        <div className="relative w-full h-48 bg-gray-300 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Sem imagem
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{city}</p>
          {priceRange && (
            <p className="text-sm text-[#EFA23B] font-medium">{priceRange}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
