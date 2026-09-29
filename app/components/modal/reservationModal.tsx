"use client";

import React, { useState, useEffect } from "react";
import { Reservation, TimeSlot } from "@/app/types/reservation";
import { FiX, FiCalendar, FiClock, FiDollarSign, FiChevronRight, FiChevronLeft } from "react-icons/fi";

interface ReservationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  fieldId: string;
  fieldName: string;
  availableSlots: TimeSlot[];
  onConfirm?: (reservation: Omit<Reservation, "id" | "createdAt">) => void;
}

type Step = "date" | "time" | "summary";

export default function ReservationModal({
  isOpen,
  onClose,
  fieldId,
  fieldName,
  availableSlots,
  onConfirm,
}: ReservationModalProps) {
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [error, setError] = useState("");

  // Reset ao abrir
  useEffect(() => {
    if (isOpen) {
      setStep("date");
      setSelectedDate("");
      setSelectedDayOfWeek("");
      setSelectedStartTime("");
      setDuration(1);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const daysOfWeek: Record<string, string> = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  const daysMap: Record<number, string> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  const today = new Date().toISOString().split("T")[0];

  // Pegar slot do dia da semana selecionado
  const getSlotForSelectedDay = () => {
    if (!selectedDayOfWeek) return null;
    return availableSlots.find(
      (slot) => slot.dayOfWeek === selectedDayOfWeek && slot.isOpen
    ) || null;
  };

  const currentSlot = getSlotForSelectedDay();

  // Gerar horários disponíveis de 1 em 1 hora
  const generateAvailableHours = () => {
    if (!currentSlot) return [];
    
    const [startHour] = currentSlot.startTime.split(":").map(Number);
    const [endHour] = currentSlot.endTime.split(":").map(Number);
    
    const hours = [];
    for (let h = startHour; h < endHour; h++) {
      hours.push(`${String(h).padStart(2, "0")}:00`);
    }
    
    return hours;
  };

  // Máximo de horas que pode reservar
  const getMaxDuration = () => {
    if (!currentSlot || !selectedStartTime) return 1;
    
    const [startHour] = selectedStartTime.split(":").map(Number);
    const [endHour] = currentSlot.endTime.split(":").map(Number);
    
    return endHour - startHour;
  };

  // Calcular preço total
  const calculateTotalPrice = () => {
    if (!currentSlot) return 0;
    return parseFloat(currentSlot.price) * duration;
  };

  // Calcular horário de término
  const getEndTime = () => {
    if (!selectedStartTime) return "";
    const [hours, minutes] = selectedStartTime.split(":").map(Number);
    const endHours = hours + duration;
    return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  // Avançar para seleção de horário
  const handleDateNext = () => {
    if (!selectedDate) {
      setError("Por favor, selecione uma data");
      return;
    }

    // Verificar se a data não é no passado
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate + "T00:00:00");
    
    if (selected < todayObj) {
      setError("Não é possível reservar uma data no passado");
      return;
    }

    // Determinar dia da semana
    const dayOfWeek = daysMap[selected.getDay()];
    setSelectedDayOfWeek(dayOfWeek);

    // Verificar se há slots disponíveis para esse dia
    const slotForDay = availableSlots.find(
      (slot) => slot.dayOfWeek === dayOfWeek && slot.isOpen
    );

    if (!slotForDay) {
      setError(`Não há horários disponíveis para ${daysOfWeek[dayOfWeek].toLowerCase()}`);
      return;
    }

    setError("");
    setStep("time");
  };

  // Avançar para resumo
  const handleTimeNext = () => {
    if (!selectedStartTime) {
      setError("Por favor, selecione um horário de início");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Você precisa estar logado para fazer uma reserva");
      return;
    }

    setError("");
    setStep("summary");
  };

  // Confirmar reserva
  const handleConfirm = () => {
    if (!currentSlot || !selectedDate || !selectedStartTime) return;

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = userData.id || "local-user";

    const selected = new Date(selectedDate + "T00:00:00");
    const dayOfWeek = daysMap[selected.getDay()];

    const reservation: Omit<Reservation, "id" | "createdAt"> = {
      userId,
      fieldId,
      fieldName,
      date: selectedDate,
      dayOfWeek,
      startTime: selectedStartTime,
      endTime: getEndTime(),
      price: calculateTotalPrice().toFixed(2),
      status: "confirmed",
    };

    onConfirm?.(reservation);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{fieldName}</h2>
          <button
            onClick={() => onClose?.()}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6">
          <div className={`flex items-center ${step === "date" ? "text-[#EFA23B]" : "text-gray-400"}`}>
            <FiCalendar size={20} />
            <span className="ml-2 text-sm font-medium">Data</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2" />
          <div className={`flex items-center ${step === "time" ? "text-[#EFA23B]" : "text-gray-400"}`}>
            <FiClock size={20} />
            <span className="ml-2 text-sm font-medium">Horário</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300 mx-2" />
          <div className={`flex items-center ${step === "summary" ? "text-[#EFA23B]" : "text-gray-400"}`}>
            <FiDollarSign size={20} />
            <span className="ml-2 text-sm font-medium">Resumo</span>
          </div>
        </div>

        {/* Step 1: Selecionar Data */}
        {step === "date" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escolha uma data:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setError("");
              }}
              min={today}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EFA23B] focus:border-transparent"
            />
            {selectedDate && (
              <p className="text-sm text-blue-600 mt-2">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              onClick={handleDateNext}
              disabled={!selectedDate}
              className="w-full mt-6 px-4 py-3 bg-[#EFA23B] text-white rounded-lg hover:bg-[#d89235] transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Próximo <FiChevronRight />
            </button>
          </div>
        )}

        {/* Step 2: Selecionar Horário e Duração */}
        {step === "time" && currentSlot && (
          <div>
            <button
              onClick={() => setStep("date")}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 text-sm"
            >
              <FiChevronLeft /> Voltar
            </button>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>

            {/* Seleção de Horário de Início */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horário de início:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {generateAvailableHours().map((hour) => (
                  <button
                    key={hour}
                    onClick={() => {
                      setSelectedStartTime(hour);
                      setError("");
                    }}
                    className={`px-3 py-2 rounded-lg border-2 transition-all ${
                      selectedStartTime === hour
                        ? "border-[#EFA23B] bg-[#EFA23B] text-white"
                        : "border-gray-300 hover:border-[#EFA23B] text-gray-700"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Duração */}
            {selectedStartTime && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantas horas você quer jogar:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: getMaxDuration() }, (_, i) => i + 1).map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setDuration(hours)}
                      className={`px-3 py-2 rounded-lg border-2 transition-all ${
                        duration === hours
                          ? "border-[#EFA23B] bg-[#EFA23B] text-white"
                          : "border-gray-300 hover:border-[#EFA23B] text-gray-700"
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Término: {getEndTime()}
                </p>
              </div>
            )}

            {/* Preço Estimado */}
            {selectedStartTime && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Valor estimado:</span>
                  <span className="text-2xl font-bold text-[#EFA23B]">
                    R$ {calculateTotalPrice().toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  R$ {parseFloat(currentSlot.price).toFixed(2)} por hora × {duration} hora(s)
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleTimeNext}
              disabled={!selectedStartTime}
              className="w-full px-4 py-3 bg-[#EFA23B] text-white rounded-lg hover:bg-[#d89235] transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Próximo <FiChevronRight />
            </button>
          </div>
        )}

        {/* Step 3: Resumo e Confirmação */}
        {step === "summary" && currentSlot && (
          <div>
            <button
              onClick={() => setStep("time")}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 text-sm"
            >
              <FiChevronLeft /> Voltar
            </button>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Resumo da Reserva</h3>
                
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-[#EFA23B]" />
                    <span>
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FiClock className="text-[#EFA23B]" />
                    <span>
                      {selectedStartTime} - {getEndTime()} ({duration}h)
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="text-[#EFA23B]" />
                    <span className="font-semibold text-xl text-[#EFA23B]">
                      R$ {calculateTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> O pagamento será realizado no local
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-[#EFA23B] text-white rounded-lg hover:bg-[#d89235] transition-colors font-medium"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
