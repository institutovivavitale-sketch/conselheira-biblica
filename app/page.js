"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");

  const [etapa, setEtapa] = useState("login");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostaAtual, setRespostaAtual] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [chat, setChat] = useState([]);

  const palavraDoDia = {
    versiculo: "A mulher sábia edifica a sua casa. Provérbios 14:1",
    reflexao:
      "Hoje, antes de tentar mudar o outro, observe a postura que você está construindo dentro do seu lar. Uma mulher sábia não age pelo desespero, pela cobrança ou pela ansiedade. Ela aprende a se posicionar com firmeza, doçura e direção.",
    acao:
      "Ação de hoje: antes de responder no impulso, respire, ore e escolha uma atitude que edifique, não que aumente a guerra."
  };

  const categorias = {
    traicao: {
      titulo: "Traição e Infidelidade",
      perguntas: [
        "Quando você descobriu a traição?",
        "Ele confessou ou você descobriu sozinha?",
        "Ainda existe contato entre eles?",
        "Vocês continuam morando juntos?",
        "Isso já aconteceu antes?"
      ]
    },
    distanciamento: {
      titulo: "Distanciamento e Falta de Intimidade",
      perguntas: [
        "Há quanto tempo ele está distante?",
        "Vocês ainda conversam normalmente?",
        "Existe carinho físico entre vocês?",
        "Vocês ainda dormem juntos?",
        "Você sente que ele evita sua presença?"
      ]
    },
    brigas: {
      titulo: "Brigas e Discussões",
      perguntas: [
        "As brigas acontecem com que frequência?",
        "Quem costuma iniciar as discussões?",
        "Vocês conseguem resolver ou só acumulam mágoas?",
        "Há ofensas, gritos ou ameaças?",
        "Depois das brigas, vocês ficam dias sem se falar?"
      ]
    },
    separacao: {
      titulo: "Marido Fora de Casa",
      perguntas: [
        "Ele já saiu de casa há quanto tempo?",
        "Vocês ainda mantêm contato?",
        "Ele demonstra abertura ou está totalmente fechado?",
        "Existe outra pessoa envolvida?",
        "Você tem procurado ele com frequência?"
      ]
    },
    terceiros: {
      titulo: "Parentes e Terceiros",
      perguntas: [
        "Quem está interferindo no relacionamento de vocês?",
        "Ele costuma defender você diante dessas pessoas?",
        "Essa interferência vem da família dele, da sua ou de terceiros?",
        "Isso já causou brigas entre vocês?",
        "Você sente que perdeu seu lugar de esposa?"
      ]
    },
    sexualidade: {
      titulo: "Vida Sexual",
      perguntas: [
        "Há quanto tempo a vida sexual esfriou?",
        "Ele te procura ou você sente que só você tenta?",
        "Existe mágoa acumulada entre vocês?",
        "Você se sente desejada por ele?",
        "Esse assunto gera cobrança ou constrangimento?"
      ]
    },
    familia: {
      titulo: "Família e Filhos",
      perguntas: [
        "Vocês têm filhos?",
        "Os filhos estão sendo afetados pela crise?",
        "Vocês discordam sobre criação ou rotina dos filhos?",
        "Você sente que carrega a família sozinha?",
        "Ele participa emocionalmente da vida familiar?"
      ]
    },
    financeiro: {
      titulo: "Vida Financeira",
      perguntas: [
        "O dinheiro tem sido motivo de briga?",
        "Vocês conversam com clareza sobre finanças?",
        "Você sente sobrecarga financeira?",
        "Ele assume responsabilidade financeira?",
        "Existe desorganização ou dívida afetando o casamento?"
      ]
    },
    lar: {
      titulo: "Rotina e Cuidados do Lar",
      perguntas: [
        "Você sente que carrega a casa sozinha?",
        "Ele reconhece seu esforço?",
        "A rotina da casa gera brigas?",
        "Você sente que perdeu sua leveza dentro do lar?",
        "Você cuida mais da casa do que de você?"
      ]
    }
  };

  const respostasPorCategoria = {
    traicao:
      "Pelo que você respondeu no diagnóstico, o que você está vivendo não é apenas dor. É uma quebra de confiança que mexe com a sua identidade como mulher, esposa e companheira.\n\nMas existe um ponto que você precisa enxergar com clareza: a forma como você reage agora pode aprofundar ainda mais essa ferida ou começar a mudar a direção da história.\n\nQuando uma mulher entra em desespero, cobrança, perseguição ou medo de perder, ela começa a perder o próprio posicionamento. E quando ela perde o posicionamento, muitas vezes o homem se afasta ainda mais.\n\nO que você precisa fazer agora:\n\n1. Pare de reagir no impulso.\n2. Recupere seu controle emocional antes de qualquer conversa importante.\n3. Observe os fatos com clareza, sem se humilhar por respostas.\n\nCuidado: tentar resolver tudo hoje, pressionar, investigar sem parar ou exigir uma definição imediata pode piorar o cenário.\n\nVocê não precisa agir rápido. Você precisa agir certo.\n\nE isso começa com postura, não com desespero.",

    distanciamento:
      "Pelo que você respondeu, o que está acontecendo não parece ser apenas frieza. Parece uma desconexão emocional que foi se formando aos poucos.\n\nE aqui muitas mulheres erram: tentam puxar proximidade através de cobrança, carência, DR constante ou insistência.\n\nMas proximidade não se força. Proximidade se constrói.\n\nQuando o homem sente pressão, ele tende a se fechar ainda mais. Por isso, sua próxima atitude precisa ser menos ansiedade e mais presença estratégica.\n\nO que você precisa entender agora:\n\n1. Você não reconecta cobrando atenção.\n2. Sua energia emocional influencia a forma como ele te percebe.\n3. Antes de tentar se aproximar dele, você precisa voltar para si.\n\nCuidado: pedir amor, pedir carinho ou tentar conversar toda hora pode aumentar a distância se ele já estiver fechado.\n\nO caminho agora não é correr atrás. É reposicionar sua presença.",

    brigas:
      "Pelo que você respondeu, o problema não parece ser apenas a briga em si, mas o padrão que se repete dentro dela.\n\nQuando um relacionamento entra em ciclo de discussão, ele deixa de ser sobre resolver e passa a ser sobre vencer. E quando os dois tentam vencer, o casamento começa a perder.\n\nVocê precisa quebrar o ciclo, não alimentar a próxima discussão.\n\nO que fazer agora:\n\n1. Pare de responder no calor da emoção.\n2. Não entre na mesma energia que sempre termina em briga.\n3. Escolha momentos certos para se posicionar, não momentos carregados.\n\nCuidado: explicar demais, se justificar demais ou tentar provar que está certa pode manter vocês presos no mesmo padrão.\n\nNem toda batalha precisa ser respondida. Algumas precisam ser interrompidas com sabedoria.",

    separacao:
      "Pelo que você respondeu, o fato dele estar fora de casa exige muita sabedoria. Isso não significa necessariamente que tudo acabou, mas também não significa que você pode agir de qualquer forma.\n\nEsse é um momento em que muitas mulheres perdem o controle emocional e, sem perceber, acabam afastando ainda mais o homem.\n\nAgora não é sobre correr atrás. É sobre reconstruir sua presença de forma estratégica.\n\nO que você precisa entender:\n\n1. Desespero fecha portas.\n2. Pressão aumenta resistência.\n3. Postura abre possibilidades.\n\nCuidado: mandar mensagem toda hora, pedir explicações, fazer cobranças ou tentar forçar uma reaproximação pode enfraquecer ainda mais sua posição.\n\nSilêncio com postura pode ser muito mais forte do que insistência com descontrole.",

    terceiros:
      "Pelo que você respondeu, existe interferência externa afetando o espaço do casal. E quando terceiros entram demais no relacionamento, geralmente o problema não é só a presença deles, mas a falta de limite dentro da relação.\n\nSe você atacar diretamente essas pessoas, existe uma grande chance dele defendê-las e se colocar contra você.\n\nPor isso, sua postura precisa ser mais inteligente do que reativa.\n\nO que fazer agora:\n\n1. Pare de disputar espaço emocional com terceiros.\n2. Fortaleça sua posição como mulher dentro da relação.\n3. Observe onde ele está permitindo interferência demais.\n\nCuidado: brigar com sogra, família, amigos ou outras pessoas pode te colocar no lugar de vilã.\n\nVocê não precisa vencer terceiros. Você precisa se posicionar melhor dentro do seu lugar.",

    sexualidade:
      "Pelo que você respondeu, a vida sexual de vocês parece carregar mais do que falta de desejo. Muitas vezes, quando a intimidade esfria, existe mágoa, distância emocional, rotina pesada ou insegurança escondida por trás.\n\nSexo dentro do casamento não é só corpo. É conexão, presença, admiração e segurança emocional.\n\nMas também é importante entender: cobrança mata o desejo. Pressão mata o clima. Ressentimento fecha o corpo.\n\nO que fazer agora:\n\n1. Observe se existe mágoa não resolvida entre vocês.\n2. Pare de tratar intimidade como prova de amor.\n3. Comece a reconstruir leveza, toque e presença sem cobrança.\n\nCuidado: transformar sexo em disputa, chantagem ou cobrança pode aumentar ainda mais a distância.\n\nA intimidade volta melhor quando o ambiente emocional começa a ficar seguro de novo.",

    familia:
      "Pelo que você respondeu, a crise não está afetando apenas o casal. Ela também toca a estrutura da família e, possivelmente, os filhos.\n\nQuando a mulher sente que carrega tudo sozinha, ela pode começar a funcionar no modo sobrevivência: resolve tudo, segura tudo, sente tudo e ainda tenta salvar o casamento.\n\nMas uma casa não se edifica apenas com esforço. Ela precisa de ordem, presença e direção.\n\nO que fazer agora:\n\n1. Pare de carregar sozinha o que deveria ser responsabilidade compartilhada.\n2. Observe onde você virou mãe do relacionamento, e não esposa.\n3. Proteja emocionalmente seus filhos sem transformar eles em confidentes da dor do casal.\n\nCuidado: envolver filhos, desabafar com eles ou usar a família como campo de guerra pode gerar marcas profundas.\n\nSeu lar precisa de paz, mas essa paz começa com posicionamento.",

    financeiro:
      "Pelo que você respondeu, a vida financeira está mexendo com a segurança do relacionamento. E dinheiro, dentro do casamento, raramente é só dinheiro. Ele revela responsabilidade, parceria, medo, controle e sobrecarga.\n\nQuando não existe clareza financeira, a mulher pode se sentir desamparada, sobrecarregada ou até sozinha dentro da própria casa.\n\nO que fazer agora:\n\n1. Pare de discutir dinheiro apenas no momento da crise.\n2. Busque clareza antes de cobrança.\n3. Observe se existe desorganização, omissão ou falta de responsabilidade.\n\nCuidado: brigar por dinheiro sem uma conversa estruturada pode transformar o problema financeiro em guerra emocional.\n\nO primeiro passo não é acusar. É organizar a realidade e se posicionar com firmeza.",

    lar:
      "Pelo que você respondeu, parece que o peso da rotina e dos cuidados do lar está consumindo sua leveza.\n\nMuitas mulheres entram em um ciclo silencioso: cuidam da casa, dos filhos, da rotina, do marido, dos problemas… e quando percebem, deixaram de cuidar de si.\n\nMas uma mulher esgotada não consegue edificar com alegria. Ela apenas sobrevive dentro da própria casa.\n\nO que fazer agora:\n\n1. Observe onde você está carregando mais do que deveria.\n2. Pare de se abandonar em nome de manter tudo funcionando.\n3. Reorganize sua rotina com espaço para você também existir.\n\nCuidado: fazer tudo sozinha e depois explodir de mágoa cria um ciclo de ressentimento.\n\nCuidar do lar é importante. Mas você também faz parte desse lar."
  };

  const login = () => {
    if (!email.trim()) return alert("Digite seu email");

    setUser({
      id: email.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
    });

    setEtapa("categoria");
  };

  const responderPergunta = async () => {
    if (!respostaAtual.trim()) return;

    if (respostaAtual.trim().length < 3) {
      alert("Escreva uma resposta um pouco mais clara para continuar.");
      return;
    }

    const novas = [...respostas, respostaAtual.trim()];
    setRespostas(novas);
    setRespostaAtual("");

    if (perguntaAtual + 1 < categorias[categoriaSelecionada].perguntas.length) {
      setPerguntaAtual(perguntaAtual + 1);
    } else {
      await supabase.from("diagnosticos").insert([{
        email: user.email,
        categoria: categoriaSelecionada,
        respostas: novas
      }]);

      setEtapa("chat");
    }
  };

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;

    const pergunta = {
      tipo: "pergunta",
      texto: mensagem,
    };

    const resposta = {
      tipo: "resposta",
      texto: respostasPorCategoria[categoriaSelecionada],
    };

    setChat([...chat, pergunta, resposta]);
    setMensagem("");
  };

  const novoAssunto = () => {
    setEtapa("categoria");
    setCategoriaSelecionada(null);
    setRespostas([]);
    setPerguntaAtual(0);
    setRespostaAtual("");
    setMensagem("");
    setChat([]);
  };

  if (etapa === "login") {
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
            className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:scale-[1.02] transition"
          >
            Acessar meu Oráculo
          </button>
        </div>
      </main>
    );
  }

  if (etapa === "categoria") {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-semibold text-center mb-2">
            Oráculo Bíblico
          </h1>

          <p className="text-gray-400 text-center mb-6">
            Direção bíblica, prática e feminina para o seu relacionamento.
          </p>

          <div className="bg-[#171717] border border-white/10 rounded-3xl p-5 mb-7 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d6b56d] mb-3">
              Palavra do dia
            </p>

            <h2 className="text-lg font-semibold mb-3">
              {palavraDoDia.versiculo}
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {palavraDoDia.reflexao}
            </p>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                {palavraDoDia.acao}
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center mb-3">
            Selecione sobre qual assunto quer tratar hoje com seu Oráculo Bíblico
          </h2>

          <p className="text-gray-500 text-sm text-center mb-5">
            Escolha uma área para receber um direcionamento mais específico.
          </p>

          <div className="flex flex-col gap-3">
            {Object.keys(categorias).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setCategoriaSelecionada(key);
                  setEtapa("perguntas");
                }}
                className="bg-[#1f1f1f] px-6 py-4 rounded-xl w-full border border-white/10 hover:bg-[#2a2a2a] transition text-left"
              >
                {categorias[key].titulo}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (etapa === "perguntas") {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-md bg-[#171717] border border-white/10 rounded-3xl p-7 shadow-2xl">
          <p className="text-gray-500 mb-4">
            Pergunta {perguntaAtual + 1} de {categorias[categoriaSelecionada].perguntas.length}
          </p>

          <h1 className="mb-6 text-xl">
            {categorias[categoriaSelecionada].perguntas[perguntaAtual]}
          </h1>

          <textarea
            value={respostaAtual}
            onChange={(e) => setRespostaAtual(e.target.value)}
            className="p-4 text-white bg-[#0f0f0f] border border-white/20 w-full rounded-xl outline-none focus:border-[#d6b56d] min-h-[120px]"
            placeholder="Escreva sua resposta aqui..."
          />

          <button
            onClick={responderPergunta}
            disabled={!respostaAtual.trim()}
            className={`mt-4 w-full py-4 rounded-xl font-semibold transition ${
              respostaAtual.trim()
                ? "bg-white text-black hover:scale-[1.02]"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Avançar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-3xl font-semibold mb-2">Oráculo Bíblico</h1>
        <p className="text-gray-400">
          Seu diagnóstico foi concluído. Agora você pode conversar com o Oráculo.
        </p>
      </div>

      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-4 h-[420px] overflow-y-auto mb-4 shadow-xl border border-white/5">
        {chat.length === 0 && (
          <p className="text-gray-500 text-sm text-center">
            Digite sua dúvida para começar
          </p>
        )}

        {chat.map((item, index) => (
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
          onClick={enviarMensagem}
          className="bg-white text-black px-4 rounded-xl font-medium"
        >
          Enviar
        </button>
      </div>

      <button
        onClick={() => router.push("/analise")}
        className="mt-8 bg-white text-black px-6 py-4 rounded-xl font-semibold shadow-xl hover:scale-105 transition text-center leading-tight"
      >
        <span className="block text-base">Quero uma análise individual</span>
        <span className="block text-sm opacity-80">sobre o meu relacionamento</span>
      </button>

      <button
        onClick={novoAssunto}
        className="mt-5 text-sm text-gray-400 underline"
      >
        Obter auxílio em novo assunto
      </button>
    </main>
  );
}