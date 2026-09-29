"use client";

import SearchBar from "../../fields_inputs/searchBar";
import HomeNavbar from "../../layout/homeNavbar";
import Subtitle from "../../text/subtitle";
import Title from "../../text/title";
import { getSportsCentersByCity } from "../../../utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const HomeSection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSearch = async (city: string) => {
    if (!city.trim()) return alert("Digite o nome de uma cidade.");
    try {
      setLoading(true);
      // Salvar cidade pesquisada para usar nos filtros
      localStorage.setItem("searchedCity", city);
      // Redirecionar para a página de campos
      router.push("/rotas/campos");
    } catch (err: any) {
      console.error("Erro ao buscar centros:", err);
      alert(err.message || "Erro ao buscar centros esportivos.");
    } finally {
      setLoading(false);
    }
  };

  const videos = [
    "/videos/bask1.mp4",
    "/videos/bask2.mp4",
    "/videos/fut1.mp4",
    "/videos/fut2.mp4",
    "/videos/tenis1.mp4",
    "/videos/tenis2.mp4",
    "/videos/volei1.mp4",
    "/videos/volei2.mp4",
  ];

  const videoSelected = videos[Math.floor(Math.random() * videos.length)];

  return (
    <section className="relative flex flex-col justify-center items-center min-h-screen text-white overflow-hidden">
      {/* Background Video */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover blur-[8px]"
        >
          <source src={videoSelected} type="video/mp4" />
          Seu navegador não suporta vídeos em HTML5.
        </video>
      </div>

      {/* Overlay escura */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Navbar */}
      <div className="w-full z-20">
        <HomeNavbar />
      </div>

      {/* Conteúdo */}
      <div
        className="
          relative z-10 flex flex-col 
          items-end text-right 
          px-6 md:px-10 
          max-w-[1100px] w-full 
          mt-24 md:mt-32
        "
      >
        {/* Títulos - responsivo */}
        <div
          className="w-full flex flex-col items-end md:items-end text-right md:text-right
                        items-center text-center md:text-right md:items-end
        "
        >
          <Title
            firstLine="ENCONTRE SEU CAMPO"
            secondLine="PERFEITO"
            align="right"
          />

          <Subtitle
            firstLine="Reserve seu horário no campo mais próximo de"
            secondLine="você e jogue sem preocupações!"
            align="right"
          />
        </div>

        {/* SearchBar Responsivo */}
        <div className="mt-10 w-full flex justify-center md:justify-end">
          <div className="w-full md:w-[800px] lg:w-[1072px]">
            <SearchBar
              placeholder="DIGITE SUA CIDADE..."
              buttonLabel={loading ? "BUSCANDO..." : "BUSCAR"}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
