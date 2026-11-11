import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Share2,
  Instagram,
  Facebook,
  MessageCircle,
  Video,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Plus,
  Send
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const SocialMediaTab: React.FC = () => {
  const { business, socialConnections, toggleSocialConnection, campaigns } = useApp();
  const [activeModalPlatform, setActiveModalPlatform] = useState<string | null>(null);
  const [handleInput, setHandleInput] = useState('');

  const platformsConfig = [
    {
      id: 'instagram',
      name: 'Instagram Profissional',
      icon: Instagram,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      officialAuth: 'Meta Graph API (Facebook Login for Business)',
      scopes: 'instagram_basic, instagram_content_publish, pages_show_list',
      requirements: 'Requer Conta Comercial no Instagram vinculada a uma Página do Facebook com permissão de administrador.',
      docsUrl: 'https://developers.facebook.com/docs/instagram-api'
    },
    {
      id: 'facebook',
      name: 'Página Facebook',
      icon: Facebook,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      officialAuth: 'Meta Graph API',
      scopes: 'pages_manage_posts, pages_read_engagement',
      requirements: 'Requer Página Oficial da Empresa configurada no Meta Business Suite.',
      docsUrl: 'https://developers.facebook.com/docs/pages-api'
    },
    {
      id: 'whatsapp_business',
      name: 'WhatsApp Business Cloud API',
      icon: MessageCircle,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      officialAuth: 'Meta WhatsApp Business API Oficial',
      scopes: 'whatsapp_business_messaging, whatsapp_business_management',
      requirements: 'Requer número exclusivo verificado na Meta e aprovação de modelos de mensagem (Templates).',
      docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api'
    },
    {
      id: 'tiktok',
      name: 'TikTok for Business',
      icon: Video,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      officialAuth: 'TikTok Open API Oficial',
      scopes: 'video.publish, user.info.basic',
      requirements: 'Requer conta comercial TikTok for Business e aplicativo aprovado no TikTok Developer Portal.',
      docsUrl: 'https://developers.tiktok.com'
    }
  ];

  const handleOpenConnect = (platformId: string) => {
    const existing = socialConnections.find(s => s.platform === platformId);
    setHandleInput(existing?.accountHandle || '');
    setActiveModalPlatform(platformId);
  };

  const handleSaveConnection = () => {
    if (activeModalPlatform) {
      toggleSocialConnection(activeModalPlatform, true, handleInput);
      setActiveModalPlatform(null);
    }
  };

  const handleDisconnect = (platformId: string) => {
    if (window.confirm('Deseja desconectar este canal? Os agendamentos futuros não serão disparados.')) {
      toggleSocialConnection(platformId, false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-1">
          <Share2 className="w-3.5 h-3.5" />
          <span>Central Oficial de Conexões</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white">
          Redes Sociais & Canais de Venda
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Conecte os canais oficiais do seu negócio com segurança via OAuth. Nunca solicitamos nem armazenamos senhas de redes sociais.
        </p>
      </div>

      {/* Security notice regarding official integrations */}
      <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl flex items-start gap-3 text-xs text-slate-300">
        <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-white">Diretriz de Segurança e Transparência:</div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            As publicações e métricas utilizam as APIs oficiais (Meta Graph API, WhatsApp Cloud API e TikTok Developer). Para agendamento automático em produção, você precisará conectar as credenciais do seu Meta Business Manager ou TikTok Developer.
          </p>
        </div>
      </div>

      {/* Social Platforms Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platformsConfig.map(platform => {
          const Icon = platform.icon;
          const conn = socialConnections.find(s => s.platform === platform.id);
          const isConnected = !!conn?.connected;

          return (
            <div
              key={platform.id}
              className={`p-6 rounded-2xl border transition-all ${
                isConnected
                  ? 'bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${platform.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">{platform.name}</h2>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {isConnected ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Conectado: {conn.accountHandle || 'Canal Ativo'}</span>
                        </span>
                      ) : (
                        <span>Não conectado</span>
                      )}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  isConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {isConnected ? 'Ativo' : 'Pendente'}
                </span>
              </div>

              {/* Requirement details */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 mb-4">
                <div>
                  <strong className="text-slate-300">Autenticação:</strong> {platform.officialAuth}
                </div>
                <div>
                  <strong className="text-slate-300">Requisito:</strong> {platform.requirements}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                <a
                  href={platform.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Documentação Oficial</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {isConnected ? (
                  <button
                    onClick={() => handleDisconnect(platform.id)}
                    className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg font-semibold transition-colors"
                  >
                    Desconectar
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenConnect(platform.id)}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-xs transition-colors shadow-md shadow-indigo-600/20"
                  >
                    Conectar Canal
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheduled & Published Posts Library */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Conteúdos Prontos para Redes</h2>
          </div>
          <span className="text-xs text-slate-400">{campaigns.length} posts disponíveis</span>
        </div>

        <div className="space-y-3">
          {campaigns.map(camp => (
            <div key={camp.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-semibold text-white">{camp.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">
                  {camp.instagramPost || camp.whatsappMessage}
                </div>
                <div className="text-[10px] text-indigo-400">
                  Horário sugerido: {camp.bestTimes || 'Quinta/Sexta às 18h'}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  camp.status === 'publicado'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : camp.status === 'aprovado'
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {camp.status}
                </span>

                <button
                  onClick={() => alert(`Post pronto! Copie o texto na aba Marketing e publique no seu ${camp.status === 'publicado' ? 'canal' : 'Instagram/WhatsApp'}.`)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                >
                  Abrir Post
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for connecting account */}
      {activeModalPlatform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Configurar Conexão do Canal
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Informe o identificador da conta ou página oficial da sua empresa para associar ao sistema:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nome do Usuário ou Identificador (@perfil ou Telefone)
              </label>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="@seunegocio ou +55 11 99999-9999"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200">
              ℹ️ A autorização final para agendamentos automáticos redirecionará para a tela oficial de login da Meta / TikTok sem exposição de senhas.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setActiveModalPlatform(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveConnection}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                Salvar Conexão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
