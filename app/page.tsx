"use client";

import { useState, useRef, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { supabase } from "@/lib/supabase";

// ============ DADOS FAKE ============
const videosFake = [
  { id: 1, titulo: "Fui banido pelo VACNET ao vivo na live (Partida cancelada)", canal: "@dj_nene", views: "12 mil visualizações • há 2 horas", thumb: "https://picsum.photos/seed/video1/640/360", duracao: "10:03", categoria: "Videogames", cor: "bg-blue-600", descricao: "Fui banido pelo VACNET ao vivo, foi uma partida muito emocionante." },
  { id: 2, titulo: "Busquei ela de Golf GTI no colégio", canal: "@canal_automotivo", views: "45 mil visualizações • há 1 dia", thumb: "https://picsum.photos/seed/video2/640/360", duracao: "17:03", categoria: "Automotivo", cor: "bg-green-600", descricao: "Hoje eu fui buscar ela no colégio com o Golf GTI." },
  { id: 3, titulo: "Bistecão fez cariani pagar almoço milionário", canal: "@podcast_brasil", views: "1,2 mi de visualizações • há 3 dias", thumb: "https://picsum.photos/seed/video3/640/360", duracao: "55:02", categoria: "Podcasts", cor: "bg-red-600", descricao: "Nesse episódio do podcast, o Bistecão fez o Cariani pagar um almoço que virou lenda!" },
];

const memesFake = [
  { id: "meme_1", titulo: "Meu chefe pedindo hora extra", thumb: "https://i.imgflip.com/30b1gx.jpg", autor: "@trabalho_sofr", likes: 1243, dislikes: 47, comentarios: 89 },
  { id: "meme_2", titulo: "Eu chegando na segunda-feira", thumb: "https://i.imgflip.com/1ur9b0.jpg", autor: "@humor_br", likes: 892, dislikes: 23, comentarios: 42 },
  { id: "meme_3", titulo: "Está tudo bem, vai dar certo", thumb: "https://i.imgflip.com/9ehk.jpg", autor: "@comedia", likes: 2431, dislikes: 98, comentarios: 156 },
  { id: "meme_4", titulo: "POV: você finalmente termina o projeto", thumb: "https://i.imgflip.com/1bh97n.jpg", autor: "@dev_life", likes: 573, dislikes: 12, comentarios: 28 },
  { id: "meme_5", titulo: "Quando o wi-fi cai no meio do jogo", thumb: "https://i.imgflip.com/1bhf.jpg", autor: "@tecnologia", likes: 1847, dislikes: 56, comentarios: 73 },
  { id: "meme_6", titulo: "Segunda-feira às 6 da manhã", thumb: "https://i.imgflip.com/1otk96.jpg", autor: "@escola_sofr", likes: 3201, dislikes: 143, comentarios: 210 },
  { id: "meme_7", titulo: "Minha mãe chegando no meu quarto", thumb: "https://i.imgflip.com/1bgw.jpg", autor: "@familia_br", likes: 852, dislikes: 15, comentarios: 47 },
  { id: "meme_8", titulo: "Eu tentando economizar dinheiro", thumb: "https://i.imgflip.com/26am.jpg", autor: "@financeiro", likes: 1523, dislikes: 34, comentarios: 92 },
  { id: "meme_9", titulo: "Quando alguém fala mal do meu time", thumb: "https://i.imgflip.com/1bhk.jpg", autor: "@futebol_br", likes: 4211, dislikes: 187, comentarios: 342 },
  { id: "meme_10", titulo: "Eu depois de comer demais no almoço", thumb: "https://i.imgflip.com/1ihzfe.jpg", autor: "@comida_sofr", likes: 987, dislikes: 21, comentarios: 65 },
];

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

const categorias = ["Todas", "Filmes", "NSFW"];

// ============ STORIES (FAKE) ============
const storiesFake: { [usuario: string]: any[] } = {
  "meme_lord": [
    { id: "sf_1_1", autor: "meme_lord", imagem: "https://picsum.photos/seed/storyA1/1080/1920", texto: "bom dia galera ☀️", timestamp: Date.now() - 3600000 },
    { id: "sf_1_2", autor: "meme_lord", imagem: "https://picsum.photos/seed/storyA2/1080/1920", texto: "sextou 🔥", timestamp: Date.now() - 3300000 },
  ],
  "humor_br": [
    { id: "sf_2_1", autor: "humor_br", imagem: "https://picsum.photos/seed/storyB1/1080/1920", texto: "acordei tarde kkkk", timestamp: Date.now() - 7200000 },
  ],
  "dev_life": [
    { id: "sf_3_1", autor: "dev_life", imagem: "https://picsum.photos/seed/storyC1/1080/1920", texto: "codando até tarde 💻", timestamp: Date.now() - 10800000 },
    { id: "sf_3_2", autor: "dev_life", imagem: "https://picsum.photos/seed/storyC2/1080/1920", texto: "chega né", timestamp: Date.now() - 10500000 },
  ],
};

const planos = [
  { id: "free", nome: "Iniciante", preco: 0, precoOriginal: null, periodo: "para sempre", popular: false, limiteMB: 50, recursos: ["50 MB por vídeo","10 min de duração máxima","Vídeos em HD","Com anúncios"], botao: "Começar de graça" },
  { id: "essencial", nome: "Essencial", preco: 9.9, precoOriginal: 12.9, periodo: "por mês • cobrado anualmente", popular: false, limiteMB: 500, recursos: ["500 MB por vídeo","50 GB de armazenamento","Vídeos em 4K Ultra HD","Sem anúncios"], botao: "Quero o Essencial" },
  { id: "ultra", nome: "Ultra", preco: 19.9, precoOriginal: 24.9, periodo: "por mês • cobrado anualmente", popular: true, limiteMB: 2000, recursos: ["2 GB por vídeo","200 GB de armazenamento","500 GB de banda","Suporte prioritário"], botao: "Quero o Ultra" },
  { id: "master", nome: "Master", preco: 49.9, precoOriginal: 59.9, periodo: "por mês • cobrado anualmente", popular: false, limiteMB: 10000, recursos: ["10 GB por vídeo","1 TB de armazenamento","2 TB de banda","Suporte 24/7 dedicado","Selo verificado dourado"], botao: "Virar Master" },
];

const ordemPlanos = ["free", "essencial", "ultra", "master"];
const coresCanais = ["bg-blue-600","bg-green-600","bg-red-600","bg-purple-600","bg-orange-600","bg-pink-600","bg-teal-600","bg-indigo-600"];

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

function comprimirImagem(file: File, maxLado = 900, qualidade = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxLado) {
          height = Math.round((height * maxLado) / width);
          width = maxLado;
        } else if (height > width && height > maxLado) {
          width = Math.round((width * maxLado) / height);
          height = maxLado;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("sem canvas context")); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", qualidade);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("erro ao carregar imagem"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("erro ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

// Detecta o tipo de URL de vídeo (YouTube, Vimeo ou arquivo direto do Cloudinary)
function getTipoVideo(url: string): { tipo: "youtube" | "vimeo" | "video" | "vazio"; embedUrl?: string } {
  if (!url || !url.trim()) return { tipo: "vazio" };

  const urlLimpa = url.trim();

  // YouTube
  const regexYoutube = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const matchYt = urlLimpa.match(regexYoutube);
  if (matchYt) {
    const params = "rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&fs=1&playsinline=1";
    return { tipo: "youtube", embedUrl: `https://www.youtube.com/embed/${matchYt[1]}?${params}` };
  }

  // Vimeo
  const regexVimeo = /vimeo\.com\/(?:video\/)?(\d+)/;
  const matchVm = urlLimpa.match(regexVimeo);
  if (matchVm) {
    return { tipo: "vimeo", embedUrl: `https://player.vimeo.com/video/${matchVm[1]}` };
  }

  // Cloudinary ou arquivo direto (.mp4, .webm, .mov, etc)
  if (
    urlLimpa.includes("res.cloudinary.com") ||
    /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i.test(urlLimpa)
  ) {
    return { tipo: "video" };
  }

  // Qualquer outra URL → rejeita
  return { tipo: "vazio" };
}

// Verifica se a URL é de YouTube, Vimeo ou Cloudinary
function urlVideoValida(url: string): boolean {
  if (!url || !url.trim()) return false;
  const urlLimpa = url.trim();
  const regexYoutube = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const regexVimeo = /vimeo\.com\/(?:video\/)?(\d+)/;
  return regexYoutube.test(urlLimpa) || regexVimeo.test(urlLimpa) || urlLimpa.includes("res.cloudinary.com");
}
function safeSetItem(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e: any) {
    if (e.name === "QuotaExceededError") {
      console.warn(`[localStorage] Cota estourada ao salvar "${key}".`);
    } else {
      console.error(`[localStorage] Erro ao salvar "${key}":`, e);
    }
  }
}

