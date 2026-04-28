export default function Analise() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center px-6 py-10">

      <h1 className="text-2xl font-semibold mb-4 text-center">
        Análise de Caso Individual
      </h1>

      <p className="text-gray-400 text-center max-w-md mb-8">
        Aqui você vai entender por que conselhos genéricos não resolvem e como ter uma direção clara para o seu caso.
      </p>

      {/* Espaço do vídeo */}
      <div className="w-full max-w-md h-[220px] bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-6">
        <p className="text-gray-500 text-sm">
          Seu vídeo aparecerá aqui
        </p>
      </div>

      {/* Copy */}
      <div className="max-w-md text-gray-300 text-sm text-center mb-6 space-y-3">
        <p>
          Você pode continuar tentando sozinha…
        </p>

        <p>
          Mas sem clareza, é muito fácil reforçar exatamente o que está afastando ele.
        </p>

        <p>
          Na análise de caso, eu olho a sua situação de forma profunda e te mostro exatamente o que fazer — sem achismo, sem desespero.
        </p>
      </div>

      {/* Botão */}
      <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition">
        Quero minha análise de caso
      </button>

    </main>
  );
}