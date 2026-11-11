import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  User,
  Palette,
  ShieldCheck,
  Download,
  Trash2,
  Check,
  CreditCard,
  Sparkles,
  Lock,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';
import { formatDocument, formatPhone } from '../../utils/formatters';

export const SettingsTab: React.FC = () => {
  const {
    business,
    theme,
    setTheme,
    updateBusiness,
    exportAllDataJson,
    resetAllData,
    switchPlan,
    setShowOnboardingModal,
    logoutUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'perfil' | 'marca' | 'plano' | 'lgpd'>('perfil');

  // Form states
  const [ownerName, setOwnerName] = useState(business.ownerName);
  const [email, setEmail] = useState(business.email);
  const [phone, setPhone] = useState(business.phone);
  const [name, setName] = useState(business.name);
  const [segment, setSegment] = useState(business.segment);
  const [city, setCity] = useState(business.city);
  const [state, setState] = useState(business.state);

  // Brand colors
  const [primaryColor, setPrimaryColor] = useState(business.brandPrimaryColor || '#4f46e5');
  const [secondaryColor, setSecondaryColor] = useState(business.brandSecondaryColor || '#8b5cf6');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness({
      ownerName,
      email,
      phone,
      name,
      segment,
      city,
      state,
      brandPrimaryColor: primaryColor,
      brandSecondaryColor: secondaryColor
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Configurações & Governança</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Configurações da Conta & LGPD
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie as informações do seu negócio, personalize sua marca e exerça seus direitos sob a LGPD.
          </p>
        </div>

        <button
          onClick={() => setShowOnboardingModal(true)}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-center transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Refazer Questionário de Onboarding</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold">
        {[
          { id: 'perfil', label: 'Dados do Negócio & Empreendedor', icon: Building2 },
          { id: 'marca', label: 'Identidade & Cores da Marca', icon: Palette },
          { id: 'plano', label: 'Plano & Assinatura', icon: CreditCard },
          { id: 'lgpd', label: 'Segurança & LGPD', icon: ShieldCheck }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === t.id
                  ? 'border-indigo-500 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Alterações salvas com sucesso!</span>
        </div>
      )}

      {/* 1. DADOS DO NEGOCIO */}
      {activeTab === 'perfil' && (
        <form onSubmit={handleSaveProfile} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white mb-1">Dados Cadastrais da Empresa</h2>
            <p className="text-xs text-slate-400">Informações que personalizam relatórios e o Assistente de IA.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Nome Fantasia do Negócio</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Nome do(a) Responsável</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Segmento Principal</label>
              <input
                type="text"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">E-mail de Contato</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Telefone / WhatsApp Comercial</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Cidade</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Estado (UF)</label>
              <input
                type="text"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 uppercase"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/30"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      )}

      {/* 2. IDENTIDADE DA MARCA */}
      {activeTab === 'marca' && (
        <form onSubmit={handleSaveProfile} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white mb-1">Identidade Visual, Cores & Tema</h2>
            <p className="text-xs text-slate-400">
              Personalize a aparência do sistema entre tema claro (branco) e escuro, além das cores da sua marca.
            </p>
          </div>

          {/* Seletor de Tema: Branco (Claro) vs Escuro */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <label className="block font-semibold text-slate-300 text-xs">Tema da Interface da Plataforma</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'bg-amber-500/10 border-amber-500 text-slate-900 ring-2 ring-amber-500/30 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Tema Claro (Branco)</div>
                  <div className="text-[11px] text-slate-400">Fundo branco e claro, ideal para o dia a dia</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-indigo-950/40 border-indigo-500 text-white ring-2 ring-indigo-500/30 font-bold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Tema Escuro</div>
                  <div className="text-[11px] text-slate-400">Visual moderno com fundo escuro e alto contraste</div>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <label className="block font-semibold text-slate-300">Cor Primária da Marca</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-xs text-slate-300">{primaryColor}</span>
              </div>
              <p className="text-[11px] text-slate-400">Utilizada em destaques e botões de ação.</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <label className="block font-semibold text-slate-300">Cor Secundária da Marca</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <span className="font-mono text-xs text-slate-300">{secondaryColor}</span>
              </div>
              <p className="text-[11px] text-slate-400">Utilizada em selos e fundos degradê.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/30"
            >
              Salvar Cores da Marca
            </button>
          </div>
        </form>
      )}

      {/* 3. PLANO E ASSINATURA */}
      {activeTab === 'plano' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white mb-1">Seu Plano Atual</h2>
            <p className="text-xs text-slate-400">
              Você está utilizando o <strong className="text-indigo-400 uppercase">Plano {business.plan}</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              { id: 'gratuito', name: 'Gratuito', price: 'R$ 0,00', desc: 'Recursos essenciais para início' },
              { id: 'pro', name: 'PRO', price: 'R$ 49,90 / mês', desc: 'IA completa, fiados ilimitados e estúdio de artes' },
              { id: 'premium', name: 'PREMIUM', price: 'R$ 89,90 / mês', desc: 'Consultoria estratégica e plano contínuo' }
            ].map(p => {
              const isCurrent = business.plan === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                    isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white uppercase tracking-wider">{p.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                          Plano Ativo
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-black text-white mt-1">{p.price}</div>
                    <p className="text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
                  </div>

                  {!isCurrent ? (
                    <button
                      onClick={() => {
                        switchPlan(p.id as any);
                        alert(`Plano atualizado para ${p.name}!`);
                      }}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
                    >
                      Mudar para este plano
                    </button>
                  ) : (
                    <div className="w-full py-2 text-center text-slate-500 font-medium border border-slate-800 rounded-xl">
                      Plano em uso
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            ℹ️ A arquitetura de checkout está preparada para gateway seguro (Stripe ou provedor brasileiro). Não há cobrança sem sua autorização explícita.
          </div>
        </div>
      )}

      {/* 4. SEGURANCA E LGPD */}
      {activeTab === 'lgpd' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div>
            <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conformidade com a LGPD (Lei Geral de Proteção de Dados)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Você é o único titular e dono dos dados do seu negócio e dos seus clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Export JSON */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="font-bold text-white flex items-center gap-2 mb-1">
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Portabilidade & Backup Integral</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Baixe um arquivo JSON completo com todos os seus produtos, histórico de vendas, caderneta de fiados, clientes, despesas e artes salvas.
                </p>
              </div>

              <button
                onClick={exportAllDataJson}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Todos os Meus Dados (JSON)</span>
              </button>
            </div>

            {/* Reset / Delete data */}
            <div className="p-5 bg-slate-950 rounded-2xl border border-rose-500/30 flex flex-col justify-between space-y-4 bg-rose-950/10">
              <div>
                <div className="font-bold text-rose-300 flex items-center gap-2 mb-1">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Direito ao Esquecimento & Exclusão</span>
                </div>
                <p className="text-rose-200/70 leading-relaxed">
                  Conforme o Artigo 18 da LGPD, você pode solicitar a eliminação definitiva de todos os dados pessoais e operacionais armazenados.
                </p>
              </div>

              <button
                onClick={resetAllData}
                className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir Permanentemente Meus Dados</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Sessão ativa como: <strong>{business.email}</strong></span>
            <button
              onClick={logoutUser}
              className="text-rose-400 hover:underline font-semibold"
            >
              Desconectar da Conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
