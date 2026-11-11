import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign } from '../../types';
import {
  Megaphone,
  Sparkles,
  Send,
  Copy,
  Check,
  Instagram,
  MessageCircle,
  Video,
  Clock,
  Users,
  Calendar,
  Share2,
  Trash2,
  Edit3,
  ThumbsUp,
  FileCheck,
  Plus,
  Loader2,
  Wand2,
  Image as ImageIcon
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const MarketingTab: React.FC = () => {
  const {
    business,
    campaigns,
    addCampaign,
    updateCampaignStatus,
    deleteCampaign
  } = useApp();

  const [brief, setBrief] = useState('');
  const [objective, setObjective] = useState('Atrair clientes e aumentar vendas');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'library' | 'calendar'>('create');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(campaigns[0] || null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const objectives = [
    'Atrair novos clientes',
    'Aumentar vendas imediatas',
    'Divulgar promoção / queima',
    'Divulgar novo produto / coleção',
    'Fortalecer a marca local',
    'Fidelizar e resgatar clientes'
  ];

  const handleSelectCampaign = (camp: Campaign) => {
    setSelectedCampaign(camp);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief,
          objective,
          businessContext: {
            name: business.name,
            segment: business.segment,
            city: business.city,
            channels: business.channels
          }
        })
      });

      const data = await res.json();
      const newCamp = addCampaign({
        title: brief.slice(0, 45) + (brief.length > 45 ? '...' : ''),
        objective,
        brief,
        status: 'gerado',
        instagramPost: data.instagramPost || '',
        instagramCaption: data.instagramCaption || '',
        artIdea: data.artIdea || '',
        whatsappMessage: data.whatsappMessage || '',
        facebookPost: data.facebookPost || '',
        videoScript: data.videoScript || '',
        targetAudience: data.targetAudience || '',
        bestTimes: data.bestTimes || '',
        editorialCalendar: data.editorialCalendar || '',
        hashtags: data.hashtags || []
      });

      setSelectedCampaign(newCamp);
      setActiveTab('create');
      setBrief('');
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar campanha. Verifique sua conexão e tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marketing Multicanal com IA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Marketing Automático para {business.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Crie estratégias, campanhas e conteúdos persuasivos profissionais para Instagram, WhatsApp, TikTok e Facebook.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs self-start sm:self-center">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'create' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gerador & Detalhes
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'library' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Biblioteca ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'calendar' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cronograma Editorial
          </button>
        </div>
      </div>

      {/* Main Container */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Form: Briefing */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
              <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-400" />
                <span>O que você deseja divulgar hoje?</span>
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Descreva de forma natural, como se estivesse conversando com um amigo.
              </p>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Objetivo da Campanha
                  </label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {objectives.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Ideia / Briefing da Divulgação
                    </label>
                    <span className="text-[10px] text-slate-500">Ex: Promoção de sexta</span>
                  </div>
                  <textarea
                    rows={4}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder="Ex: Quero divulgar uma promoção de sexta-feira com 15% de desconto no Pix para todos os nossos produtos..."
                    required
                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                {/* Quick Suggester Chips */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 mb-2">Exemplos rápidos:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Promoção de sexta-feira com 15% off no Pix',
                      'Lançamento da nova coleção com brinde surpresa',
                      'Super queima de estoque das últimas peças',
                      'Combo especial com frete grátis para nossa cidade'
                    ].map((example, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setBrief(example)}
                        className="text-[10px] px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition-colors text-left"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !brief.trim()}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Criando Estratégia e Textos com IA...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Gerar Campanha Completa com IA</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Recent Campaigns Quick Selector */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>Campanhas Salvas</span>
                <span className="text-[10px] text-slate-500">{campaigns.length} itens</span>
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {campaigns.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCampaign(c)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      selectedCampaign?.id === c.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-950 hover:text-slate-200'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-medium truncate">{c.title}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{formatDate(c.createdAt)}</span>
                        {c.imageUrl && (
                          <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                            <ImageIcon className="w-2.5 h-2.5" /> Com Imagem
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                      c.status === 'publicado'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : c.status === 'aprovado'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Preview: Generated Multichannel Content */}
          <div className="lg:col-span-7 space-y-4">
            {selectedCampaign ? (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
                {/* Campaign Header & Status Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedCampaign.title}</h2>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Objetivo: <strong className="text-slate-300">{selectedCampaign.objective}</strong>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                    {(['gerado', 'aprovado', 'publicado'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => updateCampaignStatus(selectedCampaign.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-colors ${
                          selectedCampaign.status === st
                            ? st === 'publicado'
                              ? 'bg-emerald-600 text-white'
                              : st === 'aprovado'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-amber-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>



                {/* 1. WhatsApp Message (Ready to Copy) */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <MessageCircle className="w-4 h-4" />
                      <span>Mensagem Pronta para WhatsApp</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedCampaign.whatsappMessage, 'whatsapp')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copiedField === 'whatsapp' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'whatsapp' ? 'Copiado!' : 'Copiar para WhatsApp'}</span>
                    </button>
                  </div>
                  <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {selectedCampaign.whatsappMessage}
                  </div>
                </div>

                {/* 2. Instagram Feed & Legenda */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                      <Instagram className="w-4 h-4" />
                      <span>Post e Legenda para Instagram</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`${selectedCampaign.instagramPost}\n\n${selectedCampaign.instagramCaption}\n\n${(selectedCampaign.hashtags || []).join(' ')}`, 'instagram')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copiedField === 'instagram' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'instagram' ? 'Copiado!' : 'Copiar Post Completo'}</span>
                    </button>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1">Texto da Postagem / Feed:</div>
                    <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {selectedCampaign.instagramPost}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1">Legenda Persuasiva:</div>
                    <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {selectedCampaign.instagramCaption}
                    </div>
                  </div>

                  {selectedCampaign.hashtags && selectedCampaign.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {selectedCampaign.hashtags.map((tag, i) => (
                        <span key={i} className="text-[10px] text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Ideia de Arte Recomendada */}
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>Ideia Visual de Arte</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedCampaign.artIdea}
                  </p>
                </div>

                {/* 4. Roteiro de Vídeo (Reels / TikTok) */}
                {selectedCampaign.videoScript && (
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-violet-400 text-xs font-bold">
                        <Video className="w-4 h-4" />
                        <span>Roteiro de Vídeo Curto (Reels & TikTok)</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(selectedCampaign.videoScript, 'video')}
                        className="text-[11px] text-violet-300 hover:underline flex items-center gap-1"
                      >
                        {copiedField === 'video' ? 'Copiado!' : 'Copiar Roteiro'}
                      </button>
                    </div>
                    <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">
                      {selectedCampaign.videoScript}
                    </div>
                  </div>
                )}

                {/* 5. Horários & Público Recomendado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Melhores Horários</span>
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      {selectedCampaign.bestTimes || 'Quintas e sextas às 11h30 e 18h30.'}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Público-Alvo Recomendado</span>
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      {selectedCampaign.targetAudience || `Moradores locais de ${business.city || 'sua região'}.`}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                Nenhuma campanha selecionada. Gere uma nova ao lado!
              </div>
            )}
          </div>

        </div>
      )}

      {/* Library View */}
      {activeTab === 'library' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Todas as Campanhas Criadas</h2>
            <button
              onClick={() => setActiveTab('create')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Campanha</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map(c => (
              <div key={c.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  {c.imageUrl && (
                    <div className="w-full h-32 rounded-lg overflow-hidden mb-3 border border-slate-800">
                      <img
                        src={c.imageUrl}
                        alt={c.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      c.status === 'publicado'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : c.status === 'aprovado'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                    <span className="text-[10px] text-slate-500">{formatDate(c.createdAt)}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{c.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {c.brief}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      handleSelectCampaign(c);
                      setActiveTab('create');
                    }}
                    className="text-indigo-400 hover:underline font-medium"
                  >
                    Ver detalhes →
                  </button>
                  <button
                    onClick={() => deleteCampaign(c.id)}
                    className="text-slate-500 hover:text-rose-400"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editorial Calendar View */}
      {activeTab === 'calendar' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Cronograma Editorial Sugerido</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Estratégia de postagem em 3 fases para aquecer e converter clientes com segurança.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Fase 1: Aquecimento (Quinta)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Poste Stories mostrando bastidores ou novidades com caixinha de perguntas. "Quem aí está animada para o fim de semana?"
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Fase 2: Dia da Oferta (Sexta)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dispare a mensagem pronta para a lista VIP do WhatsApp às 10h e publique a foto no Feed com a legenda persuasiva.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Fase 3: Última Chance (Sábado)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Poste contagem regressiva nos Stories: "Últimas unidades com desconto especial". Encerre às 18h criando senso de urgência.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
