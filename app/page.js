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

  const perguntasRapidas = [
    "Ele está frio comigo",
    "Ele saiu de casa",
    "Ele quer se separar",
    "Descobri uma traição",
    "Ele está com outra",
    "Ele não me procura mais",
    "Brigamos demais",
    "Não sei se devo falar ou me calar",
    "Minha sogra interfere",
    "Ele não me defende",
    "Quero restaurar meu casamento",
    "Não sei se ainda existe esperança",
  ];

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
    if (!email) {
      alert("Digite seu email.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://conselheira-biblica.vercel.app",
      },
    });

    if (error) {
      alert("Erro ao enviar link de acesso. Tente novamente.");
      return;
    }

    alert("Enviamos um link de acesso para seu email.");
  };

  const sair = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const enviarMensagem = (texto) => {
    const msg = texto || mensagem;
    if (!msg) return;

    const novaPergunta = {
      tipo: "pergunta",
      texto: msg,
    };

    let respostaTexto =
      "Entenda isso primeiro: você não precisa agir no impulso.\n\nO que está acontecendo: quando a dor aperta, a vontade é tentar resolver tudo imediatamente. Mas nem toda atitude tomada na ansiedade produz restauração.\n\nO que a Bíblia mostra: a mulher sábia edifica a sua casa.\n\nO que fazer agora:\n1. Pare de tentar arrancar uma resposta dele hoje\n2. Observe mais e reaja menos\n3. Escolha uma postura firme, calma e coerente\n\nCuidado: insistir, cobrar ou se humilhar pode afastar ainda mais.\n\nFaça isso hoje: fique em silêncio estratégico e cuide da sua presença.";

    if (respostas.length >= 6) {
      respostaTexto =
        "Eu percebo que você está buscando muitas respostas seguidas.\n\nMas nesse momento, mais perguntas não vão resolver o que só a sua postura pode começar a mudar.\n\nEscolha uma orientação que você já recebeu e aplique hoje. Depois volte com mais clareza sobre o que aconteceu.";
    }

    const resposta = {
      tipo: "resposta",
      texto: respostaTexto,
    };

    setRespostas([...respostas, novaPergunta, resposta]);
    setMensagem("");
  };

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md bg-[#171717] border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-3">
            Acesso exclusivo
          </p>

          <h1 className="text-3xl font-semibold mb-3">
            Oráculo Bíblico
          </h1>

          <p className="text-gray-400 text-sm mb-8">
            Entre com seu email para acessar sua direção bíblica para casamento, família e postura.
          </p>

          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#0f0f0f] border border-gray-700 text-white outline-none text-sm mb-3"
          />

          <button
            onClick={fazerLogin}
            className="w-full bg-white text-black px-6 py-4 rounded-xl font-semibold shadow-xl hover:scale-105 transition"
          >
            Receber link de acesso
          </button>

          <p className="text-gray-500 text-xs mt-5">
            O acesso é liberado por email. Verifique sua caixa de entrada.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex justify-between items-center mb-5">
        <div>
          <h1 className="text-3xl font-semibold">
            Oráculo Bíblico
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Acesso ativo
          </p>
        </div>

        <button
          onClick={sair}
          className="text-xs text-gray-400 underline"
        >
          Sair
        </button>
      </div>

      <p className="text-gray-400 text-center mb-5 max-w-md">
        Direção clara para o seu relacionamento, baseada na Palavra.
      </p>

      <div className="flex flex-wrap gap-2 mb-4 max-w-md justify-center">
        {perguntasRapidas.map((p, i) => (
          <button
            key={i}
            onClick={() => enviarMensagem(p)}
            className="bg-[#2a2a2a] text-sm px-3 py-2 rounded-full hover:bg-[#3a3a3a] transition"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-4 h-[420px] overflow-y-auto mb-4 shadow-xl border border-white/5">
        {respostas.length === 0 && (
          <p className="text-gray-500 text-sm text-center">
            Digite sua dúvida ou escolha uma opção acima
          </p>
        )}

        {respostas.map((item, index) => (
          <div
            key={index}
            className={`mb-3 ${
              item.tipo === "pergunta" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-3 rounded-xl max-w-[85%] whitespace-pre-line text-sm leading-relaxed ${
                item.tipo === "pergunta"
                  ? "bg-white text-black"
                  : "bg-[#2a2a2a] text-gray-100"
              }`}
            >
              {item.texto}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md flex gap-2">
        <input
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite sua dúvida..."
          className="flex-1 p-3 rounded-xl bg-[#1c1c1c] border border-gray-700 text-white outline-none text-sm"
        />

        <button
          onClick={() => enviarMensagem()}
          className="bg-white text-black px-4 rounded-xl font-medium"
        >
          Enviar
        </button>
      </div>

      <button
        onClick={() => router.push("/analise")}
        className="mt-8 bg-white text-black px-6 py-4 rounded-xl font-semibold shadow-xl hover:scale-105 transition text-center leading-tight"
      >
        <span className="block text-base">
          Quero uma análise individual
        </span>
        <span className="block text-sm opacity-80">
          sobre o meu relacionamento
        </span>
      </button>
    </main>
  );
}