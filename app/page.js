"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {

  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [etapa, setEtapa] = useState("categoria");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);

  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState([]);

  const emailsPermitidos = [
    "seuemail@gmail.com"
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
        "Quem costuma iniciar?",
        "Vocês resolvem ou acumulam?",
        "Há ofensas ou desrespeito?",
        "Ficam dias sem se falar?"
      ]
    },
    distanciamento: {
      titulo: "Distanciamento",
      perguntas: [
        "Ele está frio há quanto tempo?",
        "Vocês ainda conversam normalmente?",
        "Há carinho físico?",
        "Vocês dormem juntos?",
        "Você sente rejeição?"
      ]
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCarregando(false);
    });
  }, []);

  const acessoLiberado = user && emailsPermitidos.includes(user.email);

  const responderPergunta = async (resposta) => {
    const novasRespostas = [...respostas, resposta];
    setRespostas(novasRespostas);

    if (perguntaAtual + 1 < categorias[categoriaSelecionada].perguntas.length) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      await salvarDiagnostico(novasRespostas);
      setEtapa("chat");
    }
  };

  const salvarDiagnostico = async (respostasFinal) => {
    await supabase.from("diagnosticos").insert([
      {
        user_id: user.id,
        email: user.email,
        categoria: categoriaSelecionada,
        respostas: respostasFinal
      }
    ]);
  };

  const enviarMensagem = () => {
    if (!mensagem) return;

    const nova = { tipo: "pergunta", texto: mensagem };

    const resposta = {
      tipo: "resposta",
      texto:
        "Baseado no que você me contou, existe um padrão emocional acontecendo.\n\nVocê precisa parar de agir no impulso e assumir uma postura estratégica.\n\nA mulher sábia edifica a sua casa."
    };

    setChat([...chat, nova, resposta]);
    setMensagem("");
  };

  if (carregando) return <div className="text-white">Carregando...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Faça login primeiro</p>
      </div>
    );
  }

  if (!acessoLiberado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-6">
        <h1 className="text-2xl mb-4">Oráculo Bíblico</h1>

        <p className="text-gray-400 mb-6">
          Seu acesso ainda não foi liberado.
        </p>

        <a href="#" className="bg-white text-black px-6 py-3 rounded">
          Assinar agora
        </a>
      </div>
    );
  }

  if (etapa === "categoria") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 px-6">

        <h1 className="text-2xl mb-4">Qual é sua maior dor hoje?</h1>

        {Object.keys(categorias).map((key) => (
          <button
            key={key}
            onClick={() => {
              setCategoriaSelecionada(key);
              setEtapa("perguntas");
            }}
            className="bg-[#1f1f1f] px-6 py-3 rounded w-full max-w-sm"
          >
            {categorias[key].titulo}
          </button>
        ))}

      </div>
    );
  }

  if (etapa === "perguntas") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">

        <h1 className="mb-6 text-xl">
          {categorias[categoriaSelecionada].perguntas[perguntaAtual]}
        </h1>

        <input
          className="p-3 text-black mb-4 w-full max-w-sm"
          placeholder="Digite sua resposta"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              responderPergunta(e.target.value);
              e.target.value = "";
            }
          }}
        />

      </div>
    );
  }

  if (etapa === "chat") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-6">

        <h1 className="text-2xl mb-4">Oráculo Bíblico</h1>

        <div className="w-full max-w-md h-[400px] overflow-y-auto bg-[#1a1a1a] p-4 mb-4 rounded">

          {chat.map((msg, i) => (
            <p key={i} className="mb-2">{msg.texto}</p>
          ))}

        </div>

        <div className="flex gap-2 w-full max-w-md">
          <input
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="flex-1 p-3 text-black"
          />

          <button onClick={enviarMensagem} className="bg-white text-black px-4">
            Enviar
          </button>
        </div>

      </div>
    );
  }

}