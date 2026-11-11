import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { CreativeArt } from '../../types';
import {
  Palette,
  Sparkles,
  Download,
  Share2,
  Trash2,
  Sliders,
  Check,
  Plus,
  Image as ImageIcon,
  Wand2,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const CreativeStudioTab: React.FC = () => {
  const { business, creativeArts, addCreativeArt, deleteCreativeArt } = useApp();

  const [format, setFormat] = useState<CreativeArt['format']>('instagram_feed');
  const [headline, setHeadline] = useState('OFERTA ESPECIAL NA ' + business.name.toUpperCase());
  const [subheadline, setSubheadline] = useState('Peças exclusivas com caimento impecável e desconto especial no Pix');
  const [ctaText, setCtaText] = useState('PEÇA NO WHATSAPP');
  const [badge, setBadge] = useState('EDIÇÃO LIMITADA');
  const [style, setStyle] = useState<CreativeArt['style']>('elegante');
  const [bgColor, setBgColor] = useState('#0f172a');
  const [textColor, setTextColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#6366f1');

  // AI Image Generator State
  const [artPrompt, setArtPrompt] = useState('Fotografia profissional de produto para anúncio comercial com iluminação de estúdio');
  const [artStyle, setArtStyle] = useState<'estudio' | 'comercial'>('estudio');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageModelUsed, setImageModelUsed] = useState<string>('Criador de Imagens Promocionais');
  const [isGenerating, setIsGenerating] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const previewCardRef = useRef<HTMLDivElement>(null);

  const formats = [
    { id: 'instagram_feed', label: 'Feed Instagram (1:1)', aspect: 'aspect-square', sizeDesc: '1080 x 1080 px' },
    { id: 'stories', label: 'Stories / Reels (9:16)', aspect: 'aspect-[9/16] max-w-[280px]', sizeDesc: '1080 x 1920 px' },
    { id: 'banner', label: 'Banner Horizontal (16:9)', aspect: 'aspect-video', sizeDesc: '1200 x 675 px' },
    { id: 'whatsapp', label: 'Material WhatsApp (4:3)', aspect: 'aspect-[4/3]', sizeDesc: '800 x 600 px' },
  ];

  const handleSaveArt = () => {
    addCreativeArt({
      title: `${headline.slice(0, 30)} (${format})`,
      format,
      headline,
      subheadline,
      ctaText,
      style,
      bgColor,
      textColor,
      accentColor,
      badge,
      imageUrl: generatedImageUrl || undefined,
      imagePrompt: artPrompt,
      imageModel: imageModelUsed
    });
    setSuccessToast('Arte salva com sucesso na sua galeria!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleGenerateAiImage = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setSuccessToast(null);

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: artPrompt,
          style: artStyle,
          aspectRatio: format === 'banner' ? '16:9' : format === 'stories' ? '9:16' : '1:1',
          businessContext: {
            name: business.name,
            segment: business.segment,
            city: business.city
          },
          headline,
          badge
        })
      });

      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setImageModelUsed(data.modelUsed || 'Criador de Imagens Promocionais');
        setSuccessToast(`Imagem gerada com sucesso!`);
        setTimeout(() => setSuccessToast(null), 3500);
      }
    } catch (err) {
      console.error('Error generating image in studio:', err);
      alert('Não foi possível gerar a imagem no momento. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPreset = (preset: 'elegante' | 'vibrante' | 'moderno' | 'minimalista') => {
    setStyle(preset);
    if (preset === 'elegante') {
      setBgColor('#090d16');
      setTextColor('#f8fafc');
      setAccentColor('#818cf8');
    } else if (preset === 'vibrante') {
      setBgColor('#18022b');
      setTextColor('#ffffff');
      setAccentColor('#ec4899');
    } else if (preset === 'moderno') {
      setBgColor('#022c22');
      setTextColor('#f0fdf4');
      setAccentColor('#34d399');
    } else if (preset === 'minimalista') {
      setBgColor('#1e293b');
      setTextColor('#ffffff');
      setAccentColor('#38bdf8');
    }
  };

  const selectedFormatObj = formats.find(f => f.id === format) || formats[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-400 mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Estúdio Criativo de Artes com IA</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Criador de Artes & Cartazes Publicitários
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gere artes e fotografias promocionais com inteligência artificial para divulgar {business.name}.
          </p>
        </div>

        <button
          onClick={handleSaveArt}
          className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-pink-600/30 flex items-center gap-2 self-start sm:self-center transition-all active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Salvar na Minha Galeria</span>
        </button>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Studio Workspace: Editor + Live Canvas Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Controls */}
        <div className="lg:col-span-6 space-y-4">

          {/* AI Image Generation Box */}
          <div className="p-5 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/30 border border-indigo-500/30 rounded-2xl space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white">Geração de Imagem com IA</h3>
              </div>

              {/* Style selector */}
              <div className="flex items-center p-0.5 bg-slate-950 border border-slate-700 rounded-lg text-[11px]">
                <button
                  type="button"
                  onClick={() => setArtStyle('estudio')}
                  className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
                    artStyle === 'estudio'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Estúdio Fotográfico</span>
                </button>
                <button
                  type="button"
                  onClick={() => setArtStyle('comercial')}
                  className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-all ${
                    artStyle === 'comercial'
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Comercial Oferta</span>
                </button>
              </div>
            </div>

            <textarea
              rows={2}
              value={artPrompt}
              onChange={(e) => setArtPrompt(e.target.value)}
              placeholder="Descreva a imagem que deseja gerar..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
            />

            {/* Quick Themes */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '👗 Moda & Roupas', prompt: 'Coleção de moda contemporânea elegante com modelo em estúdio e luz suave' },
                { label: '🍔 Hambúrguer Gourmet', prompt: 'Hambúrguer artesanal suculento com queijo derretido e batatas em mesa rústica' },
                { label: '🛍️ Super Oferta Varejo', prompt: 'Banner promocional vibrante com sacolas de compras em 3D e iluminação neon' },
                { label: '💄 Beleza & Spa', prompt: 'Cosméticos orgânicos e cuidados com a pele em luz suave de spa relaxante' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setArtPrompt(chip.prompt)}
                  className="text-[10px] px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-md transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateAiImage}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-400 hover:via-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Gerando imagem promocional em alta resolução...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Imagem com Inteligência Artificial</span>
                </>
              )}
            </button>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Personalizar Textos e Formato</span>
            </h2>

            {/* Format Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Formato da Peça</label>
              <div className="grid grid-cols-2 gap-2">
                {formats.map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id as any)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-colors ${
                      format === f.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>{f.label}</div>
                    <div className="text-[10px] text-slate-400">{f.sizeDesc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Presets de Estilo e Cores */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Paleta & Estilo</label>
              <div className="grid grid-cols-4 gap-2">
                {(['elegante', 'vibrante', 'moderno', 'minimalista'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleQuickPreset(p)}
                    className={`py-2 px-2 text-center text-xs font-medium rounded-xl border capitalize transition-all ${
                      style === p
                        ? 'bg-slate-800 border-indigo-400 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título Principal (Headline)</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Ex: SEXTA VIP NA BELLA"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subtítulo Explicativo</label>
                <textarea
                  rows={2}
                  value={subheadline}
                  onChange={(e) => setSubheadline(e.target.value)}
                  placeholder="Ex: 15% de desconto especial em toda a linha primavera"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Texto do Botão (CTA)</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Ex: CHAME NO WHATSAPP"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Selo em Destaque</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Ex: OFERTA EXCLUSIVA"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Fundo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-slate-400">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Destaque</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-slate-400">{accentColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Texto</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-[11px] font-mono text-slate-400">{textColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Visual Preview */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-2xl relative">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-4 pb-2 border-b border-slate-800">
            <span>Pré-visualização em Tempo Real</span>
            <span className="text-indigo-400 font-semibold">{selectedFormatObj.label}</span>
          </div>

          {/* Simulated Art Canvas */}
          <div
            ref={previewCardRef}
            style={{ backgroundColor: bgColor }}
            className={`w-full max-w-[380px] ${selectedFormatObj.aspect} rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-2xl overflow-hidden border border-white/10 transition-all duration-300`}
          >
            {/* If AI Image is generated, display as backdrop */}
            {generatedImageUrl ? (
              <>
                <img
                  src={generatedImageUrl}
                  alt={headline}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 z-0" />
              </>
            ) : (
              <>
                {/* Subtle glow circles when no image */}
                <div
                  style={{ backgroundColor: accentColor }}
                  className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 blur-2xl pointer-events-none"
                />
                <div
                  style={{ backgroundColor: accentColor }}
                  className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-15 blur-2xl pointer-events-none"
                />
              </>
            )}

            {/* Top Brand Bar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div
                  style={{ backgroundColor: accentColor }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md"
                >
                  {business.name.slice(0, 1)}
                </div>
                <div className="font-extrabold text-xs tracking-wider uppercase drop-shadow" style={{ color: textColor }}>
                  {business.name}
                </div>
              </div>

              {badge && (
                <div
                  style={{
                    backgroundColor: `${accentColor}40`,
                    borderColor: `${accentColor}80`,
                    color: '#ffffff'
                  }}
                  className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border tracking-wider backdrop-blur-md"
                >
                  {badge}
                </div>
              )}
            </div>

            {/* Center Content */}
            <div className="my-auto py-4 z-10 text-center space-y-3">
              <h3
                style={{ color: textColor }}
                className="text-lg sm:text-2xl font-black uppercase tracking-tight leading-tight drop-shadow-lg"
              >
                {headline || 'SEU TÍTULO AQUI'}
              </h3>

              <p
                style={{ color: textColor }}
                className="text-xs sm:text-sm opacity-90 max-w-[280px] mx-auto leading-relaxed drop-shadow"
              >
                {subheadline || 'Descrição de impacto do seu produto ou serviço'}
              </p>
            </div>

            {/* Bottom CTA Button */}
            <div className="z-10 text-center space-y-2">
              <div
                style={{
                  backgroundColor: accentColor,
                  color: '#ffffff'
                }}
                className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
              >
                <span>{ctaText || 'SAIBA MAIS'}</span>
              </div>
              <div className="text-[10px] opacity-80 drop-shadow" style={{ color: textColor }}>
                {business.phone ? `WhatsApp: ${business.phone}` : business.city}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleSaveArt}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Salvar Arte</span>
            </button>
            {generatedImageUrl && (
              <a
                href={generatedImageUrl}
                download="arte_publicitaria.jpg"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Foto IA</span>
              </a>
            )}
            <button
              onClick={() => alert(`Arte pronta para postar no ${selectedFormatObj.label}! Salva em alta resolução na galeria.`)}
              className="px-4 py-2 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

      </div>

      {/* Art Gallery */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-indigo-400" />
          <span>Galeria de Artes do Negócio ({creativeArts.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {creativeArts.map(art => (
            <div key={art.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
              <div>
                {art.imageUrl ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden mb-2 relative border border-slate-800 group">
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-amber-400 border border-white/10">
                      {art.imageModel || 'IA'}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{ backgroundColor: art.bgColor }}
                    className="w-full aspect-video rounded-lg p-3 flex flex-col justify-between border border-white/10 mb-2"
                  >
                    <div className="flex justify-between items-center text-[9px] font-bold" style={{ color: art.accentColor }}>
                      <span>{business.name}</span>
                      <span>{art.badge}</span>
                    </div>
                    <div className="text-[11px] font-black text-center uppercase" style={{ color: art.textColor }}>
                      {art.headline}
                    </div>
                    <div className="text-[9px] text-center font-bold px-2 py-0.5 rounded" style={{ backgroundColor: art.accentColor, color: '#fff' }}>
                      {art.ctaText}
                    </div>
                  </div>
                )}

                <div className="text-xs font-bold text-white truncate">{art.title}</div>
                <div className="text-[10px] text-slate-500 capitalize mt-0.5">
                  {art.format.replace('_', ' ')} • {formatDate(art.createdAt)}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-indigo-400 text-[11px] font-semibold">Pronta para envio</span>
                <button
                  onClick={() => deleteCreativeArt(art.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