// ============ ASSISTIR VÍDEO ============
function AssistirVideo({
  video, todosVideos, comentariosBanco = {}, onVoltar, onSelecionarVideo, usuario, logado,
  inscricoes, usuarios, onCanalClick, curtidas, onToggleCurtida,
  onComentar, onLoginNecessario, onSeguir, onDeixarDeSeguir, views,
  onApagarVideo,
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
    const doBanco = comentariosBanco[video.id] || [];
    if (doBanco.length > 0) {
      setComentarios(doBanco);
    } else if (salvos) {
      setComentarios(JSON.parse(salvos));
    } else {
      setComentarios([
        { id: 1, autor: "@maria_silva", texto: "Muito bom!", tempo: "há 2 horas" },
        { id: 2, autor: "@joao_gamer", texto: "Que jogada insana!", tempo: "há 5 horas" },
      ]);
    }
    setCarregouComentarios(true);
  }, [video.id, comentariosBanco]);

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
            {(() => {
              const urlVideo = video.url || "";
              const info = getTipoVideo(urlVideo);

              // YouTube ou Vimeo (iframe)
              if ((info.tipo === "youtube" || info.tipo === "vimeo") && info.embedUrl) {
                return (
                  <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
                    <iframe
                      src={info.embedUrl}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen
                      title={video.titulo}
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                );
              }

              // Arquivo direto (Cloudinary, .mp4, etc)
              if (info.tipo === "video" && urlVideo) {
                return (
                  <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
                    <video
                      src={urlVideo}
                      controls
                      autoPlay
                      className="w-full h-full"
                      poster={video.thumb}
                    >
                      Seu navegador não suporta vídeo HTML5.
                    </video>
                  </div>
                );
              }

              // URL inválida / não suportada
              return (
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
                  <img src={video.thumb} alt={video.titulo} className="w-full h-full object-cover opacity-40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
                    <span className="material-icons-outlined text-gray-500 text-6xl">videocam_off</span>
                    <p className="text-gray-300 text-sm max-w-md">
                      Link inválido. Aceitamos <b>YouTube</b>, <b>Vimeo</b> ou upload direto.
                    </p>
                  </div>
                </div>
              );
            })()}
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
                {video.canal === `@${usuario}` && onApagarVideo && (
                  <button
                    onClick={() => {
                      if (!confirm(`Apagar o vídeo "${video.titulo}"?`)) return;
                      onApagarVideo(video.id);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all bg-[#272727] hover:bg-red-600 hover:text-white text-red-400 cursor-pointer"
                    title="Apagar vídeo"
                  >
                    <span className="material-icons-outlined text-lg">delete</span>
                    Apagar
                  </button>
                )}
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
                        onClick={async () => {
                          if (!logado) { onLoginNecessario(); return; }
                          const texto = comentario;
                          setComentarios([{ id: Date.now(), autor: usuario ? `@${usuario}` : "@anônimo", texto, tempo: "agora" }, ...comentarios]);
                          onComentar(video.id, texto);

                          try {
                            const { data: { user } } = await supabase.auth.getUser();
                            const meuId = user?.id;
                            if (meuId && typeof video.id === "string" && video.id.startsWith("db_")) {
                              const idNum = parseInt(video.id.replace("db_", ""));
                              if (!isNaN(idNum)) {
                                await supabase.from("video_comments").insert({
                                  video_id: idNum,
                                  user_id: meuId,
                                  texto,
                                });
                              }
                            }
                          } catch (err) { console.error("Erro comentar:", err); }

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
                    <p className="text-gray-400 text-xs">{formatarViews(views[v.id] || 0)}</p>
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
  const [mostrarSeguindo, setMostrarSeguindo] = useState(false);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [mostrarMensagens, setMostrarMensagens] = useState(false);
  const [conversaAtiva, setConversaAtiva] = useState<string | null>(null);
  const [textoMensagem, setTextoMensagem] = useState("");
  const [todasMensagens, setTodasMensagens] = useState<{ [key: string]: any[] }>({});
  const [mensagensBanco, setMensagensBanco] = useState<any[]>([]);
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [senhaInput, setSenhaInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [planoAtual, setPlanoAtual] = useState("free");
  const [carregou, setCarregou] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("social");
  const [videoAssistindo, setVideoAssistindo] = useState<any | null>(null);
  const [filmeSelecionado, setFilmeSelecionado] = useState<any | null>(null);
  const [canalSelecionado, setCanalSelecionado] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<{ [key: string]: any }>({});
  const [meusVideos, setMeusVideos] = useState<any[]>([]);
  const [inscricoes, setInscricoes] = useState<string[]>([]);
  const [seguindoVistos, setSeguindoVistos] = useState<string[]>([]);
  const [curtidas, setCurtidas] = useState<{ [videoId: string]: string[] }>({});
  const [comentariosBanco, setComentariosBanco] = useState<{ [videoId: string]: any[] }>({});
  const [views, setViews] = useState<{ [videoId: string]: number }>({});
  const [notificacoes, setNotificacoes] = useState<{ [userId: string]: any[] }>({});
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false);
  const [abaCanal, setAbaCanal] = useState<"videos" | "editar">("videos");
  const [novoUsuario, setNovoUsuario] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoAvatar, setNovoAvatar] = useState("");
  const [novaBio, setNovaBio] = useState("");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [modoUpload, setModoUpload] = useState<"arquivo" | "link">("arquivo");
  const [arquivoVideo, setArquivoVideo] = useState<File | null>(null);
  const [tituloModal, setTituloModal] = useState("");
  const [descModal, setDescModal] = useState("");
  const [urlModal, setUrlModal] = useState("");
  const [catModal, setCatModal] = useState("Filmes");
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState<"pix" | "cartao">("pix");
  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<any>(null);
  const [etapaPagamento, setEtapaPagamento] = useState<"planos" | "pagamento">("planos");

  const [videosBanco, setVideosBanco] = useState<any[]>([]);
  const [filmesUsuarios, setFilmesUsuarios] = useState<any[]>([]);
  const [mostrarUploadFilme, setMostrarUploadFilme] = useState(false);
  const [tituloFilmeInput, setTituloFilmeInput] = useState("");
  const [anoFilmeInput, setAnoFilmeInput] = useState("");
  const [imdbFilmeInput, setImdbFilmeInput] = useState("");

  const [memesBanco, setMemesBanco] = useState<any[]>([]);
  const [memesUsuarios, setMemesUsuarios] = useState<any[]>([]);
  const [votosBanco, setVotosBanco] = useState<{ [id: string]: { [user: string]: "like" | "dislike" } }>({});
  const [comentariosMemesBanco, setComentariosMemesBanco] = useState<{ [id: string]: any[] }>({});
  const [mostrarUploadMeme, setMostrarUploadMeme] = useState(false);
  const [tituloMemeInput, setTituloMemeInput] = useState("");
  const [imgMemeInput, setImgMemeInput] = useState("");
  const [arquivoMeme, setArquivoMeme] = useState<File | null>(null);
  const [memeCurtidas, setMemeCurtidas] = useState<{ [id: string]: string[] }>({});
  const [memeDislikes, setMemeDislikes] = useState<{ [id: string]: string[] }>({});
  const [comentariosMemes, setComentariosMemes] = useState<{ [id: string]: any[] }>({});
  const [memeComentariosAberto, setMemeComentariosAberto] = useState<string | null>(null);
  const [textoComentarioMeme, setTextoComentarioMeme] = useState("");
  const [respondendoMeme, setRespondendoMeme] = useState<number | null>(null);
  const [textoRespostaMeme, setTextoRespostaMeme] = useState("");

  const [postsUsuarios, setPostsUsuarios] = useState<{ [usuario: string]: any[] }>({});
  const [mostrarUploadPost, setMostrarUploadPost] = useState(false);
  const [imgPostInput, setImgPostInput] = useState("");
  const [legendaPostInput, setLegendaPostInput] = useState("");
  const [arquivoPost, setArquivoPost] = useState<File | null>(null);
  const [abaPerfil, setAbaPerfil] = useState<"videos" | "posts">("videos");
  const [postAberto, setPostAberto] = useState<any | null>(null);
  const [postCurtidas, setPostCurtidas] = useState<{ [postId: string]: string[] }>({});
  const [comentariosPosts, setComentariosPosts] = useState<{ [postId: string]: any[] }>({});
  const [textoComentarioPost, setTextoComentarioPost] = useState("");

  const [mostrarConfirmacaoNSFW, setMostrarConfirmacaoNSFW] = useState(false);
  const [modoClaro, setModoClaro] = useState(false);
  const [posters, setPosters] = useState<{ [id: string]: string }>({});
  const [recados, setRecados] = useState<{ [usuario: string]: any[] }>({});
  const [textoRecado, setTextoRecado] = useState("");
  const [mostrarEmojisRecado, setMostrarEmojisRecado] = useState(false);
  const [imagemRecado, setImagemRecado] = useState("");
  const [solicitacoes, setSolicitacoes] = useState<{ [paraUsuario: string]: any[] }>({});
  const [abaMsg, setAbaMsg] = useState<"conversas" | "solicitacoes">("conversas");

  const [resultadosBusca, setResultadosBusca] = useState<any>({
    usuarios: [],
    filmes: [],
    memes: [],
    posts: [],
    videos: [],
  });

  const [storiesUsuarios, setStoriesUsuarios] = useState<{ [usuario: string]: any[] }>({});
  const [storiesVistos, setStoriesVistos] = useState<{ [storyId: string]: string[] }>({});
  const [storyAberto, setStoryAberto] = useState<{ usuario: string; index: number } | null>(null);
  const [progressoStory, setProgressoStory] = useState(0);
  const [mostrarUploadStory, setMostrarUploadStory] = useState(false);
  const [imgStoryInput, setImgStoryInput] = useState("");
  const [textoStoryInput, setTextoStoryInput] = useState("");
  const [arquivoStory, setArquivoStory] = useState<File | null>(null);
  const [storyCurtidas, setStoryCurtidas] = useState<{ [storyId: string]: string[] }>({});
  const [textoRespostaStory, setTextoRespostaStory] = useState("");

  const mainRef = useRef<HTMLElement>(null);
  const ultimoCountRef = useRef(0);

  // ===== CARREGAR DO LOCALSTORAGE (só uma vez) =====
  useEffect(() => {
    (async () => {
    const usuariosSalvos = localStorage.getItem("nosafee_usuarios");
    const usuariosData = usuariosSalvos ? JSON.parse(usuariosSalvos) : {};
    setUsuarios(usuariosData);

    // ============ VERIFICA SESSÃO DO SUPABASE ============
    const { data: { session } } = await supabase.auth.getSession();
    let logadoSalvo: string | null = null;

    if (session?.user) {
      const { data: meuProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (meuProfile) {
        logadoSalvo = meuProfile.username;
        setUsuario(meuProfile.username);
        setLogado(true);
        setPlanoAtual(meuProfile.plano || "free");
      }
    }
    if (localStorage.getItem("nosafee_idade_ok") === "true") setIdadeVerificada(true);

    // (mensagens agora vêm do Supabase)

    const curtidasSalvas = localStorage.getItem("nosafee_curtidas");
    if (curtidasSalvas) setCurtidas(JSON.parse(curtidasSalvas));

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

    const filmesSalvos = localStorage.getItem("nosafee_filmes");
    if (filmesSalvos) setFilmesUsuarios(JSON.parse(filmesSalvos));

    const memesSalvos = localStorage.getItem("nosafee_memes");
    if (memesSalvos) setMemesUsuarios(JSON.parse(memesSalvos));

    const memeCurtidasSalvas = localStorage.getItem("nosafee_meme_curtidas");
    if (memeCurtidasSalvas) setMemeCurtidas(JSON.parse(memeCurtidasSalvas));

    const memeDislikesSalvos = localStorage.getItem("nosafee_meme_dislikes");
    if (memeDislikesSalvos) setMemeDislikes(JSON.parse(memeDislikesSalvos));

    const comentariosMemesSalvos = localStorage.getItem("nosafee_comentarios_memes");
    if (comentariosMemesSalvos) setComentariosMemes(JSON.parse(comentariosMemesSalvos));

    const recadosSalvos = localStorage.getItem("nosafee_recados");
    if (recadosSalvos) setRecados(JSON.parse(recadosSalvos));

    // (solicitações agora vêm do Supabase)

    const postsSalvos = localStorage.getItem("nosafee_posts");
    if (postsSalvos) setPostsUsuarios(JSON.parse(postsSalvos));

    const postCurtidasSalvas = localStorage.getItem("nosafee_post_curtidas");
    if (postCurtidasSalvas) setPostCurtidas(JSON.parse(postCurtidasSalvas));

    const comentariosPostsSalvos = localStorage.getItem("nosafee_post_comentarios");
    if (comentariosPostsSalvos) setComentariosPosts(JSON.parse(comentariosPostsSalvos));

    const storiesSalvos = localStorage.getItem("nosafee_stories");
    if (storiesSalvos) setStoriesUsuarios(JSON.parse(storiesSalvos));

    const storiesVistosSalvos = localStorage.getItem("nosafee_stories_vistos");
    if (storiesVistosSalvos) setStoriesVistos(JSON.parse(storiesVistosSalvos));

    const storyCurtidasSalvas = localStorage.getItem("nosafee_story_curtidas");
    if (storyCurtidasSalvas) setStoryCurtidas(JSON.parse(storyCurtidasSalvas));

    if (localStorage.getItem("nosafee_modo_claro") === "true") setModoClaro(true);

    try {
      const { data: todosProfiles } = await supabase.from("profiles").select("*");
      if (todosProfiles) {
        const mapa: any = {};
        todosProfiles.forEach((p: any) => {
          mapa[p.username] = {
            ...(usuariosData[p.username] || {}),
            email: p.email,
            avatarUrl: p.avatar_url || "",
            bio: p.bio || "",
            plano: p.plano || "free",
            idSupabase: p.id,
          };
        });
        setUsuarios((prev: any) => ({ ...prev, ...mapa }));
      }

      const { data: todosVideos } = await supabase
        .from("videos")
        .select("*, profiles!videos_user_id_fkey(username, avatar_url)")
        .order("created_at", { ascending: false });

      if (todosVideos) {
        const formatados = todosVideos.map((v: any) => ({
          id: `db_${v.id}`,
          dbId: v.id,
          titulo: v.titulo,
          descricao: v.descricao || "Sem descrição.",
          url: v.url,
          thumb: v.thumb || `https://picsum.photos/seed/db${v.id}/640/360`,
          duracao: v.duracao || "00:00",
          categoria: v.categoria || "Filmes",
          canal: `@${v.profiles?.username || "desconhecido"}`,
          views: `${v.views || 0} visualizações • recente`,
          cor: "bg-pink-600",
        }));
        setVideosBanco(formatados);
      }

      if (logadoSalvo && usuariosData[logadoSalvo]) {
        const meuProfile = todosProfiles?.find((p: any) => p.username === logadoSalvo);
        if (meuProfile) {
          const { data: followsData } = await supabase
            .from("follows")
            .select("profiles!follows_following_id_fkey(username)")
            .eq("follower_id", meuProfile.id);
          if (followsData) {
            setInscricoes(followsData.map((f: any) => `@${f.profiles.username}`));
          }
        }
      }

      // Curtidas do banco
      const { data: likesData } = await supabase
        .from("video_likes")
        .select("video_id, profiles!video_likes_user_id_fkey(username)");
      if (likesData) {
        const mapa: { [vid: string]: string[] } = {};
        likesData.forEach((l: any) => {
          const chave = `db_${l.video_id}`;
          if (!mapa[chave]) mapa[chave] = [];
          mapa[chave].push(l.profiles?.username || "");
        });
        setCurtidas((prev: any) => ({ ...prev, ...mapa }));
      }

      // Comentários do banco
      const { data: commentsData } = await supabase
        .from("video_comments")
        .select("id, video_id, texto, created_at, profiles!video_comments_user_id_fkey(username)")
        .order("created_at", { ascending: false });
      if (commentsData) {
        const mapa: { [vid: string]: any[] } = {};
        commentsData.forEach((c: any) => {
          const chave = `db_${c.video_id}`;
          if (!mapa[chave]) mapa[chave] = [];
          mapa[chave].push({
            id: c.id,
            autor: `@${c.profiles?.username || "anônimo"}`,
            texto: c.texto,
            tempo: "recente",
            dbId: c.id,
          });
        });
        setComentariosBanco(mapa);
      }

      // ============ MEMES DO BANCO ============
      const { data: memesData } = await supabase
        .from("memes")
        .select("*, profiles!memes_user_id_fkey(username)")
        .order("created_at", { ascending: false });
      if (memesData) {
        setMemesBanco(memesData.map((m: any) => ({
          id: `db_meme_${m.id}`,
          dbId: m.id,
          titulo: m.titulo,
          thumb: m.thumb,
          autor: `@${m.profiles?.username || "anônimo"}`,
          likes: 0,
          dislikes: 0,
          comentarios: 0,
          timestamp: new Date(m.created_at).getTime(),
        })));
      }

      // Votos em memes
      const { data: votosData } = await supabase
        .from("meme_votes")
        .select("meme_id, tipo, profiles!meme_votes_user_id_fkey(username)");
      if (votosData) {
        const mapaVotos: { [id: string]: { [user: string]: "like" | "dislike" } } = {};
        votosData.forEach((v: any) => {
          const chave = `db_meme_${v.meme_id}`;
          if (!mapaVotos[chave]) mapaVotos[chave] = {};
          mapaVotos[chave][v.profiles?.username || ""] = v.tipo;
        });
        setVotosBanco(mapaVotos);
      }

      // Comentários de memes
      const { data: comentariosMemesData } = await supabase
        .from("meme_comments")
        .select("id, meme_id, texto, created_at, profiles!meme_comments_user_id_fkey(username)")
        .order("created_at", { ascending: false });
      if (comentariosMemesData) {
        const mapa: { [id: string]: any[] } = {};
        comentariosMemesData.forEach((c: any) => {
          const chave = `db_meme_${c.meme_id}`;
          if (!mapa[chave]) mapa[chave] = [];
          mapa[chave].push({
            id: c.id,
            autor: c.profiles?.username || "anônimo",
            texto: c.texto,
            timestamp: new Date(c.created_at).getTime(),
            dbId: c.id,
          });
        });
        setComentariosMemesBanco(mapa);
      }

      // ============ MENSAGENS DO BANCO ============
      if (session?.user) {
        const { data: mensagensData, error: erroMsg } = await supabase
          .from("messages")
          .select("*")
          .or(`from_id.eq.${session.user.id},to_id.eq.${session.user.id}`)
          .order("created_at", { ascending: true });

        if (erroMsg) {
          console.error("ERRO ao carregar mensagens:", erroMsg);
        }

        if (mensagensData && mensagensData.length > 0) {
          // Busca os usernames de todos os envolvidos
          const idsUsuarios = new Set<string>();
          mensagensData.forEach((m: any) => {
            idsUsuarios.add(m.from_id);
            idsUsuarios.add(m.to_id);
          });

          const { data: profilesMsg, error: erroProf } = await supabase
            .from("profiles")
            .select("id, username")
            .in("id", Array.from(idsUsuarios));

          if (erroProf) {
            console.error("ERRO ao buscar usernames:", erroProf);
          }

          const mapaUsernames: { [id: string]: string } = {};
          (profilesMsg || []).forEach((p: any) => { mapaUsernames[p.id] = p.username; });

          const formatadas = mensagensData.map((m: any) => ({
            ...m,
            from_profile: { username: mapaUsernames[m.from_id] || "?" },
            to_profile: { username: mapaUsernames[m.to_id] || "?" },
          }));

          console.log("DEBUG mensagens carregadas:", formatadas);
          setMensagensBanco(formatadas);
        } else {
          console.log("DEBUG: nenhuma mensagem encontrada para o user", session.user.id);
        }
      }
    } catch (err) {
      console.error("Erro Supabase:", err);
    }

    setCarregou(true);
    setCarregouIdade(true);
    })();
  }, []);

  // ============ LISTENER DE SESSÃO ============
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setLogado(false);
        setUsuario("");
      }
      if (event === "SIGNED_IN" && session?.user) {
        const { data: meuProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (meuProfile) {
          setUsuario(meuProfile.username);
          setLogado(true);
          setPlanoAtual(meuProfile.plano || "free");
        }
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // ===== SALVAR NO LOCALSTORAGE =====
  useEffect(() => {
    if (!carregou || !logado || !usuario) return;
    setUsuarios((prev) => {
      const novoBanco = { ...prev, [usuario]: { ...prev[usuario], plano: planoAtual, videos: meusVideos, inscricoes: inscricoes } };
      localStorage.setItem("nosafee_usuarios", JSON.stringify(novoBanco));
      return novoBanco;
    });
  }, [planoAtual, meusVideos, inscricoes, usuario, logado, carregou]);

  // (mensagens agora vão pro Supabase, não pro localStorage)
  useEffect(() => { if (carregou) safeSetItem("nosafee_curtidas", curtidas); }, [curtidas, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_views", views); }, [views, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_notificacoes", notificacoes); }, [notificacoes, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_filmes", filmesUsuarios); }, [filmesUsuarios, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_memes", memesUsuarios); }, [memesUsuarios, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_meme_curtidas", memeCurtidas); }, [memeCurtidas, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_meme_dislikes", memeDislikes); }, [memeDislikes, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_comentarios_memes", comentariosMemes); }, [comentariosMemes, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_recados", recados); }, [recados, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_modo_claro", modoClaro); }, [modoClaro, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_solicitacoes", solicitacoes); }, [solicitacoes, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_posts", postsUsuarios); }, [postsUsuarios, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_post_curtidas", postCurtidas); }, [postCurtidas, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_post_comentarios", comentariosPosts); }, [comentariosPosts, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_stories", storiesUsuarios); }, [storiesUsuarios, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_stories_vistos", storiesVistos); }, [storiesVistos, carregou]);
  useEffect(() => { if (carregou) safeSetItem("nosafee_story_curtidas", storyCurtidas); }, [storyCurtidas, carregou]);

  // ===== BUSCA POSTERS TMDB =====
  const TMDB_API_KEY = "0f29ff5593e87401941af3352859cfbd";
  useEffect(() => {
    const filmesParaBuscar = [...filmesUsuarios, ...filmes];
    filmesParaBuscar.forEach(async (filme) => {
      if (posters[filme.id]) return;
      if (!filme.id.startsWith("tt")) return;
      try {
        const res = await fetch(`https://api.themoviedb.org/3/find/${filme.id}?api_key=${TMDB_API_KEY}&external_source=imdb_id&language=pt-BR`);
        const data = await res.json();
        const resultado = data.movie_results?.[0];
        if (resultado?.poster_path) {
          const url = `https://image.tmdb.org/t/p/w500${resultado.poster_path}`;
          setPosters((prev) => ({ ...prev, [filme.id]: url }));
        }
      } catch (e) {
        console.error("Erro ao buscar pôster:", filme.id, e);
      }
    });
  }, [filmesUsuarios]);

  // ===== SEGUINDO VISTOS =====
  useEffect(() => {
    if (!carregou || !usuario) return;
    const salvos = localStorage.getItem(`nosafee_seguindo_vistos_${usuario}`);
    setSeguindoVistos(salvos ? JSON.parse(salvos) : []);
  }, [usuario, carregou]);

  useEffect(() => {
    if (!carregou || !usuario) return;
    localStorage.setItem(`nosafee_seguindo_vistos_${usuario}`, JSON.stringify(seguindoVistos));
  }, [seguindoVistos, usuario, carregou]);

  // ===== STORAGE EVENT =====
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "nosafee_usuarios" && e.newValue) setUsuarios(JSON.parse(e.newValue));
      if (e.key === "nosafee_posts" && e.newValue) setPostsUsuarios(JSON.parse(e.newValue));
      if (e.key === "nosafee_stories" && e.newValue) setStoriesUsuarios(JSON.parse(e.newValue));
      if (e.key === "nosafee_memes" && e.newValue) setMemesUsuarios(JSON.parse(e.newValue));
      if (e.key === "nosafee_recados" && e.newValue) setRecados(JSON.parse(e.newValue));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ===== NOTIFICAÇÕES =====
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

  // ===== ABA EDITAR =====
  useEffect(() => {
    if (abaCanal === "editar" && logado) {
      setNovoUsuario(usuario);
      setNovoEmail(usuarios[usuario]?.email || "");
      setNovoAvatar(usuarios[usuario]?.avatarUrl || "");
      setNovaBio(usuarios[usuario]?.bio || "");
    }
  }, [abaCanal, logado, usuario, usuarios]);

  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [abaAtiva, videoAssistindo, canalSelecionado, filmeSelecionado, postAberto]);

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

  // ===== AUTO-AVANÇO DO STORY =====
  useEffect(() => {
    if (!storyAberto) return;
    setProgressoStory(0);
    const inicio = Date.now();

    const timer = setInterval(() => {
      const passou = Date.now() - inicio;
      const progresso = Math.min((passou / 5000) * 100, 100);
      setProgressoStory(progresso);

      if (progresso >= 100) {
        clearInterval(timer);
        const stories = todosOsStories[storyAberto.usuario] || [];
        if (storyAberto.index < stories.length - 1) {
          abrirStory(storyAberto.usuario, storyAberto.index + 1);
        } else {
          setStoryAberto(null);
        }
      }
    }, 50);

    return () => clearInterval(timer);
  }, [storyAberto?.usuario, storyAberto?.index]);

  useEffect(() => {
    setTextoRespostaStory("");
  }, [storyAberto?.usuario, storyAberto?.index]);

  // ===== FUNÇÕES =====
  const todosOsVideosDoSite = () => {
    const videosUsuarios: any[] = [];
    Object.values(usuarios).forEach((u: any) => { if (u.videos) videosUsuarios.push(...u.videos); });
    const map = new Map();
    [...videosBanco, ...videosUsuarios, ...videosFake].forEach((v) => { if (!map.has(v.id)) map.set(v.id, v); });
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

 const toggleCurtida = async (videoId: string) => {
    if (!logado || !usuario) { setModoAuth("login"); setMostrarLogin(true); return; }
    const jaCurtiu = (curtidas[videoId] || []).includes(usuario);
    setCurtidas((prev) => {
      const atuais = prev[videoId] || [];
      if (atuais.includes(usuario)) return { ...prev, [videoId]: atuais.filter((u) => u !== usuario) };
      return { ...prev, [videoId]: [...atuais, usuario] };
    });

    try {
      const meuId = await getMeuIdSupabase();
      if (meuId && typeof videoId === "string" && videoId.startsWith("db_")) {
        const idNum = parseInt(videoId.replace("db_", ""));
        if (!isNaN(idNum)) {
          if (jaCurtiu) {
            await supabase.from("video_likes").delete().eq("video_id", idNum).eq("user_id", meuId);
          } else {
            await supabase.from("video_likes").insert({ video_id: idNum, user_id: meuId });
          }
        }
      }
    } catch (err) {
      console.error("Erro curtida:", err);
    }
    if (!jaCurtiu) {
      const video = todosOsVideosDoSite().find((v) => v.id === videoId);
      if (!video) return;
      const dono = video.canal.replace("@", "");
      if (dono !== usuario && usuarios[dono]) {
        adicionarNotificacao(dono, { tipo: "curtida", de: usuario, videoId: video.id, videoTitulo: video.titulo, texto: `@${usuario} curtiu seu vídeo` });
      }
    }
  };

  const getMeuIdSupabase = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
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

  const seguirCanal = async (canal: string) => {
    if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; }
    if (inscricoes.includes(canal)) return;
    setInscricoes([...inscricoes, canal]);
    try {
      const meuProfile = await getMeuIdSupabase();
      const alvoProfile = usuarios[canal.replace("@", "")]?.idSupabase;
      if (meuProfile && alvoProfile) {
        await supabase.from("follows").insert({ follower_id: meuProfile, following_id: alvoProfile });
      }
    } catch (err) { console.error("Erro seguir:", err); }
    const nomeCanal = canal.replace("@", "");
    if (usuarios[nomeCanal] && nomeCanal !== usuario) {
      adicionarNotificacao(nomeCanal, { tipo: "seguidor", de: usuario, texto: `@${usuario} começou a te seguir` });
    }
  };

  const deixarDeSeguirCanal = async (canal: string) => {
    setInscricoes(inscricoes.filter((c) => c !== canal));
    setSeguindoVistos(seguindoVistos.filter((c) => c !== canal));
    try {
      const meuProfile = await getMeuIdSupabase();
      const alvoProfile = usuarios[canal.replace("@", "")]?.idSupabase;
      if (meuProfile && alvoProfile) {
        await supabase.from("follows").delete().eq("follower_id", meuProfile).eq("following_id", alvoProfile);
      }
    } catch (err) { console.error("Erro deixar de seguir:", err); }
  };

  const buscarUsuarios = (termo: string) => {
    if (!termo.trim()) return [];
    const termoLimpo = termo.toLowerCase().replace("@", "");
    return Object.keys(usuarios).filter((nome) => nome.toLowerCase().includes(termoLimpo)).slice(0, 6);
  };

  const buscarTudo = (termo: string) => {
    if (!termo.trim()) {
      setResultadosBusca({ usuarios: [], filmes: [], memes: [], posts: [], videos: [] });
      return;
    }
    const t = termo.toLowerCase().replace("@", "").trim();

    const usuariosEncontrados = Object.keys(usuarios).filter((nome) => nome.toLowerCase().includes(t)).slice(0, 5);
    const todosOsFilmesLocal = [...filmesUsuarios, ...filmes];
    const filmesEncontrados = todosOsFilmesLocal.filter((f) => f.titulo.toLowerCase().includes(t) || String(f.ano).includes(t)).slice(0, 5);
    const todosOsMemesLocal = [...memesUsuarios, ...memesFake];
    const memesEncontrados = todosOsMemesLocal.filter((m) => m.titulo.toLowerCase().includes(t) || m.autor.toLowerCase().replace("@", "").includes(t)).slice(0, 5);

    const postsEncontrados: any[] = [];
    Object.entries(postsUsuarios).forEach(([dono, lista]: any) => {
      (lista || []).forEach((p: any) => {
        if ((p.legenda && p.legenda.toLowerCase().includes(t)) || dono.toLowerCase().includes(t)) {
          postsEncontrados.push({ ...p, autor: dono });
        }
      });
    });

    const todosVideos = todosOsVideosDoSite();
    const videosEncontrados = todosVideos.filter((v) => v.titulo.toLowerCase().includes(t) || v.canal.toLowerCase().replace("@", "").includes(t)).slice(0, 5);

    setResultadosBusca({
      usuarios: usuariosEncontrados,
      filmes: filmesEncontrados,
      memes: memesEncontrados,
      posts: postsEncontrados.slice(0, 5),
      videos: videosEncontrados,
    });
  };

  const getChaveConversa = (user1: string, user2: string) => [user1, user2].sort().join("__");

  const getContatos = () => {
    if (!logado || !usuario) return [];
    const meusSeguidores: string[] = [];
    Object.entries(usuarios).forEach(([nome, dados]: any) => {
      if (dados.inscricoes && dados.inscricoes.includes(`@${usuario}`)) meusSeguidores.push(nome);
    });
    const mutuos = inscricoes.filter((canal) => { const nomeLimpo = canal.replace("@", ""); return meusSeguidores.includes(nomeLimpo); }).map((canal) => canal.replace("@", ""));

    // Contatos com conversa no banco
    const comConversa: string[] = [];
    mensagensBanco.forEach((m: any) => {
      const de = m.from_profile?.username;
      const para = m.to_profile?.username;
      if (de === usuario && para) comConversa.push(para);
      else if (para === usuario && de) comConversa.push(de);
    });

    return Array.from(new Set([...mutuos, ...comConversa]));
  };

  const getMinhasSolicitacoes = () => {
    if (!usuario) return [];
    // Solicitações = mensagens recebidas de quem eu NÃO sigo
    const porRemetente: { [de: string]: any[] } = {};
    mensagensBanco.forEach((m: any) => {
      const de = m.from_profile?.username;
      const para = m.to_profile?.username;
      if (para === usuario && de && !inscricoes.includes(`@${de}`)) {
        if (!porRemetente[de]) porRemetente[de] = [];
        porRemetente[de].push({
          id: m.id,
          de,
          para,
          texto: m.texto,
          timestamp: new Date(m.created_at).getTime(),
        });
      }
    });
    return Object.entries(porRemetente).map(([de, msgs]) => ({ de, msgs }));
  };

  const getMensagens = (outroUsuario: string) => {
    if (!usuario) return [];
    return mensagensBanco
      .filter((m: any) => {
        const de = m.from_profile?.username;
        const para = m.to_profile?.username;
        return (de === usuario && para === outroUsuario) || (de === outroUsuario && para === usuario);
      })
      .map((m: any) => ({
        de: m.from_profile?.username,
        para: m.to_profile?.username,
        texto: m.texto,
        timestamp: new Date(m.created_at).getTime(),
        lida: m.lida,
      }));
  };

  const enviarMensagem = async (outroUsuario: string) => {
    if (!textoMensagem.trim() || !usuario) return;
    const texto = textoMensagem.trim();
    setTextoMensagem("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const outroId = usuarios[outroUsuario]?.idSupabase;

      if (user && outroId) {
        const { data: novaMsg } = await supabase.from("messages").insert({
          from_id: user.id,
          to_id: outroId,
          texto,
        }).select("*, from_profile:profiles!messages_from_id_fkey(username), to_profile:profiles!messages_to_id_fkey(username)").single();

        if (novaMsg) {
          setMensagensBanco((prev) => [...prev, novaMsg]);
        }
      } else {
        alert("Não foi possível enviar a mensagem. Verifique se o destinatário existe.");
      }
    } catch (err) {
      console.error("Erro enviar mensagem:", err);
    }
  };

  const confirmarSolicitacao = async (deUsuario: string) => {
    if (!usuario) return;

    // Segue o usuário automaticamente
    if (!inscricoes.includes(`@${deUsuario}`)) {
      await seguirCanal(`@${deUsuario}`);
    }

    setConversaAtiva(deUsuario);
  };

  const recusarSolicitacao = async (deUsuario: string) => {
    if (!usuario) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const deId = usuarios[deUsuario]?.idSupabase;
      if (user && deId) {
        await supabase.from("messages").delete().eq("from_id", deId).eq("to_id", user.id);
        setMensagensBanco((prev) => prev.filter((m: any) => !(m.from_profile?.username === deUsuario && m.to_profile?.username === usuario)));
      }
    } catch (err) { console.error("Erro recusar:", err); }
  };

  const abrirConversaCom = (canalNome: string) => {
    const nomeLimpo = canalNome.replace("@", "");
    setConversaAtiva(nomeLimpo);
    setAbaMsg("conversas");
    setMostrarMensagens(true);
    marcarComoLida(nomeLimpo);
  };

  const marcarComoLida = async (outroUsuario: string) => {
    if (!usuario) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const deId = usuarios[outroUsuario]?.idSupabase;
      if (user && deId) {
        await supabase.from("messages").update({ lida: true }).eq("from_id", deId).eq("to_id", user.id).eq("lida", false);
        setMensagensBanco((prev) => prev.map((m: any) =>
          m.from_profile?.username === outroUsuario && m.to_profile?.username === usuario ? { ...m, lida: true } : m
        ));
      }
    } catch (err) { console.error("Erro marcar lida:", err); }
  };

  const getTotalNaoLidas = () => {
    if (!usuario) return 0;
    return mensagensBanco.filter((m: any) => m.to_profile?.username === usuario && !m.lida).length;
  };

  const irParaInicio = () => { setAbaAtiva("inicio"); setVideoAssistindo(null); setCanalSelecionado(null); setFilmeSelecionado(null); setBusca(""); setCategoriaAtiva("Todas"); setPostAberto(null); };

  const abrirCanal = (canal: string) => {
    setCanalSelecionado(canal);
    setVideoAssistindo(null);
    setFilmeSelecionado(null);
    setAbaAtiva("canal-externo");
    setAbaPerfil("videos");
    setPostAberto(null);
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

  // ===== STORIES =====
  const todosOsStories = { ...storiesFake, ...storiesUsuarios };

  const storiesVisiveis: { [usuario: string]: any[] } = {};
  Object.entries(todosOsStories).forEach(([autor, lista]: any) => {
    const ehMeu = logado && autor === usuario;
    const sigoEle = inscricoes.includes(`@${autor}`);
    if (ehMeu || sigoEle) {
      storiesVisiveis[autor] = lista;
    }
  });

  const abrirStory = (autorStory: string, index: number) => {
    setStoryAberto({ usuario: autorStory, index });
    setProgressoStory(0);
    if (usuario) {
      const story = (todosOsStories[autorStory] || [])[index];
      if (story) {
        setStoriesVistos((prev) => {
          const atual = prev[story.id] || [];
          if (atual.includes(usuario)) return prev;
          return { ...prev, [story.id]: [...atual, usuario] };
        });
      }
    }
  };

  const proximoStory = () => {
    if (!storyAberto) return;
    const stories = todosOsStories[storyAberto.usuario] || [];
    if (storyAberto.index < stories.length - 1) {
      abrirStory(storyAberto.usuario, storyAberto.index + 1);
    } else {
      setStoryAberto(null);
    }
  };

  const anteriorStory = () => {
    if (!storyAberto) return;
    if (storyAberto.index > 0) {
      abrirStory(storyAberto.usuario, storyAberto.index - 1);
    } else {
      setStoryAberto(null);
    }
  };

  // ===== LOGIN / CADASTRO =====
  const handleLogin = async () => {
    if (emailInput.trim() === "") { alert("Digite seu e-mail!"); return; }
    if (senhaInput.trim() === "") { alert("Digite sua senha!"); return; }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput.trim(),
      password: senhaInput,
    });

    if (error) { alert("Erro: " + error.message); return; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    const nomeLimpo = profile?.username || emailInput.split("@")[0];
    setUsuario(nomeLimpo);
    setPlanoAtual(profile?.plano || "free");
    setLogado(true);
    setMostrarLogin(false);
    setSenhaInput("");
    setEmailInput("");
    setCanalSelecionado(`@${nomeLimpo}`);
    setAbaAtiva("canal-externo");
    alert("Bem-vindo de volta, @" + nomeLimpo + "!");
  };

  const handleCriarConta = async () => {
    const nomeLimpo = usuario.trim().replace("@", "").toLowerCase();
    if (nomeLimpo === "") { alert("Digite um nome de usuário!"); return; }
    if (emailInput.trim() === "") { alert("Digite um e-mail!"); return; }
    if (senhaInput.trim() === "") { alert("Digite uma senha!"); return; }

    const { data, error } = await supabase.auth.signUp({
      email: emailInput.trim(),
      password: senhaInput,
      options: { data: { username: nomeLimpo } },
    });

    if (error) { alert("Erro: " + error.message); return; }

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
      novoBanco[novoNomeLimpo] = { ...dadosAtuais, email: novoEmail, avatarUrl: novoAvatar, bio: novaBio, plano: planoAtual, videos: meusVideos, inscricoes: inscricoes };
      localStorage.setItem("nosafee_logado", novoNomeLimpo);
      setUsuario(novoNomeLimpo);
    } else {
      novoBanco[usuario] = { ...dadosAtuais, email: novoEmail, avatarUrl: novoAvatar, bio: novaBio, plano: planoAtual, videos: meusVideos, inscricoes: inscricoes };
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
    setAbaAtiva("social");
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

  const todosOsFilmes = [...filmesUsuarios, ...filmes];
  const todosOsMemes = [...memesBanco, ...memesUsuarios, ...memesFake];
  const todosVideosLista = todosOsVideosDoSite();
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
    <div
      className={`flex flex-col h-screen overflow-hidden ${modoClaro ? "modo-claro" : ""}`}
      style={{ backgroundColor: modoClaro ? "#f0f2f5" : "#0f0f0f" }}
    >
      {/* ============ CABEÇALHO ============ */}
      <header className="flex items-center justify-between px-4 h-16 bg-[#121212] border-b border-[#e888d3] fixed top-0 w-full z-50">
        <div onClick={irParaInicio} className="flex items-center cursor-pointer">
          <img src={modoClaro ? "/logo-claro.png" : "/logo.png"} alt="nosafee" className="h-20 object-contain" />
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4 relative">
          {logado && (
            <button
              onClick={() => { setMostrarPagamento(true); setEtapaPagamento("planos"); }}
              className="hidden lg:flex items-center gap-1 bg-[#e888d3]/15 hover:bg-[#e888d3] border border-[#e888d3]/40 hover:border-[#e888d3] text-[#e888d3] hover:text-black text-xs font-medium px-3 py-1.5 rounded-full mr-5 flex-shrink-0 transition-all cursor-pointer group"
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
              placeholder="Pesquisar filmes, memes, posts, vídeos, @usuários..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                buscarTudo(e.target.value);
                setMostrarSugestoes(e.target.value.trim().length > 0);
              }}
              onFocus={() => { if (busca.trim().length > 0) setMostrarSugestoes(true); }}
              onBlur={() => { setTimeout(() => setMostrarSugestoes(false), 200); }}
              className="bg-transparent outline-none w-full text-white placeholder-gray-400"
            />
          </div>
          <button className="bg-[#222222] border border-[#303030] border-l-0 rounded-r-full px-5 py-2 hover:bg-[#e888d3] text-gray-400 hover:text-black transition-all duration-300 cursor-pointer">
            <span className="material-icons-outlined">search</span>
          </button>

          {mostrarSugestoes && busca.trim().length > 0 && (() => {
            const { usuarios: users, filmes: films, memes: mms, posts: psts, videos: vds } = resultadosBusca;
            const totalResultados = users.length + films.length + mms.length + psts.length + vds.length;

            if (totalResultados === 0) {
              return (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1c1c1c] border border-[#303030] rounded-xl shadow-2xl overflow-hidden z-[60] px-4 py-6 text-center">
                  <span className="material-icons-outlined text-4xl text-gray-600 mb-2 block">search_off</span>
                  <p className="text-sm text-gray-400">Nada encontrado pra &quot;{busca}&quot;</p>
                </div>
              );
            }

            return (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#1c1c1c] border border-[#303030] rounded-xl shadow-2xl overflow-hidden z-[60] max-h-[520px] overflow-y-auto">
                {users.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-[10px] text-gray-500 uppercase tracking-wider border-b border-[#303030] bg-[#161616] sticky top-0 flex items-center gap-2">
                      <span className="material-icons-outlined text-sm">person</span> Canais ({users.length})
                    </div>
                    {users.map((nome: any) => {
                      const info = getCanalInfo(`@${nome}`);
                      const videos = getVideosDoCanal(`@${nome}`);
                      return (
                        <div key={`user-${nome}`} onClick={() => { setCanalSelecionado(`@${nome}`); setAbaAtiva("canal-externo"); setVideoAssistindo(null); setFilmeSelecionado(null); setMostrarSugestoes(false); setBusca(""); marcarComoLida(nome); }} className="flex items-center gap-3 px-4 py-2 hover:bg-[#272727] cursor-pointer transition">
                          {info.avatarUrl ? <img src={info.avatarUrl} alt={nome} className="w-9 h-9 rounded-full object-cover flex-shrink-0" /> : <div className={`w-9 h-9 ${info.cor} rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{nome.slice(0, 2).toUpperCase()}</div>}
                          <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">@{nome}</p><p className="text-xs text-gray-500">{videos.length} vídeos</p></div>
                        </div>
                      );
                    })}
                  </>
                )}
                {films.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-[10px] text-gray-500 uppercase tracking-wider border-b border-[#303030] bg-[#161616] sticky top-0 flex items-center gap-2">
                      <span className="material-icons-outlined text-sm">movie</span> Filmes ({films.length})
                    </div>
                    {films.map((f: any) => (
                      <div key={`filme-${f.id}`} onClick={() => { setFilmeSelecionado(f); setMostrarSugestoes(false); setBusca(""); }} className="flex items-center gap-3 px-4 py-2 hover:bg-[#272727] cursor-pointer transition">
                        <div className="w-9 h-9 rounded-full bg-[#e888d3] flex items-center justify-center flex-shrink-0"><span className="material-icons-outlined text-black text-sm">movie</span></div>
                        <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{f.titulo}</p><p className="text-xs text-gray-500">{f.ano} • Filme</p></div>
                      </div>
                    ))}
                  </>
                )}
                {vds.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-[10px] text-gray-500 uppercase tracking-wider border-b border-[#303030] bg-[#161616] sticky top-0 flex items-center gap-2">
                      <span className="material-icons-outlined text-sm">video_library</span> Vídeos ({vds.length})
                    </div>
                    {vds.map((v: any) => (
                      <div key={`video-${v.id}`} onClick={() => { setVideoAssistindo(v); setMostrarSugestoes(false); setBusca(""); setFilmeSelecionado(null); setCanalSelecionado(null); }} className="flex items-center gap-3 px-4 py-2 hover:bg-[#272727] cursor-pointer transition">
                        <div className="w-14 h-9 rounded overflow-hidden flex-shrink-0 bg-black"><img src={v.thumb} alt={v.titulo} className="w-full h-full object-cover" /></div>
                        <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{v.titulo}</p><p className="text-xs text-gray-500 truncate">{v.canal}</p></div>
                      </div>
                    ))}
                  </>
                )}
                {mms.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-[10px] text-gray-500 uppercase tracking-wider border-b border-[#303030] bg-[#161616] sticky top-0 flex items-center gap-2">
                      <span className="material-icons-outlined text-sm">sentiment_very_satisfied</span> Memes ({mms.length})
                    </div>
                    {mms.map((m: any) => (
                      <div key={`meme-${m.id}`} onClick={() => { setAbaAtiva("funny"); setMostrarSugestoes(false); setBusca(""); setVideoAssistindo(null); setFilmeSelecionado(null); setCanalSelecionado(null); }} className="flex items-center gap-3 px-4 py-2 hover:bg-[#272727] cursor-pointer transition">
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-black"><img src={m.thumb} alt={m.titulo} className="w-full h-full object-cover" /></div>
                        <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{m.titulo}</p><p className="text-xs text-gray-500 truncate">{m.autor}</p></div>
                      </div>
                    ))}
                  </>
                )}
                {psts.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-[10px] text-gray-500 uppercase tracking-wider border-b border-[#303030] bg-[#161616] sticky top-0 flex items-center gap-2">
                      <span className="material-icons-outlined text-sm">photo_library</span> Posts ({psts.length})
                    </div>
                    {psts.map((p: any) => (
                      <div key={`post-${p.id}`} onClick={() => { setPostAberto(p); setMostrarSugestoes(false); setBusca(""); setVideoAssistindo(null); setFilmeSelecionado(null); setCanalSelecionado(null); }} className="flex items-center gap-3 px-4 py-2 hover:bg-[#272727] cursor-pointer transition">
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-black"><img src={p.imagem} alt="post" className="w-full h-full object-cover" /></div>
                        <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">@{p.autor}</p><p className="text-xs text-gray-500 truncate">{p.legenda || "Sem legenda"}</p></div>
                      </div>
                    ))}
                  </>
                )}
                <div className="px-4 py-2 text-[10px] text-gray-500 border-t border-[#303030] bg-[#161616] text-center">
                  {totalResultados} resultados encontrados
                </div>
              </div>
            );
          })()}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setModoClaro(!modoClaro)} className="relative p-2 hover:bg-[#272727] rounded-full transition cursor-pointer" title={modoClaro ? "Modo escuro" : "Modo claro"}>
            <span className="material-icons-outlined text-gray-300">{modoClaro ? "dark_mode" : "light_mode"}</span>
          </button>

          {logado && (
            <div className="relative">
              <button onClick={() => { setMostrarNotificacoes(!mostrarNotificacoes); setMostrarSugestoes(false); }} className="relative p-2 hover:bg-[#272727] rounded-full transition cursor-pointer" title="Notificações">
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
                        </div>
                      ) : (
                        minhasNotificacoes.map((n) => (
                          <div key={n.id} onClick={() => { marcarNotifComoLida(n.id); setMostrarNotificacoes(false); }} className={`flex items-start gap-3 px-4 py-3 border-b border-[#252525] hover:bg-[#222] transition cursor-pointer ${!n.lida ? "bg-[#e888d3]/5" : ""}`}>
                            <div className="w-10 h-10 rounded-full bg-[#e888d3] flex items-center justify-center flex-shrink-0">
                              <span className="material-icons-outlined text-black text-lg">{n.tipo === "seguidor" ? "person_add" : n.tipo === "curtida" ? "thumb_up" : "chat"}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm">{n.texto}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatarTempo(n.timestamp)}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ============ CORPO ============ */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        <aside className="w-60 bg-[#0f0f0f] overflow-y-auto hidden md:block px-3 py-2">
          <ul className="space-y-1">
            <li onClick={() => { setAbaAtiva("social"); setVideoAssistindo(null); setCanalSelecionado(null); setFilmeSelecionado(null); setPostAberto(null); }} className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${abaAtiva === "social" ? "bg-[#e888d3] text-black" : "hover:bg-[#272727]"}`}>
              <span className="material-icons-outlined">people</span> Social
            </li>
            <li onClick={() => { setAbaAtiva("funny"); setVideoAssistindo(null); setCanalSelecionado(null); setFilmeSelecionado(null); setPostAberto(null); }} className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${abaAtiva === "funny" ? "bg-[#e888d3] text-black" : "hover:bg-[#272727]"}`}>
              <span className="material-icons-outlined">sentiment_very_satisfied</span> Funny
            </li>
            <li onClick={irParaInicio} className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer font-medium ${abaAtiva === "inicio" && !videoAssistindo && !canalSelecionado && !filmeSelecionado ? "bg-[#e888d3] text-black" : "hover:bg-[#272727]"}`}>
              <span className="material-icons-outlined">movie</span> Filmes
            </li>
            <li onClick={() => setMostrarConfirmacaoNSFW(true)} className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${abaAtiva === "nsfw" ? "bg-[#e888d3] text-black" : "hover:bg-[#272727]"}`}>
              <span className="material-icons-outlined">local_fire_department</span> NSFW
            </li>
          </ul>

          <hr className="border-[#303030] my-3" />

          <ul className="space-y-1">
            <li onClick={() => { if (!logado) { setModoAuth("login"); setMostrarLogin(true); } else { setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); setVideoAssistindo(null); setFilmeSelecionado(null); setBusca(""); setAbaPerfil("videos"); } }} className={`flex items-center gap-4 px-3 py-2 rounded-lg cursor-pointer ${abaAtiva === "canal-externo" && canalSelecionado === `@${usuario}` ? "bg-[#e888d3] text-black font-medium" : "hover:bg-[#272727]"}`}>
              {logado && usuarios[usuario]?.avatarUrl ? (
                <img src={usuarios[usuario].avatarUrl} alt={usuario} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <span className="material-icons-outlined">{logado ? "account_circle" : "login"}</span>
              )}
              {logado ? `@${usuario}` : "LOGIN/CADASTRE"}
            </li>

            {logado && (
              <li onClick={() => { setMostrarMensagens(true); setConversaAtiva(null); setAbaMsg("conversas"); setMostrarSeguindo(false); }} className="flex items-center gap-4 px-3 py-2 hover:bg-[#272727] rounded-lg cursor-pointer">
                <span className="material-icons-outlined">chat</span> Mensagens
                {(() => {
                  const total = getTotalNaoLidas() + (solicitacoes[usuario] || []).length;
                  return total > 0 ? <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#e888d3] text-black">{total}</span> : null;
                })()}
              </li>
            )}

            {logado && (
              <li onClick={handleLogout} className="flex items-center gap-4 px-3 py-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg cursor-pointer transition-all duration-200">
                <span className="material-icons-outlined">logout</span> Sair
              </li>
            )}
          </ul>
        </aside>

        <main ref={mainRef} className="flex-1 bg-[#0f0f0f] overflow-y-auto">
          {/* ===== POST ABERTO ===== */}
          {postAberto ? (
            <div className="min-h-full bg-[#0f0f0f] p-4">
              <div className="max-w-3xl mx-auto">
                <button onClick={() => { setPostAberto(null); setTextoComentarioPost(""); }} className="flex items-center gap-2 mb-4 text-sm text-gray-300 hover:text-[#e888d3] transition cursor-pointer">
                  <span className="material-icons-outlined">arrow_back</span> Voltar para o perfil
                </button>

                <div className="bg-[#1c1c1c] border border-[#303030] rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-[#303030]">
                    {(() => {
                      const info = getCanalInfo(`@${postAberto.autor}`);
                      return (
                        <>
                          <div onClick={() => { setPostAberto(null); abrirCanal(`@${postAberto.autor}`); }} className="cursor-pointer flex-shrink-0">
                            {info.avatarUrl ? (
                              <img src={info.avatarUrl} className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-[#e888d3] transition" alt={postAberto.autor} />
                            ) : (
                              <div className={`w-10 h-10 ${info.cor} rounded-full flex items-center justify-center text-sm font-bold text-white hover:ring-2 hover:ring-[#e888d3] transition`}>
                                {postAberto.autor.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p onClick={() => { setPostAberto(null); abrirCanal(`@${postAberto.autor}`); }} className="font-medium text-sm cursor-pointer hover:text-[#e888d3] transition">@{postAberto.autor}</p>
                            <p className="text-xs text-gray-500">{formatarTempo(postAberto.timestamp)}</p>
                          </div>
                          {usuario === postAberto.autor && (
                            <button onClick={() => {
                              if (!confirm("Apagar esse post?")) return;
                              setPostsUsuarios((prev) => {
                                const atualizado = { ...prev, [postAberto.autor]: (prev[postAberto.autor] || []).filter((p: any) => p.id !== postAberto.id) };
                                localStorage.setItem("nosafee_posts", JSON.stringify(atualizado));
                                return atualizado;
                              });
                              setPostAberto(null);
                            }} className="material-icons-outlined text-gray-500 hover:text-red-500 transition cursor-pointer" title="Apagar post">delete</button>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  <div className="bg-black flex items-center justify-center">
                    <img src={postAberto.imagem} alt={postAberto.legenda || "post"} className="w-full max-h-[70vh] object-contain" />
                  </div>

                  {postAberto.legenda && (
                    <div className="px-4 py-3 border-t border-[#303030]">
                      <p className="text-sm text-gray-200 whitespace-pre-line break-words">
                        <span className="font-bold text-[#e888d3] mr-2">@{postAberto.autor}</span>
                        {postAberto.legenda}
                      </p>
                    </div>
                  )}

                  {(() => {
                    const idPost = String(postAberto.id);
                    const listaCurtidas = postCurtidas[idPost] || [];
                    const curtiu = usuario ? listaCurtidas.includes(usuario) : false;
                    const totalCurtidas = listaCurtidas.length;
                    const listaComentarios = comentariosPosts[idPost] || [];
                    const totalComentarios = listaComentarios.length;

                    return (
                      <>
                        <div className="px-4 py-3 border-t border-[#303030] flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; }
                              setPostCurtidas((prev) => {
                                const atuais = prev[idPost] || [];
                                if (atuais.includes(usuario)) return { ...prev, [idPost]: atuais.filter((u) => u !== usuario) };
                                return { ...prev, [idPost]: [...atuais, usuario] };
                              });
                            }}
                            className={`flex items-center gap-2 transition cursor-pointer ${curtiu ? "text-[#e888d3]" : "text-gray-400 hover:text-[#e888d3]"}`}
                          >
                            <span className="material-icons-outlined text-2xl">{curtiu ? "favorite" : "favorite_border"}</span>
                            <span className="text-sm font-medium">{totalCurtidas}</span>
                          </button>
                          <div className="flex items-center gap-2 text-gray-400">
                            <span className="material-icons-outlined text-2xl">chat_bubble_outline</span>
                            <span className="text-sm font-medium">{totalComentarios}</span>
                          </div>
                        </div>

                        <div className="border-t border-[#303030]">
                          {totalComentarios > 0 && (
                            <div className="max-h-72 overflow-y-auto px-4 py-3 space-y-3">
                              {listaComentarios.map((c: any) => {
                                const avatarAutor = usuarios[c.autor]?.avatarUrl;
                                return (
                                  <div key={c.id} className="flex gap-2">
                                    <div onClick={() => { setPostAberto(null); abrirCanal(`@${c.autor}`); }} className="cursor-pointer flex-shrink-0">
                                      {avatarAutor ? (
                                        <img src={avatarAutor} className="w-8 h-8 rounded-full object-cover" alt={c.autor} />
                                      ) : (
                                        <div className="w-8 h-8 bg-[#e888d3] rounded-full flex items-center justify-center">
                                          <span className="material-icons-outlined text-black text-xs">person</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <span onClick={() => { setPostAberto(null); abrirCanal(`@${c.autor}`); }} className="text-xs font-bold text-[#e888d3] cursor-pointer hover:underline">@{c.autor}</span>
                                        <span className="text-gray-500 text-[10px]">{formatarTempo(c.timestamp)}</span>
                                      </div>
                                      <p className="text-sm text-gray-200 break-words">{c.texto}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {logado ? (
                            <div className="flex gap-2 px-4 py-3 border-t border-[#303030]">
                              <div className="flex-shrink-0">
                                {usuarios[usuario]?.avatarUrl ? (
                                  <img src={usuarios[usuario].avatarUrl} className="w-8 h-8 rounded-full object-cover" alt={usuario} />
                                ) : (
                                  <div className="w-8 h-8 bg-[#e888d3] rounded-full flex items-center justify-center">
                                    <span className="material-icons-outlined text-black text-xs">person</span>
                                  </div>
                                )}
                              </div>
                              <input
                                type="text"
                                placeholder="Adicione um comentário..."
                                value={textoComentarioPost}
                                onChange={(e) => setTextoComentarioPost(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    if (!textoComentarioPost.trim()) return;
                                    const novo = { id: Date.now(), autor: usuario, texto: textoComentarioPost.trim(), timestamp: Date.now() };
                                    setComentariosPosts((prev) => ({ ...prev, [idPost]: [...(prev[idPost] || []), novo] }));
                                    setTextoComentarioPost("");
                                  }
                                }}
                                className="flex-1 bg-[#0f0f0f] border border-[#303030] rounded-full px-4 py-2 text-sm text-white outline-none focus:border-[#e888d3]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!textoComentarioPost.trim()) return;
                                  const novo = { id: Date.now(), autor: usuario, texto: textoComentarioPost.trim(), timestamp: Date.now() };
                                  setComentariosPosts((prev) => ({ ...prev, [idPost]: [...(prev[idPost] || []), novo] }));
                                  setTextoComentarioPost("");
                                }}
                                disabled={!textoComentarioPost.trim()}
                                className="w-9 h-9 rounded-full bg-[#e888d3] hover:bg-[#d176be] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition cursor-pointer flex-shrink-0"
                              >
                                <span className="material-icons-outlined text-black text-base">send</span>
                              </button>
                            </div>
                          ) : (
                            <div className="px-4 py-3 border-t border-[#303030] text-center">
                              <button type="button" onClick={() => { setModoAuth("login"); setMostrarLogin(true); }} className="text-xs text-[#e888d3] hover:underline font-medium cursor-pointer">Faça login para comentar</button>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : filmeSelecionado ? (
            <div className="h-full flex flex-col bg-black">
              <div className="p-4 flex items-center justify-between flex-wrap gap-3">
                <button onClick={() => setFilmeSelecionado(null)} className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#e888d3] transition-colors cursor-pointer">
                  <span className="material-icons-outlined">arrow_back</span> Voltar para a lista de filmes
                </button>
                <p className="text-sm text-gray-400">{filmeSelecionado.titulo} ({filmeSelecionado.ano})</p>
              </div>
              <div className="flex-1 relative">
                <iframe key={filmeSelecionado.id} src={`https://embedplayapi.top/embed/${filmeSelecionado.id}`} className="absolute inset-0 w-full h-full" allowFullScreen title={filmeSelecionado.titulo} referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          ) : videoAssistindo ? (
            <AssistirVideo
              video={videoAssistindo}
              todosVideos={todosVideosLista}
              comentariosBanco={comentariosBanco}
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
              onApagarVideo={async (videoId: string) => {
                if (typeof videoId === "string" && videoId.startsWith("db_")) {
                  const idNum = parseInt(videoId.replace("db_", ""));
                  if (!isNaN(idNum)) {
                    try {
                      await supabase.from("videos").delete().eq("id", idNum);
                      setVideosBanco((prev: any) => prev.filter((v: any) => v.id !== videoId));
                    } catch (err) { console.error("Erro apagar:", err); }
                  }
                }
                setMeusVideos((prev) => prev.filter((v) => v.id !== videoId));
                setVideoAssistindo(null);
              }}
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
                const nomeLimpo = canalSelecionado.replace("@", "");
                const posts = postsUsuarios[nomeLimpo] || [];
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
                        {usuarios[nomeLimpo]?.bio && (
                          <p className="text-gray-300 text-sm mb-2 whitespace-pre-line max-w-2xl">{usuarios[nomeLimpo].bio}</p>
                        )}
                        <p className="text-gray-400 text-sm mb-3">{seguidores.toLocaleString("pt-BR")} seguidores • {videos.length} vídeos • {posts.length} posts</p>
                        {ehMeuPerfil ? (
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => { setCanalSelecionado(null); setAbaAtiva("canal"); setAbaCanal("videos"); }} className="px-6 py-2.5 rounded-full text-sm font-medium transition-all bg-[#e888d3] hover:bg-[#d176be] text-black flex items-center gap-2 cursor-pointer">
                              <span className="material-icons-outlined text-base">video_library</span> Gerenciar meus vídeos
                            </button>
                            <button onClick={() => { setCanalSelecionado(null); setAbaAtiva("canal"); setAbaCanal("editar"); }} className="px-6 py-2.5 rounded-full text-sm font-medium transition-all bg-[#272727] hover:bg-[#3f3f3f] text-white border border-[#303030] flex items-center gap-2 cursor-pointer">
                              <span className="material-icons-outlined text-base">manage_accounts</span> Editar perfil
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => { if (seguindo) deixarDeSeguirCanal(canalSelecionado); else seguirCanal(canalSelecionado); }} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${seguindo ? "bg-[#272727] text-white hover:bg-[#3f3f3f]" : "bg-white text-black hover:bg-gray-200"}`}>
                              {seguindo ? "Seguindo" : "Seguir"}
                            </button>
                            {logado && (
                              <button onClick={() => abrirConversaCom(canalSelecionado)} className="px-6 py-2.5 rounded-full text-sm font-medium transition-all bg-[#272727] hover:bg-[#3f3f3f] text-white border border-[#303030] flex items-center gap-2 cursor-pointer">
                                <span className="material-icons-outlined text-base">mail</span> Enviar mensagem
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1 bg-[#1c1c1c] p-1 rounded-lg mb-5 max-w-md">
                      <button onClick={() => setAbaPerfil("videos")} className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer ${abaPerfil === "videos" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#272727]"}`}>
                        <span className="material-icons-outlined text-base">video_library</span> Vídeos ({videos.length})
                      </button>
                      <button onClick={() => setAbaPerfil("posts")} className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer ${abaPerfil === "posts" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#272727]"}`}>
                        <span className="material-icons-outlined text-base">photo_library</span> Posts ({posts.length})
                      </button>
                    </div>

                    {abaPerfil === "posts" ? (
                      <>
                        {ehMeuPerfil && (
                          <button onClick={() => setMostrarUploadPost(true)} className="flex items-center gap-2 bg-[#e888d3] hover:bg-[#d176be] text-black px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer mb-5">
                            <span className="material-icons-outlined text-base">add</span> Criar post
                          </button>
                        )}
                        {posts.length === 0 ? (
                          <div className="text-center py-16 bg-[#1c1c1c] rounded-2xl">
                            <span className="material-icons-outlined text-5xl text-gray-600 mb-3">photo_camera</span>
                            <p className="text-gray-400">Nenhum post ainda.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                            {posts.map((p: any) => (
                              <div key={p.id} onClick={() => setPostAberto(p)} className="aspect-square rounded-xl overflow-hidden bg-[#1c1c1c] border border-[#303030] relative group cursor-pointer">
                                <img src={p.imagem} alt={p.legenda || "post"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
                                  <span className="flex items-center gap-1 text-white text-xs font-medium"><span className="material-icons-outlined text-base">favorite</span>{(postCurtidas[String(p.id)] || []).length}</span>
                                  <span className="flex items-center gap-1 text-white text-xs font-medium"><span className="material-icons-outlined text-base">chat_bubble</span>{(comentariosPosts[String(p.id)] || []).length}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {videos.length === 0 ? (
                          <div className="text-center py-16 bg-[#1c1c1c] rounded-2xl">
                            <span className="material-icons-outlined text-5xl text-gray-600 mb-3">videocam_off</span>
                            <p className="text-gray-400">Este usuário não tem vídeos ainda.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
                            {videos.map((v) => (
                              <div key={v.id} onClick={() => { setVideoAssistindo(v); setCanalSelecionado(null); if (mainRef.current) mainRef.current.scrollTop = 0; }} className="cursor-pointer group">
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                                  <img src={v.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={v.titulo} />
                                  <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-1 rounded">{v.duracao}</span>
                                </div>
                                <div className="flex gap-3 mt-3">
                                  {info.avatarUrl ? <img src={info.avatarUrl} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" alt={v.canal} /> : <div className={`w-9 h-9 ${info.cor} rounded-full flex-shrink-0`}></div>}
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
                  </>
                );
              })()}
            </div>
          ) : abaAtiva === "nsfw" ? (
            <div className="p-6 max-w-4xl mx-auto text-center">
              <div className="mt-20">
                <span className="material-icons-outlined text-6xl text-gray-700 mb-4">local_fire_department</span>
                <h1 className="text-2xl font-bold mb-2">Conteúdo NSFW</h1>
                <p className="text-gray-400">Em breve os vídeos adultos vão aparecer aqui.</p>
              </div>
            </div>
          ) : abaAtiva === "funny" ? (
            <div className="p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between flex-wrap gap-3 mt-2 mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Funny</h1>
                  <p className="text-gray-400 text-sm">Só memes • {todosOsMemes.length} no total</p>
                </div>
                <button onClick={() => { if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; } setMostrarUploadMeme(true); }} className="flex items-center gap-2 bg-[#e888d3] hover:bg-[#d176be] text-black px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer">
                  <span className="material-icons-outlined text-base">add</span> Postar meme
                </button>
              </div>

              <div className="space-y-6">
                {todosOsMemes.map((meme) => {
                  const listaCurtidas = memeCurtidas[meme.id] || [];
                  const listaDislikes = memeDislikes[meme.id] || [];
                  const curtiu = usuario ? listaCurtidas.includes(usuario) : false;
                  const dislikei = usuario ? listaDislikes.includes(usuario) : false;
                  const totalLikes = (meme.likes || 0) + listaCurtidas.length;
                  const totalDislikes = (meme.dislikes || 0) + listaDislikes.length;

                  return (
                    <div key={meme.id} className="bg-[#1c1c1c] rounded-2xl overflow-hidden border border-[#303030]">
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#303030]">
                        <div onClick={() => abrirCanal(meme.autor)} className="w-10 h-10 bg-[#e888d3] rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#e888d3] transition">
                          <span className="material-icons-outlined text-black text-lg">person</span>
                        </div>
                        <div className="flex-1">
                          <p onClick={() => abrirCanal(meme.autor)} className="font-medium text-sm cursor-pointer hover:text-[#e888d3] transition">{meme.autor}</p>
                          <p className="text-xs text-gray-500">há 2 horas</p>
                        </div>
                      </div>

                      <div className="bg-black">
                        <img src={meme.thumb} alt={meme.titulo} className="w-full object-contain max-h-[600px]" />
                      </div>

                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-200 mb-4">{meme.titulo}</p>
                        <div className="flex items-center gap-4">
                          <button onClick={async () => {
                            if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; }
                            setMemeCurtidas((prev) => {
                              const atuais = prev[meme.id] || [];
                              if (atuais.includes(usuario)) return { ...prev, [meme.id]: atuais.filter((u) => u !== usuario) };
                              return { ...prev, [meme.id]: [...atuais, usuario] };
                            });
                            if (!curtiu) setMemeDislikes((prev) => ({ ...prev, [meme.id]: (prev[meme.id] || []).filter((u) => u !== usuario) }));

                            try {
                              const { data: { user } } = await supabase.auth.getUser();
                              if (user && typeof meme.id === "string" && meme.id.startsWith("db_meme_")) {
                                const idNum = parseInt(meme.id.replace("db_meme_", ""));
                                if (!isNaN(idNum)) {
                                  if (curtiu) {
                                    await supabase.from("meme_votes").delete().eq("meme_id", idNum).eq("user_id", user.id);
                                  } else {
                                    await supabase.from("meme_votes").upsert({ meme_id: idNum, user_id: user.id, tipo: "like" }, { onConflict: "meme_id,user_id" });
                                  }
                                }
                              }
                            } catch (err) { console.error("Erro voto:", err); }
                          }} className={`flex items-center gap-2 transition cursor-pointer ${curtiu ? "text-[#e888d3]" : "text-gray-400 hover:text-white"}`}>
                            <span className="material-icons-outlined text-2xl">{curtiu ? "favorite" : "favorite_border"}</span>
                            <span className="text-sm font-medium">{totalLikes.toLocaleString("pt-BR")}</span>
                          </button>
                          <button onClick={async () => {
                            if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; }
                            setMemeDislikes((prev) => {
                              const atuais = prev[meme.id] || [];
                              if (atuais.includes(usuario)) return { ...prev, [meme.id]: atuais.filter((u) => u !== usuario) };
                              return { ...prev, [meme.id]: [...atuais, usuario] };
                            });
                            if (!dislikei) setMemeCurtidas((prev) => ({ ...prev, [meme.id]: (prev[meme.id] || []).filter((u) => u !== usuario) }));

                            try {
                              const { data: { user } } = await supabase.auth.getUser();
                              if (user && typeof meme.id === "string" && meme.id.startsWith("db_meme_")) {
                                const idNum = parseInt(meme.id.replace("db_meme_", ""));
                                if (!isNaN(idNum)) {
                                  if (dislikei) {
                                    await supabase.from("meme_votes").delete().eq("meme_id", idNum).eq("user_id", user.id);
                                  } else {
                                    await supabase.from("meme_votes").upsert({ meme_id: idNum, user_id: user.id, tipo: "dislike" }, { onConflict: "meme_id,user_id" });
                                  }
                                }
                              }
                            } catch (err) { console.error("Erro voto:", err); }
                          }} className={`flex items-center gap-2 transition cursor-pointer ${dislikei ? "text-red-500" : "text-gray-400 hover:text-white"}`}>
                            <span className="material-icons-outlined text-2xl">thumb_down</span>
                            <span className="text-sm font-medium">{totalDislikes}</span>
                          </button>
                          <button onClick={() => setMemeComentariosAberto(memeComentariosAberto === meme.id ? null : meme.id)} className={`flex items-center gap-2 transition cursor-pointer ${memeComentariosAberto === meme.id ? "text-[#e888d3]" : "text-gray-400 hover:text-white"}`}>
                            <span className="material-icons-outlined text-2xl">chat_bubble_outline</span>
                            <span className="text-sm font-medium">{(meme.comentarios || 0) + (comentariosMemes[meme.id]?.length || 0)}</span>
                          </button>
                        </div>
                      </div>

                      {memeComentariosAberto === meme.id && (
                        <div className="border-t border-[#303030] bg-[#0f0f0f]">
                          <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
                            {(comentariosMemes[meme.id] || []).length === 0 ? (
                              <p className="text-center text-xs text-gray-500 py-4 italic">Nenhum comentário ainda.</p>
                            ) : (
                              comentariosMemes[meme.id].map((c: any) => (
                                <div key={c.id} className="flex gap-2">
                                  <div className="w-8 h-8 bg-[#e888d3] rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="material-icons-outlined text-black text-xs">person</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs font-bold text-[#e888d3]">@{c.autor}</p>
                                    <p className="text-sm text-gray-200">{c.texto}</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          {logado && (
                            <div className="flex gap-2 p-3 border-t border-[#303030]">
                              <input type="text" placeholder="Escreva um comentário..." value={textoComentarioMeme} onChange={(e) => setTextoComentarioMeme(e.target.value)} onKeyDown={async (e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  if (!textoComentarioMeme.trim()) return;
                                  const texto = textoComentarioMeme.trim();
                                  const novo = { id: Date.now(), autor: usuario, texto, timestamp: Date.now() };
                                  setComentariosMemes((prev) => ({ ...prev, [meme.id]: [novo, ...(prev[meme.id] || [])] }));

                                  try {
                                    const { data: { user } } = await supabase.auth.getUser();
                                    if (user && typeof meme.id === "string" && meme.id.startsWith("db_meme_")) {
                                      const idNum = parseInt(meme.id.replace("db_meme_", ""));
                                      if (!isNaN(idNum)) {
                                        await supabase.from("meme_comments").insert({ meme_id: idNum, user_id: user.id, texto });
                                      }
                                    }
                                  } catch (err) { console.error("Erro comentar meme:", err); }

                                  setTextoComentarioMeme("");
                                }
                              }} className="flex-1 bg-[#0f0f0f] border border-[#303030] rounded-full px-3 py-1.5 text-sm text-white outline-none focus:border-[#e888d3]" />
                              <button onClick={async () => {
                                if (!textoComentarioMeme.trim()) return;
                                const texto = textoComentarioMeme.trim();
                                const novo = { id: Date.now(), autor: usuario, texto, timestamp: Date.now() };
                                setComentariosMemes((prev) => ({ ...prev, [meme.id]: [novo, ...(prev[meme.id] || [])] }));

                                try {
                                  const { data: { user } } = await supabase.auth.getUser();
                                  if (user && typeof meme.id === "string" && meme.id.startsWith("db_meme_")) {
                                    const idNum = parseInt(meme.id.replace("db_meme_", ""));
                                    if (!isNaN(idNum)) {
                                      await supabase.from("meme_comments").insert({ meme_id: idNum, user_id: user.id, texto });
                                    }
                                  }
                                } catch (err) { console.error("Erro comentar meme:", err); }

                                setTextoComentarioMeme("");
                              }} className="w-8 h-8 rounded-full bg-[#e888d3] flex items-center justify-center cursor-pointer">
                                <span className="material-icons-outlined text-black text-sm">send</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : abaAtiva === "social" ? (
            <div className="p-4 max-w-5xl mx-auto">
              <div className="mt-2 mb-4">
                <h1 className="text-2xl font-bold mb-1">Social</h1>
                <p className="text-gray-400 text-sm">Mural de recados • {usuario ? (recados[usuario]?.length || 0) : 0} no seu mural</p>
              </div>

              {/* ===== BARRA DE STORIES ===== */}
              <div className="flex gap-4 overflow-x-auto pb-4 mb-2 -mx-4 px-4">
                {logado && (
                  <div onClick={() => setMostrarUploadStory(true)} className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0">
                    <div className="relative">
                      {usuarios[usuario]?.avatarUrl ? (
                        <img src={usuarios[usuario].avatarUrl} alt={usuario} className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[#e888d3] flex items-center justify-center text-black font-bold text-xl">{usuario.slice(0, 1).toUpperCase()}</div>
                      )}
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#e888d3] border-2 border-[#0f0f0f] rounded-full flex items-center justify-center">
                        <span className="material-icons-outlined text-black text-sm">add</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-300 truncate w-16 text-center">Seu story</span>
                  </div>
                )}

                {Object.keys(storiesVisiveis).length === 0 && !logado && (
                  <div className="flex items-center px-3 py-4 text-xs text-gray-500 italic">Faça login para ver stories</div>
                )}
                {Object.keys(storiesVisiveis).length === 0 && logado && (
                  <div className="flex items-center px-3 py-4 text-xs text-gray-500 italic">Siga alguém pra ver os stories deles</div>
                )}
                {Object.entries(storiesVisiveis).map(([nomeAutor, stories]: any) => {
                  if (!stories || stories.length === 0) return null;
                  const info = getCanalInfo(`@${nomeAutor}`);
                  const todasVistas = usuario ? stories.every((s: any) => (storiesVistos[s.id] || []).includes(usuario)) : false;
                  const naoVisto = !todasVistas;
                  return (
                    <div key={nomeAutor} onClick={() => abrirStory(nomeAutor, 0)} className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 group">
                      <div className={`w-16 h-16 rounded-full p-[2.5px] transition ${naoVisto ? "bg-gradient-to-tr from-[#e888d3] via-pink-500 to-yellow-400" : "bg-gray-600"} group-hover:scale-105`}>
                        <div className="w-full h-full rounded-full bg-[#0f0f0f] p-[2px]">
                          {info.avatarUrl ? (
                            <img src={info.avatarUrl} className="w-full h-full rounded-full object-cover" alt={nomeAutor} />
                          ) : (
                            <div className={`w-full h-full rounded-full ${info.cor} flex items-center justify-center text-white font-bold text-base`}>{nomeAutor.slice(0, 2).toUpperCase()}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-300 truncate w-16 text-center">@{nomeAutor}</span>
                    </div>
                  );
                })}
              </div>

              {/* ===== MURAL DE RECADOS ===== */}
              <div className="bg-[#1c1c1c] border border-[#303030] rounded-2xl mb-6 overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-[#303030]">
                  <span className="material-icons-outlined text-[#e888d3]">sticky_note_2</span>
                  <h2 className="font-bold">Recados</h2>
                  <span className="text-xs text-gray-500 ml-auto">{usuario ? (recados[usuario]?.length || 0) : 0} no mural</span>
                </div>

                <div className="p-5">
                  {logado ? (
                    <>
                      <div className="flex gap-3 mb-3">
                        {usuarios[usuario]?.avatarUrl ? (
                          <img src={usuarios[usuario].avatarUrl} alt={usuario} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 bg-[#e888d3] rounded-full flex items-center justify-center flex-shrink-0"><span className="material-icons-outlined text-black text-sm">person</span></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <textarea placeholder="Escreva um recado no seu mural..." value={textoRecado} onChange={(e) => setTextoRecado(e.target.value)} rows={2} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-[#e888d3] resize-none" />
                          {imagemRecado && (
                            <div className="mt-2 relative inline-block">
                              <img src={imagemRecado} alt="preview" className="max-h-40 rounded-lg border border-[#303030]" />
                              <button onClick={() => setImagemRecado("")} className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"><span className="material-icons-outlined text-sm">close</span></button>
                            </div>
                          )}
                          {mostrarEmojisRecado && (
                            <div className="mt-2 bg-[#0f0f0f] border border-[#303030] rounded-lg p-2 grid grid-cols-8 gap-1 max-w-md">
                              {["😀","😂","🤣","😊","😍","🥰","😎","🤔","😅","😭","😡","🥳","😴","🤯","🤩","😇","👍","👎","👏","🙌","🙏","💪","✌️","🤝","❤️","🔥","✨","🎉","💀","💯","⭐","🌈","🍕","🍔","☕","🍺","⚽","🎮","🎬","🎵","📷","💻","📱","🚀","🌎","💣","🎁","🧠"].map((emoji) => (
                                <button key={emoji} onClick={() => setTextoRecado((prev) => prev + emoji)} className="text-xl hover:bg-[#272727] rounded p-1 transition cursor-pointer">{emoji}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex gap-1">
                          <button onClick={() => setMostrarEmojisRecado(!mostrarEmojisRecado)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${mostrarEmojisRecado ? "bg-[#e888d3] text-black border-[#e888d3]" : "bg-[#0f0f0f] text-gray-300 border-[#303030] hover:border-[#e888d3]/50"}`}>
                            <span className="material-icons-outlined text-base">sentiment_satisfied</span> Emoji
                          </button>
                          <label className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#0f0f0f] text-gray-300 border border-[#303030] hover:border-[#e888d3]/50 transition cursor-pointer">
                            <span className="material-icons-outlined text-base">image</span> Foto
                            <input type="file" accept="image/*" onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 8 * 1024 * 1024) { alert("Imagem muito grande! Máximo 8 MB."); return; }
                              try { const c = await comprimirImagem(file, 900, 0.72); setImagemRecado(c); } catch { alert("Erro ao processar."); }
                              e.target.value = "";
                            }} className="hidden" />
                          </label>
                        </div>
                        <button onClick={() => {
                          if (!textoRecado.trim() && !imagemRecado) return;
                          const novo = { id: Date.now(), autor: usuario, texto: textoRecado.trim(), imagem: imagemRecado || null, timestamp: Date.now() };
                          setRecados((prev) => ({ ...prev, [usuario]: [novo, ...(prev[usuario] || [])] }));
                          setTextoRecado(""); setImagemRecado(""); setMostrarEmojisRecado(false);
                        }} className="bg-[#e888d3] hover:bg-[#d176be] text-black text-sm font-bold px-4 py-1.5 rounded-full transition cursor-pointer">Enviar recado</button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-3">Faça login para escrever recados</p>
                  )}
                </div>

                <div className="border-t border-[#303030]">
                  {usuario && (recados[usuario]?.length || 0) > 0 ? (
                    recados[usuario].map((r: any) => (
                      <div key={r.id} className="p-4 flex gap-3 border-b border-[#252525] last:border-b-0">
                        <div onClick={() => abrirCanal(`@${r.autor}`)} className="cursor-pointer flex-shrink-0">
                          {usuarios[r.autor]?.avatarUrl ? (
                            <img src={usuarios[r.autor].avatarUrl} alt={r.autor} className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-[#e888d3] transition" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center hover:ring-2 hover:ring-[#e888d3] transition"><span className="material-icons-outlined text-white text-sm">person</span></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span onClick={() => abrirCanal(`@${r.autor}`)} className="font-medium text-sm text-[#e888d3] cursor-pointer hover:underline">@{r.autor}</span>
                            <span className="text-gray-500 text-xs">{formatarTempo(r.timestamp)}</span>
                          </div>
                          {r.texto && <p className="text-sm text-gray-200 break-words whitespace-pre-wrap">{r.texto}</p>}
                          {r.imagem && <img src={r.imagem} alt="recado" className="mt-2 max-h-72 rounded-lg border border-[#303030] cursor-pointer" onClick={() => window.open(r.imagem, "_blank")} />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <span className="material-icons-outlined text-4xl text-gray-600 mb-2">sticky_note_2</span>
                      <p className="text-sm text-gray-400">Nenhum recado ainda</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ===== VÍDEOS DA COMUNIDADE ===== */}
              <div className="flex items-center justify-between flex-wrap gap-3 mt-8 mb-4">
                <div>
                  <h2 className="font-bold text-lg">Vídeos da comunidade</h2>
                  <p className="text-gray-400 text-xs mt-0.5">{todosVideosLista.length} vídeos enviados</p>
                </div>
                <button onClick={() => { if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; } setMostrarUpload(true); }} className="flex items-center gap-2 bg-[#e888d3] hover:bg-[#d176be] text-black px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer">
                  <span className="material-icons-outlined text-sm">add</span> Enviar vídeo
                </button>
              </div>

              {todosVideosLista.length === 0 ? (
                <div className="text-center py-16 bg-[#1c1c1c] rounded-2xl border border-[#303030]">
                  <span className="material-icons-outlined text-5xl text-gray-600 mb-3">videocam_off</span>
                  <p className="text-gray-400">Nenhum vídeo ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8">
                  {todosVideosLista.map((v) => {
                    const info = getCanalInfo(v.canal);
                    return (
                      <div key={v.id} onClick={() => setVideoAssistindo(v)} className="cursor-pointer group">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                          <img src={v.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={v.titulo} />
                          <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-1 rounded">{v.duracao}</span>
                        </div>
                        <div className="flex gap-3 mt-3">
                          <div onClick={(e) => { e.stopPropagation(); abrirCanal(v.canal); }} className="cursor-pointer flex-shrink-0">
                            {info.avatarUrl ? (
                              <img src={info.avatarUrl} className="w-9 h-9 rounded-full object-cover hover:ring-2 hover:ring-[#e888d3] transition" alt={v.canal} />
                            ) : (
                              <div className={`w-9 h-9 ${info.cor} rounded-full flex items-center justify-center text-[10px] font-bold text-white hover:ring-2 hover:ring-[#e888d3] transition`}>{v.canal.replace("@", "").slice(0, 2).toUpperCase()}</div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <h3 className="font-semibold text-sm line-clamp-2 leading-5 group-hover:text-[#e888d3] transition">{v.titulo}</h3>
                            <p onClick={(e) => { e.stopPropagation(); abrirCanal(v.canal); }} className="text-gray-400 text-xs mt-1 cursor-pointer hover:text-[#e888d3] hover:underline">{v.canal}</p>
                            <p className="text-gray-400 text-xs">{viewsDoVideo(v)}</p>
                          </div>
                        </div>
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
                    <div className="w-16 h-16 bg-[#e888d3] rounded-full flex items-center justify-center"><span className="material-icons-outlined text-3xl text-black">person</span></div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold mb-1">Bem-vindo, @{usuario}</h1>
                    {usuarios[usuario]?.bio && <p className="text-gray-300 text-sm mb-2 whitespace-pre-line max-w-xl">{usuarios[usuario].bio}</p>}
                    <p className="text-gray-400 text-sm mb-2">Aqui você pode gerenciar seus vídeos e sua conta.</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-[#e888d3]/20 border border-[#e888d3]/40 text-[#e888d3] text-xs font-medium px-2.5 py-1 rounded-full"><span className="material-icons-outlined text-sm">workspace_premium</span> Plano {nomePlano}</span>
                      <span className="text-xs text-gray-500">Limite: {limiteAtual} MB por vídeo</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); setAbaPerfil("videos"); }} className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 cursor-pointer">
                    <span className="material-icons-outlined text-base">visibility</span> Ver meu perfil
                  </button>
                  {planoAtual !== "master" && (
                    <button onClick={() => { setMostrarPagamento(true); setEtapaPagamento("planos"); }} className="flex items-center gap-2 bg-[#e888d3] hover:bg-[#d176be] text-black px-4 py-2 rounded-full text-sm font-bold transition-all flex-shrink-0 cursor-pointer">
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
                                    {/* Abas: Do PC / Do Link */}
                    <div className="flex gap-1 mb-4 bg-[#0f0f0f] p-1 rounded-lg">
                      <button
                        onClick={() => setModoUpload("arquivo")}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition cursor-pointer ${modoUpload === "arquivo" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#1c1c1c]"}`}
                      >
                        <span className="material-icons-outlined text-base align-middle mr-1">upload_file</span>
                        Do PC
                      </button>
                      <button
                        onClick={() => setModoUpload("link")}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition cursor-pointer ${modoUpload === "link" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#1c1c1c]"}`}
                      >
                        <span className="material-icons-outlined text-base align-middle mr-1">link</span>
                        Do Link
                      </button>
                    </div>

                    {modoUpload === "arquivo" ? (
                      <div className="mb-4">
                        <CldUploadWidget
                          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                          options={{
                            sources: ["local"],
                            resourceType: "video",
                            clientAllowedFormats: ["mp4", "webm", "mov"],
                            maxFileSize: 104857600,
                          }}
                          onSuccess={(result: any) => {
                            const videoUrl = result.info.secure_url;
                            setUrlModal(videoUrl);
                            alert("Upload concluído! Agora clique em Publicar.");
                          }}
                        >
                          {({ open }) => (
                            <button
                              type="button"
                              onClick={() => open()}
                              className="w-full bg-[#0f0f0f] border-2 border-dashed border-[#303030] hover:border-[#e888d3] rounded-lg px-4 py-6 text-sm text-gray-300 transition cursor-pointer"
                            >
                              <span className="material-icons-outlined text-4xl text-gray-400 mb-2 block">cloud_upload</span>
                              {urlModal && urlModal.includes("cloudinary") ? "Vídeo enviado! Envie outro se quiser" : "Clique para escolher um vídeo do seu PC"}
                            </button>
                          )}
                        </CldUploadWidget>
                        <p className="text-xs text-gray-500 mt-2">
                          Máximo 100 MB • formatos: mp4, webm, mov
                        </p>
                      </div>
                    ) : (
                      <div className="mb-3">
                        <label className="block text-xs text-gray-400 mb-2 font-medium">Cole o link do vídeo</label>
                        <input
                          type="text"
                          placeholder="Cole o link do YouTube ou Vimeo"
                          value={urlModal}
                          onChange={(e) => setUrlModal(e.target.value)}
                          className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 text-white outline-none focus:border-[#e888d3]"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Aceita YouTube e Vimeo.
                        </p>
                      </div>
                    )}
                    <input type="text" placeholder="Título do vídeo" value={tituloModal} onChange={(e) => setTituloModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
                    <textarea placeholder="Descrição (opcional)" rows={3} value={descModal} onChange={(e) => setDescModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-4 text-white outline-none focus:border-[#e888d3]"></textarea>
                    <button onClick={async() => {
                      if (!tituloModal.trim()) { alert("Digite um título!"); return; }
                      if (!urlModal.trim()) { alert("Cole um link de vídeo!"); return; }
                      if (!urlVideoValida(urlModal)) {
                        alert("Só aceitamos links do YouTube ou do Vimeo!");
                        return;
                      }

                      const novoId = Date.now();
                      const linkLimpo = urlModal.trim();

                      // Gera thumbnail do YouTube automaticamente
                      let thumbUrl = `https://picsum.photos/seed/${novoId}/640/360`;
                      const regexYt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                      const matchYt = linkLimpo.match(regexYt);
                      if (matchYt) {
                        thumbUrl = `https://img.youtube.com/vi/${matchYt[1]}/hqdefault.jpg`;
                      }

                      const novoVideoLocal = {
                        id: novoId,
                        titulo: tituloModal,
                        descricao: descModal || "Sem descrição.",
                        url: linkLimpo,
                        categoria: catModal,
                        thumb: thumbUrl,
                        duracao: "00:00",
                        canal: `@${usuario}`,
                        views: "0 visualizações • agora",
                        cor: "bg-pink-600",
                      };
                      setMeusVideos([novoVideoLocal, ...meusVideos]);
                      setViews((prev) => ({ ...prev, [novoId]: 0 }));
                      try {
                        const meuId = await getMeuIdSupabase();
                        console.log("DEBUG salvar vídeo - meuId:", meuId);
                        if (meuId) {
                          const { data: salvo, error: erroSalvar } = await supabase.from("videos").insert({
                            user_id: meuId,
                            titulo: tituloModal,
                            descricao: descModal || "Sem descrição.",
                            url: linkLimpo,
                            thumb: thumbUrl,
                            categoria: catModal,
                           }).select().single();

                          console.log("DEBUG salvar vídeo - resultado:", salvo, "erro:", erroSalvar);

                          if (salvo) {
                            setVideosBanco((prev: any) => [{
                              id: `db_${salvo.id}`,
                              dbId: salvo.id,
                              titulo: salvo.titulo,
                              descricao: salvo.descricao,
                              url: salvo.url,
                              thumb: salvo.thumb,
                              duracao: "00:00",
                              categoria: salvo.categoria,
                              canal: `@${usuario}`,
                              views: "0 visualizações • agora",
                              cor: "bg-pink-600",
                            }, ...prev]);
                          }
                        }
                      } catch (err) { console.error("Erro salvar vídeo:", err); }
                      setTituloModal(""); setDescModal(""); setUrlModal("");
                      alert("Vídeo publicado!");
                    }} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Publicar</button>
                  </div>

                  <h2 className="font-bold text-lg mb-4">Meus vídeos ({meusVideos.length})</h2>
                  {meusVideos.length === 0 ? (
                    <p className="text-gray-400 text-sm">Você ainda não postou nenhum vídeo.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8">
                      {meusVideos.map((v) => (
                        <div key={v.id} className="cursor-pointer group relative">
                          <div onClick={() => setVideoAssistindo(v)}>
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                              <img src={v.thumb} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={v.titulo} />
                              <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-1 rounded">{v.duracao}</span>
                            </div>
                            <div className="flex gap-3 mt-3">
                              <div className={`w-9 h-9 ${v.cor} rounded-full flex-shrink-0`}></div>
                              <div className="flex flex-col">
                                <h3 className="font-semibold text-sm line-clamp-2 leading-5">{v.titulo}</h3>
                                <p className="text-gray-400 text-xs">{viewsDoVideo(v)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Botão de apagar */}
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm(`Apagar o vídeo "${v.titulo}"?`)) return;
                              if (typeof v.id === "string" && v.id.startsWith("db_")) {
                                const idNum = parseInt(v.id.replace("db_", ""));
                                if (!isNaN(idNum)) {
                                  try {
                                    await supabase.from("videos").delete().eq("id", idNum);
                                    setVideosBanco((prev: any) => prev.filter((x: any) => x.id !== v.id));
                                  } catch (err) { console.error("Erro apagar:", err); }
                                }
                              }
                              setMeusVideos((prev) => prev.filter((x) => x.id !== v.id));
                            }}
                            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Apagar vídeo"
                          >
                            <span className="material-icons-outlined text-lg">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {abaCanal === "editar" && (
                <div className="bg-[#1c1c1c] rounded-2xl p-6">
                  <h2 className="font-bold text-lg mb-1">Editar Perfil</h2>
                  <p className="text-sm text-gray-400 mb-6">Atualize sua foto, nome de usuário, e-mail e bio.</p>
                  <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#303030]">
                    <div className="relative">
                      {novoAvatar ? (
                        <img src={novoAvatar} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-[#e888d3]" />
                      ) : (
                        <div className="w-20 h-20 bg-[#e888d3] rounded-full flex items-center justify-center"><span className="material-icons-outlined text-4xl text-black">person</span></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">@{usuario}</p>
                      <div className="flex gap-2">
                        <label className="cursor-pointer bg-[#e888d3] hover:bg-[#d176be] text-black text-xs font-bold px-3 py-1.5 rounded-full transition">
                          Trocar foto
                          <input type="file" accept="image/*" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 8 * 1024 * 1024) { alert("Imagem muito grande! Máximo 8 MB."); return; }
                            try { const c = await comprimirImagem(file, 400, 0.75); setNovoAvatar(c); } catch { alert("Erro."); }
                          }} className="hidden" />
                        </label>
                        {novoAvatar && <button onClick={() => setNovoAvatar("")} className="bg-[#272727] hover:bg-[#3f3f3f] text-white text-xs font-medium px-3 py-1.5 rounded-full transition cursor-pointer">Remover</button>}
                      </div>
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
                  <p className="text-xs text-gray-500 mb-4">Usado para login e notificações.</p>

                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea placeholder="Escreva algo sobre você (máx 160 caracteres)" value={novaBio} onChange={(e) => setNovaBio(e.target.value.slice(0, 160))} rows={3} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 text-white outline-none focus:border-[#e888d3] resize-none"></textarea>
                  <div className="flex justify-between mb-6">
                    <p className="text-xs text-gray-500">Aparece no seu perfil público.</p>
                    <p className={`text-xs ${novaBio.length >= 160 ? "text-red-400" : "text-gray-500"}`}>{novaBio.length}/160</p>
                  </div>

                  <button disabled={salvandoPerfil} onClick={handleSalvarPerfil} className="w-full bg-[#e888d3] hover:bg-[#d176be] disabled:opacity-50 text-black font-bold py-2.5 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer">
                    {salvandoPerfil ? <><span className="material-icons-outlined animate-spin">refresh</span> Salvando...</> : <><span className="material-icons-outlined text-base">save</span> Salvar alterações</>}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-3 mt-2 mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Filmes</h1>
                  <p className="text-gray-400 text-sm">{todosOsFilmes.length} filmes disponíveis • dublado e legendado</p>
                </div>
                <button onClick={() => { if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; } setMostrarUploadFilme(true); }} className="flex items-center gap-2 bg-[#e888d3] hover:bg-[#d176be] text-black px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer">
                  <span className="material-icons-outlined text-base">add</span> Enviar filme
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-8">
                {todosOsFilmes.map((filme) => (
                  <div key={filme.id} onClick={() => setFilmeSelecionado(filme)} className="cursor-pointer group">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[#1c1c1c] to-[#0f0f0f] border border-[#303030] group-hover:border-[#e888d3] transition">
                      <img src={posters[filme.id] || `https://picsum.photos/seed/${filme.id}/640/360`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={filme.titulo} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center group-hover:bg-[#e888d3] transition">
                          <span className="material-icons-outlined text-white group-hover:text-black text-3xl">play_arrow</span>
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-2 py-0.5 rounded">Filme</span>
                    </div>
                    <div className="flex gap-3 mt-3">
                      <div className="w-9 h-9 bg-[#e888d3] rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="material-icons-outlined text-black text-sm">movie</span>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-sm line-clamp-2 leading-5 group-hover:text-[#e888d3] transition">{filme.titulo}</h3>
                        <p className="text-gray-400 text-xs mt-1">{filme.ano}</p>
                        <p className="text-gray-400 text-xs">Filme • HD</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============ MODAL: VER STORY ============ */}
      {storyAberto && (() => {
        const stories = todosOsStories[storyAberto.usuario] || [];
        const storyAtual = stories[storyAberto.index];
        if (!storyAtual) return null;
        return (
          <div className="fixed inset-0 bg-black z-[200] flex items-center justify-center">
            <div className="relative w-full h-full max-w-md">
              <div className="absolute top-4 left-2 right-2 flex gap-1 z-20">
                {stories.map((_: any, i: number) => (
                  <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{ width: i < storyAberto.index ? "100%" : i === storyAberto.index ? `${progressoStory}%` : "0%", transition: "none" }}></div>
                  </div>
                ))}
              </div>

              <div className="absolute top-7 left-4 right-4 flex items-center gap-3 z-20">
                {(() => {
                  const info = getCanalInfo(`@${storyAberto.usuario}`);
                  return info.avatarUrl ? (
                    <img src={info.avatarUrl} className="w-9 h-9 rounded-full object-cover border border-white/40" alt={storyAberto.usuario} />
                  ) : (
                    <div className={`w-9 h-9 ${info.cor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>{storyAberto.usuario.slice(0, 2).toUpperCase()}</div>
                  );
                })()}
                <p className="text-white font-medium text-sm flex-1 drop-shadow">@{storyAberto.usuario}</p>
                <span className="text-white/70 text-xs drop-shadow">{formatarTempo(storyAtual.timestamp)}</span>
                <button onClick={() => setStoryAberto(null)} className="material-icons-outlined text-white cursor-pointer drop-shadow hover:scale-110 transition">close</button>
              </div>

              <img src={storyAtual.imagem} alt={`story de ${storyAberto.usuario}`} className="w-full h-full object-cover" />

              {storyAtual.texto && (
                <div className="absolute inset-x-0 bottom-24 px-6 z-20 pointer-events-none">
                  <p className="text-white text-2xl font-bold drop-shadow-lg text-center whitespace-pre-wrap break-words">{storyAtual.texto}</p>
                </div>
              )}

              <button onClick={anteriorStory} className="absolute left-0 top-0 bottom-0 w-1/2 z-10 cursor-pointer group" title="Anterior">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 group-hover:bg-black/80 rounded-full flex items-center justify-center transition opacity-70 group-hover:opacity-100">
                  <span className="material-icons-outlined text-white text-2xl">chevron_left</span>
                </div>
              </button>
              <button onClick={proximoStory} className="absolute right-0 top-0 bottom-0 w-1/2 z-10 cursor-pointer group" title="Próximo">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 group-hover:bg-black/80 rounded-full flex items-center justify-center transition opacity-70 group-hover:opacity-100">
                  <span className="material-icons-outlined text-white text-2xl">chevron_right</span>
                </div>
              </button>

              <div className="absolute bottom-4 left-4 right-4 z-30">
                {usuario && usuario !== storyAberto.usuario && !inscricoes.includes(`@${storyAberto.usuario}`) && (
                  <button onClick={() => seguirCanal(`@${storyAberto.usuario}`)} className="mb-2 bg-white/90 hover:bg-white text-black text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur">
                    <span className="material-icons-outlined text-base">person_add</span> Seguir @{storyAberto.usuario}
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <input type="text" placeholder={usuario ? `Responder a @${storyAberto.usuario}...` : "Faça login para responder"} value={textoRespostaStory} onChange={(e) => setTextoRespostaStory(e.target.value)} onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; }
                      if (!textoRespostaStory.trim()) return;
                      const outroSegueVoce = usuarios[storyAberto.usuario]?.inscricoes?.includes(`@${usuario}`);
                      if (outroSegueVoce) {
                        const chave = getChaveConversa(usuario, storyAberto.usuario);
                        setTodasMensagens((prev) => ({ ...prev, [chave]: [...(prev[chave] || []), { de: usuario, para: storyAberto.usuario, texto: `📸 Story: ${textoRespostaStory.trim()}`, timestamp: Date.now(), lida: false }] }));
                      } else {
                        setSolicitacoes((prev) => ({ ...prev, [storyAberto.usuario]: [...(prev[storyAberto.usuario] || []), { id: Date.now() + Math.random(), de: usuario, para: storyAberto.usuario, texto: `📸 Story: ${textoRespostaStory.trim()}`, timestamp: Date.now() }] }));
                      }
                      setTextoRespostaStory(""); alert("Resposta enviada!");
                    }
                  }} disabled={!usuario} className="flex-1 bg-transparent border border-white/50 hover:border-white focus:border-white rounded-full px-4 py-2 text-sm text-white placeholder-white/70 outline-none transition backdrop-blur disabled:opacity-50" />
                  <button onClick={() => {
                    if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; }
                    if (!textoRespostaStory.trim()) return;
                    const outroSegueVoce = usuarios[storyAberto.usuario]?.inscricoes?.includes(`@${usuario}`);
                    if (outroSegueVoce) {
                      const chave = getChaveConversa(usuario, storyAberto.usuario);
                      setTodasMensagens((prev) => ({ ...prev, [chave]: [...(prev[chave] || []), { de: usuario, para: storyAberto.usuario, texto: `📸 Story: ${textoRespostaStory.trim()}`, timestamp: Date.now(), lida: false }] }));
                    } else {
                      setSolicitacoes((prev) => ({ ...prev, [storyAberto.usuario]: [...(prev[storyAberto.usuario] || []), { id: Date.now() + Math.random(), de: usuario, para: storyAberto.usuario, texto: `📸 Story: ${textoRespostaStory.trim()}`, timestamp: Date.now() }] }));
                    }
                    setTextoRespostaStory(""); alert("Resposta enviada!");
                  }} disabled={!usuario || !textoRespostaStory.trim()} className="w-10 h-10 rounded-full bg-white/90 hover:bg-white disabled:opacity-40 flex items-center justify-center transition cursor-pointer backdrop-blur flex-shrink-0">
                    <span className="material-icons-outlined text-black text-lg">send</span>
                  </button>
                  {(() => {
                    const storyId = storyAtual.id;
                    const listaCurtidas = storyCurtidas[storyId] || [];
                    const curtiu = usuario ? listaCurtidas.includes(usuario) : false;
                    return (
                      <button onClick={() => {
                        if (!logado) { setModoAuth("login"); setMostrarLogin(true); return; }
                        setStoryCurtidas((prev) => {
                          const atuais = prev[storyId] || [];
                          if (atuais.includes(usuario)) return { ...prev, [storyId]: atuais.filter((u) => u !== usuario) };
                          return { ...prev, [storyId]: [...atuais, usuario] };
                        });
                      }} className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition cursor-pointer backdrop-blur flex-shrink-0">
                        <span className={`material-icons-outlined text-lg transition-transform ${curtiu ? "text-red-500 scale-110" : "text-black"}`}>{curtiu ? "favorite" : "favorite_border"}</span>
                      </button>
                    );
                  })()}
                </div>
                {(() => {
                  const storyId = storyAtual.id;
                  const listaCurtidas = storyCurtidas[storyId] || [];
                  if (listaCurtidas.length === 0) return null;
                  return (
                    <div className="mt-2 flex items-center gap-1.5 text-white text-xs font-medium drop-shadow">
                      <span className="material-icons-outlined text-sm">favorite</span> {listaCurtidas.length} {listaCurtidas.length === 1 ? "curtida" : "curtidas"}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ============ MODAL: CRIAR STORY ============ */}
      {mostrarUploadStory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1c1c1c] p-6 rounded-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Criar story</h2>
              <button onClick={() => { setMostrarUploadStory(false); setImgStoryInput(""); setTextoStoryInput(""); setArquivoStory(null); }} className="material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
            </div>
            <label className="flex flex-col items-center justify-center w-full bg-[#0f0f0f] border-2 border-dashed border-[#303030] hover:border-[#e888d3] rounded-lg px-4 py-6 mb-3 cursor-pointer transition">
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 8 * 1024 * 1024) { alert("Imagem muito grande! Máximo 8 MB."); return; }
                setArquivoStory(file);
                try { const c = await comprimirImagem(file, 1080, 0.75); setImgStoryInput(c); } catch { alert("Erro."); }
              }} className="hidden" />
              <span className="material-icons-outlined text-4xl text-gray-400 mb-2">add_photo_alternate</span>
              <span className="text-sm text-gray-300 text-center">{arquivoStory ? arquivoStory.name : "Clique para escolher uma imagem (vertical)"}</span>
            </label>
            {imgStoryInput && (
              <div className="mb-3 rounded-lg overflow-hidden border border-[#303030]">
                <img src={imgStoryInput} alt="preview" className="w-full max-h-60 object-contain bg-black" />
              </div>
            )}
            <input type="text" placeholder="Escreva algo... (opcional)" value={textoStoryInput} onChange={(e) => setTextoStoryInput(e.target.value.slice(0, 120))} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-1 text-white outline-none focus:border-[#e888d3]" />
            <p className="text-xs text-gray-500 mb-4 text-right">{textoStoryInput.length}/120</p>
            <button onClick={() => {
              if (!imgStoryInput) { alert("Escolha uma imagem!"); return; }
              const novo = { id: `story_${Date.now()}`, autor: usuario, imagem: imgStoryInput, texto: textoStoryInput.trim() || null, timestamp: Date.now() };
              setStoriesUsuarios((prev) => ({ ...prev, [usuario]: [novo, ...(prev[usuario] || [])] }));
              setImgStoryInput(""); setTextoStoryInput(""); setArquivoStory(null); setMostrarUploadStory(false);
              alert("Story publicado!");
            }} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Publicar story</button>
          </div>
        </div>
      )}

      {/* ============ MODAL: CONFIRMAÇÃO NSFW ============ */}
      {mostrarConfirmacaoNSFW && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[130] p-4">
          <div className="bg-[#1c1c1c] rounded-2xl w-full max-w-md p-6 border border-[#e888d3]/40">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="material-icons-outlined text-red-500 text-4xl">warning</span>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2 text-center">Conteúdo adulto +18</h2>
            <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
              Esta seção contém conteúdo sensível e impróprio para menores de 18 anos.<br />
              Você confirma que tem <span className="text-[#e888d3] font-bold">18 anos ou mais</span>?
            </p>
            <div className="flex gap-2">
              <button onClick={() => setMostrarConfirmacaoNSFW(false)} className="flex-1 py-2.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-white font-medium transition cursor-pointer">Não, voltar</button>
              <button onClick={() => { setMostrarConfirmacaoNSFW(false); setAbaAtiva("nsfw"); setVideoAssistindo(null); setCanalSelecionado(null); setFilmeSelecionado(null); }} className="flex-1 py-2.5 rounded-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold transition cursor-pointer">Sim, tenho 18+</button>
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL: LOGIN / CADASTRO ============ */}
      {mostrarLogin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1c1c1c] rounded-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="relative p-6 border-b border-[#303030]">
              <button onClick={() => { setMostrarLogin(false); setSenhaInput(""); setEmailInput(""); setModoAuth("login"); }} className="absolute top-4 right-4 material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
              <h2 className="text-xl font-bold mb-1">{modoAuth === "login" ? "Entrar no nosafee" : "Criar sua conta"}</h2>
              <p className="text-sm text-gray-400">{modoAuth === "login" ? "Bem-vindo de volta!" : "Crie sua conta grátis."}</p>
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
              {modoAuth === "cadastro" && (
                <input type="text" placeholder="Nome de usuário (@)" value={usuario} onChange={(e) => setUsuario(e.target.value.replace("@", "").toLowerCase())} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
              )}
              <input type="email" placeholder="E-mail" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
              <input type="password" placeholder="Senha" value={senhaInput} onChange={(e) => setSenhaInput(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-4 text-white outline-none focus:border-[#e888d3]" />
              {modoAuth === "login" ? (
                <>
                  <button onClick={handleLogin} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Entrar</button>
                  <p className="text-xs text-gray-500 text-center mt-3">Ainda não tem conta? <button onClick={() => { setModoAuth("cadastro"); setSenhaInput(""); setEmailInput(""); }} className="text-[#e888d3] hover:underline font-medium cursor-pointer">Crie uma agora</button></p>
                </>
              ) : (
                <>
                  <button onClick={handleCriarConta} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Criar conta</button>
                  <p className="text-xs text-gray-500 text-center mt-3">Já tem conta? <button onClick={() => { setModoAuth("login"); setSenhaInput(""); setEmailInput(""); }} className="text-[#e888d3] hover:underline font-medium cursor-pointer">Faça login</button></p>
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
              <button onClick={() => {
                setMostrarPagamento(false); setPlanoSelecionado(null); setEtapaPagamento("planos"); setProcessandoPagamento(false);
                if (!logado && usuario) { setLogado(true); setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); localStorage.setItem("nosafee_logado", usuario); }
              }} className="absolute top-4 right-4 material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
              <h2 className="text-2xl font-bold mb-1">{etapaPagamento === "planos" ? "Bem-vindo! Escolha seu plano" : `Pagamento • ${planoSelecionado?.nome}`}</h2>
            </div>

            {etapaPagamento === "planos" && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {planos.map((plano) => {
                  const indiceAtual = ordemPlanos.indexOf(planoAtual);
                  const indicePlano = ordemPlanos.indexOf(plano.id);
                  const ehPlanoAtual = plano.id === planoAtual && logado;
                  return (
                    <div key={plano.id} className={`relative rounded-2xl p-5 flex flex-col transition-all ${ehPlanoAtual ? "bg-[#1c1c1c] border-2 border-green-500" : plano.popular ? "bg-[#1c1c1c] border-2 border-[#e888d3]" : "bg-[#161616] border border-[#303030]"}`}>
                      <h3 className="text-lg font-bold mb-3">{plano.nome}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{plano.preco === 0 ? "R$ 0" : `R$ ${plano.preco.toFixed(2).replace(".", ",")}`}</span>
                        <p className="text-xs text-gray-500 mt-1">{plano.periodo}</p>
                      </div>
                      <button onClick={() => {
                        if (plano.id === "free") { setPlanoAtual("free"); setMostrarPagamento(false); setLogado(true); setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); localStorage.setItem("nosafee_logado", usuario); alert("Tudo pronto!"); }
                        else { setPlanoSelecionado(plano); setEtapaPagamento("pagamento"); }
                      }} className={`w-full py-2.5 rounded-full font-medium text-sm mb-5 transition-all cursor-pointer ${plano.popular ? "bg-[#e888d3] hover:bg-[#d176be] text-black" : "bg-[#272727] hover:bg-[#3f3f3f] text-white"}`}>{plano.botao}</button>
                      <ul className="space-y-2.5 text-sm text-gray-300">
                        {plano.recursos.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2"><span className="material-icons-outlined text-[#e888d3] text-lg flex-shrink-0">check_circle</span><span>{rec}</span></li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {etapaPagamento === "pagamento" && planoSelecionado && (
              <div className="p-6 max-w-md mx-auto">
                <button onClick={() => { setEtapaPagamento("planos"); setPlanoSelecionado(null); }} className="flex items-center gap-1 text-sm text-gray-400 hover:text-[#e888d3] mb-4 transition cursor-pointer"><span className="material-icons-outlined text-base">arrow_back</span> Trocar plano</button>
                <div className="bg-[#0f0f0f] border border-[#e888d3]/40 rounded-xl p-4 mb-5">
                  <div className="flex items-baseline justify-between mb-2"><span className="font-bold">Plano {planoSelecionado.nome}</span><div className="text-right"><div className="text-xl font-bold text-[#e888d3]">R$ {planoSelecionado.preco.toFixed(2).replace(".", ",")}</div><div className="text-xs text-gray-500">por mês</div></div></div>
                </div>
                <button disabled={processandoPagamento} onClick={() => {
                  setProcessandoPagamento(true);
                  setTimeout(() => {
                    setProcessandoPagamento(false); setPlanoAtual(planoSelecionado?.id || "free"); setMostrarPagamento(false); setPlanoSelecionado(null); setEtapaPagamento("planos");
                    setLogado(true); setCanalSelecionado(`@${usuario}`); setAbaAtiva("canal-externo"); localStorage.setItem("nosafee_logado", usuario);
                    alert("Plano ativado!");
                  }, 2000);
                }} className="w-full bg-[#e888d3] hover:bg-[#d176be] disabled:opacity-50 text-black font-bold py-3 rounded-full transition-all cursor-pointer">
                  {processandoPagamento ? "Processando..." : `Pagar R$ ${planoSelecionado.preco.toFixed(2).replace(".", ",")}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ MODAL: UPLOAD DE POST ============ */}
      {mostrarUploadPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1c1c1c] p-6 rounded-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Criar post</h2>
              <button onClick={() => { setMostrarUploadPost(false); setImgPostInput(""); setLegendaPostInput(""); setArquivoPost(null); }} className="material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
            </div>
            <label className="flex flex-col items-center justify-center w-full bg-[#0f0f0f] border-2 border-dashed border-[#303030] hover:border-[#e888d3] rounded-lg px-4 py-6 mb-3 cursor-pointer transition">
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 8 * 1024 * 1024) { alert("Imagem muito grande! Máximo 8 MB."); return; }
                setArquivoPost(file);
                try { const c = await comprimirImagem(file, 900, 0.72); setImgPostInput(c); } catch { alert("Erro."); }
              }} className="hidden" />
              <span className="material-icons-outlined text-4xl text-gray-400 mb-2">add_photo_alternate</span>
              <span className="text-sm text-gray-300 text-center">{arquivoPost ? arquivoPost.name : "Clique para escolher uma imagem"}</span>
            </label>
            {imgPostInput && (
              <div className="mb-3 rounded-lg overflow-hidden border border-[#303030]">
                <img src={imgPostInput} alt="preview" className="w-full max-h-60 object-contain bg-black" />
              </div>
            )}
            <textarea placeholder="Escreva uma legenda... (opcional)" value={legendaPostInput} onChange={(e) => setLegendaPostInput(e.target.value.slice(0, 300))} rows={3} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-1 text-white outline-none focus:border-[#e888d3] resize-none"></textarea>
            <p className="text-xs text-gray-500 mb-4 text-right">{legendaPostInput.length}/300</p>
            <button onClick={() => {
              if (!imgPostInput) { alert("Escolha uma imagem!"); return; }
              const novo = { id: Date.now(), autor: usuario, imagem: imgPostInput, legenda: legendaPostInput.trim() || null, timestamp: Date.now() };
              setPostsUsuarios((prev) => {
                const atualizado = { ...prev, [usuario]: [novo, ...(prev[usuario] || [])] };
                localStorage.setItem("nosafee_posts", JSON.stringify(atualizado));
                return atualizado;
              });
              setImgPostInput(""); setLegendaPostInput(""); setArquivoPost(null); setMostrarUploadPost(false); setAbaPerfil("posts");
              alert("Post criado!");
            }} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Publicar post</button>
          </div>
        </div>
      )}

      {/* ============ MODAL: UPLOAD DE MEME ============ */}
      {mostrarUploadMeme && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1c1c1c] p-6 rounded-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Postar meme</h2>
              <button onClick={() => setMostrarUploadMeme(false)} className="material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
            </div>
            <input type="text" placeholder="Título do meme" value={tituloMemeInput} onChange={(e) => setTituloMemeInput(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
            <label className="flex flex-col items-center justify-center w-full bg-[#0f0f0f] border-2 border-dashed border-[#303030] hover:border-[#e888d3] rounded-lg px-4 py-6 mb-3 cursor-pointer transition">
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 8 * 1024 * 1024) { alert("Imagem muito grande! Máximo 8 MB."); return; }
                setArquivoMeme(file);
                try { const c = await comprimirImagem(file, 900, 0.72); setImgMemeInput(c); } catch { alert("Erro."); }
              }} className="hidden" />
              <span className="material-icons-outlined text-4xl text-gray-400 mb-2">image</span>
              <span className="text-sm text-gray-300 text-center">{arquivoMeme ? arquivoMeme.name : "Clique para escolher uma imagem"}</span>
            </label>
            {imgMemeInput && (
              <div className="mb-3 rounded-lg overflow-hidden border border-[#303030]">
                <img src={imgMemeInput} alt="preview" className="w-full max-h-48 object-contain bg-black" />
              </div>
            )}
            <button onClick={async () => {
              if (!tituloMemeInput.trim()) { alert("Digite um título!"); return; }
              if (!imgMemeInput) { alert("Escolha uma imagem!"); return; }

              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  const { data: salvo } = await supabase.from("memes").insert({
                    user_id: user.id,
                    titulo: tituloMemeInput.trim(),
                    thumb: imgMemeInput,
                  }).select().single();

                  if (salvo) {
                    setMemesBanco((prev: any) => [{
                      id: `db_meme_${salvo.id}`,
                      dbId: salvo.id,
                      titulo: salvo.titulo,
                      thumb: salvo.thumb,
                      autor: `@${usuario}`,
                      likes: 0,
                      dislikes: 0,
                      comentarios: 0,
                      timestamp: new Date(salvo.created_at).getTime(),
                    }, ...prev]);
                  }
                }
              } catch (err) { console.error("Erro salvar meme:", err); }

              setTituloMemeInput(""); setImgMemeInput(""); setArquivoMeme(null); setMostrarUploadMeme(false);
              alert("Meme postado!");
            }} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Postar meme</button>
          </div>
        </div>
      )}

      {/* ============ MODAL: UPLOAD DE FILME ============ */}
      {mostrarUploadFilme && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1c1c1c] p-6 rounded-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Enviar filme</h2>
              <button onClick={() => setMostrarUploadFilme(false)} className="material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
            </div>
            <p className="text-xs text-gray-400 mb-4">Cole o ID do IMDB. Ex: <span className="text-[#e888d3]">tt0111161</span></p>
            <input type="text" placeholder="Título do filme" value={tituloFilmeInput} onChange={(e) => setTituloFilmeInput(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
            <input type="text" placeholder="Ano (ex: 1994)" value={anoFilmeInput} onChange={(e) => setAnoFilmeInput(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
            <input type="text" placeholder="ID do IMDB (tt...)" value={imdbFilmeInput} onChange={(e) => setImdbFilmeInput(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-4 text-white outline-none focus:border-[#e888d3]" />
            <button onClick={() => {
              if (!tituloFilmeInput.trim()) { alert("Digite o título!"); return; }
              if (!imdbFilmeInput.trim()) { alert("Digite o ID do IMDB!"); return; }
              if (!imdbFilmeInput.startsWith("tt")) { alert("O ID precisa começar com 'tt'"); return; }
              const novo = { id: imdbFilmeInput.trim(), titulo: tituloFilmeInput.trim(), ano: parseInt(anoFilmeInput) || new Date().getFullYear(), enviadoPor: usuario };
              if (todosOsFilmes.some((f) => f.id === novo.id)) { alert("Esse filme já existe!"); return; }
              setFilmesUsuarios([novo, ...filmesUsuarios]);
              setTituloFilmeInput(""); setAnoFilmeInput(""); setImdbFilmeInput(""); setMostrarUploadFilme(false);
              alert("Filme adicionado!");
            }} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Adicionar filme</button>
          </div>
        </div>
      )}

      {/* ============ MODAL: UPLOAD VÍDEO ============ */}
      {mostrarUpload && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1c1c1c] p-6 rounded-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Enviar vídeo</h2>
              <button onClick={() => setMostrarUpload(false)} className="material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
            </div>
            {!logado ? (
              <div className="text-center">
                <p className="text-gray-300 mb-4">Você precisa estar logado!</p>
                <button onClick={() => { setMostrarUpload(false); setModoAuth("login"); setMostrarLogin(true); }} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Fazer login</button>
              </div>
            ) : (
              <>
                {/* Abas: Do PC / Do Link */}
                <div className="flex gap-1 mb-4 bg-[#0f0f0f] p-1 rounded-lg">
                  <button
                    onClick={() => setModoUpload("arquivo")}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition cursor-pointer ${modoUpload === "arquivo" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#1c1c1c]"}`}
                  >
                    <span className="material-icons-outlined text-base align-middle mr-1">upload_file</span>
                    Do PC
                  </button>
                  <button
                    onClick={() => setModoUpload("link")}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition cursor-pointer ${modoUpload === "link" ? "bg-[#e888d3] text-black" : "text-gray-300 hover:bg-[#1c1c1c]"}`}
                  >
                    <span className="material-icons-outlined text-base align-middle mr-1">link</span>
                    Do Link
                  </button>
                </div>

                {modoUpload === "arquivo" ? (
                  <div className="mb-4">
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      options={{
                        sources: ["local"],
                        resourceType: "video",
                        clientAllowedFormats: ["mp4", "webm", "mov"],
                        maxFileSize: 104857600,
                      }}
                      onSuccess={(result: any) => {
                        const videoUrl = result.info.secure_url;
                        setUrlModal(videoUrl);
                        alert("Upload concluído! Agora clique em Publicar.");
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="w-full bg-[#0f0f0f] border-2 border-dashed border-[#303030] hover:border-[#e888d3] rounded-lg px-4 py-6 text-sm text-gray-300 transition cursor-pointer"
                        >
                          <span className="material-icons-outlined text-4xl text-gray-400 mb-2 block">cloud_upload</span>
                          {urlModal && urlModal.includes("cloudinary") ? "Vídeo enviado! Envie outro se quiser" : "Clique para escolher um vídeo do seu PC"}
                        </button>
                      )}
                    </CldUploadWidget>
                    <p className="text-xs text-gray-500 mt-2">
                      Máximo 100 MB • formatos: mp4, webm, mov
                    </p>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="block text-xs text-gray-400 mb-2 font-medium">Cole o link do vídeo</label>
                    <input
                      type="text"
                      placeholder="Cole o link do YouTube ou Vimeo"
                      value={urlModal}
                      onChange={(e) => setUrlModal(e.target.value)}
                      className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 text-white outline-none focus:border-[#e888d3]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Aceita YouTube e Vimeo.
                    </p>
                  </div>
                )}
                <input type="text" placeholder="Título" value={tituloModal} onChange={(e) => setTituloModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-3 text-white outline-none focus:border-[#e888d3]" />
                <textarea placeholder="Descrição" rows={3} value={descModal} onChange={(e) => setDescModal(e.target.value)} className="w-full bg-[#0f0f0f] border border-[#303030] rounded-lg px-4 py-2 mb-4 text-white outline-none focus:border-[#e888d3]"></textarea>
                              <button onClick={async() => {
                  if (!tituloModal.trim()) { alert("Digite um título!"); return; }
                  if (!urlModal.trim()) { alert("Cole um link de vídeo!"); return; }
                  if (!urlVideoValida(urlModal)) {
                    alert("Só aceitamos links do YouTube ou do Vimeo!");
                    return;
                  }

                  const novoId = Date.now();
                  const linkLimpo = urlModal.trim();

                  // Gera thumbnail do YouTube automaticamente
                  let thumbUrl = `https://picsum.photos/seed/${novoId}/640/360`;
                  const regexYt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                  const matchYt = linkLimpo.match(regexYt);
                  if (matchYt) {
                    thumbUrl = `https://img.youtube.com/vi/${matchYt[1]}/hqdefault.jpg`;
                  }

                  setMeusVideos([{
                    id: novoId,
                    titulo: tituloModal,
                    descricao: descModal || "Sem descrição.",
                    url: linkLimpo,
                    categoria: catModal,
                    thumb: thumbUrl,
                    duracao: "00:00",
                    canal: `@${usuario}`,
                    views: "0 visualizações • agora",
                    cor: "bg-pink-600",
                  }, ...meusVideos]);
                  setViews((prev) => ({ ...prev, [novoId]: 0 }));
                  setTituloModal(""); setDescModal(""); setUrlModal("");
                  setMostrarUpload(false); setAbaAtiva("social"); setVideoAssistindo(null);
                }} className="w-full bg-[#e888d3] hover:bg-[#d176be] text-black font-bold py-2 rounded-full transition-all cursor-pointer">Publicar vídeo</button>
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
              <div className="flex items-center gap-3"><span className="material-icons-outlined text-[#e888d3]">chat</span><h2 className="text-lg font-bold">Mensagens</h2></div>
              <button onClick={() => { setMostrarMensagens(false); setConversaAtiva(null); setTextoMensagem(""); }} className="material-icons-outlined text-gray-400 hover:text-white cursor-pointer">close</button>
            </div>

            <div className="flex border-b border-[#303030] px-4">
              <button onClick={() => { setAbaMsg("conversas"); setConversaAtiva(null); }} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition cursor-pointer ${abaMsg === "conversas" ? "border-[#e888d3] text-[#e888d3]" : "border-transparent text-gray-400"}`}>Conversas</button>
              <button onClick={() => { setAbaMsg("solicitacoes"); setConversaAtiva(null); }} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition cursor-pointer flex items-center gap-1.5 ${abaMsg === "solicitacoes" ? "border-[#e888d3] text-[#e888d3]" : "border-transparent text-gray-400"}`}>
                Solicitações
                {getMinhasSolicitacoes().length > 0 && <span className="bg-[#e888d3] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{getMinhasSolicitacoes().length}</span>}
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className={`${conversaAtiva ? "hidden md:flex" : "flex"} flex-col w-full md:w-72 border-r border-[#303030] overflow-y-auto`}>
                {abaMsg === "solicitacoes" ? (
                  getMinhasSolicitacoes().length === 0 ? (
                    <div className="p-6 text-center"><span className="material-icons-outlined text-5xl text-gray-600 mb-3">mark_email_read</span><p className="text-sm text-gray-400">Nenhuma solicitação</p></div>
                  ) : (
                    <div className="p-3 space-y-2">
                      {getMinhasSolicitacoes().map(({ de, msgs }) => {
                        const info = getCanalInfo(`@${de}`);
                        const ultima = msgs[msgs.length - 1];
                        return (
                          <div key={de} className="bg-[#0f0f0f] border border-[#303030] rounded-xl p-3">
                            <div className="flex items-center gap-3 mb-2">
                              {info.avatarUrl ? <img src={info.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt={de} /> : <div className={`w-10 h-10 ${info.cor} rounded-full flex items-center justify-center text-xs font-bold text-white`}>{de.slice(0, 2).toUpperCase()}</div>}
                              <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">@{de}</p></div>
                            </div>
                            <p className="text-xs text-gray-300 line-clamp-2 mb-3">{ultima?.texto}</p>
                            <div className="flex gap-2">
                              <button onClick={() => confirmarSolicitacao(de)} className="flex-1 bg-[#e888d3] hover:bg-[#d176be] text-black text-xs font-bold py-1.5 rounded-full transition cursor-pointer">Confirmar</button>
                              <button onClick={() => recusarSolicitacao(de)} className="flex-1 bg-[#272727] hover:bg-[#3f3f3f] text-white text-xs font-medium py-1.5 rounded-full transition cursor-pointer">Recusar</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : getContatos().length === 0 ? (
                  <div className="p-6 text-center"><span className="material-icons-outlined text-5xl text-gray-600 mb-3">forum</span><p className="text-sm text-gray-400">Nenhuma conversa ainda.</p></div>
                ) : (
                  <div className="py-2">
                    {getContatos().map((contato) => {
                      const info = getCanalInfo(`@${contato}`);
                      const msgs = getMensagens(contato);
                      const ultima = msgs[msgs.length - 1];
                      const ativo = conversaAtiva === contato;
                      return (
                        <div key={contato} onClick={() => { setConversaAtiva(contato); marcarComoLida(contato); }} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition ${ativo ? "bg-[#e888d3]/10 border-l-2 border-[#e888d3]" : "hover:bg-[#272727]"}`}>
                          <div className="flex-shrink-0">
                            {info.avatarUrl ? <img src={info.avatarUrl} className="w-12 h-12 rounded-full object-cover" alt={contato} /> : <div className={`w-12 h-12 ${info.cor} rounded-full flex items-center justify-center text-sm font-bold text-white`}>{contato.slice(0, 2).toUpperCase()}</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">@{contato}</p>
                            <p className="text-xs text-gray-400 truncate">{ultima ? ultima.texto : "Diga oi!"}</p>
                          </div>
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
                    <p className="text-gray-400">Selecione uma conversa</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#303030]">
                      <button onClick={() => setConversaAtiva(null)} className="md:hidden material-icons-outlined text-gray-400 cursor-pointer">arrow_back</button>
                      <div className="flex items-center gap-3">
                        {(() => {
                          const info = getCanalInfo(`@${conversaAtiva}`);
                          return info.avatarUrl ? <img src={info.avatarUrl} className="w-9 h-9 rounded-full object-cover" alt={conversaAtiva} /> : <div className={`w-9 h-9 ${info.cor} rounded-full flex items-center justify-center text-xs font-bold text-white`}>{conversaAtiva.slice(0, 2).toUpperCase()}</div>;
                        })()}
                        <p className="font-medium text-sm">@{conversaAtiva}</p>
                      </div>
                    </div>

                    <div className="conversa-scroll flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
                      {getMensagens(conversaAtiva).map((msg, i) => {
                        const ehMinha = msg.de === usuario;
                        return (
                          <div key={i} className={`flex ${ehMinha ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${ehMinha ? "bg-[#e888d3] text-black rounded-br-md" : "bg-[#272727] text-white rounded-bl-md"}`}>{msg.texto}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 p-3 border-t border-[#303030]">
                      <input type="text" placeholder="Digite uma mensagem..." value={textoMensagem} onChange={(e) => setTextoMensagem(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensagem(conversaAtiva); } }} className="flex-1 bg-[#0f0f0f] border border-[#303030] rounded-full px-4 py-2 text-sm text-white outline-none focus:border-[#e888d3]" />
                      <button onClick={() => enviarMensagem(conversaAtiva)} disabled={!textoMensagem.trim()} className="w-10 h-10 rounded-full bg-[#e888d3] hover:bg-[#d176be] disabled:opacity-30 flex items-center justify-center transition cursor-pointer">
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

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        /* ============ MODO CLARO ============ */
        .modo-claro { background-color: #f0f2f5 !important; color: #1a1a1a; }

        .modo-claro [class*="bg-[#0f0f0f]"] { background-color: #f0f2f5 !important; }
        .modo-claro [class*="bg-[#121212]"] { background-color: #ffffff !important; }
        .modo-claro [class*="bg-[#1c1c1c]"] { background-color: #ffffff !important; }
        .modo-claro [class*="bg-[#161616]"] { background-color: #f8f9fa !important; }
        .modo-claro [class*="bg-[#222222]"] { background-color: #e4e6eb !important; }
        .modo-claro [class*="bg-[#272727]"] { background-color: #e4e6eb !important; }

        .modo-claro [class*="border-[#303030]"] { border-color: #d0d3d8 !important; }
        .modo-claro [class*="border-[#2a2a2a]"] { border-color: #d0d3d8 !important; }
        .modo-claro [class*="border-[#252525]"] { border-color: #e4e6eb !important; }

        .modo-claro .text-white { color: #1a1a1a !important; }
        .modo-claro .text-gray-300 { color: #4a4a4a !important; }
        .modo-claro .text-gray-400 { color: #65676b !important; }
        .modo-claro .text-gray-200 { color: #3a3a3a !important; }
        .modo-claro .text-gray-500 { color: #888 !important; }

        .modo-claro input, .modo-claro textarea, .modo-claro select {
          background-color: #ffffff !important;
          color: #1a1a1a !important;
        }
        .modo-claro input::placeholder,
        .modo-claro textarea::placeholder { color: #888 !important; }
      ` }} />
    </div>
  );
} 
