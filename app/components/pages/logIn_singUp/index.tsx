"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Title from "../../text/title";
import InputField from "../../fields_inputs/inputField";
import PrimaryButton from "../../button/primaryButton";
import { registerUser, loginUser } from "../../../utils/api";

export default function LoginSignUp() {
  const router = useRouter();

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

  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
  });

  const [signin, setSignin] = useState({ email: "", password: "" });

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSignup({ ...signup, [e.target.name]: e.target.value });

  const handleSigninChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSignin({ ...signin, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    // Validações
    if (!signup.name || !signup.email || !signup.password || !signup.cpf) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    if (signup.cpf.replace(/\D/g, "").length !== 11) {
      setMensagem("CPF deve conter 11 dígitos.");
      return;
    }

    if (signup.password.length < 6) {
      setMensagem("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      setMensagem("Criando conta...");

      try {
        // Tentar criar conta no backend
        await registerUser(signup);
        setMensagem("Conta criada com sucesso!");
        await new Promise((resolve) => setTimeout(resolve, 1200));

        const loginResponse = await loginUser({
          email: signup.email,
          password: signup.password,
        });

        localStorage.setItem("token", loginResponse.token);
        
        const userData = {
          id: loginResponse.user.id || "local-user",
          name: loginResponse.user.name || signup.name,
          email: loginResponse.user.email || signup.email,
          phone: loginResponse.user.phone || "",
          avatar: loginResponse.user.avatar || null,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        
        // Redirecionar para página principal após cadastro
        router.push("/");
        return; // Importante: sair da função aqui
      } catch (backendErr: any) {
        // Verificar se é erro de rede (backend offline) ou erro de validação
        const isNetworkError = 
          backendErr.message?.includes("Failed to fetch") ||
          backendErr.message?.includes("NetworkError") ||
          backendErr.message?.includes("fetch") ||
          !backendErr.message; // Se não tem mensagem, provavelmente é erro de rede
        
        if (!isNetworkError) {
          // É um erro de validação do backend (ex: email já existe)
          throw backendErr; // Repassar o erro para o catch externo
        }
        
        // Backend offline - modo offline
        console.warn("⚠️ Backend offline, criando conta localmente");
        
        // Verificar se já existe usuário com esse email
        const existingUsers = JSON.parse(localStorage.getItem("offlineUsers") || "[]");
        const userExists = existingUsers.some((u: any) => u.email === signup.email);
        
        if (userExists) {
          throw new Error("Já existe uma conta com este email");
        }
        
        // Criar usuário offline
        const userId = `offline-${Date.now()}`;
        const newUser = {
          id: userId,
          name: signup.name,
          email: signup.email,
          cpf: signup.cpf,
          password: signup.password, // Em produção, seria hash
          phone: "",
          avatar: null,
        };
        
        existingUsers.push(newUser);
        localStorage.setItem("offlineUsers", JSON.stringify(existingUsers));
        localStorage.setItem("token", `offline-token-${userId}`);
        localStorage.setItem("userData", JSON.stringify({
          id: userId,
          name: signup.name,
          email: signup.email,
          phone: "",
          avatar: null,
        }));
        
        setMensagem("Conta criada localmente! (Modo Offline)");
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Redirecionar para página principal após cadastro
      router.push("/");
    } catch (err: any) {
      console.error("❌ Erro ao criar conta:", err);
      
      let errorMessage = "Erro desconhecido ao criar conta";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.detail) {
        errorMessage = typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail);
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setMensagem("Erro: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    // Validações
    if (!signin.email || !signin.password) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      setMensagem("Entrando...");

      try {
        // Tentar login no backend
        const response = await loginUser(signin);

        localStorage.setItem("token", response.token);
        
        const userData = {
          id: response.user.id || "local-user",
          name: response.user.name || "",
          email: response.user.email || signin.email,
          phone: response.user.phone || "",
          avatar: response.user.avatar || null,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        
        setMensagem("Login realizado com sucesso!");
        
        router.push("/");
        return; // Importante: sair da função aqui
      } catch (backendErr: any) {
        // Verificar se é erro de rede (backend offline) ou erro de validação
        const isNetworkError = 
          backendErr.message?.includes("Failed to fetch") ||
          backendErr.message?.includes("NetworkError") ||
          backendErr.message?.includes("fetch") ||
          !backendErr.message;
        
        if (!isNetworkError) {
          // É um erro de validação do backend (ex: senha incorreta)
          throw backendErr; // Repassar o erro para o catch externo
        }
        
        // Backend offline - modo offline
        console.warn("⚠️ Backend offline, fazendo login localmente");
        
        // Buscar usuário offline
        const offlineUsers = JSON.parse(localStorage.getItem("offlineUsers") || "[]");
        const user = offlineUsers.find(
          (u: any) => u.email === signin.email && u.password === signin.password
        );
        
        if (!user) {
          throw new Error("Email ou senha incorretos");
        }
        
        // Login offline bem-sucedido
        localStorage.setItem("token", `offline-token-${user.id}`);
        localStorage.setItem("userData", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          avatar: user.avatar || null,
        }));
        
        setMensagem("Login realizado! (Modo Offline)");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        router.push("/");
      }
    } catch (err: any) {
      console.error("❌ Erro ao fazer login:", err);
      setMensagem("Erro: " + (err.message || "Falha ao entrar"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex flex-col justify-center items-center min-h-screen text-white overflow-hidden">
      {/* Vídeo de fundo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover blur-[8px]"
      >
        <source src={videoSelected} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60"></div>

      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-center bg-no-repeat bg-cover md:bg-contain h-[60vh] md:h-[80vh]"
        style={{ backgroundImage: "url('/images/campo_fundo.jpeg')" }}
      />

      <div className="absolute inset-0 bg-black/20"></div>

      {/* ESCUDO */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center pointer-events-auto z-30">
        <Link
          href="/"
          className="hover:scale-105 transition-transform duration-300"
        >
          <Image
            src="/images/Logo.png"
            alt="Logo Bola Marcada"
            width={630}
            height={630}
            className="w-[250px] h-[250px] md:w-[230px] md:h-[230px] object-contain"
            priority
          />
        </Link>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div className="relative z-20 flex flex-col md:flex-row items-center justify-center w-full max-w-[1400px] px-6 gap-16 md:gap-0 pt-40 md:pt-0">
        {/* CRIAR CONTA */}
        <div className="flex flex-col w-full md:w-1/2 items-center justify-center px-4 md:px-12">
          <Title
            firstLine="CRIAR CONTA"
            align="center"
            size="42px"
            lineHeight="46px"
          />

          <div className="flex flex-col w-full md:w-[65%] space-y-4 backdrop-blur-md bg-white/10 p-6 rounded-lg shadow-lg mt-6">
            <InputField
              label="Nome"
              name="name"
              value={signup.name}
              onChange={handleSignupChange}
            />
            <InputField
              label="E-mail"
              name="email"
              type="email"
              value={signup.email}
              onChange={handleSignupChange}
            />
            <InputField
              label="Senha"
              name="password"
              type="password"
              value={signup.password}
              onChange={handleSignupChange}
            />
            <InputField
              label="CPF"
              name="cpf"
              value={signup.cpf}
              onChange={handleSignupChange}
            />

            <PrimaryButton
              label={loading ? "Criando..." : "CRIAR CONTA"}
              onClick={handleSignup}
              color="#D9D9D9"
              hoverColor="#C5C5C5"
              textColor="#1C1A0D"
            />
          </div>
        </div>

        {/* ENTRAR */}
        <div className="flex flex-col w-full md:w-1/2 items-center justify-center px-4 md:px-12">
          <Title
            firstLine="ENTRAR"
            align="center"
            size="42px"
            lineHeight="46px"
          />

          <div className="flex flex-col w-full md:w-[65%] space-y-4 backdrop-blur-md bg-white/10 p-6 rounded-lg shadow-lg mt-6">
            <InputField
              label="E-mail"
              name="email"
              type="email"
              value={signin.email}
              onChange={handleSigninChange}
            />
            <InputField
              label="Senha"
              name="password"
              type="password"
              value={signin.password}
              onChange={handleSigninChange}
            />

            <PrimaryButton
              label={loading ? "Entrando..." : "ENTRAR"}
              onClick={handleSignin}
              color="#D9D9D9"
              hoverColor="#C5C5C5"
              textColor="#1C1A0D"
            />
          </div>
        </div>
      </div>

      {/* MENSAGEM DE SUCESSO/ERRO */}
      {mensagem && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg text-white font-semibold text-center z-[9999] bg-black/70 backdrop-blur-sm shadow-lg max-w-[90vw]">
          <p
            className={
              mensagem.includes("sucesso") ? "text-green-400" : "text-red-400"
            }
          >
            {mensagem}
          </p>
        </div>
      )}
    </section>
  );
}
