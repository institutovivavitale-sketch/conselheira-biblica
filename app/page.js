"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mensagem, setMensagem] = useState("");
  const [respostas, setRespostas] = useState([]);
  const router = useRouter();

  const perguntasRapidas = [
    "Ele está distante de mim",
    "Meu casamento esfriou",
    "Ele me traiu",
    "Não sei como agir com ele"
  ];

  const enviarMensagem = (texto) => {
    const msg = texto || mensagem;
    if (!msg) return;

    const novaPergunta = {
      tipo: "pergunta",
      texto: msg,
    };

    let respostaTexto =
      "Entenda isso primeiro: você não precisa agir no impulso.\n\nO que a Bíblia mostra: existe sabedoria em agir com calma.\n\nO que fazer agora:\n1. Pare de reagir emocionalmente\n2. Observe o comportamento dele\n3. Ajuste sua postura\n\nCuidado: insistir só afasta.\n\nFaça isso hoje: fique em silêncio e observe.";

    // alerta inteligente
    if (respostas.length >= 4) {
      respostaTexto =
        "Eu posso continuar te respondendo, mas nesse momento isso não vai mudar sua situação.\n\nO que vai gerar resultado é aplicar o que já foi direcionado.\n\nEscolha uma das orientações anteriores e coloque em prática hoje.";
    }

    const resposta = {
      tipo: "resposta",
      texto: respostaTexto,
    };

    setRespostas([...respostas, novaPergunta, resposta]);
    setMensagem("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white flex flex-col items-center px-4 py-10">

      <h1 className="text-3xl font-semibold mb-2 text-center">
        Oráculo Bíblico
      </h1>

      <p className="text-gray-400 text-center mb-6 max-w-md">
        Direção clara para o seu relacionamento, baseada na Palavra.
      </p>

      {/* Sugestões */}
      <div className="flex flex-wrap gap-2 mb-4 max-w-md justify-center">
        {perguntasRapidas.map((p, i) => (
          <button
            key={i}
            onClick={() => enviarMensagem(p)}
            className="bg-[#2a2a2a] text-sm px-3 py-2 rounded-full hover:bg-[#3a3a3a]"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-4 h-[420px] overflow-y-auto mb-4 shadow-xl">
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
              className={`inline-block px-4 py-3 rounded-xl max-w-[80%] whitespace-pre-line text-sm ${
                item.tipo === "pergunta"
                  ? "bg-white text-black"
                  : "bg-[#2a2a2a]"
              }`}
            >
              {item.texto}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
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

      {/* Botão premium */}
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