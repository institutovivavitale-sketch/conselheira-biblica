"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [acessoLiberado, setAcessoLiberado] = useState(false);

  const [etapa, setEtapa] = useState("categoria");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);

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

  const verificarAcesso = async (emailUsuario) => {
    setCarregando(true);

    const emailNormalizado = emailUsuario.toLowerCase().trim();

    const { data, error } = await supabase
      .from("usuarios_liberados")
      .select("*")
      .eq("email", emailNormalizado)
      .eq("ativo", true)
      .maybeSingle();

    if (error) {
      console.log(error);
      setAcessoLiberado(false);
    } else {
      setAcessoLiberado(!!data);
    }

    setCarregando(false);
  };

  const login = async () => {
    if (!email) return alert("Digite seu email");

    const emailNormalizado = email.toLowerCase().trim();

    setUser({
      id: emailNormalizado,
      email: emailNormalizado,
    });

    await verificarAcesso(emailNormalizado);
  };

  const sair = () => {
    setUser(null);
    setEmail("");
    setAcessoLiberado(false);
  };

  const responderPergunta = async (resposta) => {
    const novas = [...respostas, resposta];
    setRespostas(novas);

    if (perguntaAtual + 1 < categorias[categoriaSelecionada].perguntas.length) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      await supabase.from("diagnosticos").insert([{
        email: user.email,
        categoria: categoriaSelecionada,
        respostas: novas
      }]);

      setEtapa("final");
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-[#171717] rounded-3xl p-8 border border-white/10 shadow-2xl text-center">

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
              className="w-full p-4 rounded-xl bg-[#0f0f0f] text-white border border-white/20 outline-none focus:border-[#d6b56d]"
            />
          </div>

          <button
            onClick={login}
            className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:scale-[1.02]"
          >
            Receber acesso
          </button>

        </div>
      </main>
    );
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Verificando acesso...</p>
      </main>
    );
  }

  if (!acessoLiberado) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center text-center px-6">

        <div className="bg-[#171717] p-8 rounded-3xl border border-white/10">

          <h1 className="text-3xl mb-4">Acesso não liberado</h1>

          <p className="text-gray-400 mb-6">
            Para acessar o Oráculo Bíblico, adquira sua assinatura.
          </p>

          <a
            href="https://checkout.payt.com.br/02936c4fc57ed16c8e45e392086f5b98"
            target="_blank"
            className="bg-white text-black px-6 py-4 rounded-xl font-semibold inline-block"
          >
            Assinar agora
          </a>

          <button
            onClick={sair}
            className="block mx-auto mt-6 text-sm text-gray-400 underline"
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

        <h1 className="text-2xl mb-6 text-center">
          Qual é sua maior dor hoje?
        </h1>

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
          className="p-4 text-white bg-[#0f0f0f] border border-white/20 w-full max-w-sm rounded-xl"
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