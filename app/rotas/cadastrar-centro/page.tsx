"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSportsCenter } from "../../utils/api";
import toast from "react-hot-toast";
import PrimaryButton from "../../components/button/primaryButton";
import InputField from "../../components/fields_inputs/inputField";
import TextAreaField from "../../components/fields_inputs/textAreaField";

export default function CadastrarCentroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    latitude: -23.55052,
    longitude: -46.633308,
    photo: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Você precisa fazer login primeiro!");
        router.push("/rotas/login");
        return;
      }

      // Validar CNPJ (14 dígitos)
      const cnpjNumbers = formData.cnpj.replace(/\D/g, "");
      if (cnpjNumbers.length !== 14) {
        toast.error("CNPJ deve ter 14 dígitos");
        setLoading(false);
        return;
      }

      await createSportsCenter(token, {
        name: formData.name,
        cnpj: cnpjNumbers,
        latitude: formData.latitude,
        longitude: formData.longitude,
        photo: formData.photo || undefined,
        description: formData.description || undefined,
      });

      toast.success("Centro esportivo criado com sucesso!");
      router.push("/rotas/cadastrar-campo");
    } catch (error: any) {
      console.error("Erro ao criar centro:", error);
      toast.error(error.message || "Erro ao criar centro esportivo");
    } finally {
      setLoading(false);
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 14) {
      return numbers.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
      );
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar Centro Esportivo
          </h1>
          <p className="text-gray-600 mb-8">
            Cadastre seu centro esportivo para poder adicionar campos
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Nome do Centro"
              name="name"
              type="text"
              placeholder="Ex: Arena Esportiva São Paulo"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <InputField
              label="CNPJ"
              name="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              value={formatCNPJ(formData.cnpj)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, cnpj: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Latitude"
                name="latitude"
                type="number"
                placeholder="-23.550520"
                value={formData.latitude.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    latitude: parseFloat(e.target.value),
                  })
                }
              />

              <InputField
                label="Longitude"
                name="longitude"
                type="number"
                placeholder="-46.633308"
                value={formData.longitude.toString()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    longitude: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <p className="text-sm text-gray-500">
              💡 Dica: Você pode obter as coordenadas procurando seu endereço no{" "}
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Maps
              </a>{" "}
              e clicando com o botão direito no local.
            </p>

            <InputField
              label="Foto (URL) - Opcional"
              name="photo"
              type="url"
              placeholder="https://exemplo.com/foto.jpg"
              value={formData.photo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, photo: e.target.value })
              }
            />

            <TextAreaField
              label="Descrição - Opcional"
              name="description"
              placeholder="Descreva seu centro esportivo..."
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="flex gap-4">
              <PrimaryButton
                label={loading ? "Criando..." : "Criar Centro Esportivo"}
                type="submit"
              />
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
