"use client";

import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/app/components/layout/navbar";
import FieldCard from "@/app/components/cards/fieldCard";
import { FiSearch } from "react-icons/fi";
import { getFields } from "@/app/utils/api";

interface Field {
  id: string;
  name: string;
  image: string;
  sportType: string;
  city: string;
  address: string;
  priceRange?: string;
}

export default function FieldsListingSection() {
  const [fields, setFields] = useState<Field[]>([]);
  const [filteredFields, setFilteredFields] = useState<Field[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [loading, setLoading] = useState(true);

  // Buscar campos ao carregar a página
  useEffect(() => {
    fetchFields();
    
    // Recuperar cidade da busca inicial (se houver)
    const savedCity = localStorage.getItem("searchedCity");
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  // Filtrar campos quando mudar os filtros
  useEffect(() => {
    filterFields();
  }, [fields, searchTerm, selectedCity, selectedSport]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      
      let allFields: Field[] = [];
      
      // Tentar buscar do backend
      try {
        const data = await getFields();
        allFields = data;
      } catch (apiError) {
        console.warn("Backend não disponível, usando dados locais e mockados");
        
        // Buscar campos salvos localmente
        const localFields = JSON.parse(localStorage.getItem("localFields") || "[]");
        
        // Dados mockados para demonstração
        const mockFields: Field[] = [
          {
            id: "1",
            name: "Society Field A",
            image: "/images/soccer-field.jpg",
            sportType: "futebol",
            city: "São Paulo",
            address: "Rua das Flores, 123",
            priceRange: "R$ 50,00 - R$ 70,00",
          },
          {
            id: "2",
            name: "Society Field B",
            image: "/images/soccer-field.jpg",
            sportType: "futebol",
            city: "São Paulo",
            address: "Av. Paulista, 456",
            priceRange: "R$ 60,00 - R$ 80,00",
          },
          {
            id: "3",
            name: "Beach Tennis Court A",
            image: "/images/beach-tennis.jpg",
            sportType: "beach-tennis",
            city: "Rio de Janeiro",
            address: "Copacabana, 789",
            priceRange: "R$ 40,00 - R$ 60,00",
          },
        ];
        
        // Combinar campos locais com mockados
        allFields = [...localFields, ...mockFields];
      }

      setFields(allFields);
      setFilteredFields(allFields);
    } catch (error) {
      console.error("Erro ao buscar campos:", error);
      setFields([]);
      setFilteredFields([]);
    } finally {
      setLoading(false);
    }
  };

  const filterFields = () => {
    // Garantir que fields é um array
    let result = Array.isArray(fields) ? fields : [];

    // Filtrar por busca (nome do lugar)
    if (searchTerm) {
      result = result.filter((field) =>
        field.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por cidade
    if (selectedCity) {
      result = result.filter((field) =>
        field.city.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    // Filtrar por tipo de esporte
    if (selectedSport) {
      result = result.filter((field) => field.sportType === selectedSport);
    }

    setFilteredFields(result);
  };

  // Agrupar campos por tipo de esporte
  const groupedFields = useMemo(() => {
    // Garantir que é um array
    const safeFilteredFields = Array.isArray(filteredFields) ? filteredFields : [];
    
    if (safeFilteredFields.length === 0) {
      return {} as Record<string, Field[]>;
    }
    
    return safeFilteredFields.reduce((acc, field) => {
      if (!acc[field.sportType]) {
        acc[field.sportType] = [];
      }
      acc[field.sportType].push(field);
      return acc;
    }, {} as Record<string, Field[]>);
  }, [filteredFields]);

  const sportTypeLabels: Record<string, string> = {
    futebol: "Society",
    futsal: "Futsal",
    volei: "Vôlei",
    basquete: "Basquete",
    tenis: "Tênis",
    "beach-tennis": "Beach Tennis",
    padel: "Padel",
    outros: "Outros",
  };

  const cities = Array.from(new Set(Array.isArray(fields) ? fields.map((f) => f.city) : []));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-8 py-12 mt-24">
        {/* Cabeçalho com filtros */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bebas text-gray-800">
              <span className="text-[#EFA23B]"></span> Campos
            </h1>
            {selectedCity && (
              <p className="text-gray-600 mt-1">
                Mostrando campos em <strong>{selectedCity}</strong>
              </p>
            )}
          </div>

          {/* Barra de busca e filtros */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Busca por lugar */}
              <div className="flex flex-col space-y-1">
                <label className="text-gray-700 text-sm font-medium">
                  Lugar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    data-testid="search-input"
                    placeholder="Digite o nome do lugar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-[45px] rounded-sm pl-3 pr-10 outline-none text-gray-700 border border-gray-300 focus:ring-2 focus:ring-[#EFA23B] focus:border-transparent transition-all duration-200"
                  />
                  <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Filtro por cidade */}
              <div className="flex flex-col space-y-1">
                <label className="text-gray-700 text-sm font-medium">
                  Onde
                </label>
                <select
                  data-testid="city-filter"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-[45px] rounded-sm px-3 outline-none text-gray-700 border border-gray-300 focus:ring-2 focus:ring-[#EFA23B] focus:border-transparent transition-all duration-200"
                >
                  <option value="">Digite sua cidade</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por tipo */}
              <div className="flex flex-col space-y-1">
                <label className="text-gray-700 text-sm font-medium">
                  Tipo do campo
                </label>
                <select
                  data-testid="sport-filter"
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full h-[45px] rounded-sm px-3 outline-none text-gray-700 border border-gray-300 focus:ring-2 focus:ring-[#EFA23B] focus:border-transparent transition-all duration-200"
                >
                  <option value="">selecione o tipo</option>
                  {Object.entries(sportTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Listagem de campos por categoria */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando campos...</p>
          </div>
        ) : filteredFields.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Nenhum campo encontrado com os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedFields).map(([sportType, sportFields]) => (
              <div key={sportType}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {sportTypeLabels[sportType] || sportType} {">"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {sportFields.map((field) => (
                    <FieldCard key={field.id} {...field} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
