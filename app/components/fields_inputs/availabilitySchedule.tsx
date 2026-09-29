"use client";

import React, { useState } from "react";

interface TimeSlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  price: string;
  isOpen: boolean;
}

interface AvailabilityScheduleProps {
  onScheduleChange?: (schedule: TimeSlot[]) => void;
}

const daysOfWeek = [
  { value: "monday", label: "Segunda-feira" },
  { value: "tuesday", label: "Terça-feira" },
  { value: "wednesday", label: "Quarta-feira" },
  { value: "thursday", label: "Quinta-feira" },
  { value: "friday", label: "Sexta-feira" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

export default function AvailabilitySchedule({
  onScheduleChange,
}: AvailabilityScheduleProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    daysOfWeek.map((day, index) => ({
      id: (index + 1).toString(),
      dayOfWeek: day.value,
      startTime: "",
      endTime: "",
      price: "",
      isOpen: true,
    }))
  );

  const updateTimeSlot = (
    id: string,
    field: keyof TimeSlot,
    value: string | boolean
  ) => {
    const newSlots = timeSlots.map((slot) =>
      slot.id === id ? { ...slot, [field]: value } : slot
    );
    setTimeSlots(newSlots);
    if (onScheduleChange) onScheduleChange(newSlots);
  };

  const getDayLabel = (dayValue: string) => {
    return daysOfWeek.find((d) => d.value === dayValue)?.label || dayValue;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Disponibilidade e Valores
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Dia da Semana
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">
                Aberto?
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Horário de Abertura
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Horário de Fechamento
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Preço por Hora
              </th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr
                key={slot.id}
                className={`border-b border-gray-200 transition-colors ${
                  slot.isOpen ? "hover:bg-gray-50" : "bg-gray-100"
                }`}
              >
                <td className="py-4 px-4 text-gray-800">
                  {getDayLabel(slot.dayOfWeek)}
                </td>
                <td className="py-4 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={slot.isOpen}
                    onChange={(e) =>
                      updateTimeSlot(slot.id, "isOpen", e.target.checked)
                    }
                    className="w-5 h-5 text-[#EFA23B] cursor-pointer accent-[#EFA23B]"
                  />
                </td>
                <td className="py-4 px-4">
                  <input
                    type="time"
                    value={slot.startTime}
                    disabled={!slot.isOpen}
                    onChange={(e) =>
                      updateTimeSlot(slot.id, "startTime", e.target.value)
                    }
                    className={`w-full px-3 py-2 border-none outline-none rounded transition-colors ${
                      slot.isOpen
                        ? "text-[#EFA23B] bg-transparent focus:bg-gray-100 cursor-pointer"
                        : "text-gray-400 bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </td>
                <td className="py-4 px-4">
                  <input
                    type="time"
                    value={slot.endTime}
                    disabled={!slot.isOpen}
                    onChange={(e) =>
                      updateTimeSlot(slot.id, "endTime", e.target.value)
                    }
                    className={`w-full px-3 py-2 border-none outline-none rounded transition-colors ${
                      slot.isOpen
                        ? "text-[#EFA23B] bg-transparent focus:bg-gray-100 cursor-pointer"
                        : "text-gray-400 bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </td>
                <td className="py-4 px-4">
                  <input
                    type="number"
                    step="0.01"
                    value={slot.price}
                    disabled={!slot.isOpen}
                    onChange={(e) =>
                      updateTimeSlot(slot.id, "price", e.target.value)
                    }
                    placeholder="R$ 0,00"
                    className={`w-full px-3 py-2 border-none outline-none rounded transition-colors ${
                      slot.isOpen
                        ? "text-[#EFA23B] bg-transparent focus:bg-gray-100 cursor-pointer"
                        : "text-gray-400 bg-gray-100 cursor-not-allowed"
                    }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
