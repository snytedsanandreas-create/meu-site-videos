"use client";

import { useState, useRef, useEffect } from "react";

// ============ DADOS FAKE ============
const videosFake = [
  { id: 1, titulo: "Fui banido pelo VACNET ao vivo na live (Partida cancelada)", canal: "@dj_nene", views: "12 mil visualizações • há 2 horas", thumb: "https://picsum.photos/seed/video1/640/360", duracao: "10:03", categoria: "Videogames", cor: "bg-blue-600", descricao: "Fui banido pelo VACNET ao vivo, foi uma partida muito emocionante. Assiste aí e me diz o que achou!" },
  { id: 2, titulo: "Busquei ela de Golf GTI no colégio", canal: "@canal_automotivo", views: "45 mil visualizações • há 1 dia", thumb: "https://picsum.photos/seed/video2/640/360", duracao: "17:03", categoria: "Automotivo", cor: "bg-green-600", descricao: "Hoje eu fui buscar ela no colégio com o Golf GTI. A reação dela foi impagável!" },
  { id: 3, titulo: "Bistecão fez cariani pagar almoço milionário", canal: "@podcast_brasil", views: "1,2 mi de visualizações • há 3 dias", thumb: "https://picsum.photos/seed/video3/640/360", duracao: "55:02", categoria: "Podcasts", cor: "bg-red-600", descricao: "Nesse episódio do podcast, o Bistecão fez o Cariani pagar um almoço que virou lenda!" },
];

const shortsFake = [
  { id: 1, titulo: "Olha essa jogada absurda!", canal: "@dj_nene", curtidas: "45 mil", comentarios: "1,2 mil", thumb: "https://picsum.photos/seed/short1/400/700", cor: "bg-blue-600" },
  { id: 2, titulo: "Meu novo setup tá insano", canal: "@tech_br", curtidas: "23 mil", comentarios: "890", thumb: "https://picsum.photos/seed/short2/400/700", cor: "bg-purple-600" },
  { id: 3, titulo: "Ele não esperava por isso", canal: "@comedia_br", curtidas: "120 mil", comentarios: "3,5 mil", thumb: "https://picsum.photos/seed/short3/400/700", cor: "bg-yellow-600" },
  { id: 4, titulo: "Golpe novo no futebol", canal: "@esportes", curtidas: "67 mil", comentarios: "2,1 mil", thumb: "https://picsum.photos/seed/short4/400/700", cor: "bg-green-600" },
  { id: 5, titulo: "Essa receita é TOP", canal: "@chef_br", curtidas: "89 mil", comentarios: "1,8 mil", thumb: "https://picsum.photos/seed/short5/400/700", cor: "bg-orange-600" },
];

// ============ FILMES (CATEGORIA) ============
const filmes = [
  { id: "tt0111161", titulo: "Um Sonho de Liberdade", ano: 1994 },
  { id: "tt0068646", titulo: "O Poderoso Chefão", ano: 1972 },
  { id: "tt0468569", titulo: "Batman: O Cavaleiro das Trevas", ano: 2008 },
  { id: "tt0110912", titulo: "Pulp Fiction: Tempo de Violência", ano: 1994 },
  { id: "tt0109830", titulo: "Forrest Gump: O Contador de Histórias", ano: 1994 },
  { id: "tt1375666", titulo: "A Origem", ano: 2010 },
  { id: "tt0137523", titulo: "Clube da Luta", ano: 1999 },
  { id: "tt0133093", titulo: "Matrix", ano: 1999 },
  { id: "tt0099685", titulo: "Os Bons Companheiros", ano: 1990 },
  { id: "tt0816692", titulo: "Interestelar", ano: 2014 },
];

const categorias = ["Todas","Música","Videogames","Podcasts","Automotivo","Esportes","Tecnologia","Comédia","Filmes","Educação"];

const planos = [
  { id: "free", nome: "Iniciante", preco: 0, precoOriginal: null, periodo: "para sempre", popular: false, limiteMB: 50, recursos: ["50 MB por vídeo","10 min de duração máxima","Vídeos em HD","Com anúncios"], botao: "Começar de graça" },
  { id: "essencial", nome: "Essencial", preco: 9.9, precoOriginal: 12.9, periodo: "por mês • cobrado anualmente", popular: false, limiteMB: 500, recursos: ["500 MB por vídeo","50 GB de armazenamento","Vídeos em 4K Ultra HD","Sem anúncios"], botao: "Quero o Essencial" },
  { id: "ultra", nome: "Ultra", preco: 19.9, precoOriginal: 24.9, periodo: "por mês • cobrado anualmente", popular: true, limiteMB: 2000, recursos: ["2 GB por vídeo","200 GB de armazenamento","500 GB de banda","Suporte prioritário"], botao: "Quero o Ultra" },
  { id: "master", nome: "Master", preco: 49.9, precoOriginal: 59.9, periodo: "por mês • cobrado anualmente", popular: false, limiteMB: 10000, recursos: ["10 GB por vídeo","1 TB de armazenamento","2 TB de banda","Suporte 24/7 dedicado","Selo verificado dourado","Sem marca d'água nos vídeos"], botao: "Virar Master" },
];

const ordemPlanos = ["free", "essencial", "ultra", "master"];
const coresCanais = ["bg-blue-600","bg-green-600","bg-red-600","bg-purple-600","bg-orange-600","bg-pink-600","bg-teal-600","bg-indigo-600"];

// ============ FONTES DE FILMES ============



function getCorCanal(canalNome: string) {
  const hash = canalNome.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return coresCanais[hash % coresCanais.length];
}

function parseViewsFromString(s: string): number {
  if (!s) return 0;
  const match = s.match(/([\d.,]+)\s*(mil|mi)?/i);
  if (!match) return 0;
  let n = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(n)) return 0;
  const unit = match[2]?.toLowerCase();
  if (unit === "mil") n *= 1000;
  else if (unit === "mi") n *= 1000000;
  return Math.round(n);
}

function formatarViews(n: number): string {
  if (n < 1000) return `${n} ${n === 1 ? "visualização" : "visualizações"}`;
  if (n < 1000000) return `${(n / 1000).toFixed(1).replace(".", ",")} mil visualizações`;
  return `${(n / 1000000).toFixed(1).replace(".", ",")} mi de visualizações`;
}

function getTempoPublicado(viewsStr: string): string {
  return (viewsStr || "").split("•")[1]?.trim() || "";
}

function parsearMilhar(s: string): number {
  if (!s) return 0;
  const match = s.match(/([\d.,]+)\s*(mil|mi)?/i);
  if (!match) return 0;
  let n = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(n)) return 0;
  const unit = match[2]?.toLowerCase();
  if (unit === "mil") n *= 1000;
  else if (unit === "mi") n *= 1000000;
  return Math.round(n);
}

function formatarMilhar(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1000000) return `${(n / 1000).toFixed(1).replace(".", ",")} mil`;
  return `${(n / 1000000).toFixed(1).replace(".", ",")} mi`;
}

