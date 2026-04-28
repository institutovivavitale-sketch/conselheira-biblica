"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mensagem, setMensagem] = useState("");
  const [respostas, setRespostas] = useState([]);
  const router = useRouter();

  const enviarMensagem = () => {
    if (!mensagem) return;

    const novaPergunta = {
      tipo: "pergunta",
      texto: mensagem,
    };

    const respostaFake = {
      tipo: "resposta",
      texto:
        "Entenda isso primeiro: você não precisa agir no impulso.\n\nO que a Bíblia mostra: existe sabedoria em agir com calma e direção.\n\nO que fazer agora:\n1. Pare de reagir no calor da emoção\n2. Observe o comportamento dele\n3. Ajuste sua postura\n\nCuidado: insistir ou pressionar só afasta mais.\n\nFaça isso hoje: fique em silêncio estratégico e observe.",
    };

    setRespostas([...respostas, novaPergunta, respostaFake]);
    setMensagem("");
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center px-4 py-10">

      <h1 className="text-2xl font-semibold mb-2 text-center">
        Sua Conselheira Bíblica
      </h1>

      <p className="text-gray-400 text-center mb-6 max-w-md">
        Receba direção clara, prática e baseada na Palavra.
      </p>

      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-4 h-[420px] overflow-y-auto mb-4 shadow-lg">
        {respostas.length === 0 && (
          <p className="text-gray-500 text-sm text-center">
            Digite sua dúvida para começar
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

      <div className="w-full max-w-md flex gap-2">
        <input
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite sua dúvida..."
          className="flex-1 p-3 rounded-xl bg-[#1c1c1c] border border-gray-700 text-white outline-none text-sm"
        />

        <button
          onClick={enviarMensagem}
          className="bg-white text-black px-4 rounded-xl font-medium"
        >
          Enviar
        </button>
      </div>

      <button
        onClick={() => router.push("/analise")}
        className="mt-8 bg-white text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
      >
        Quero uma análise individual sobre o meu relacionamento
      </button>

    </main>
  );
}