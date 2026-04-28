"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [email, setEmail] = useState("");

  const [etapa, setEtapa] = useState("categoria");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);

  const emailsPermitidos = [
    "seuemail@gmail.com"
    "investvilkn@gmail.com"
  ];

  const categorias = {
    traicao: {
      titulo: "Traição",
      perguntas: [
        "Quando você descobriu a traição?",
        "Ele assumiu ou você descobriu?",
        "Ainda existe contato entre eles?",
        "Vocês continuam juntos?",
        "Isso já aconteceu antes?"
      ]
    },
    brigas: {
      titulo: "Brigas",
      perguntas: [
        "As brigas são frequentes?",
        "Quem inicia?",
        "Vocês resolvem ou acumulam?",
        "Há desrespeito?",
        "Ficam dias sem se falar?"
      ]
    },
    distanciamento: {
      titulo: "Distanciamento",
      perguntas: [
        "Há quanto tempo ele está distante?",
        "Vocês ainda conversam?",
        "Existe carinho físico?",
        "Dormem juntos?",
        "Você se sente rejeitada?"
      ]
    }
  };

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

  const acessoLiberado = user && emailsPermitidos.includes(user.email);

  const login = async () => {
    if (!email) return alert("Digite seu email");

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://conselheira-biblica.vercel.app",
      },
    });

    alert("Verifique seu email para acessar.");
  };

  const sair = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmail("");
  };

  const responderPergunta = async (resposta) => {
    const novas = [...respostas, resposta];
    setRespostas(novas);

    if (perguntaAtual + 1 < categorias[categoriaSelecionada].perguntas.length) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      await supabase.from("diagnosticos").insert([{
        user_id: user.id,
        email: user.email,
        categoria: categoriaSelecionada,
        respostas: novas
      }]);

      setEtapa("final");
    }
  };

  if (carregando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-[#171717] rounded-3xl p-8 text-center border border-white/10 shadow-2xl">
          <h1 className="text-3xl mb-4">Oráculo Bíblico</h1>

          <p className="text-gray-400 mb-8">
            Receba direção clara para o seu relacionamento
          </p>

          <div className="text-left mb-4">
            <label className="text-xs text-gray-400 mb-2 block">
              Seu email
            </label>

            <input
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#0f0f0f] text-white border border-white/20 outline-none focus:border-[#d6b56d] transition"
            />
          </div>

          <button
            onClick={login}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            Receber acesso
          </button>
        </div>
      </main>
    );
  }

  if (!acessoLiberado) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 text-center">
        <div className="max-w-md bg-[#171717] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl mb-4">Acesso não liberado</h1>

          <p className="text-gray-400 mb-6">
            Para acessar o Oráculo Bíblico, adquira sua assinatura.
          </p>

          <a
            href="https://checkout.payt.com.br/02936c4fc57ed16c8e45e392086f5b98"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black px-6 py-4 rounded-xl font-semibold"
          >
            Assinar agora
          </a>

          <button
            onClick={sair}
            className="block mx-auto mt-6 text-sm text-gray-500 underline"
          >
            Entrar com outro email
          </button>
        </div>
      </main>
    );
  }

  if (etapa === "categoria") {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-2xl mb-6 text-center">Qual é sua maior dor hoje?</h1>

        {Object.keys(categorias).map((key) => (
          <button
            key={key}
            onClick={() => {
              setCategoriaSelecionada(key);
              setEtapa("perguntas");
            }}
            className="bg-[#1f1f1f] px-6 py-4 rounded-xl w-full max-w-sm border border-white/10"
          >
            {categorias[key].titulo}
          </button>
        ))}
      </main>
    );
  }

  if (etapa === "perguntas") {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-6 text-xl">
          {categorias[categoriaSelecionada].perguntas[perguntaAtual]}
        </h1>

        <input
          className="p-4 text-white bg-[#0f0f0f] border border-white/20 w-full max-w-sm rounded-xl outline-none focus:border-[#d6b56d]"
          placeholder="Digite sua resposta"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              responderPergunta(e.target.value);
              e.target.value = "";
            }
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-2xl mb-4">Diagnóstico concluído</h1>
        <p className="text-gray-400">
          Agora vamos te direcionar da forma correta.
        </p>
      </div>
    </main>
  );
}