// ============ SHORTS ============
function Shorts({ curtidas, onToggleCurtida, usuario, comentariosShorts, setComentariosShorts, onLoginNecessario, onCanalClick, inscricoes, onSeguir, onDeixarDeSeguir }: any) {
  const [painelAberto, setPainelAberto] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [respondendoA, setRespondendoA] = useState<number | null>(null);
  const [textoResposta, setTextoResposta] = useState("");

  const abrirComentarios = (idShort: string) => {
    if (!usuario) { onLoginNecessario(); return; }
    setPainelAberto(idShort);
    setTexto("");
    setRespondendoA(null);
    setTextoResposta("");
  };

  const adicionarComentario = (idShort: string) => {
    if (!texto.trim() || !usuario) return;
    const novo = {
      id: Date.now(),
      autor: `@${usuario}`,
      texto: texto.trim(),
      tempo: "agora",
      respostas: [],
    };
    setComentariosShorts((prev: any) => ({
      ...prev,
      [idShort]: [novo, ...(prev[idShort] || [])],
    }));
    setTexto("");
  };

  const adicionarResposta = (idShort: string, comentarioId: number) => {
    if (!textoResposta.trim() || !usuario) return;
    const novaResposta = {
      id: Date.now(),
      autor: `@${usuario}`,
      texto: textoResposta.trim(),
      tempo: "agora",
    };
    setComentariosShorts((prev: any) => ({
      ...prev,
      [idShort]: (prev[idShort] || []).map((c: any) =>
        c.id === comentarioId
          ? { ...c, respostas: [...(c.respostas || []), novaResposta] }
          : c
      ),
    }));
    setTextoResposta("");
    setRespondendoA(null);
  };

  const contarComentariosDoShort = (idShort: string) => {
    const comentarios = comentariosShorts[idShort] || [];
    return comentarios.reduce(
      (acc: number, c: any) => acc + 1 + (c.respostas?.length || 0),
      0
    );
  };

  return (
    <>
      {shortsFake.map((s) => {
        const idShort = `short_${s.id}`;
        const listaCurtidas = curtidas[idShort] || [];
        const curtido = usuario ? listaCurtidas.includes(usuario) : false;
        const baseFixa = parsearMilhar(s.curtidas);
        const totalCurtidas = baseFixa + listaCurtidas.length;

        const comentariosBase = parsearMilhar(s.comentarios);
        const comentariosUsuario = contarComentariosDoShort(idShort);
        const totalComentarios = comentariosBase + comentariosUsuario;

        const listaComentarios = comentariosShorts[idShort] || [];

        return (
          <div key={s.id} className="h-full w-full snap-start flex items-center justify-center relative">
            <div className="relative h-[calc(100vh-3.5rem)] aspect-[9/16] max-h-full">
              <img src={s.thumb} alt={s.titulo} className="w-full h-full object-cover rounded-lg" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg"></div>

              <div className="absolute right-3 bottom-24 flex flex-col gap-5 items-center">
                <button
                  onClick={() => onToggleCurtida(idShort)}
                  className="flex flex-col items-center cursor-pointer group"
                  title={curtido ? "Descurtir" : "Curtir"}
                >
                  <div className={`rounded-full p-2.5 transition ${curtido ? "bg-[#e888d3]" : "bg-black/50 group-hover:bg-[#272727]"}`}>
                    <span className={`material-icons-outlined ${curtido ? "text-black" : "text-white"}`}>
                      {curtido ? "thumb_up" : "thumb_up_off_alt"}
                    </span>
                  </div>
                  <span className={`text-xs mt-1 font-medium ${curtido ? "text-[#e888d3]" : "text-white"}`}>
                    {formatarMilhar(totalCurtidas)}
                  </span>
                </button>

                <button
                  onClick={() => abrirComentarios(idShort)}
                  className="flex flex-col items-center cursor-pointer group"
                  title="Comentários"
                >
                  <div className="bg-black/50 rounded-full p-2.5 group-hover:bg-[#272727] transition">
                    <span className="material-icons-outlined text-white">comment</span>
                  </div>
                  <span className="text-white text-xs mt-1 font-medium">
                    {formatarMilhar(totalComentarios)}
                  </span>
                </button>
              </div>

              <div className="absolute left-4 bottom-6 right-20">
                <div className="flex items-center gap-3 mb-2">
                  <div onClick={() => onCanalClick(s.canal)} className={`w-9 h-9 ${s.cor} rounded-full cursor-pointer hover:ring-2 hover:ring-[#e888d3] transition`}></div>
                  <span onClick={() => onCanalClick(s.canal)} className="font-medium text-sm cursor-pointer hover:text-[#e888d3] transition">{s.canal}</span>
                  {(() => {
                    const seguindo = inscricoes.includes(s.canal);
                    return (
                      <button
                        onClick={() => {
                          if (seguindo) onDeixarDeSeguir(s.canal);
                          else onSeguir(s.canal);
                        }}
                        className={`text-xs font-medium px-3 py-1 rounded-full transition cursor-pointer ${
                          seguindo
                            ? "bg-[#272727] text-white border border-[#303030] hover:bg-[#3f3f3f]"
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                      >
                        {seguindo ? "Seguindo" : "Seguir"}
                      </button>
                    );
                  })()}
                </div>
                <p className="text-sm text-white leading-5">{s.titulo}</p>
              </div>

              {painelAberto === idShort && (
                <>
                  <div
                    className="absolute inset-0 bg-black/60 rounded-lg cursor-pointer"
                    onClick={() => setPainelAberto(null)}
                  />
                  <div className="absolute left-0 right-0 bottom-0 max-h-[70%] bg-[#1c1c1c] rounded-t-2xl flex flex-col overflow-hidden z-10">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#303030]">
                      <div className="flex items-center gap-2">
                        <span className="material-icons-outlined text-[#e888d3]">comment</span>
                        <h3 className="font-bold text-sm">
                          {formatarMilhar(totalComentarios)} comentários
                        </h3>
                      </div>
                      <button
                        onClick={() => setPainelAberto(null)}
                        className="material-icons-outlined text-gray-400 hover:text-white cursor-pointer"
                      >close</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {listaComentarios.length === 0 ? (
                        <div className="text-center py-8">
                          <span className="material-icons-outlined text-4xl text-gray-600 mb-2">forum</span>
                          <p className="text-sm text-gray-400">Nenhum comentário ainda</p>
                          <p className="text-xs text-gray-500 mt-1">Seja o primeiro a comentar!</p>
                        </div>
                      ) : (
                        listaComentarios.map((c: any) => (
                          <div key={c.id} className="flex flex-col">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-[#e888d3] rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="material-icons-outlined text-black text-sm">person</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-xs">{c.autor}</span>
                                  <span className="text-gray-500 text-[10px]">{c.tempo}</span>
                                </div>
                                <p className="text-sm text-gray-200 break-words">{c.texto}</p>

                                <button
                                  onClick={() => {
                                    if (respondendoA === c.id) {
                                      setRespondendoA(null);
                                      setTextoResposta("");
                                    } else {
                                      setRespondendoA(c.id);
                                      setTextoResposta("");
                                    }
                                  }}
                                  className="text-xs text-gray-400 hover:text-[#e888d3] mt-2 font-medium transition cursor-pointer"
                                >
                                  Responder
                                </button>

                                {respondendoA === c.id && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <input
                                      type="text"
                                      placeholder={`Responder ${c.autor}...`}
                                      value={textoResposta}
                                      onChange={(e) => setTextoResposta(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                          e.preventDefault();
                                          adicionarResposta(idShort, c.id);
                                        }
                                        if (e.key === "Escape") {
                                          setRespondendoA(null);
                                          setTextoResposta("");
                                        }
                                      }}
                                      autoFocus
                                      className="flex-1 bg-[#0f0f0f] border border-[#303030] rounded-full px-3 py-1.5 text-xs text-white outline-none focus:border-[#e888d3]"
                                    />
                                    <button
                                      onClick={() => adicionarResposta(idShort, c.id)}
                                      disabled={!textoResposta.trim()}
                                      className="w-8 h-8 rounded-full bg-[#e888d3] hover:bg-[#d176be] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer"
                                    >
                                      <span className="material-icons-outlined text-black text-sm">send</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {(c.respostas?.length || 0) > 0 && (
                              <div className="ml-11 mt-3 space-y-3 border-l-2 border-[#303030] pl-3">
                                {c.respostas.map((r: any) => (
                                  <div key={r.id} className="flex gap-2">
                                    <div className="w-7 h-7 bg-[#e888d3]/60 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="material-icons-outlined text-black text-xs">person</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-medium text-xs">{r.autor}</span>
                                        <span className="text-gray-500 text-[10px]">{r.tempo}</span>
                                      </div>
                                      <p className="text-sm text-gray-300 break-words">{r.texto}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2 p-3 border-t border-[#303030]">
                      <input
                        type="text"
                        placeholder="Adicione um comentário..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            adicionarComentario(idShort);
                          }
                        }}
                        className="flex-1 bg-[#0f0f0f] border border-[#303030] rounded-full px-4 py-2 text-sm text-white outline-none focus:border-[#e888d3]"
                      />
                      <button
                        onClick={() => adicionarComentario(idShort)}
                        disabled={!texto.trim()}
                        className="w-10 h-10 rounded-full bg-[#e888d3] hover:bg-[#d176be] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer"
                      >
                        <span className="material-icons-outlined text-black text-lg">send</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ============ ASSISTIR VÍDEO ============
function AssistirVideo({
  video, todosVideos, onVoltar, onSelecionarVideo, usuario, logado,
  inscricoes, usuarios, onCanalClick, curtidas, onToggleCurtida,
  onComentar, onLoginNecessario, onSeguir, onDeixarDeSeguir, views,
}: any) {
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [carregouComentarios, setCarregouComentarios] = useState(false);

  const inscrito = inscricoes.includes(video.canal);
  const outrosVideos = todosVideos.filter((v: any) => v.id !== video.id);
  const nomeCanalLimpo = video.canal.startsWith("@") ? video.canal.slice(1) : video.canal;
  const avatarCanal = usuarios[nomeCanalLimpo]?.avatarUrl;

  const listaCurtidas = curtidas[video.id] || [];
  const curtido = usuario ? listaCurtidas.includes(usuario) : false;
  const totalCurtidas = listaCurtidas.length;

  useEffect(() => {
    const chave = `nosafee_comentarios_${video.id}`;
    const salvos = localStorage.getItem(chave);
    if (salvos) setComentarios(JSON.parse(salvos));
    else setComentarios([
      { id: 1, autor: "@maria_silva", texto: "Muito bom!", tempo: "há 2 horas" },
      { id: 2, autor: "@joao_gamer", texto: "Que jogada insana!", tempo: "há 5 horas" },
    ]);
    setCarregouComentarios(true);
  }, [video.id]);

  useEffect(() => {
    if (!carregouComentarios) return;
    localStorage.setItem(`nosafee_comentarios_${video.id}`, JSON.stringify(comentarios));
  }, [comentarios, video.id, carregouComentarios]);

  return (
    <div className="h-full overflow-y-auto bg-[#0f0f0f]">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6">
        <button onClick={onVoltar} className="flex items-center gap-2 mb-4 text-sm text-gray-300 hover:text-[#e888d3] transition-colors cursor-pointer">
          <span className="material-icons-outlined">arrow_back</span> Voltar para o início
        </button>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
              <img src={video.thumb} alt={video.titulo} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition">
                  <span className="material-icons-outlined text-white text-5xl">play_arrow</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div className="h-full bg-[#e888d3] w-1/3"></div>
              </div>
            </div>
            <h1 className="text-xl font-bold mt-4 mb-3">{video.titulo}</h1>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#303030]">
              <div className="flex items-center gap-3">
                <div onClick={() => onCanalClick(video.canal)} className="cursor-pointer">
                  {avatarCanal ? (
                    <img src={avatarCanal} alt={video.canal} className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-[#e888d3] transition" />
                  ) : (
                    <div className={`w-10 h-10 ${getCorCanal(video.canal)} rounded-full hover:ring-2 hover:ring-[#e888d3] transition`}></div>
                  )}
                </div>
                <div onClick={() => onCanalClick(video.canal)} className="cursor-pointer">
                  <p className="font-medium text-sm hover:text-[#e888d3] transition">{video.canal}</p>
                  <p className="text-gray-400 text-xs">1,2 mil seguidores</p>
                </div>
                <button onClick={() => { if (inscrito) onDeixarDeSeguir(video.canal); else onSeguir(video.canal); }} className={`ml-3 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${inscrito ? "bg-[#272727] text-white hover:bg-[#3f3f3f]" : "bg-white text-black hover:bg-gray-200"}`}>
                  {inscrito ? "Seguindo" : "Seguir"}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onToggleCurtida(video.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${curtido ? "bg-[#e888d3] text-black" : "bg-[#272727] hover:bg-[#3f3f3f]"}`}>
                  <span className="material-icons-outlined text-lg">{curtido ? "thumb_up" : "thumb_up_off_alt"}</span>
                  {curtido ? "Curtido" : "Curtir"}
                  {totalCurtidas > 0 && <span className="text-xs opacity-80">{totalCurtidas}</span>}
                </button>
              </div>
            </div>
            <div className="bg-[#1c1c1c] rounded-xl p-4 mt-4">
              <p className="text-sm text-gray-300 whitespace-pre-line">
                {formatarViews(views[video.id] || 0)}{getTempoPublicado(video.views || "") ? ` • ${getTempoPublicado(video.views || "")}` : ""}
                {"\n\n"}
                {video.descricao}
              </p>
            </div>
            <div className="mt-6">
              <h2 className="font-bold text-lg mb-4">{comentarios.length} comentários</h2>
              <div className="flex gap-3 mb-6">
                {usuario && usuarios[usuario]?.avatarUrl ? (
                  <img src={usuarios[usuario].avatarUrl} alt={usuario} className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-[#e888d3] rounded-full flex-shrink-0"></div>
                )}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Adicione um comentário..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    onFocus={() => { if (!logado) onLoginNecessario(); }}
                    className="w-full bg-transparent border-b border-[#303030] focus:border-[#e888d3] outline-none pb-2 text-sm text-white placeholder-gray-400 transition-colors"
                  />
                  {comentario.trim() && (
                    <div className="flex justify-end gap-2 mt-3">
                      <button onClick={() => setComentario("")} className="px-4 py-1.5 rounded-full text-sm text-gray-300 hover:bg-[#272727] transition cursor-pointer">Cancelar</button>
                      <button
                        onClick={() => {
                          if (!logado) { onLoginNecessario(); return; }
                          const texto = comentario;
                          setComentarios([{ id: Date.now(), autor: usuario ? `@${usuario}` : "@anônimo", texto, tempo: "agora" }, ...comentarios]);
                          onComentar(video.id, texto);
                          setComentario("");
                        }}
                        className="px-4 py-1.5 bg-[#e888d3] hover:bg-[#d176be] text-black rounded-full text-sm font-medium transition cursor-pointer"
                      >Comentar</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-5">
                {comentarios.map((c) => {
                  const nomeAutor = c.autor.startsWith("@") ? c.autor.slice(1) : c.autor;
                  const avatarAutor = usuarios[nomeAutor]?.avatarUrl;
                  return (
                    <div key={c.id} className="flex gap-3">
                      {avatarAutor ? (
                        <img src={avatarAutor} alt={c.autor} className="w-10 h-10 rounded-full flex-shrink-0 object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0"></div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{c.autor}</span>
                          <span className="text-gray-500 text-xs">{c.tempo}</span>
                        </div>
                        <p className="text-sm text-gray-200">{c.texto}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="lg:w-96 flex-shrink-0">
            <h2 className="font-medium text-sm mb-3 text-gray-300">Próximos vídeos</h2>
            <div className="space-y-3">
              {outrosVideos.map((v: any) => (
                <div key={v.id} onClick={() => onSelecionarVideo(v)} className="flex gap-3 cursor-pointer group">
                  <div className="relative w-40 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                    <img src={v.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={v.titulo} />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-xs px-1 rounded">{v.duracao}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium text-sm line-clamp-2 leading-5">{v.titulo}</h3>
                    <p className="text-gray-400 text-xs">{v.canal}</p>
                    <p className="text-gray-400 text-xs">{formatarViews(views[v.id] || 0)}{getTempoPublicado(v.views || "") ? ` • ${getTempoPublicado(v.views || "")}` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ COMPONENTE PRINCIPAL ============
export default function Home() {
  const [busca, setBusca] = useState("");
  const [idadeVerificada, setIdadeVerificada] = useState(false);
  const [carregouIdade, setCarregouIdade] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [modoAuth, setModoAuth] = useState<"login" | "cadastro">("login");
  const [mostrarUpload, setMostrarUpload] = useState(false);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarSeguindo, setMostrarSeguindo] = useState(false);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [mostrarMensagens, setMostrarMensagens] = useState(false);
  const [conversaAtiva, setConversaAtiva] = useState<string | null>(null);
  const [textoMensagem, setTextoMensagem] = useState("");
  const [todasMensagens, setTodasMensagens] = useState<{ [key: string]: any[] }>({});
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [planoAtual, setPlanoAtual] = useState("free");
  const [carregou, setCarregou] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("inicio");
  const [videoAssistindo, setVideoAssistindo] = useState<any | null>(null);
  const [filmeSelecionado, setFilmeSelecionado] = useState<any | null>(null);
  const [fonteFilme, setFonteFilme] = useState(0);
const [idiomaFilme, setIdiomaFilme] = useState<"dublado" | "legendado">("dublado");
  const [canalSelecionado, setCanalSelecionado] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<{ [key: string]: any }>({});
  const [meusVideos, setMeusVideos] = useState<any[]>([]);
  const [inscricoes, setInscricoes] = useState<string[]>([]);
  const [seguindoVistos, setSeguindoVistos] = useState<string[]>([]);
  const [curtidas, setCurtidas] = useState<{ [videoId: string]: string[] }>({});
  const [views, setViews] = useState<{ [videoId: string]: number }>({});
  const [comentariosShorts, setComentariosShorts] = useState<{ [shortId: string]: any[] }>({});
  const [notificacoes, setNotificacoes] = useState<{ [userId: string]: any[] }>({});
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const [abaCanal, setAbaCanal] = useState<"videos" | "editar">("videos");
  const [novoUsuario, setNovoUsuario] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoAvatar, setNovoAvatar] = useState("");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [modoUpload, setModoUpload] = useState<"arquivo" | "link">("arquivo");
  const [arquivoVideo, setArquivoVideo] = useState<File | null>(null);
  const [tituloModal, setTituloModal] = useState("");
  const [descModal, setDescModal] = useState("");
  const [urlModal, setUrlModal] = useState("");
  const [catModal, setCatModal] = useState("Videogames");
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState<"pix" | "cartao">("pix");
  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<any>(null);
  const [etapaPagamento, setEtapaPagamento] = useState<"planos" | "pagamento">("planos");

  const mainRef = useRef<HTMLElement>(null);
  const ultimoCountRef = useRef(0);

  useEffect(() => {
    const usuariosSalvos = localStorage.getItem("nosafee_usuarios");
    const usuariosData = usuariosSalvos ? JSON.parse(usuariosSalvos) : {};
    setUsuarios(usuariosData);
    const logadoSalvo = localStorage.getItem("nosafee_logado");
    if (logadoSalvo && usuariosData[logadoSalvo]) {
      const userData = usuariosData[logadoSalvo];
      setUsuario(logadoSalvo);
      setLogado(true);
      setPlanoAtual(userData.plano || "free");
      setMeusVideos(userData.videos || []);
      setInscricoes(userData.inscricoes || []);
    }
    if (localStorage.getItem("nosafee_idade_ok") === "true") setIdadeVerificada(true);
    const mensagensSalvas = localStorage.getItem("nosafee_mensagens");
    if (mensagensSalvas) setTodasMensagens(JSON.parse(mensagensSalvas));
    const curtidasSalvas = localStorage.getItem("nosafee_curtidas");
    if (curtidasSalvas) setCurtidas(JSON.parse(curtidasSalvas));

    const comentariosShortsSalvos = localStorage.getItem("nosafee_comentarios_shorts");
    if (comentariosShortsSalvos) setComentariosShorts(JSON.parse(comentariosShortsSalvos));

    const viewsSalvas = localStorage.getItem("nosafee_views");
    if (viewsSalvas) {
      setViews(JSON.parse(viewsSalvas));
    } else {
      const seeds: { [id: string]: number } = {};
      const todos: any[] = [...videosFake];
      Object.values(usuariosData).forEach((u: any) => { if (u.videos) todos.push(...u.videos); });
      todos.forEach((v: any) => { seeds[v.id] = parseViewsFromString(v.views || "0"); });
      setViews(seeds);
    }

    const notifSalvas = localStorage.getItem("nosafee_notificacoes");
    if (notifSalvas) setNotificacoes(JSON.parse(notifSalvas));
    setCarregou(true);
    setCarregouIdade(true);
  }, []);

  useEffect(() => {
    if (!carregou || !logado || !usuario) return;
    setUsuarios((prev) => {
      const novoBanco = { ...prev, [usuario]: { ...prev[usuario], plano: planoAtual, videos: meusVideos, inscricoes: inscricoes } };
      localStorage.setItem("nosafee_usuarios", JSON.stringify(novoBanco));
      return novoBanco;
    });
  }, [planoAtual, meusVideos, inscricoes, usuario, logado, carregou]);

  useEffect(() => { if (carregou) localStorage.setItem("nosafee_mensagens", JSON.stringify(todasMensagens)); }, [todasMensagens, carregou]);
  useEffect(() => { if (carregou) localStorage.setItem("nosafee_curtidas", JSON.stringify(curtidas)); }, [curtidas, carregou]);
  useEffect(() => { if (carregou) localStorage.setItem("nosafee_views", JSON.stringify(views)); }, [views, carregou]);
  useEffect(() => { if (carregou) localStorage.setItem("nosafee_comentarios_shorts", JSON.stringify(comentariosShorts)); }, [comentariosShorts, carregou]);
  useEffect(() => { if (carregou) localStorage.setItem("nosafee_notificacoes", JSON.stringify(notificacoes)); }, [notificacoes, carregou]);

  useEffect(() => {
    if (!carregou || !usuario) return;
    const salvos = localStorage.getItem(`nosafee_seguindo_vistos_${usuario}`);
    setSeguindoVistos(salvos ? JSON.parse(salvos) : []);
  }, [usuario, carregou]);

  useEffect(() => {
    if (!carregou || !usuario) return;
    localStorage.setItem(`nosafee_seguindo_vistos_${usuario}`, JSON.stringify(seguindoVistos));
  }, [seguindoVistos, usuario, carregou]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "nosafee_mensagens" && e.newValue) setTodasMensagens(JSON.parse(e.newValue));
      if (e.key === "nosafee_usuarios" && e.newValue) setUsuarios(JSON.parse(e.newValue));
      if (e.key === "nosafee_curtidas" && e.newValue) setCurtidas(JSON.parse(e.newValue));
      if (e.key === "nosafee_views" && e.newValue) setViews(JSON.parse(e.newValue));
      if (e.key === "nosafee_comentarios_shorts" && e.newValue) setComentariosShorts(JSON.parse(e.newValue));
      if (e.key === "nosafee_notificacoes" && e.newValue) setNotificacoes(JSON.parse(e.newValue));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!carregou || !usuario) return;
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") Notification.requestPermission();
  }, [carregou, usuario]);

  useEffect(() => {
    if (!carregou || !usuario) return;
    const naoLidas = getTotalNaoLidas();
    if (naoLidas > ultimoCountRef.current && ultimoCountRef.current !== 0) {
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("Nova mensagem no nosafee", { body: "Você recebeu uma nova mensagem!" });
      }
    }
    ultimoCountRef.current = naoLidas;
  }, [todasMensagens, carregou, usuario]);

  useEffect(() => {
    if (abaCanal === "editar" && logado) {
      setNovoUsuario(usuario);
      setNovoEmail(usuarios[usuario]?.email || "");
      setNovoAvatar(usuarios[usuario]?.avatarUrl || "");
    }
  }, [abaCanal, logado, usuario, usuarios]);

  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [abaAtiva, videoAssistindo, canalSelecionado, filmeSelecionado]);

  useEffect(() => {
    if (!videoAssistindo?.id) return;
    const id = videoAssistindo.id;
    setViews((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, [videoAssistindo?.id]);

  useEffect(() => {
    if (mostrarMensagens && conversaAtiva) {
      setTimeout(() => { const div = document.querySelector(".conversa-scroll"); if (div) div.scrollTop = div.scrollHeight; }, 50);
    }
  }, [todasMensagens, conversaAtiva, mostrarMensagens]);

  const todosOsVideosDoSite = () => {
    const videosUsuarios: any[] = [];
    Object.values(usuarios).forEach((u: any) => { if (u.videos) videosUsuarios.push(...u.videos); });
    const map = new Map();
    [...videosUsuarios, ...videosFake].forEach((v) => { if (!map.has(v.id)) map.set(v.id, v); });
    return Array.from(map.values());
  };

  const getVideosDoCanal = (canalNome: string) => todosOsVideosDoSite().filter((v) => v.canal === canalNome);

  const getCanalInfo = (canalNome: string) => {
    const nomeLimpo = canalNome.startsWith("@") ? canalNome.slice(1) : canalNome;
    const userData = usuarios[nomeLimpo];
    if (userData) return { avatarUrl: userData.avatarUrl || "", cor: "bg-[#e888d3]" };
    return { avatarUrl: "", cor: getCorCanal(canalNome) };
  };

  const getSeguidores = (canalNome: string) => {
    let count = 0;
    Object.values(usuarios).forEach((u: any) => { if (u.inscricoes && u.inscricoes.includes(canalNome)) count++; });
    const hash = canalNome.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return count + (hash % 500) + 42;
  };

  const toggleCurtida = (videoId: string) => {
    if (!logado || !usuario) { setModoAuth("login"); setMostrarLogin(true); return; }
    const jaCurtiu = (curtidas[videoId] || []).includes(usuario);
    setCurtidas((prev) => {
      const atuais = prev[videoId] || [];
      if (atuais.includes(usuario)) return { ...prev, [videoId]: atuais.filter((u) => u !== usuario) };
      return { ...prev, [videoId]: [...atuais, usuario] };
    });
    if (!jaCurtiu) {
      const video = todosOsVideosDoSite().find((v) => v.id === videoId);
      if (!video) return;
      const dono = video.canal.replace("@", "");
      if (dono !== usuario && usuarios[dono]) {
        adicionarNotificacao(dono, { tipo: "curtida", de: usuario, videoId: video.id, videoTitulo: video.titulo, texto: `@${usuario} curtiu seu vídeo` });
      }
    }
  };

  const adicionarNotificacao = (paraUsuario: string, notif: any) => {
    setNotificacoes((prev) => {
      const atuais = prev[paraUsuario] || [];
      return { ...prev, [paraUsuario]: [{ ...notif, id: Date.now() + Math.random(), timestamp: Date.now(), lida: false }, ...atuais].slice(0, 50) };
    });
  };

  const formatarTempo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const min = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (min < 1) return "agora";
    if (min < 60) return `há ${min} min`;
    if (h < 24) return `há ${h}h`;
    if (d < 7) return `há ${d}d`;
    return new Date(timestamp).toLocaleDateString("pt-BR");
  };

  const minhasNotificacoes = usuario ? notificacoes[usuario] || [] : [];
  const naoLidasNotif = minhasNotificacoes.filter((n) => !n.lida).length;
  const limparNotificacoes = () => { if (usuario) setNotificacoes((prev) => ({ ...prev, [usuario]: [] })); };
  const marcarNotifComoLida = (id: number) => {
    if (!usuario) return;
    setNotificacoes((prev) => ({ ...prev, [usuario]: (prev[usuario] || []).map((n) => n.id === id ? { ...n, lida: true } : n) }));
  };

  const seguirCanal = (canal: string) => {
    if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; }
    if (inscricoes.includes(canal)) return;
    setInscricoes([...inscricoes, canal]);
    const nomeCanal = canal.replace("@", "");
    if (usuarios[nomeCanal] && nomeCanal !== usuario) {
      adicionarNotificacao(nomeCanal, { tipo: "seguidor", de: usuario, texto: `@${usuario} começou a te seguir` });
    }
  };

  const deixarDeSeguirCanal = (canal: string) => {
    setInscricoes(inscricoes.filter((c) => c !== canal));
    setSeguindoVistos(seguindoVistos.filter((c) => c !== canal));
  };

  const buscarUsuarios = (termo: string) => {
    if (!termo.trim()) return [];
    const termoLimpo = termo.toLowerCase().replace("@", "");
    return Object.keys(usuarios).filter((nome) => nome.toLowerCase().includes(termoLimpo)).slice(0, 6);
  };

  const getChaveConversa = (user1: string, user2: string) => [user1, user2].sort().join("__");

  const getContatos = () => {
    if (!logado || !usuario) return [];
    const meusSeguidores: string[] = [];
    Object.entries(usuarios).forEach(([nome, dados]: any) => {
      if (dados.inscricoes && dados.inscricoes.includes(`@${usuario}`)) meusSeguidores.push(nome);
    });
    return inscricoes.filter((canal) => { const nomeLimpo = canal.replace("@", ""); return meusSeguidores.includes(nomeLimpo); }).map((canal) => canal.replace("@", ""));
  };

  const getMensagens = (outroUsuario: string) => {
    if (!usuario) return [];
    return todasMensagens[getChaveConversa(usuario, outroUsuario)] || [];
  };

  const enviarMensagem = (outroUsuario: string) => {
    if (!textoMensagem.trim() || !usuario) return;
    const chave = getChaveConversa(usuario, outroUsuario);
    const novaMsg = { de: usuario, para: outroUsuario, texto: textoMensagem.trim(), timestamp: Date.now(), lida: false };
    setTodasMensagens((prev) => ({ ...prev, [chave]: [...(prev[chave] || []), novaMsg] }));
    setTextoMensagem("");
  };

  const marcarComoLida = (outroUsuario: string) => {
    if (!usuario) return;
    const chave = getChaveConversa(usuario, outroUsuario);
    setTodasMensagens((prev) => {
      const msgs = prev[chave] || [];
      const atualizadas = msgs.map((m) => m.para === usuario ? { ...m, lida: true } : m);
      return { ...prev, [chave]: atualizadas };
    });
  };

  const getTotalNaoLidas = () => {
    if (!usuario) return 0;
    let count = 0;
    Object.values(todasMensagens).forEach((msgs: any) => { msgs.forEach((m: any) => { if (m.para === usuario && !m.lida) count++; }); });
    return count;
  };

  const irParaInicio = () => { setAbaAtiva("inicio"); setVideoAssistindo(null); setCanalSelecionado(null); setFilmeSelecionado(null); setBusca(""); setCategoriaAtiva("Todas"); };

  const abrirCanal = (canal: string) => {
    setCanalSelecionado(canal);
    setVideoAssistindo(null);
    setFilmeSelecionado(null);
    setAbaAtiva("canal-externo");
    if (logado && canal) marcarComoLida(canal.replace("@", ""));
  };

  const abrirPerfilDoChat = (canalNome: string) => {
    const canal = canalNome.startsWith("@") ? canalNome : `@${canalNome}`;
    setMostrarMensagens(false);
    setConversaAtiva(null);
    setCanalSelecionado(canal);
    setAbaAtiva("canal-externo");
    setVideoAssistindo(null);
    setFilmeSelecionado(null);
    if (logado) marcarComoLida(canalNome.replace("@", ""));
  };

  const handleLogin = () => {
    const nomeLimpo = usuario.trim().replace("@", "").toLowerCase();
    if (nomeLimpo === "") { alert("Digite um nome de usuário!"); return; }
    if (senhaInput.trim() === "") { alert("Digite sua senha!"); return; }
    const usuarioExistente = usuarios[nomeLimpo];
    if (!usuarioExistente) { alert("Usuário não encontrado! Crie uma conta primeiro."); return; }
    if (usuarioExistente.senha !== senhaInput) { alert("Senha incorreta! Tente novamente."); return; }
    setUsuario(nomeLimpo);
    setPlanoAtual(usuarioExistente.plano || "free");
    setMeusVideos(usuarioExistente.videos || []);
    setInscricoes(usuarioExistente.inscricoes || []);
    setLogado(true);
    localStorage.setItem("nosafee_logado", nomeLimpo);
    setMostrarLogin(false);
    setSenhaInput("");
    setEmailInput("");
    setCanalSelecionado(`@${nomeLimpo}`);
    setAbaAtiva("canal-externo");
    alert("Bem-vindo de volta, @" + nomeLimpo + "!");
  };

  const handleCriarConta = () => {
    const nomeLimpo = usuario.trim().replace("@", "").toLowerCase();
    if (nomeLimpo === "") { alert("Digite um nome de usuário!"); return; }
    if (emailInput.trim() === "") { alert("Digite um e-mail!"); return; }
    if (senhaInput.trim() === "") { alert("Digite uma senha!"); return; }
    if (usuarios[nomeLimpo]) { alert("Este nome já está em uso! Escolha outro ou faça login."); return; }
    const novoUsuarioObj = { senha: senhaInput, email: emailInput, plano: "free", videos: [], inscricoes: [], avatarUrl: "", criadoEm: new Date().toISOString() };
    const novoBanco = { ...usuarios, [nomeLimpo]: novoUsuarioObj };
    setUsuarios(novoBanco);
    localStorage.setItem("nosafee_usuarios", JSON.stringify(novoBanco));
    setUsuario(nomeLimpo);
    setPlanoAtual("free");
    setMeusVideos([]);
    setInscricoes([]);
    setMostrarLogin(false);
    setSenhaInput("");
    setEmailInput("");
    setMostrarPagamento(true);
    setEtapaPagamento("planos");
  };

  const handleSalvarPerfil = () => {
    const novoNomeLimpo = novoUsuario.trim().replace("@", "").toLowerCase();
    if (novoNomeLimpo === "") { alert("Digite um nome de usuário!"); return; }
    if (novoEmail.trim() === "") { alert("Digite um e-mail!"); return; }
    if (!novoEmail.includes("@")) { alert("Digite um e-mail válido!"); return; }
    if (novoNomeLimpo !== usuario && usuarios[novoNomeLimpo]) { alert("Este nome já está em uso! Escolha outro."); return; }
    setSalvandoPerfil(true);
    const dadosAtuais = usuarios[usuario] || {};
    const novoBanco = { ...usuarios };
    if (novoNomeLimpo !== usuario) {
      delete novoBanco[usuario];
      novoBanco[novoNomeLimpo] = { ...dadosAtuais, email: novoEmail, avatarUrl: novoAvatar, plano: planoAtual, videos: meusVideos, inscricoes: inscricoes };
      localStorage.setItem("nosafee_logado", novoNomeLimpo);
      setUsuario(novoNomeLimpo);
    } else {
      novoBanco[usuario] = { ...dadosAtuais, email: novoEmail, avatarUrl: novoAvatar, plano: planoAtual, videos: meusVideos, inscricoes: inscricoes };
    }
    setUsuarios(novoBanco);
    localStorage.setItem("nosafee_usuarios", JSON.stringify(novoBanco));
    setTimeout(() => { setSalvandoPerfil(false); alert("Perfil atualizado com sucesso!"); }, 800);
  };

  const handleLogout = () => {
    setLogado(false);
    setUsuario("");
    setPlanoAtual("free");
    setMeusVideos([]);
    setInscricoes([]);
    setAbaAtiva("inicio");
    setAbaCanal("videos");
    setVideoAssistindo(null);
    setFilmeSelecionado(null);
    setCanalSelecionado(null);
    setBusca("");
    setSenhaInput("");
    setEmailInput("");
    setMostrarMensagens(false);
    setMostrarNotificacoes(false);
    setConversaAtiva(null);
    localStorage.removeItem("nosafee_logado");
  };

  const todosVideosLista = todosOsVideosDoSite();
  const buscaSemArroba = busca.replace("@", "").toLowerCase();
  const videosFiltrados = todosVideosLista.filter((v) => {
    const passaBusca = v.titulo.toLowerCase().includes(buscaSemArroba);
    const passaCategoria = categoriaAtiva === "Todas" || v.categoria === categoriaAtiva;
    return passaBusca && passaCategoria;
  });
  const naoVistosSeguindo = inscricoes.filter((c) => !seguindoVistos.includes(c)).length;
  const viewsDoVideo = (v: any) => {
    const count = views[v.id] || 0;
    const tempo = getTempoPublicado(v.views || "");
    return `${formatarViews(count)}${tempo ? ` • ${tempo}` : ""}`;
  };
  const limiteAtual = planos.find((p) => p.id === planoAtual)?.limiteMB || 50;
  const nomePlano = planos.find((p) => p.id === planoAtual)?.nome || "Iniciante";

  if (!carregouIdade) return <div className="h-screen bg-[#0f0f0f]"></div>;

  if (!idadeVerificada) {
    return (
      <div className="h-screen w-full bg-[#0f0f0f] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#e888d3] via-transparent to-[#e888d3]"></div>
        </div>
        <div className="relative z-10 max-w-lg w-full text-center">
          <div className="flex justify-center mb-10">
            <img src="/logo.png" alt="nosafee" className="h-20 object-contain" />
          </div>
          <h1 className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
            Este site é uma comunidade que pode conter <span className="text-white font-medium">conteúdo sensível para menores de 18 anos</span>.<br />
            Você deve ter <span className="text-[#e888d3] font-bold">18 anos ou mais</span> para entrar.
          </h1>
          <button
            onClick={() => { localStorage.setItem("nosafee_idade_ok", "true"); setIdadeVerificada(true); }}
            className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 tracking-wide text-sm md:text-base uppercase cursor-pointer"
          >Tenho 18 anos ou mais • Entrar</button>
          <button onClick={() => { window.location.href = "https://www.google.com"; }} className="mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
            Tenho menos de 18 anos • Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ============ CABEÇALHO ============ */}
      <header className="flex items-center justify-between px-4 h-16 bg-[#121212] border-b border-[#e888d3] fixed top-0 w-full z-50">
        <div onClick={irParaInicio} className="flex items-center cursor-pointer">
          <img src="/logo.png" alt="nosafee" className="h-20 object-contain" />
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4 relative">
          {logado && (
            <button
              onClick={() => { setMostrarPagamento(true); setEtapaPagamento("planos"); }}
              className="hidden lg:flex items-center gap-1 bg-[#e888d3]/15 hover:bg-[#e888d3] border border-[#e888d3]/40 hover:border-[#e888d3] text-[#e888d3] hover:text-black text-xs font-medium px-3 py-1.5 rounded-full mr-5 flex-shrink-0 transition-all cursor-pointer group"
              title="Clique para mudar de plano"
            >
              <span className="material-icons-outlined text-sm">workspace_premium</span>
              <span>Plano {nomePlano}</span>
              <span className="material-icons-outlined text-sm opacity-70 group-hover:opacity-100">expand_more</span>
            </button>
          )}
          <div className="flex flex-1 items-center bg-[#121212] border border-[#303030] rounded-l-full px-4 py-2">
            <span className="material-icons-outlined text-gray-400 text-xl mr-2">search</span>
            <input
              type="text"
              placeholder="Pesquisar vídeos ou @usuários"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setMostrarSugestoes(e.target.value.trim().length > 0); }}
              onFocus={() => { if (busca.trim().length > 0) setMostrarSugestoes(true); }}
              onBlur={() => { setTimeout(() => setMostrarSugestoes(false), 200); }}
              className="bg-transparent outline-none w-full text-white placeholder-gray-400"
            />
          </div>
          <button className="bg-[#222222] border border-[#303030] border-l-0 rounded-r-full px-5 py-2 hover:bg-[#e888d3] text-gray-400 hover:text-black transition-all duration-300 cursor-pointer">
            <span className="material-icons-outlined">search</span>
          </button>

          {mostrarSugestoes && busca.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1c1c1c] border border-[#303030] rounded-xl shadow-2xl overflow-hidden z-[60]">
              {(() => {
                const resultados = buscarUsuarios(busca);
                if (resultados.length === 0) return <div className="px-4 py-3 text-sm text-gray-500 text-center">Nenhum usuário encontrado pra &quot;{busca}&quot;</div>;
                return (
                  <>
                    <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider border-b border-[#303030]">Canais</div>
                    {resultados.map((nome) => {
                      const info = getCanalInfo(`@${nome}`);
                      const videos = getVideosDoCanal(`@${nome}`);
                      return (
                        <div
                          key={nome}
                          onClick={() => { setCanalSelecionado(`@${nome}`); setAbaAtiva("canal-externo"); setVideoAssistindo(null); setFilmeSelecionado(null); setMostrarSugestoes(false); setBusca(""); marcarComoLida(nome); }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#272727] cursor-pointer transition"
                        >
                          {info.avatarUrl ? (
                            <img src={info.avatarUrl} alt={nome} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className={`w-10 h-10 ${info.cor} rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{nome.slice(0, 2).toUpperCase()}</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">@{nome}</p>
                            <p className="text-xs text-gray-500">{videos.length} {videos.length === 1 ? "vídeo" : "vídeos"}</p>
                          </div>
                          <span className="material-icons-outlined text-gray-500 text-base">arrow_forward</span>
                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {logado && (
            <div className="relative">
              <button
                onClick={() => { setMostrarNotificacoes(!mostrarNotificacoes); setMostrarSugestoes(false); }}
                className="relative p-2 hover:bg-[#272727] rounded-full transition cursor-pointer"
                title="Notificações"
              >
                <span className="material-icons-outlined text-gray-300">{naoLidasNotif > 0 ? "notifications" : "notifications_none"}</span>
                {naoLidasNotif > 0 && (
                  <span className="absolute top-0 right-0 bg-[#e888d3] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center animate-pulse">
                    {naoLidasNotif > 9 ? "9+" : naoLidasNotif}
                  </span>
                )}
              </button>

              {mostrarNotificacoes && (
                <>
                  <div className="fixed inset-0 z-[70]" onClick={() => setMostrarNotificacoes(false)} />
                  <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-[#1c1c1c] border border-[#303030] rounded-2xl shadow-2xl z-[80] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#303030]">
                      <h3 className="font-bold">Notificações</h3>
                      {minhasNotificacoes.length > 0 && (
                        <button onClick={limparNotificacoes} className="text-xs text-gray-400 hover:text-[#e888d3] transition cursor-pointer">Limpar tudo</button>
                      )}
                    </div>
                    <div className="max-h-[420px] overflow-y-auto">
                      {minhasNotificacoes.length === 0 ? (
                        <div className="p-8 text-center">
                          <span className="material-icons-outlined text-5xl text-gray-600 mb-2">notifications_off</span>
                          <p className="text-sm text-gray-400">Nenhuma notificação</p>
                          <p className="text-xs text-gray-500 mt-1">Você será avisado quando alguém interagir com você.</p>
                        </div>
                      ) : (
                        minhasNotificacoes.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              marcarNotifComoLida(n.id);
                              setMostrarNotificacoes(false);
                              if (n.tipo === "curtida" || n.tipo === "comentario") {
                                const v = todosOsVideosDoSite().find((x) => x.id === n.videoId);
                                if (v) { setVideoAssistindo(v); setFilmeSelecionado(null); setCanalSelecionado(null); setAbaAtiva("inicio"); }
                              } else if (n.tipo === "seguidor") {
                                abrirPerfilDoChat(n.de);
                              }
                            }}
                            className={`flex items-start gap-3 px-4 py-3 border-b border-[#252525] hover:bg-[#222] transition cursor-pointer ${!n.lida ? "bg-[#e888d3]/5" : ""}`}
                          >
                            <div className="w-10 h-10 rounded-full bg-[#e888d3] flex items-center justify-center flex-shrink-0">
                              <span className="material-icons-outlined text-black text-lg">
                                {n.tipo === "seguidor" ? "person_add" : n.tipo === "curtida" ? "thumb_up" : "chat"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm">{n.texto}</p>
                              {n.videoTitulo && <p className="text-xs text-gray-500 truncate mt-0.5">{n.videoTitulo}</p>}
                              <p className="text-xs text-gray-500 mt-1">{formatarTempo(n.timestamp)}</p>
                            </div>
                            {!n.lida && <div className="w-2 h-2 rounded-full bg-[#e888d3] flex-shrink-0 mt-2" />}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={() => setMostrarUpload(true)}
            className="flex items-center gap-2 bg-[#222222] hover:bg-[#e888d3] hover:text-black px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
          >
            <span className="material-icons-outlined text-xl">file_upload</span>
            Enviar vídeo
          </button>
        </div>
      </header>

      {/* ============ CORPO ============ */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        <aside className="w-60 bg-[#0f0f0f] overflow-y-auto hidden md:block px-3 py-2">
          <ul className="space-y-1">
            <li
              onClick={irParaInicio}
              className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer font-medium ${abaAtiva === "inicio" && !videoAssistindo && !canalSelecionado && !filmeSelecionado ? "bg-[#e888d3] text-black" : "hover:bg-[#272727]"}`}
            >
              <span className="material-icons-outlined">home</span> Início
            </li>
            <li
              onClick={() => { setAbaAtiva("shorts"); setVideoAssistindo(null); setCanalSelecionado(null); setFilmeSelecionado(null); }}
              className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${abaAtiva === "shorts" ? "bg-[#e888d3] text-black" : "hover:bg-[#272727]"}`}
            >
              <span className="material-icons-outlined">video_library</span> Shorts
            </li>
            <li onClick={() => setMostrarCategorias(!mostrarCategorias)} className="flex items-center gap-4 px-3 py-2 hover:bg-[#272727] rounded-lg cursor-pointer">
              <span className="material-icons-outlined">category</span> Categorias
              <span className="material-icons-outlined text-sm ml-auto">{mostrarCategorias ? "expand_less" : "expand_more"}</span>
            </li>
            {mostrarCategorias && (
              <li className="mt-1">
                <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-2 space-y-0.5">
                  {categorias.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setCategoriaAtiva(cat);
                        setVideoAssistindo(null);
                        setCanalSelecionado(null);
                        setFilmeSelecionado(null);
                        if (cat === "Filmes") {
                          setAbaAtiva("filmes");
                        } else {
                          setAbaAtiva("inicio");
                        }
                      }}
                      className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition-all flex items-center justify-between ${categoriaAtiva === cat ? "bg-[#e888d3] text-black font-semibold" : "hover:bg-[#272727] text-gray-300"}`}
                    >
                      <span>{cat}</span>
                      {categoriaAtiva === cat && <span className="material-icons-outlined text-base">check</span>}
                    </div>
                  ))}
                </div>
              </li>
            )}
          </ul>

          <hr className="border-[#303030] my-3" />

          <ul className="space-y-1">
            <li
              onClick={() => {
                if (!logado) { setModoAuth("login"); setMostrarLogin(true); }
                else { setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); setVideoAssistindo(null); setFilmeSelecionado(null); setBusca(""); }
              }}
              className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${abaAtiva === "canal-externo" && canalSelecionado === `@${usuario}` ? "bg-[#e888d3] text-black font-medium" : "hover:bg-[#272727]"}`}
            >
              {logado && usuarios[usuario]?.avatarUrl ? (
                <img src={usuarios[usuario].avatarUrl} alt={usuario} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <span className="material-icons-outlined">{logado ? "account_circle" : "login"}</span>
              )}
              {logado ? `@${usuario}` : "LOGIN/CADASTRE"}
            </li>

            {logado && (
              <li
                onClick={() => { setMostrarMensagens(true); setConversaAtiva(null); setMostrarSeguindo(false); }}
                className="flex items-center gap-4 px-3 py-2 hover:bg-[#272727] rounded-lg cursor-pointer"
              >
                <span className="material-icons-outlined">chat</span> Mensagens
                {(() => {
                  const totalNaoLidas = getTotalNaoLidas();
                  return totalNaoLidas > 0 ? <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#e888d3] text-black">{totalNaoLidas}</span> : null;
                })()}
              </li>
            )}

            <li>
              <div
                onClick={() => {
                  const vaiAbrir = !mostrarSeguindo;
                  setMostrarSeguindo(vaiAbrir);
                  if (vaiAbrir && inscricoes.length > 0) setTimeout(() => setSeguindoVistos([...inscricoes]), 800);
                }}
                className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${abaAtiva === "acompanhando" ? "bg-[#e888d3] text-black" : "hover:bg-[#272727]"}`}
              >
                <span className="material-icons-outlined">subscriptions</span> Seguindo
                <div className="ml-auto flex items-center gap-1">
                  {naoVistosSeguindo > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#e888d3] text-black animate-pulse">{naoVistosSeguindo}</span>
                  )}
                  <span className="material-icons-outlined text-sm">{mostrarSeguindo ? "expand_less" : "expand_more"}</span>
                </div>
              </div>

              {mostrarSeguindo && (
                <div className="mt-1">
                  {!logado ? (
                    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Faça login para ver seus canais.</p></div>
                  ) : inscricoes.length === 0 ? (
                    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-3 text-center"><p className="text-xs text-gray-400">Você ainda não segue nenhum canal.</p></div>
                  ) : (
                    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-2 space-y-0.5">
                      {inscricoes.map((canal) => {
                        const info = getCanalInfo(canal);
                        const nomeLimpo = canal.replace("@", "");
                        const msgs = getMensagens(nomeLimpo);
                        const naoLidas = msgs.filter((m: any) => m.para === usuario && !m.lida).length;
                        return (
                          <div
                            key={canal}
                            onClick={() => { setCanalSelecionado(canal); setAbaAtiva("canal-externo"); setVideoAssistindo(null); setFilmeSelecionado(null); marcarComoLida(nomeLimpo); }}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#272727] transition"
                          >
                            {info.avatarUrl ? (
                              <img src={info.avatarUrl} alt={canal} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                            ) : (
                              <div className={`w-6 h-6 ${info.cor} rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>{canal.replace("@", "").slice(0, 2).toUpperCase()}</div>
                            )}
                            <span className="text-xs text-gray-300 truncate flex-1">{canal}</span>
                            {naoLidas > 0 && <span className="bg-[#e888d3] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{naoLidas}</span>}
                          </div>
                        );
                      })}
                      <div
                        onClick={() => { setAbaAtiva("acompanhando"); setVideoAssistindo(null); setCanalSelecionado(null); setFilmeSelecionado(null); }}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#272727] transition mt-1 border-t border-[#2a2a2a] pt-2"
                      >
                        <span className="material-icons-outlined text-sm text-[#e888d3]">arrow_forward</span>
                        <span className="text-xs text-[#e888d3] font-medium">Ver todos</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>

            {logado && (
              <li onClick={handleLogout} className="flex items-center gap-4 px-3 py-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg cursor-pointer transition-all duration-200">
                <span className="material-icons-outlined">logout</span> Sair
              </li>
            )}
          </ul>
        </aside>

        <main
          ref={mainRef}
          className={`flex-1 bg-[#0f0f0f] ${abaAtiva === "shorts" && !videoAssistindo && !canalSelecionado && !filmeSelecionado ? "overflow-y-scroll snap-y snap-mandatory scrollbar-hide" : "overflow-y-auto"}`}
        >
          {/* ===== FILME SELECIONADO ===== */}
          {filmeSelecionado ? (
            <div className="h-full flex flex-col bg-black">
              <div className="p-4 flex items-center justify-between flex-wrap gap-3">
                <button
                  onClick={() => setFilmeSelecionado(null)}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#e888d3] transition-colors cursor-pointer"
                >
                  <span className="material-icons-outlined">arrow_back</span>
                  Voltar para a lista de filmes
                </button>
                <p className="text-sm text-gray-400">{filmeSelecionado.titulo} ({filmeSelecionado.ano})</p>
              </div>

                           <div className="flex-1 relative">
                <iframe
                  key={filmeSelecionado.id}
                  src={`https://embedplayapi.top/embed/${filmeSelecionado.id}`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  title={filmeSelecionado.titulo}
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              </div>
    
          ) : videoAssistindo ? (
            <AssistirVideo
              video={videoAssistindo}
              todosVideos={todosVideosLista}
              onVoltar={() => setVideoAssistindo(null)}
              onSelecionarVideo={(v: any) => { setVideoAssistindo(v); if (mainRef.current) mainRef.current.scrollTop = 0; }}
              usuario={usuario}
              logado={logado}
              inscricoes={inscricoes}
              usuarios={usuarios}
              onCanalClick={abrirCanal}
              curtidas={curtidas}
              onToggleCurtida={toggleCurtida}
              onComentar={(videoId: string, texto: string) => {
                const v = todosOsVideosDoSite().find((x) => x.id === videoId);
                if (!v) return;
                const dono = v.canal.replace("@", "");
                if (dono !== usuario && usuarios[dono]) {
                  adicionarNotificacao(dono, { tipo: "comentario", de: usuario, videoId: v.id, videoTitulo: v.titulo, texto: `@${usuario} comentou: "${texto.substring(0, 40)}${texto.length > 40 ? "..." : ""}"` });
                }
              }}
              onLoginNecessario={() => { setModoAuth("login"); setMostrarLogin(true); }}
              onSeguir={seguirCanal}
              onDeixarDeSeguir={deixarDeSeguirCanal}
              views={views}
            />
          ) : canalSelecionado ? (
            <div className="p-6 max-w-5xl">
              <button onClick={() => setCanalSelecionado(null)} className="flex items-center gap-2 mb-4 text-sm text-gray-300 hover:text-[#e888d3] transition cursor-pointer">
                <span className="material-icons-outlined">arrow_back</span> Voltar
              </button>
              {(() => {
                const info = getCanalInfo(canalSelecionado);
                const videos = getVideosDoCanal(canalSelecionado);
                const seguindo = inscricoes.includes(canalSelecionado);
                const seguidores = getSeguidores(canalSelecionado);
                const ehMeuPerfil = logado && canalSelecionado === `@${usuario}`;
                return (
                  <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                      {info.avatarUrl ? (
                        <img src={info.avatarUrl} alt={canalSelecionado} className="w-28 h-28 rounded-full object-cover border-4 border-[#e888d3]" />
                      ) : (
                        <div className={`w-28 h-28 ${info.cor} rounded-full flex items-center justify-center text-4xl font-bold border-4 border-[#e888d3] text-white`}>{canalSelecionado.replace("@", "").slice(0, 2).toUpperCase()}</div>
                      )}
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-1">{canalSelecionado}</h1>
                        <p className="text-gray-400 text-sm mb-3">{seguidores.toLocaleString("pt-BR")} seguidores • {videos.length} {videos.length === 1 ? "vídeo" : "vídeos"}</p>
                        {ehMeuPerfil ? (
                          <button
                            onClick={() => { setCanalSelecionado(null); setAbaAtiva("canal"); setAbaCanal("videos"); }}
                            className="px-6 py-2.5 rounded-full text-sm font-medium transition-all bg-[#e888d3] hover:bg-[#d176be] text-black flex items-center gap-2 cursor-pointer"
                          >
                            <span className="material-icons-outlined text-base">settings</span> Gerenciar meus vídeos
                          </button>
                        ) : (
                          <button
                            onClick={() => { if (seguindo) deixarDeSeguirCanal(canalSelecionado); else seguirCanal(canalSelecionado); }}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${seguindo ? "bg-[#272727] text-white hover:bg-[#3f3f3f]" : "bg-white text-black hover:bg-gray-200"}`}
                          >
                            {seguindo ? "Seguindo" : "Seguir"}
                          </button>
                        )}
                      </div>
                    </div>
                    <h2 className="font-bold text-lg mb-4">Vídeos do usuário</h2>
                    {videos.length === 0 ? (
                      <div className="text-center py-16 bg-[#1c1c1c] rounded-2xl">
                        <span className="material-icons-outlined text-5xl text-gray-600 mb-3">videocam_off</span>
                        <p className="text-gray-400">Este usuário não tem vídeos ainda.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
                        {videos.map((v) => (
                          <div
                            key={v.id}
                            onClick={() => { setVideoAssistindo(v); setCanalSelecionado(null); if (mainRef.current) mainRef.current.scrollTop = 0; }}
                            className="cursor-pointer group"
                          >
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                              <img src={v.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={v.titulo} />
                              <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-1 rounded">{v.duracao}</span>
                            </div>
                            <div className="flex gap-3 mt-3">
                              {info.avatarUrl ? (
                                <img src={info.avatarUrl} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" alt={v.canal} />
                              ) : (
                                <div className={`w-9 h-9 ${info.cor} rounded-full flex-shrink-0`}></div>
                              )}
                              <div className="flex flex-col">
                                <h3 className="font-semibold text-sm line-clamp-2 leading-5">{v.titulo}</h3>
                                <p className="text-gray-400 text-xs mt-1">{v.canal}</p>
                                <p className="text-gray-400 text-xs">{viewsDoVideo(v)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : abaAtiva === "shorts" ? (
            <Shorts
              curtidas={curtidas}
              onToggleCurtida={toggleCurtida}
              usuario={usuario}
              comentariosShorts={comentariosShorts}
              setComentariosShorts={setComentariosShorts}
              onLoginNecessario={() => { setModoAuth("login"); setMostrarLogin(true); }}
              onCanalClick={(canal: string) => {
                setAbaAtiva("canal-externo");
                setCanalSelecionado(canal);
                setVideoAssistindo(null);
                setFilmeSelecionado(null);
              }}
              inscricoes={inscricoes}
              onSeguir={seguirCanal}
              onDeixarDeSeguir={deixarDeSeguirCanal}
            />
          ) : abaAtiva === "filmes" ? (
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-1">Filmes</h1>
              <p className="text-gray-400 text-sm mb-6">{filmes.length} filmes disponíveis • dublado e legendado</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filmes.map((filme) => (
                  <div
                    key={filme.id}
                    onClick={() => { setFilmeSelecionado(filme); setFonteFilme(0); setIdiomaFilme("dublado"); }}
                    className="cursor-pointer group"
                  >
                    <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br from-[#1c1c1c] to-[#0f0f0f] flex flex-col items-center justify-center p-3 border border-[#303030] group-hover:border-[#e888d3] transition">
                      <span className="material-icons-outlined text-5xl text-[#e888d3]/60 group-hover:text-[#e888d3] transition mb-2">movie</span>
                      <p className="text-center text-xs text-gray-300 line-clamp-3 leading-tight">{filme.titulo}</p>
                    </div>
                    <h3 className="font-semibold text-sm mt-3 line-clamp-2 leading-5 group-hover:text-[#e888d3] transition">{filme.titulo}</h3>
                    <p className="text-gray-400 text-xs">{filme.ano}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : abaAtiva === "acompanhando" ? (
            <div className="p-6 max-w-5xl">
              <h1 className="text-2xl font-bold mb-1">Seguindo</h1>
              <p className="text-gray-400 text-sm mb-6">
                {inscricoes.length === 0 ? "Você ainda não segue nenhum canal." : `${inscricoes.length} ${inscricoes.length === 1 ? "canal" : "canais"}`}
              </p>
              {!logado ? (
                <div className="text-center py-16 bg-[#1c1c1c] rounded-2xl">
                  <span className="material-icons-outlined text-5xl text-gray-600 mb-3">lock</span>
                  <p className="text-gray-400 mb-4">Faça login para ver os canais que você segue.</p>
                  <button onClick={() => { setModoAuth("login"); setMostrarLogin(true); }} className="bg-[#e888d3] hover:bg-[#d176be] text-black font-bold px-6 py-2 rounded-full transition cursor-pointer">Fazer login</button>
                </div>
              ) : inscricoes.length === 0 ? (
                <div className="text-center py-16 bg-[#1c1c1c] rounded-2xl">
                  <span className="material-icons-outlined text-5xl text-gray-600 mb-3">subscriptions</span>
                  <p className="text-gray-400">Você ainda não segue nenhum canal.</p>
                  <p className="text-gray-500 text-sm mt-2">Explore vídeos e clique em &quot;Seguir&quot; pra começar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inscricoes.map((canal) => {
                    const info = getCanalInfo(canal);
                    const videos = getVideosDoCanal(canal);
                    const seguidores = getSeguidores(canal);
                    return (
                      <div key={canal} className="bg-[#1c1c1c] rounded-2xl p-4 flex flex-col">
                        <div
                          onClick={() => { setCanalSelecionado(canal); setAbaAtiva("canal-externo"); setFilmeSelecionado(null); marcarComoLida(canal.replace("@", "")); }}
                          className="flex items-center gap-3 mb-4 cursor-pointer group"
                        >
                          {info.avatarUrl ? (
                            <img src={info.avatarUrl} className="w-14 h-14 rounded-full object-cover" alt={canal} />
                          ) : (
                            <div className={`w-14 h-14 ${info.cor} rounded-full flex items-center justify-center text-xl font-bold text-white`}>{canal.replace("@", "").slice(0, 2).toUpperCase()}</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate group-hover:text-[#e888d3] transition">{canal}</p>
                            <p className="text-xs text-gray-400">{seguidores.toLocaleString("pt-BR")} seguidores</p>
                            <p className="text-xs text-gray-500">{videos.length} {videos.length === 1 ? "vídeo" : "vídeos"}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deixarDeSeguirCanal(canal)}
                          className="w-full bg-[#272727] hover:bg-red-500/10 hover:text-red-500 text-sm font-medium py-2 rounded-full transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-icons-outlined text-base">close</span> Deixar de seguir
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : abaAtiva === "canal" ? (
            <div className="p-6 max-w-4xl">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {usuarios[usuario]?.avatarUrl ? (
                    <img src={usuarios[usuario].avatarUrl} alt={usuario} className="w-16 h-16 rounded-full object-cover border-2 border-[#e888d3]" />
                  ) : (
                    <div className="w-16 h-16 bg-[#e888d3] rounded-full flex items-center justify-center">
                      <span className="material-icons-outlined text-3xl text-black">person</span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold mb-1">Bem-vindo, @{usuario}</h1>
                    <p className="text-gray-400 text-sm mb-2">Aqui você pode gerenciar seus vídeos e sua conta.</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-[#e888d3]/20 border border-[#e888d3]/40 text-[#e888d3] text-xs font-medium px-2.5 py-1 rounded-full">
                        <span className="material-icons-outlined text-sm">workspace_premium</span> Plano {nomePlano}
                      </span>
                      <span className="text-xs text-gray-500">Limite: {limiteAtual} MB por vídeo</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); }}
                    className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 cursor-pointer"
                  >
                    <span className="material-icons-outlined text-base">visibility</span> Ver meu perfil
                  </button>
                  {planoAtual === "master" ? (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-[#e888d3]/20 to-[#e888d3]/5 border border-[#e888d3]/40 text-[#e888d3] px-4 py-2 rounded-full text-sm font-medium flex-shrink-0">
                      <span className="material-icons-outlined text-base">verified</span> Plano máximo ativo
                    </div>
                  ) : planoAtual === "ultra" ? (
                    <button onClick={() => { setMostrarPagamento(true); setEtapaPagamento("planos"); }} className="flex items-center gap-2 bg-[#e888d3] hover:bg-[#d176be] text-black px-4 py-2 rounded-full text-sm font-bold transition-all flex-shrink-0 cursor-pointer">
                      <span className="material-icons-outlined text-base">workspace_premium</span> Quero ser Master
                    </button>
                  ) : planoAtual === "essencial" ? (
                    <button onClick={() => { setMostrarPagamento(true); setEtapaPagamento("planos"); }} className="flex items-center gap-2 bg-[#e888d3] hover:bg-[#d176be] text-black px-4 py-2 rounded-full text-sm font-bold transition-all flex-shrink-0 cursor-pointer">
                      <span className="material-icons-outlined text-base">workspace_premium</span> Quero ser Ultra
                    </button>
                  ) : (
                    <button onClick={() => { setMostrarPagamento(true); setEtapaPagamento("planos"); }} className="flex items-center gap-2 bg-[#e888d3] hover:bg-[#d176be] text-black px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 cursor-pointer">
                      <span className="material-icons-outlined text-base">workspace_premium</span> Fazer upgrade
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-1 bg-[#1c1c1c] p-1 rounded-lg mb-6">
                <button onClick={() => setAbaCanal("videos")} className={`flex-1 py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer ${abaCanal === "videos" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#272727]"}`}>
                  <span className="material-icons-outlined text-base">video_library</span> Meus Vídeos
                </button>
                <button onClick={() => setAbaCanal("editar")} className={`flex-1 py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer ${abaCanal === "editar" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#272727]"}`}>
                  <span className="material-icons-outlined text-base">manage_accounts</span> Editar Perfil
                </button>
              </div>

              {abaCanal === "videos" && (
                <>
                  <div className="bg-[#1c1c1c] rounded-2xl p-5 mb-8">
                    <h2 className="font-bold text-lg mb-4">Postar novo vídeo</h2>
                    <div className="flex gap-1 mb-4 bg-[#0f0f0f] p-1 rounded-lg">
                      <button onClick={() => setModoUpload("arquivo")} className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1 cursor-pointer ${modoUpload === "arquivo" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#1c1c1c]"}`}>
                        <span className="material-icons-outlined text-base">upload_file</span> Do PC
                      </button>
                      <button onClick={() => setModoUpload("link")} className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1 cursor-pointer ${modoUpload === "link" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#1c1c1c]"}`}>
                        <span className="material-icons-outlined text-base">link</span> Do Link
                      </button>
                    </div>

                    {modoUpload === "arquivo" ? (
                      <>
                        <label className="flex flex-col items-center justify-center w-full bg-[#0f0f0f] border-2 border-dashed border-[#303030] hover:border-[#e888d3] rounded-lg px-4 py-6 mb-2 cursor-pointer transition">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              if (file && file.size > limiteAtual * 1024 * 1024) {
                                alert(`O vídeo é muito grande! Seu plano ${nomePlano} permite até ${limiteAtual} MB.`);
                                setArquivoVideo(null);
                                return;
                              }
                              setArquivoVideo(file);
                            }}
                            className="hidden"
                          />
                          <span className="material-icons-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                          <span className="text-sm text-gray-300 text-center">
                            {arquivoVideo ? `${arquivoVideo.name} (${(arquivoVideo.size / 1024 / 1024).toFixed(1)} MB)` : "Clique para escolher um vídeo do seu computador"}
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                          <span className="material-icons-outlined text-sm">info</span>
                          Seu plano {nomePlano} permite até {limiteAtual} MB por vídeo.
                        </p>
                      </>
                    ) : (
                      <input type="text" placeholder="Cole o link do vídeo (YouTube, etc)" value={urlModal} onChange={(e) => setUrlModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
                    )}

                    <input type="text" placeholder="Título do vídeo" value={tituloModal} onChange={(e) => setTituloModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
                    <textarea placeholder="Descrição (opcional)" rows={3} value={descModal} onChange={(e) => setDescModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]"></textarea>
                    <select value={catModal} onChange={(e) => setCatModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-4 text-white outline-none focus:border-[#e888d3]">
                      {categorias.slice(1).map((c) => <option key={c}>{c}</option>)}
                    </select>

                    <button
                      onClick={() => {
                        if (!tituloModal.trim()) { alert("Digite um título para o vídeo!"); return; }
                        if (modoUpload === "arquivo" && !arquivoVideo) { alert("Escolha um arquivo de vídeo!"); return; }
                        if (modoUpload === "link" && !urlModal.trim()) { alert("Cole o link do vídeo!"); return; }
                        const novoId = Date.now();
                        setMeusVideos([{ id: novoId, titulo: tituloModal, descricao: descModal || "Sem descrição.", url: modoUpload === "link" ? urlModal : arquivoVideo?.name || "", categoria: catModal, thumb: `https://picsum.photos/seed/${novoId}/640/360`, duracao: "00:00", canal: `@${usuario}`, views: "0 visualizações • agora", cor: "bg-pink-600" }, ...meusVideos]);
                        setViews((prev) => ({ ...prev, [novoId]: 0 }));
                        setTituloModal(""); setDescModal(""); setUrlModal(""); setArquivoVideo(null); setCatModal("Videogames"); setModoUpload("arquivo");
                        alert("Vídeo publicado!");
                      }}
                      className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer"
                    >Publicar</button>
                  </div>

                  <h2 className="font-bold text-lg mb-4">Meus vídeos ({meusVideos.length})</h2>
                  {meusVideos.length === 0 ? (
                    <p className="text-gray-400 text-sm">Você ainda não postou nenhum vídeo.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
                      {meusVideos.map((v) => (
                        <div key={v.id} onClick={() => setVideoAssistindo(v)} className="cursor-pointer group">
                          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                            <img src={v.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={v.titulo} />
                            <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-1 rounded">{v.duracao}</span>
                          </div>
                          <div className="flex gap-3 mt-3">
                            <div className={`w-9 h-9 ${v.cor} rounded-full flex-shrink-0`}></div>
                            <div className="flex flex-col">
                              <h3 className="font-semibold text-sm line-clamp-2 leading-5">{v.titulo}</h3>
                              <p className="text-gray-400 text-xs mt-1">{v.canal}</p>
                              <p className="text-gray-400 text-xs">{viewsDoVideo(v)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {abaCanal === "editar" && (
                <div className="bg-[#1c1c1c] rounded-2xl p-6">
                  <h2 className="font-bold text-lg mb-1">Editar Perfil</h2>
                  <p className="text-sm text-gray-400 mb-6">Atualize sua foto, nome de usuário e e-mail.</p>
                  <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#303030]">
                    <div className="relative">
                      {novoAvatar ? (
                        <img src={novoAvatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-[#e888d3]" />
                      ) : (
                        <div className="w-20 h-20 bg-[#e888d3] rounded-full flex items-center justify-center">
                          <span className="material-icons-outlined text-4xl text-black">person</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">@{usuario}</p>
                      <div className="flex gap-2">
                        <label className="cursor-pointer bg-[#e888d3] hover:bg-[#d176be] text-black text-xs font-bold px-3 py-1.5 rounded-full transition">
                          Trocar foto
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 2 * 1024 * 1024) { alert("Imagem muito grande! Máximo 2 MB."); return; }
                              const reader = new FileReader();
                              reader.onload = () => setNovoAvatar(reader.result as string);
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                        {novoAvatar && (
                          <button onClick={() => setNovoAvatar("")} className="bg-[#272727] hover:bg-[#3f3f3f] text-white text-xs font-medium px-3 py-1.5 rounded-full transition cursor-pointer">Remover</button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG ou GIF • máximo 2 MB</p>
                    </div>
                  </div>

                  <label className="block text-sm font-medium mb-2">Nome de usuário</label>
                  <div className="relative mb-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                    <input type="text" value={novoUsuario} onChange={(e) => setNovoUsuario(e.target.value.replace("@", "").toLowerCase())} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg pl-9 pr-4 py-2 text-white outline-none focus:border-[#e888d3]" />
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Este será seu nome público no site.</p>

                  <label className="block text-sm font-medium mb-2">E-mail</label>
                  <input type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 text-white outline-none focus:border-[#e888d3] mb-1" />
                  <p className="text-xs text-gray-500 mb-6">Usado para login e notificações.</p>

                  <button disabled={salvandoPerfil} onClick={handleSalvarPerfil} className="w-full bg-[#e888d3] hover:bg-[#d176be] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-2.5 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer">
                    {salvandoPerfil ? (
                      <><span className="material-icons-outlined animate-spin">refresh</span> Salvando...</>
                    ) : (
                      <><span className="material-icons-outlined text-base">save</span> Salvar alterações</>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8 mt-2">
                {videosFiltrados.length === 0 ? (
                  <p className="text-gray-400 col-span-4">Nenhum vídeo encontrado</p>
                ) : (
                  videosFiltrados.map((v) => (
                    <div key={v.id} onClick={() => setVideoAssistindo(v)} className="cursor-pointer group">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                        <img src={v.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={v.titulo} />
                        <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-1 rounded">{v.duracao}</span>
                      </div>
                      <div className="flex gap-3 mt-3">
                        <div className={`w-9 h-9 ${v.cor} rounded-full flex-shrink-0`}></div>
                        <div className="flex flex-col">
                          <h3 className="font-semibold text-sm line-clamp-2 leading-5">{v.titulo}</h3>
                          <p className="text-gray-400 text-xs mt-1">{v.canal}</p>
                          <p className="text-gray-400 text-xs">{viewsDoVideo(v)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============ MODAL: LOGIN / CADASTRO ============ */}
      {mostrarLogin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1c1c1c] rounded-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="relative p-6 border-b border-[#303030]">
              <button onClick={() => { setMostrarLogin(false); setSenhaInput(""); setEmailInput(""); setModoAuth("login"); }} className="absolute top-4 right-4 material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
              <h2 className="text-xl font-bold mb-1">{modoAuth === "login" ? "Entrar no nosafee" : "Criar sua conta"}</h2>
              <p className="text-sm text-gray-400">{modoAuth === "login" ? "Bem-vindo de volta! Acesse sua conta." : "Crie sua conta grátis. Depois escolha um plano."}</p>
            </div>
            <div className="px-6 pt-5">
              <div className="flex gap-1 bg-[#0f0f0f] p-1 rounded-lg">
                <button onClick={() => { setModoAuth("login"); setSenhaInput(""); setEmailInput(""); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1 cursor-pointer ${modoAuth === "login" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#1c1c1c]"}`}>
                  <span className="material-icons-outlined text-base">login</span> Entrar
                </button>
                <button onClick={() => { setModoAuth("cadastro"); setSenhaInput(""); setEmailInput(""); }} className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1 cursor-pointer ${modoAuth === "cadastro" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#1c1c1c]"}`}>
                  <span className="material-icons-outlined text-base">person_add</span> Criar conta
                </button>
              </div>
            </div>
            <div className="p-6">
              <input type="text" placeholder="Nome de usuário (@)" value={usuario} onChange={(e) => setUsuario(e.target.value.replace("@", "").toLowerCase())} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
              {modoAuth === "cadastro" && (
                <input type="email" placeholder="E-mail" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
              )}
              <input type="password" placeholder="Senha" value={senhaInput} onChange={(e) => setSenhaInput(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-4 text-white outline-none focus:border-[#e888d3]" />
              {modoAuth === "login" ? (
                <>
                  <button onClick={handleLogin} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Entrar</button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Ainda não tem conta?{" "}
                    <button onClick={() => { setModoAuth("cadastro"); setSenhaInput(""); setEmailInput(""); }} className="text-[#e888d3] hover:underline font-medium cursor-pointer">Crie uma agora</button>
                  </p>
                </>
              ) : (
                <>
                  <button onClick={handleCriarConta} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Criar conta</button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Já tem conta?{" "}
                    <button onClick={() => { setModoAuth("login"); setSenhaInput(""); setEmailInput(""); }} className="text-[#e888d3] hover:underline font-medium cursor-pointer">Faça login</button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL: PLANOS ============ */}
      {mostrarPagamento && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[110] p-4 overflow-y-auto">
          <div className="bg-[#1c1c1c] rounded-2xl w-full max-w-6xl my-8">
            <div className="relative p-6 border-b border-[#303030]">
              <button
                onClick={() => {
                  setMostrarPagamento(false);
                  setPlanoSelecionado(null);
                  setEtapaPagamento("planos");
                  setProcessandoPagamento(false);
                  if (!logado && usuario) { setLogado(true); setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); localStorage.setItem("nosafee_logado", usuario); }
                }}
                className="absolute top-4 right-4 material-icons-outlined text-gray-400 hover:text-white cursor-pointer"
              >close</button>
              <h2 className="text-2xl font-bold mb-1">{etapaPagamento === "planos" ? "Bem-vindo! Escolha seu plano" : `Pagamento • ${planoSelecionado?.nome}`}</h2>
              <p className="text-sm text-gray-400">{etapaPagamento === "planos" ? "Comece de graça ou desbloqueie recursos com um plano pago." : "Finalize sua assinatura para ativar os recursos do plano."}</p>
            </div>

            {etapaPagamento === "planos" && (
              <>
                <div className="mx-6 mt-6 bg-[#e888d3]/10 border border-[#e888d3]/30 rounded-lg p-3 flex items-center gap-2 text-sm text-[#e888d3]">
                  <span className="material-icons-outlined text-base">celebration</span>
                  Conta criada com sucesso! Bem-vindo, @{usuario}.
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {planos.map((plano) => {
                    const indiceAtual = ordemPlanos.indexOf(planoAtual);
                    const indicePlano = ordemPlanos.indexOf(plano.id);
                    const ehPlanoAtual = plano.id === planoAtual && logado;
                    const ehPlanoInferior = logado && indicePlano < indiceAtual;
                    return (
                      <div key={plano.id} className={`relative rounded-2xl p-5 flex flex-col transition-all ${ehPlanoAtual ? "bg-[#1c1c1c] border-2 border-green-500" : plano.popular ? "bg-[#1c1c1c] border-2 border-[#e888d3]" : "bg-[#161616] border border-[#303030]"}`}>
                        {plano.popular && !ehPlanoAtual && (
                          <div className="absolute -top-3 left-0 right-0 flex justify-center">
                            <span className="bg-[#e888d3] text-black text-xs font-bold px-3 py-1 rounded-full">Mais popular</span>
                          </div>
                        )}
                        {ehPlanoAtual && (
                          <div className="absolute -top-3 left-0 right-0 flex justify-center">
                            <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                              <span className="material-icons-outlined text-sm">check_circle</span> Seu plano atual
                            </span>
                          </div>
                        )}
                        <h3 className="text-lg font-bold mb-3">{plano.nome}</h3>
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            {plano.precoOriginal && !ehPlanoAtual && (
                              <span className="text-gray-500 text-lg line-through">R$ {plano.precoOriginal.toFixed(2).replace(".", ",")}</span>
                            )}
                            <span className="text-3xl font-bold">{plano.preco === 0 ? "R$ 0" : `R$ ${plano.preco.toFixed(2).replace(".", ",")}`}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{plano.periodo}</p>
                        </div>

                        {ehPlanoAtual ? (
                          <button
                            onClick={() => {
                              if (plano.id === "free") { setMostrarPagamento(false); setLogado(true); setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); localStorage.setItem("nosafee_logado", usuario); alert("Você está no plano Iniciante."); }
                              else alert("Renovação do plano " + plano.nome + " realizada!");
                            }}
                            className="w-full py-2.5 rounded-full font-medium text-sm mb-5 transition-all bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30 cursor-pointer"
                          >{plano.id === "free" ? "Continuar" : "Renovar plano"}</button>
                        ) : ehPlanoInferior ? (
                          <button disabled className="w-full py-2.5 rounded-full font-medium text-sm mb-5 bg-[#272727] text-gray-500 cursor-not-allowed flex items-center justify-center gap-1">
                            <span className="material-icons-outlined text-base">block</span> Você já tem {nomePlano}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (plano.id === "free") { setPlanoAtual("free"); setMostrarPagamento(false); setLogado(true); setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); localStorage.setItem("nosafee_logado", usuario); alert("Tudo pronto! Bem-vindo, @" + usuario + "!"); }
                              else { setPlanoSelecionado(plano); setEtapaPagamento("pagamento"); }
                            }}
                            className={`w-full py-2.5 rounded-full font-medium text-sm mb-5 transition-all cursor-pointer ${plano.popular ? "bg-[#e888d3] hover:bg-[#d176be] text-black" : "bg-[#272727] hover:bg-[#3f3f3f] text-white"}`}
                          >{plano.botao}</button>
                        )}

                        <ul className="space-y-2.5 text-sm text-gray-300">
                          {plano.recursos.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="material-icons-outlined text-[#e888d3] text-lg flex-shrink-0">check_circle</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {etapaPagamento === "pagamento" && planoSelecionado && (
              <div className="p-6 max-w-md mx-auto">
                <button onClick={() => { setEtapaPagamento("planos"); setPlanoSelecionado(null); }} className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#e888d3] mb-4 transition cursor-pointer">
                  <span className="material-icons-outlined text-base">arrow_back</span> Trocar plano
                </button>
                <div className="bg-[#0f0f0f] border border-[#e888d3]/40 rounded-xl p-4 mb-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-bold">Plano {planoSelecionado.nome}</span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#e888d3]">R$ {planoSelecionado.preco.toFixed(2).replace(".", ",")}</div>
                      <div className="text-xs text-gray-500">por mês</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Cobrado anualmente • R$ {(planoSelecionado.preco * 12).toFixed(2).replace(".", ",")}</p>
                </div>
                <p className="text-sm font-medium mb-3">Forma de pagamento</p>
                <div className="flex gap-2 mb-5">
                  <button onClick={() => setMetodoPagamento("pix")} className={`flex-1 py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 border cursor-pointer ${metodoPagamento === "pix" ? "bg-[#e888d3] text-black border-[#e888d3]" : "bg-[#0f0f0f] text-gray-300 border-[#303030] hover:border-[#e888d3]/50"}`}>
                    <span className="material-icons-outlined text-base">qr_code_2</span> PIX
                  </button>
                  <button onClick={() => setMetodoPagamento("cartao")} className={`flex-1 py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 border cursor-pointer ${metodoPagamento === "cartao" ? "bg-[#e888d3] text-black border-[#e888d3]" : "bg-[#0f0f0f] text-gray-300 border-[#303030] hover:border-[#e888d3]/50"}`}>
                    <span className="material-icons-outlined text-base">credit_card</span> Cartão
                  </button>
                </div>
                {metodoPagamento === "pix" ? (
                  <div className="bg-[#0f0f0f] border border-[#303030] rounded-lg p-4 mb-5 text-center">
                    <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center mb-3">
                      <span className="material-icons-outlined text-black text-6xl">qr_code_2</span>
                    </div>
                    <p className="text-xs text-gray-400">Escaneie o QR Code no app do seu banco</p>
                  </div>
                ) : (
                  <div className="space-y-2 mb-5">
                    <input type="text" placeholder="Número do cartão" className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 text-white outline-none focus:border-[#e888d3] text-sm" />
                    <div className="flex gap-2">
                      <input type="text" placeholder="MM/AA" className="flex-1 bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 text-white outline-none focus:border-[#e888d3] text-sm" />
                      <input type="text" placeholder="CVV" className="flex-1 bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 text-white outline-none focus:border-[#e888d3] text-sm" />
                    </div>
                    <input type="text" placeholder="Nome impresso no cartão" className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 text-white outline-none focus:border-[#e888d3] text-sm" />
                  </div>
                )}
                <button
                  disabled={processandoPagamento}
                  onClick={() => {
                    setProcessandoPagamento(true);
                    setTimeout(() => {
                      setProcessandoPagamento(false);
                      setPlanoAtual(planoSelecionado?.id || "free");
                      setMostrarPagamento(false);
                      setPlanoSelecionado(null);
                      setEtapaPagamento("planos");
                      setLogado(true);
                      setCanalSelecionado(`@${usuario}`);
                      setAbaAtiva("canal-externo");
                      localStorage.setItem("nosafee_logado", usuario);
                      alert("Plano " + planoSelecionado?.nome + " ativado! Bem-vindo, @" + usuario);
                    }, 2000);
                  }}
                  className="w-full bg-[#e888d3] hover:bg-[#d176be] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {processandoPagamento ? (
                    <><span className="material-icons-outlined animate-spin">refresh</span> Processando...</>
                  ) : (
                    <>Pagar R$ {planoSelecionado.preco.toFixed(2).replace(".", ",")} e ativar plano</>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">Ao continuar, você concorda com os Termos de Uso.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ MODAL: UPLOAD ============ */}
      {mostrarUpload && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1c1c1c] p-6 rounded-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Enviar vídeo</h2>
              <button onClick={() => setMostrarUpload(false)} className="material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
            </div>
            {!logado ? (
              <div className="text-center">
                <p className="text-gray-300 mb-4">Você precisa estar logado para postar vídeos!</p>
                <button onClick={() => { setMostrarUpload(false); setModoAuth("login"); setMostrarLogin(true); }} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Fazer login / Criar conta</button>
              </div>
            ) : (
              <>
                <div className="flex gap-1 mb-4 bg-[#0f0f0f] p-1 rounded-lg">
                  <button onClick={() => setModoUpload("arquivo")} className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1 cursor-pointer ${modoUpload === "arquivo" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#1c1c1c]"}`}>
                    <span className="material-icons-outlined text-base">upload_file</span> Do PC
                  </button>
                  <button onClick={() => setModoUpload("link")} className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-1 cursor-pointer ${modoUpload === "link" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#1c1c1c]"}`}>
                    <span className="material-icons-outlined text-base">link</span> Do Link
                  </button>
                </div>

                {modoUpload === "arquivo" ? (
                  <>
                    <label className="flex flex-col items-center justify-center w-full bg-[#0f0f0f] border-2 border-dashed border-[#303030] hover:border-[#e888d3] rounded-lg px-4 py-6 mb-2 cursor-pointer transition">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file && file.size > limiteAtual * 1024 * 1024) { alert(`O vídeo é muito grande! Seu plano ${nomePlano} permite até ${limiteAtual} MB.`); setArquivoVideo(null); return; }
                          setArquivoVideo(file);
                        }}
                        className="hidden"
                      />
                      <span className="material-icons-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                      <span className="text-sm text-gray-300 text-center">
                        {arquivoVideo ? `${arquivoVideo.name} (${(arquivoVideo.size / 1024 / 1024).toFixed(1)} MB)` : "Clique para escolher um vídeo do seu computador"}
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <span className="material-icons-outlined text-sm">info</span>
                      Seu plano {nomePlano} permite até {limiteAtual} MB por vídeo.
                    </p>
                  </>
                ) : (
                  <input type="text" placeholder="Cole o link do vídeo (YouTube, etc)" value={urlModal} onChange={(e) => setUrlModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
                )}

                <input type="text" placeholder="Título do vídeo" value={tituloModal} onChange={(e) => setTituloModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
                <textarea placeholder="Descrição do vídeo" rows={3} value={descModal} onChange={(e) => setDescModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]"></textarea>
                <select value={catModal} onChange={(e) => setCatModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-4 text-white outline-none focus:border-[#e888d3]">
                  {categorias.slice(1).map((c) => <option key={c}>{c}</option>)}
                </select>

                <button
                  onClick={() => {
                    if (!tituloModal.trim()) { alert("Digite um título para o vídeo!"); return; }
                    if (modoUpload === "arquivo" && !arquivoVideo) { alert("Escolha um arquivo de vídeo!"); return; }
                    if (modoUpload === "link" && !urlModal.trim()) { alert("Cole o link do vídeo!"); return; }
                    const novoId = Date.now();
                    setMeusVideos([{ id: novoId, titulo: tituloModal, descricao: descModal || "Sem descrição.", url: modoUpload === "link" ? urlModal : arquivoVideo?.name || "", categoria: catModal, thumb: `https://picsum.photos/seed/${novoId}/640/360`, duracao: "00:00", canal: `@${usuario}`, views: "0 visualizações • agora", cor: "bg-pink-600" }, ...meusVideos]);
                    setViews((prev) => ({ ...prev, [novoId]: 0 }));
                    setTituloModal(""); setDescModal(""); setUrlModal(""); setArquivoVideo(null); setCatModal("Videogames"); setModoUpload("arquivo");
                    setMostrarUpload(false); setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); setVideoAssistindo(null);
                  }}
                  className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer"
                >Publicar vídeo</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============ MODAL: MENSAGENS ============ */}
      {mostrarMensagens && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[120] p-4">
          <div className="bg-[#1c1c1c] rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#303030]">
              <div className="flex items-center gap-3">
                <span className="material-icons-outlined text-[#e888d3]">chat</span>
                <h2 className="text-lg font-bold">Mensagens</h2>
              </div>
              <button onClick={() => { setMostrarMensagens(false); setConversaAtiva(null); setTextoMensagem(""); }} className="material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className={`${conversaAtiva ? "hidden md:flex" : "flex"} flex-col w-full md:w-72 border-r border-[#303030] overflow-y-auto`}>
                {getContatos().length === 0 ? (
                  <div className="p-6 text-center">
                    <span className="material-icons-outlined text-5xl text-gray-600 mb-3">forum</span>
                    <p className="text-sm text-gray-400 mb-2">Nenhuma conversa ainda.</p>
                    <p className="text-xs text-gray-500">Você só pode conversar com quem te segue de volta.</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {getContatos().map((contato) => {
                      const info = getCanalInfo(`@${contato}`);
                      const msgs = getMensagens(contato);
                      const ultima = msgs[msgs.length - 1];
                      const ativo = conversaAtiva === contato;
                      const naoLidas = msgs.filter((m: any) => m.para === usuario && !m.lida).length;
                      return (
                        <div
                          key={contato}
                          onClick={() => { setConversaAtiva(contato); marcarComoLida(contato); }}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${ativo ? "bg-[#e888d3]/10 border-l-2 border-[#e888d3]" : "hover:bg-[#272727]"}`}
                        >
                          <div onClick={(e) => { e.stopPropagation(); abrirPerfilDoChat(contato); }} className="cursor-pointer group flex-shrink-0" title="Ver perfil">
                            {info.avatarUrl ? (
                              <img src={info.avatarUrl} className="w-12 h-12 rounded-full object-cover group-hover:ring-2 group-hover:ring-[#e888d3] transition" alt={contato} />
                            ) : (
                              <div className={`w-12 h-12 ${info.cor} rounded-full flex items-center justify-center text-sm font-bold text-white group-hover:ring-2 group-hover:ring-[#e888d3] transition`}>{contato.slice(0, 2).toUpperCase()}</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">@{contato}</p>
                            <p className={`text-xs truncate ${naoLidas > 0 ? "text-white font-medium" : "text-gray-400"}`}>
                              {ultima ? (ultima.de === usuario ? `Você: ${ultima.texto}` : ultima.texto) : "Diga oi!"}
                            </p>
                          </div>
                          {naoLidas > 0 && <span className="bg-[#e888d3] text-black text-xs font-bold px-2 py-0.5 rounded-full">{naoLidas}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={`${conversaAtiva ? "flex" : "hidden md:flex"} flex-col flex-1 overflow-hidden`}>
                {!conversaAtiva ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <span className="material-icons-outlined text-6xl text-gray-600 mb-4">chat_bubble_outline</span>
                    <p className="text-gray-400 mb-1">Selecione uma conversa</p>
                    <p className="text-xs text-gray-500">Escolha um contato à esquerda</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#303030]">
                      <button onClick={() => setConversaAtiva(null)} className="md:hidden material-icons-outlined text-gray-400 hover:text-white cursor-pointer">arrow_back</button>
                      <div onClick={() => abrirPerfilDoChat(conversaAtiva)} className="flex items-center gap-3 cursor-pointer group" title="Ver perfil">
                        {(() => {
                          const info = getCanalInfo(`@${conversaAtiva}`);
                          return info.avatarUrl ? (
                            <img src={info.avatarUrl} className="w-9 h-9 rounded-full object-cover group-hover:ring-2 group-hover:ring-[#e888d3] transition" alt={conversaAtiva} />
                          ) : (
                            <div className={`w-9 h-9 ${info.cor} rounded-full flex items-center justify-center text-xs font-bold text-white group-hover:ring-2 group-hover:ring-[#e888d3] transition`}>{conversaAtiva.slice(0, 2).toUpperCase()}</div>
                          );
                        })()}
                        <div>
                          <p className="font-medium text-sm group-hover:text-[#e888d3] transition">@{conversaAtiva}</p>
                          <p className="text-xs text-gray-500">Online</p>
                        </div>
                      </div>
                    </div>

                    <div className="conversa-scroll flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
                      {getMensagens(conversaAtiva).length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                          <span className="material-icons-outlined text-5xl text-gray-600 mb-3">waving_hand</span>
                          <p className="text-sm text-gray-400">Diga oi pra @{conversaAtiva}!</p>
                        </div>
                      ) : (
                        getMensagens(conversaAtiva).map((msg, i) => {
                          const ehMinha = msg.de === usuario;
                          return (
                            <div key={i} className={`flex ${ehMinha ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${ehMinha ? "bg-[#e888d3] text-black rounded-br-md" : "bg-[#272727] text-white rounded-bl-md"}`}>
                                {msg.texto}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="flex items-center gap-2 p-3 border-t border-[#303030]">
                      <input
                        type="text"
                        placeholder="Digite uma mensagem..."
                        value={textoMensagem}
                        onChange={(e) => setTextoMensagem(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensagem(conversaAtiva); } }}
                        className="flex-1 bg-[#0f0f0f] border border-[#303030] rounded-full px-4 py-2 text-sm text-white outline-none focus:border-[#e888d3]"
                      />
                      <button
                        onClick={() => enviarMensagem(conversaAtiva)}
                        disabled={!textoMensagem.trim()}
                        className="w-10 h-10 rounded-full bg-[#e888d3] hover:bg-[#d176be] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer"
                      >
                        <span className="material-icons-outlined text-black text-lg">send</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}