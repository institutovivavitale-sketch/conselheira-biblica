"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [respostas, setRespostas] = useState([]);

  // 🔐 LISTA DE EMAILS LIBERADOS
  const emailsPermitidos = [
    "seuemail@gmail.com"
  ];

  const acessoLiberado = user && emailsPermitidos.includes(user.email);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCarregando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fazerLogin = async () => {
    if (!email) return alert("Digite seu email");

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://conselheira-biblica.vercel.app",
      },
    });

    alert("Verifique seu email para acessar");
  };

  const sair = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const enviarMensagem = (texto) => {
    const msg = texto || mensagem;
    if (!msg) return;

    const novaPergunta = { tipo: "pergunta", texto: msg };

    let respostaTexto =
      "Você não precisa agir no impulso.\n\nO que a Bíblia mostra: a mulher sábia edifica a sua casa.\n\nO que fazer agora:\n1. Observe mais\n2. Fale menos\n3. Ajuste sua postura\n\nCuidado: insistir pode afastar.\n\nAja com sabedoria hoje.";

    if (respostas.length >= 6) {
      respostaTexto =
        "Você já recebeu direção suficiente.\n\nAgora o que vai mudar sua realidade é a sua ação.\n\nAplique o que foi orientado.";
    }

    const resposta = { tipo: "resposta", texto: respostaTexto };

    setRespostas([...respostas, novaPergunta, resposta]);
    setMensagem("");
  };

  // ⏳ loading
  if (carregando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando...
      </main>
    );
  }

  // ❌ não logada
  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
        <h1 className="text-2xl mb-4">Oráculo Bíblico</h1>

        <input
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded text-black mb-4 w-full max-w-sm"
        />

        <button
          onClick={fazerLogin}
          className="bg-white text-black px-6 py-3 rounded"
        >
          Entrar
        </button>
      </main>
    );
  }

  // ⚠️ BLOQUEADO
  if (!acessoLiberado) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">

        <h1 className="text-2xl mb-4">Oráculo Bíblico</h1>

        <p className="text-gray-400 mb-6 max-w-sm">
          Seu acesso ainda não foi liberado.
          <br /><br />
          Para acessar o Oráculo Bíblico, adquira sua assinatura.
        </p>

        <a
          href="#"
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
        >
          Assinar agora
        </a>

        <button
          onClick={sair}
          className="mt-6 text-sm text-gray-500 underline"
        >
          Sair
        </button>

      </main>
    );
  }

  // ✅ LIBERADO
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">

      <h1 className="text-3xl mb-2">Oráculo Bíblico</h1>

      <p className="text-gray-400 mb-6 text-center max-w-md">
        Direção clara para o seu relacionamento.
      </p>

      <div className="w-full max-w-md bg-[#1a1a1a] p-4 rounded-xl h-[400px] overflow-y-auto mb-4">
        {respostas.map((item, i) => (
          <div key={i} className="mb-3">
            <p>{item.texto}</p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md flex gap-2">
        <input
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite sua dúvida..."
          className="flex-1 p-3 rounded bg-[#1c1c1c]"
        />

        <button
          onClick={() => enviarMensagem()}
          className="bg-white text-black px-4 rounded"
        >
          Enviar
        </button>
      </div>

      <button
        onClick={() => router.push("/analise")}
        className="mt-8 bg-white text-black px-6 py-4 rounded-xl text-center"
      >
        Quero uma análise individual
        <br />
        sobre o meu relacionamento
      </button>

    </main>
  );
}