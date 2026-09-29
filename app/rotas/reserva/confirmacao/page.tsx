"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/layout/navbar";
import { Reservation } from "@/app/types/reservation";
import { FiCheckCircle, FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";

export default function ReservationConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("id");
  
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reservationId) {
      router.push("/rotas/campos");
      return;
    }

    // Buscar reserva no localStorage
    const reservations = JSON.parse(
      localStorage.getItem("userReservations") || "[]"
    ) as Reservation[];
    
    const found = reservations.find((r) => r.id === reservationId);
    
    if (!found) {
      router.push("/rotas/campos");
      return;
    }
    
    setReservation(found);
    setLoading(false);
  }, [reservationId, router]);

  if (loading || !reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  const daysOfWeek: Record<string, string> = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  // Formatar data para DD/MM/YYYY
  const formattedDate = new Date(reservation.date + "T00:00:00").toLocaleDateString(
    "pt-BR"
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-8 py-12 mt-24">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="text-green-600" size={48} />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reserva Confirmada!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Sua reserva foi realizada com sucesso. Veja os detalhes abaixo:
            </p>
          </div>

          {/* Reservation Details */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {reservation.fieldName}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiCalendar className="text-[#EFA23B] mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-800">Data</p>
                  <p className="text-gray-600">
                    {formattedDate} - {daysOfWeek[reservation.dayOfWeek]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiClock className="text-[#EFA23B] mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-800">Horário</p>
                  <p className="text-gray-600">
                    {reservation.startTime} - {reservation.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiDollarSign className="text-[#EFA23B] mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-800">Valor</p>
                  <p className="text-[#EFA23B] font-semibold text-lg">
                    R$ {parseFloat(reservation.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin className="text-[#EFA23B] mt-1" size={20} />
                <div>
                  <p className="font-medium text-gray-800">Status</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Confirmada
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-yellow-800 mb-2">
              ⚠️ Informações Importantes
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Chegue com 10 minutos de antecedência</li>
              <li>• Leve documento com foto para identificação</li>
              <li>• O pagamento será realizado no local</li>
              <li>• Em caso de cancelamento, acesse "Minhas Reservas" no seu perfil</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/rotas/profile"
            className="flex-1 px-6 py-3 bg-[#EFA23B] hover:bg-[#d78c2f] text-white font-semibold rounded-lg transition-colors text-center"
          >
            Ver Minhas Reservas
          </Link>
          
          <Link
            href="/rotas/campos"
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            Explorar Mais Campos
          </Link>
        </div>
      </main>
    </div>
  );
}
