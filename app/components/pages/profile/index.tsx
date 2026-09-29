"use client";

import { useEffect, useState } from "react";
import {
  deleteUser,
  getCurrentUser,
  updateCurrentUser,
  getFields,
  getUserReservations,
  cancelReservation,
} from "../../../utils/api";

import Sidebar from "../../layout/sidebar";
import Avatar from "./avatar";

import Title from "../../text/title";
import Subtitle from "../../text/subtitle";
import PrimaryButton from "../../button/primaryButton";
import { Reservation } from "@/app/types/reservation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userFields, setUserFields] = useState<any[]>([]);
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // campos
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Se não tem token, tentar pegar dados salvos
    if (!token) {
      const savedUser = localStorage.getItem("userData");
      if (savedUser) {
        const data = JSON.parse(savedUser);
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAvatarPreview(data.avatar || null);
      }
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getCurrentUser(token);
        console.log("✅ Dados do usuário carregados:", data);
        
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAvatarPreview(data.avatar || null);
        
        // Buscar campos do usuário
        try {
          // Primeiro tenta buscar do backend
          const allFields = await getFields();
          console.log("✅ Campos do backend:", allFields);
          
          // Filtrar campos criados pelo usuário
          const myFields = allFields.filter((field: any) => field.owner_id === data.id);
          console.log("✅ Campos filtrados do usuário:", myFields);
          
          // Se não encontrou no backend, buscar do localStorage
          if (myFields.length === 0) {
            const localFields = JSON.parse(localStorage.getItem("localFields") || "[]");
            console.log("📦 Usando campos locais:", localFields);
            setUserFields(localFields);
          } else {
            setUserFields(myFields);
          }
        } catch (err) {
          console.warn("⚠️ Erro ao buscar campos do backend:", err);
          // Se backend falhar, buscar do localStorage
          const localFields = JSON.parse(localStorage.getItem("localFields") || "[]");
          console.log("📦 Usando campos locais (backend falhou):", localFields);
          setUserFields(localFields);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar usuário:", err);
        
        // Tentar carregar dados locais mesmo com erro
        const savedUser = localStorage.getItem("userData");
        if (savedUser) {
          const data = JSON.parse(savedUser);
          setUser(data);
          setName(data.name || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setAvatarPreview(data.avatar || null);
        }
        
        // Carregar campos locais
        const localFields = JSON.parse(localStorage.getItem("localFields") || "[]");
        setUserFields(localFields);
      } finally {
        setLoading(false);
      }
    })();
    
    // Carregar reservas
    loadReservations();
  }, []);
  
  // Função para carregar reservas
  const loadReservations = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Sem token, pegar do localStorage
      const localReservations = JSON.parse(
        localStorage.getItem("userReservations") || "[]"
      );
      setUserReservations(localReservations);
      return;
    }
    
    try {
      const reservations = await getUserReservations(token);
      setUserReservations(reservations);
    } catch (err) {
      console.error("❌ Erro ao carregar reservas:", err);
      // Fallback para localStorage
      const localReservations = JSON.parse(
        localStorage.getItem("userReservations") || "[]"
      );
      setUserReservations(localReservations);
    }
  };
  
  // Função para cancelar reserva
  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm("Deseja realmente cancelar esta reserva?")) {
      return;
    }
    
    const token = localStorage.getItem("token");
    
    try {
      if (token) {
        await cancelReservation(token, reservationId);
      } else {
        // Sem token, cancelar localmente
        const localReservations = JSON.parse(
          localStorage.getItem("userReservations") || "[]"
        );
        const updated = localReservations.map((r: Reservation) =>
          r.id === reservationId ? { ...r, status: "cancelled" as const } : r
        );
        localStorage.setItem("userReservations", JSON.stringify(updated));
      }
      
      // Recarregar reservas
      await loadReservations();
      alert("Reserva cancelada com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao cancelar reserva:", err);
      alert("Erro ao cancelar reserva. Tente novamente.");
    }
  };

  // máscara telefone
  function formatPhone(value: string) {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  }

  // alterar avatar
  function handleAvatarFile(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  // salvar perfil
  async function handleSave() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const body: any = { name, email, phone };
      if (avatarPreview) body.avatar = avatarPreview;

      const updated = await updateCurrentUser(token, body);

      setUser(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao atualizar perfil.");
    }
  }

  // deletar conta
  async function handleDeleteAccount() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação é irreversível."
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(token, false);
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error("Erro ao deletar conta:", err);
      alert("Erro ao excluir conta.");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Carregando...
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row bg-[#fffaf2] min-h-screen text-gray-800">
      {/* SIDEBAR */}
      <div className="md:block">
        <Sidebar />
      </div>

      {/* Conteúdo */}
      <main className="flex-1 w-full px-6 sm:px-10 md:px-20 py-10 flex justify-center">
        <div className="w-full max-w-[700px]">
          {/* título */}
          <div className="mb-10">
            <Title firstLine="Perfil" align="left" size={32} color="#1C1A0D" />
          </div>

          {/* avatar */}
          <div className="flex justify-center mb-12">
            <Avatar
              name={user?.name}
              email={user?.email}
              avatarUrl={avatarPreview}
              onImageChange={handleAvatarFile}
            />
          </div>

          {/* Minhas Reservas */}
          <section className="mb-10">
            <Title
              firstLine="Minhas Reservas"
              align="left"
              size={28}
              color="#1C1A0D"
            />

            <div className="mt-6 space-y-4">
              {userReservations.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg">
                    Você ainda não possui reservas
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Encontre campos disponíveis e faça sua primeira reserva!
                  </p>
                </div>
              ) : (
                userReservations
                  .filter((reservation) => reservation.status === "confirmed")
                  .map((reservation) => {
                    const daysOfWeek: Record<string, string> = {
                      monday: "Segunda-feira",
                      tuesday: "Terça-feira",
                      wednesday: "Quarta-feira",
                      thursday: "Quinta-feira",
                      friday: "Sexta-feira",
                      saturday: "Sábado",
                      sunday: "Domingo",
                    };
                    
                    const formattedDate = new Date(reservation.date + "T00:00:00")
                      .toLocaleDateString("pt-BR");

                    return (
                      <div
                        key={reservation.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {reservation.fieldName}
                            </h3>
                            
                            <div className="space-y-1 text-gray-600">
                              <p>
                                <span className="font-medium">Data:</span>{" "}
                                {formattedDate} ({daysOfWeek[reservation.dayOfWeek]})
                              </p>
                              <p>
                                <span className="font-medium">Horário:</span>{" "}
                                {reservation.startTime} - {reservation.endTime}
                              </p>
                              <p>
                                <span className="font-medium">Valor:</span>{" "}
                                <span className="text-[#EFA23B] font-semibold">
                                  R$ {parseFloat(reservation.price).toFixed(2)}
                                </span>
                              </p>
                            </div>
                            
                            <div className="mt-3">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                Confirmada
                              </span>
                            </div>
                          </div>

                          <div className="flex sm:flex-col gap-2">
                            <PrimaryButton
                              label="Cancelar"
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="w-full sm:w-32"
                              color="#E53935"
                              hoverColor="#C62828"
                              textColor="white"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </section>

          {/* Minhas Instalações */}
          <section className="mb-10">
            <Title
              firstLine="Minhas Instalações"
              align="left"
              size={28}
              color="#1C1A0D"
            />
            {userFields.length === 0 ? (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <Subtitle
                  firstLine="Você ainda não publicou nenhum campo."
                  align="center"
                  size={16}
                  color="#1C1A0D"
                />
                <div className="mt-4">
                  <a
                    href="/rotas/cadastrar-campo"
                    className="inline-block bg-[#EFA23B] hover:bg-[#d78c2f] text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200"
                  >
                    Cadastrar Primeiro Campo
                  </a>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {userFields.map((field) => (
                  <div
                    key={field.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {field.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {field.address}, {field.city}
                        </p>
                        <p className="text-sm text-[#EFA23B] mt-1 font-medium">
                          {field.sportType}
                        </p>
                      </div>
                      {field.image && (
                        <img
                          src={field.image}
                          alt={field.name}
                          className="w-20 h-20 object-cover rounded-md ml-4"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Configurações */}
          <section className="mb-10">
            <Title
              firstLine="Configurações da Conta"
              align="left"
              size={28}
              color="#1C1A0D"
            />

            <div className="space-y-5 mt-6">
              <input
                placeholder="Nome completo"
                value={name}
                readOnly={!isEditing}
                onChange={(e) => setName(e.target.value)}
                className={`block w-full p-3 border rounded-lg text-[16px] bg-white ${
                  isEditing ? "border-[#EFA23B] shadow-sm" : "border-gray-300"
                }`}
              />

              <input
                placeholder="Seu e-mail"
                value={email}
                readOnly={!isEditing}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full p-3 border rounded-lg text-[16px] bg-white ${
                  isEditing ? "border-[#EFA23B] shadow-sm" : "border-gray-300"
                }`}
              />

              <input
                placeholder="Telefone"
                value={phone}
                readOnly={!isEditing}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className={`block w-full p-3 border rounded-lg text-[16px] bg-white ${
                  isEditing ? "border-[#EFA23B] shadow-sm" : "border-gray-300"
                }`}
              />

              {/* botões */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {!isEditing && (
                  <PrimaryButton
                    label="Editar"
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-32"
                    color="#D9D9D9"
                    hoverColor="#C5C5C5"
                    textColor="#1C1A0D"
                  />
                )}

                {isEditing && (
                  <>
                    <PrimaryButton
                      label="Cancelar"
                      onClick={() => {
                        setIsEditing(false);
                        setName(user.name);
                        setEmail(user.email);
                        setPhone(user.phone || "");
                        setAvatarPreview(user.avatar || null);
                      }}
                      className="w-full sm:w-32"
                      color="#D9D9D9"
                      hoverColor="#C5C5C5"
                      textColor="#1C1A0D"
                    />

                    <PrimaryButton
                      label="Salvar"
                      onClick={handleSave}
                      className="w-full sm:w-32"
                      color="#EFA23B"
                      hoverColor="#d78c2f"
                      textColor="white"
                    />
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Segurança */}
          <section className="mb-12">
            <Title
              firstLine="Segurança"
              align="left"
              size={28}
              color="#1C1A0D"
            />

            <div className="space-y-4 mt-4">
              <div>
                <Subtitle
                  firstLine="Alterar Senha"
                  size={16}
                  align="left"
                  color="#1C1A0D"
                />
                <PrimaryButton
                  label="Alterar Senha"
                  onClick={() => {}}
                  className="w-full sm:w-40 mt-2"
                  color="#EFA23B"
                  hoverColor="#d78c2f"
                  textColor="white"
                />
              </div>

              <div className="pt-4">
                <Title
                  firstLine="Excluir Conta"
                  size={28}
                  align="left"
                  color="#1C1A0D"
                />

                <PrimaryButton
                  label="Deletar Conta"
                  onClick={handleDeleteAccount}
                  className="w-full sm:w-40 mt-6"
                  color="#E53935"
                  hoverColor="#C62828"
                  textColor="white"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
