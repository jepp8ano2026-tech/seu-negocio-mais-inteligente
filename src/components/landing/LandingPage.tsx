import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Receipt,
  Users,
  Megaphone,
  Palette,
  Calculator,
  MessageSquare,
  HelpCircle,
  Zap,
  Star,
  ChevronDown,
  Layers,
  Clock,
  Laptop,
  Sun,
  Moon
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const LandingPage: React.FC = () => {
  const { setShowLandingPage, setIsDemoMode, setShowAuthModal, switchPlan, theme, toggleTheme } = useApp();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const startFree = () => {
    setShowLandingPage(false);
    setShowAuthModal(true);
  };

  const startDemo = () => {
    setIsDemoMode(true);
    setShowLandingPage(false);
  };

  const faqs = [
    {
      q: 'O que é a plataforma SEU NEGÓCIO. MAIS INTELIGENTE.?',
      a: 'É um sistema operacional simples e inteligente feito especialmente para MEIs, autônomos, lojas e prestadores de serviços brasileiros. Ele reúne controle financeiro de caixa, caderneta de fiados com cobrança Pix educada, agendamento de horários, criação de artes e marketing automatizado com Inteligência Artificial em um só lugar.'
    },
    {
      q: 'Preciso entender de tecnologia para conseguir usar?',
      a: 'Não! O sistema foi desenhado para ser tão fácil e direto quanto conversar no WhatsApp. Além disso, o Assistente de IA orienta você em cada passo, tirando dúvidas sobre finanças, cobranças e campanhas em português simples.'
    },
    {
      q: 'Como funciona a cobrança educada de fiado?',
      a: 'Você anota as vendas fiadas com valores e prazos. Quando o pagamento estiver próximo ou vencer, nossa Inteligência Artificial gera mensagens gentis, cordiais e personalizadas para você copiar e colar no WhatsApp com a sua chave Pix, sem constranger o cliente e garantindo seu recebimento.'
    },
    {
      q: 'A plataforma gera artes e posts para as redes sociais?',
      a: 'Sim! No Estúdio Criativo e Marketing com IA, você informa qual é a promoção ou novidade e a IA gera a legenda persuasiva, roteiro para Reels/TikTok, textos para WhatsApp e a composição visual da arte com as cores e logo do seu negócio.'
    },
    {
      q: 'Meus dados e os dados dos meus clientes estão seguros?',
      a: 'Totalmente. Seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados). Seus dados ficam protegidos e isolados, e você tem liberdade total para exportar um backup completo em JSON ou solicitar a exclusão de tudo com um único clique.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-indigo-600/30 to-violet-900/60 border-b border-indigo-500/20 py-2 px-4 text-center text-xs text-indigo-200">
        ✨ Feito para MEIs e pequenos empreendedores brasileiros: experimente grátis sem cartão de crédito!
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-slate-700/80 shadow-md shadow-indigo-500/20 shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-05_at_13.27.08__1__2baa3e71.jpeg"
                alt="Logo Seu Negócio Mais Inteligente"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold tracking-wider text-slate-400 block uppercase">Seu Negócio.</span>
              <span className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
                MAIS INTELIGENTE.
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#beneficios" className="hover:text-white transition-colors">Benefícios</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos & Preços</a>
            <a href="#faq" className="hover:text-white transition-colors">Dúvidas Frequentes</a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20'
                  : 'bg-slate-900 border-slate-700 text-indigo-300 hover:bg-slate-800'
              }`}
              title={theme === 'light' ? 'Mudar para Tema Escuro' : 'Mudar para Tema Claro (Branco)'}
              aria-label="Alternar tema"
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <button
              onClick={startDemo}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
            >
              Ver Demonstração
            </button>
            <button
              onClick={startFree}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              Começar Gratuitamente
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>O Sistema Operacional Inteligente para o Empreendedor Brasileiro</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Seu negócio merece uma inteligência à altura dos seus sonhos.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Organize finanças, controle fiados com cobrança educada, crie campanhas de marketing, gere artes para redes sociais e acompanhe seu estoque. Tudo em um só lugar com Inteligência Artificial prática.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={startFree}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all"
            >
              <span>Começar Gratuitamente</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={startDemo}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Laptop className="w-4 h-4 text-indigo-400" />
              <span>Conhecer a Plataforma (Demo ao Vivo)</span>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sem necessidade de cartão</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Onboarding em 2 minutos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Conformidade com a LGPD</span>
            </div>
          </div>
        </div>

        {/* Dashboard Visual Preview */}
        <div className="max-w-6xl mx-auto px-4 mt-14">
          <div className="relative rounded-2xl p-2 bg-gradient-to-b from-slate-700/40 via-slate-800/20 to-transparent border border-slate-700/60 shadow-2xl backdrop-blur-sm">
            <div className="bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-800">
              {/* Preview Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-semibold text-slate-300">Bella Modas & Estilo • Painel Inteligente</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  IA Ativa em Tempo Real
                </span>
              </div>

              {/* Preview Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Vendas no Mês</div>
                  <div className="text-base sm:text-lg font-bold text-white mt-1">R$ 18.420,00</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">+14% vs mês anterior</div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Lucro Estimado*</div>
                  <div className="text-base sm:text-lg font-bold text-indigo-300 mt-1">R$ 7.890,00</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Margem líquida aprox. 42%</div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Fiados & A Receber</div>
                  <div className="text-base sm:text-lg font-bold text-amber-300 mt-1">R$ 1.340,00</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">2 cobranças pendentes</div>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Atendimentos no Mês</div>
                  <div className="text-base sm:text-lg font-bold text-white mt-1">142 registros</div>
                  <div className="text-[10px] text-indigo-400 mt-0.5">98% de satisfação</div>
                </div>
              </div>

              {/* Preview Banner AI */}
              <div className="p-3 bg-indigo-950/30 border border-indigo-500/30 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-slate-300">
                    <strong className="text-white">Insight da IA:</strong> Você tem R$ 339,60 a receber esta semana. Envie uma mensagem com Pix no WhatsApp em 1 clique!
                  </span>
                </div>
                <button
                  onClick={startDemo}
                  className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold underline shrink-0 ml-2"
                >
                  Abrir no sistema →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="funcionalidades" className="py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Recursos Completos</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Tudo o que seu negócio precisa. Em um só lugar.
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Substitua planilhas perdidas, cadernos rasgados e apps separados por uma plataforma unificada e inteligente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Caderneta de Fiados & Cobrança Educada</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Controle vendas a prazo, pagamentos parciais e gere mensagens amigáveis de cobrança com IA para enviar no WhatsApp com Pix sem constranger ninguém.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Marketing Automático com IA</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Escreva o que deseja divulgar e a IA gera a postagem completa do Instagram, legenda persuasiva, roteiro de Reels/TikTok e disparo para WhatsApp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-4">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Estúdio Criativo de Artes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Crie cartazes, stories, banners e imagens promocionais usando as cores e identidade da sua própria marca com formatos prontos para postar.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Controle Financeiro & Fluxo de Caixa</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitore receitas, despesas categorizadas, contas a pagar, ticket médio e lucro estimado com gráficos intuitivos e filtros por período.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Assistente de Gestão com IA</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tire dúvidas sobre seu negócio, receba orientações estratégicas e saiba exatamente o que fazer hoje para aumentar seu faturamento com segurança.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Agenda & Horários de Atendimento</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organize atendimentos, compromissos com clientes, prazos de entrega e lembretes diários para não perder nenhum compromisso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Simples e Rápido</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 mb-12">
            Como funciona na prática
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-lg flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                1
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Onboarding Rápido</h3>
              <p className="text-xs text-slate-400">
                Conte em 13 perguntas simples qual é seu segmento, canais e objetivos. A plataforma se molda ao seu negócio.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-violet-600/20 text-violet-400 font-bold text-lg flex items-center justify-center mx-auto mb-4 border border-violet-500/30">
                2
              </div>
              <h3 className="text-sm font-bold text-white mb-2">IA Conhece Seu Contexto</h3>
              <p className="text-xs text-slate-400">
                A IA analisa suas vendas, clientes e finanças para sugerir ações práticas, campanhas prontas e lembretes certeiros.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 font-bold text-lg flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                3
              </div>
              <h3 className="text-sm font-bold text-white mb-2">Venda Mais com Menos Estresse</h3>
              <p className="text-xs text-slate-400">
                Execute seu plano de evolução de 7, 30 e 90 dias e veja seu negócio prosperar com total tranquilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (Clearly labeled demo examples) */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Depoimentos Demonstrativos (Exemplos Ilustrativos)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              O que empreendedores como você dizem
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              *Estes depoimentos são exemplos demonstrativos do formato e experiência da plataforma, até a inclusão de histórias reais de usuários.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <p className="text-xs text-slate-300 italic mb-4">
                "Antes eu anotava o fiado num caderninho e vivia esquecendo de cobrar. As mensagens educadas geradas pela IA me ajudaram a recuperar mais de R$ 900 logo na primeira semana!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                  MS
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Mariana S.</div>
                  <div className="text-[10px] text-slate-400">Loja de Roupas Femininas (MEI) - SP</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <p className="text-xs text-slate-300 italic mb-4">
                "Eu não tinha tempo de ficar pensando em legendas para o Instagram e vídeos para o TikTok. Agora a IA cria as campanhas completas em 30 segundos com textos prontos."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center font-bold text-xs">
                  RA
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Rodrigo A.</div>
                  <div className="text-[10px] text-slate-400">Barbearia & Estética - MG</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <p className="text-xs text-slate-300 italic mb-4">
                "O simulador de precificação me abriu os olhos. Eu estava vendendo com margem quase zero por não considerar as taxas da maquininha e custos fixos. Recomendo demais!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-xs">
                  CL
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Carla L.</div>
                  <div className="text-[10px] text-slate-400">Confeitaria Artesanal - PR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="planos" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Planos Transparentes</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Escolha o plano ideal para o seu momento
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Sem fidelidade, cancele quando quiser. Pronto para integração direta com Stripe ou meios de pagamento brasileiros.
            </p>

            {/* Toggle Billing */}
            <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  billingPeriod === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  billingPeriod === 'yearly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-bold">20% OFF</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gratuito */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Gratuito</div>
                <div className="text-2xl font-black text-white mb-1">R$ 0</div>
                <div className="text-xs text-slate-400 mb-6">Para quem está dando os primeiros passos</div>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Até 30 clientes cadastrados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Controle de fiados básico</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Controle financeiro simples</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>3 consultas diárias com IA</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  switchPlan('gratuito');
                  startFree();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                Começar Grátis
              </button>
            </div>

            {/* PRO */}
            <div className="p-6 rounded-2xl bg-slate-900 border-2 border-indigo-500 relative flex flex-col justify-between shadow-xl shadow-indigo-600/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-[10px] font-extrabold text-white uppercase tracking-wider">
                Mais Escolhido
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Plano PRO</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {billingPeriod === 'monthly' ? 'R$ 49,90' : 'R$ 39,90'}
                  </span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>
                <div className="text-xs text-slate-400 mb-6">Para negócios em crescimento que querem automatizar</div>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Clientes e produtos ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Cobrança educada de fiado com IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Gerador de campanhas e roteiros</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Estúdio Criativo de artes com logo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Programa de pontos e fidelidade</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  switchPlan('pro');
                  startFree();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                Assinar Plano PRO
              </button>
            </div>

            {/* PREMIUM */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2">Plano PREMIUM</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {billingPeriod === 'monthly' ? 'R$ 89,90' : 'R$ 71,90'}
                  </span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>
                <div className="text-xs text-slate-400 mb-6">Máximo poder com consultoria estratégica por IA</div>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Tudo incluído no Plano PRO</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Plano de evolução 7/30/90 dias contínuo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Simulador avançado de precificação</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Relatórios executivos e auditoria de caixa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Suporte prioritário via WhatsApp</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => {
                  switchPlan('premium');
                  startFree();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                Assinar Plano PREMIUM
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Tire suas Dúvidas</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between font-semibold text-xs sm:text-sm text-slate-200">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === i && (
                  <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 bg-slate-950 border-t border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-black border border-slate-700/80 shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-05_at_13.27.08__1__2baa3e71.jpeg"
                alt="Logo Seu Negócio Mais Inteligente"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-slate-300">SEU NEGÓCIO. MAIS INTELIGENTE.</span>
          </div>

          <div className="text-center md:text-left text-[11px]">
            Tudo que seu negócio precisa. Em um só lugar. © 2026. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-slate-300 cursor-pointer">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Política de Privacidade (LGPD)</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Suporte ao Empreendedor</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
