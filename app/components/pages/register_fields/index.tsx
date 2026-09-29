"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/layout/navbar";
import SelectField from "@/app/components/fields_inputs/selectField";
import TextAreaField from "@/app/components/fields_inputs/textAreaField";
import ImageUpload from "@/app/components/fields_inputs/imageUpload";
import AvailabilitySchedule from "@/app/components/fields_inputs/availabilitySchedule";
import PrimaryButton from "@/app/components/button/primaryButton";
import { createField } from "@/app/utils/api";
import { FiChevronLeft } from "react-icons/fi";

interface TimeSlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  price: string;
}

const sportsOptions = [
  { value: "futebol", label: "Futebol" },
  { value: "futsal", label: "Futsal" },
  { value: "volei", label: "Vôlei" },
  { value: "basquete", label: "Basquete" },
  { value: "tenis", label: "Tênis" },
  { value: "beach-tennis", label: "Beach Tennis" },
  { value: "padel", label: "Padel" },
  { value: "outros", label: "Outros" },
];

export default function RegisterFieldsSection() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    sportType: "",
    description: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [schedule, setSchedule] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name || !formData.address || !formData.city || !formData.sportType) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (images.length === 0) {
      alert("Por favor, adicione pelo menos uma imagem do espaço.");
      return;
    }

    setLoading(true);

    try {
      // Pegar token do localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para cadastrar um campo.");
        router.push("/rotas/login");
        return;
      }

      // Preparar dados do campo
      const imageUrls = images.map((_, index) => `/images/field-${index}.jpg`);
      
      const fieldData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        sportType: formData.sportType,
        description: formData.description,
        images: imageUrls,
        schedule: schedule,
      };

      try {
        // Tentar enviar para o backend
        await createField(token, fieldData);
        alert("Campo cadastrado com sucesso!");
      } catch (apiError: any) {
        console.warn("Backend não disponível, salvando localmente:", apiError);
        
        // Salvar localmente se o backend não estiver disponível
        const localFields = JSON.parse(localStorage.getItem("localFields") || "[]");
        
        const newField = {
          id: Date.now().toString(),
          ...fieldData,
          image: imageUrls[0] || "/images/default-field.jpg",
          priceRange: schedule.length > 0 && schedule[0].price 
            ? `R$ ${schedule[0].price},00` 
            : "A consultar",
          createdAt: new Date().toISOString(),
        };
        
        localFields.push(newField);
        localStorage.setItem("localFields", JSON.stringify(localFields));
        
        alert("Backend não disponível. Campo salvo localmente para testes!");
      }
      
      // Redirecionar para a listagem de campos
      router.push("/rotas/campos");
    } catch (error: any) {
      console.error("Erro completo ao cadastrar campo:", error);
      
      let errorMessage = "Erro ao cadastrar campo. Tente novamente.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      alert(`Erro ao cadastrar campo: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-8 py-12 mt-24">
        {/* Botão Voltar */}
        <Link
          href="/rotas/profile"
          className="inline-flex items-center justify-center w-10 h-10 mb-6 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all z-50 relative"
        >
          <FiChevronLeft size={24} strokeWidth={2.5} />
        </Link>

        {/* Título */}
        <h1 className="text-4xl font-bebas text-gray-800 mb-2">
          Cadastrar Campo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção: Dados do Local */}
          <section className="bg-white rounded-sm shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Dados do Local
            </h2>

            <div className="space-y-4">
              {/* Nome do Campo */}
              <div className="flex flex-col space-y-1">
                <label className="text-gray-700 text-sm font-medium">
                  Nome do Campo/Quadra
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Quadra do Parque"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full h-[45px] rounded-sm px-3 outline-none text-gray-700 border border-gray-300 focus:ring-2 focus:ring-[#EFA23B] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Endereço */}
              <div className="flex flex-col space-y-1">
                <label className="text-gray-700 text-sm font-medium">
                  Endereço
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Ex: Rua das Flores, 123"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full h-[45px] rounded-sm px-3 outline-none text-gray-700 border border-gray-300 focus:ring-2 focus:ring-[#EFA23B] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Cidade */}
              <div className="flex flex-col space-y-1">
                <label className="text-gray-700 text-sm font-medium">
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Ex: São Paulo"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full h-[45px] rounded-sm px-3 outline-none text-gray-700 border border-gray-300 focus:ring-2 focus:ring-[#EFA23B] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Tipo de Esporte */}
              <SelectField
                label="Tipo de Esporte"
                name="sportType"
                placeholder="Selecione"
                value={formData.sportType}
                onChange={handleInputChange}
                options={sportsOptions}
              />

              {/* Descrição */}
              <TextAreaField
                label="Descrição"
                name="description"
                placeholder="Descreva as características do espaço, facilidades, etc."
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
              />
            </div>
          </section>

          {/* Seção: Imagens */}
          <section className="bg-white rounded-sm shadow-sm p-8">
            <ImageUpload
              label="Imagens"
              onImagesChange={setImages}
              maxFiles={10}
            />
          </section>

          {/* Seção: Disponibilidades e Valores */}
          <section className="bg-white rounded-sm shadow-sm p-8">
            <AvailabilitySchedule onScheduleChange={setSchedule} />
          </section>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <PrimaryButton
              type="submit"
              label={loading ? "Cadastrando..." : "Cadastrar Campo"}
              className="px-8 py-3"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
