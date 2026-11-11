import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Check, ChevronRight, ChevronLeft, Building2, Target, AlertCircle, ShoppingBag, MapPin, Users2, Clock, Smartphone } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    showOnboardingModal,
    setShowOnboardingModal,
    business,
    updateBusiness,
    setOnboardingCompleted,
    setCurrentTab
  } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 6; // Grouped logically into 6 bite-sized stages so it feels light and pleasant

  // Form state initialized with existing profile values
  const [formData, setFormData] = useState({
    ownerName: business.ownerName || '',
    name: business.name || '',
    segment: business.segment || 'Moda Feminina & Acessórios',
    businessType: business.businessType || 'both',
    businessModel: business.businessModel || 'both',
    city: business.city || 'São Paulo',
    state: business.state || 'SP',
    timeInBusiness: business.timeInBusiness || '1 a 3 anos',
    teamSize: business.teamSize || '1 a 3 pessoas',
    mainGoal: business.mainGoal || 'Aumentar faturamento e atrair mais clientes',
    biggestDifficulty: business.biggestDifficulty || 'Organizar o tempo e manter postagens nas redes',
    channels: business.channels || ['Instagram', 'WhatsApp'],
    monthlyRevenue: business.monthlyRevenue || 'R$ 10.000 a R$ 20.000',
    initialTools: business.initialTools || ['Financeiro', 'Fiados', 'Marketing IA']
  });

  if (!showOnboardingModal) return null;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Finalize onboarding
      updateBusiness(formData);
      setOnboardingCompleted(true);
      setShowOnboardingModal(false);
      localStorage.setItem('snmi_onboarding_completed', 'true');
      setCurrentTab('overview');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const toggleTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      initialTools: prev.initialTools.includes(tool)
        ? prev.initialTools.filter(t => t !== tool)
        : [...prev.initialTools, tool]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Progress */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Personalização Inteligente
              </div>
              <div className="text-[11px] text-slate-400">
                Passo {step} de {totalSteps} • Moldando seu sistema
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Contents */}
        <div className="min-h-[280px]">
          {/* STEP 1: Quem é você e seu negócio */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>1. Quem é você e qual o seu negócio?</span>
              </h2>
              <p className="text-xs text-slate-400">
                Essas informações serão usadas pelo Assistente de IA para conversar com você e assinar recibos.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Qual é o seu nome?</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Ex: Mariana Silveira"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Qual o nome do seu negócio?</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Bella Modas & Estilo"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Qual é o segmento de atuação?</label>
                <select
                  value={formData.segment}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Moda Feminina & Acessórios">Moda, Roupas & Acessórios</option>
                  <option value="Alimentação & Gastronomia">Alimentação, Confeitaria & Restaurante</option>
                  <option value="Beleza & Estética">Beleza, Barbearia & Salão</option>
                  <option value="Serviços Profissionais">Serviços Profissionais & Consultoria</option>
                  <option value="Construção & Reformas">Construção, Marcenaria & Manutenção</option>
                  <option value="Saúde & Bem-estar">Saúde, Terapia & Bem-estar</option>
                  <option value="Comércio Geral & Varejo">Comércio Geral & Bazar</option>
                  <option value="Outro">Outro segmento</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Tipo de Venda e Modelo */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-white">2. Como seu negócio opera?</h2>
              <p className="text-xs text-slate-400">
                Isso ajuda a calibrar os módulos de estoque, agendamento e precificação.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Você vende produtos, serviços ou ambos?</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'products', label: 'Produtos', desc: 'Mercadorias físicas' },
                    { id: 'services', label: 'Serviços', desc: 'Atendimentos / horas' },
                    { id: 'both', label: 'Ambos', desc: 'Produtos e serviços' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, businessType: opt.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.businessType === opt.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-200">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Seu negócio é físico, digital ou ambos?</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'physical', label: 'Loja Física', desc: 'Ponto comercial presencial' },
                    { id: 'digital', label: '100% Digital', desc: 'WhatsApp, redes e site' },
                    { id: 'both', label: 'Híbrido (Ambos)', desc: 'Loja e vendas online' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, businessModel: opt.id as any })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.businessModel === opt.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-200">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cidade onde atua</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ex: São Paulo"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estado (UF)</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    placeholder="Ex: SP"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Tempo e Equipe */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-white">3. Tempo de mercado e tamanho da equipe</h2>
              <p className="text-xs text-slate-400">
                Entendemos o seu estágio para dar conselhos adequados à sua realidade.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Há quanto tempo o negócio existe?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['Começando agora', 'Menos de 1 ano', '1 a 3 anos', 'Mais de 3 anos'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeInBusiness: t })}
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        formData.timeInBusiness === t
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Quantas pessoas trabalham nele hoje?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['Apenas eu (Euquipe)', '2 pessoas', '3 a 5 pessoas', 'Mais de 5 pessoas'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, teamSize: s })}
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        formData.teamSize === s
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Objetivo e Maior Dificuldade */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-white">4. Qual é o seu foco agora?</h2>
              <p className="text-xs text-slate-400">
                A IA usará isso para montar seu Plano de Evolução de 7, 30 e 90 dias.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Qual seu principal objetivo atualmente?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Aumentar o faturamento mensal',
                    'Atrair novos clientes na minha região',
                    'Fidelizar clientes e fazer eles comprarem de novo',
                    'Organizar as contas e diminuir o fiado'
                  ].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, mainGoal: g })}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        formData.mainGoal === g
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Qual é a sua maior dificuldade no dia a dia?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Falta de tempo para cuidar de tudo',
                    'Cobrar clientes fiados sem ficar chato',
                    'Criar conteúdo e artes para redes sociais',
                    'Saber se estou tendo lucro real nos produtos'
                  ].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData({ ...formData, biggestDifficulty: d })}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        formData.biggestDifficulty === d
                          ? 'bg-violet-600/20 border-violet-500 text-white font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Canais de Divulgação e Vendas */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-white">5. Onde seus clientes encontram você?</h2>
              <p className="text-xs text-slate-400">
                Selecione todos os canais que você utiliza para divulgar ou atender:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Ponto Físico / Balcão', 'Site / Loja Virtual'].map(ch => {
                  const isSelected = formData.channels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleChannel(ch)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{ch}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Faturamento mensal aproximado (Opcional)
                  </label>
                  <span className="text-[10px] text-slate-400">Pode pular ou alterar depois</span>
                </div>
                <select
                  value={formData.monthlyRevenue}
                  onChange={(e) => setFormData({ ...formData, monthlyRevenue: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Até R$ 5.000 / mês">Até R$ 5.000 / mês</option>
                  <option value="R$ 5.000 a R$ 15.000 / mês">R$ 5.000 a R$ 15.000 / mês</option>
                  <option value="R$ 15.000 a R$ 30.000 / mês">R$ 15.000 a R$ 30.000 / mês</option>
                  <option value="Mais de R$ 30.000 / mês">Mais de R$ 30.000 / mês</option>
                  <option value="Prefiro não informar agora">Prefiro não informar agora</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 6: Ferramentas Iniciais */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-lg font-bold text-white">6. Quais ferramentas deseja ver primeiro?</h2>
              <p className="text-xs text-slate-400">
                Selecione as áreas prioritárias para organizarmos seus atalhos no Dashboard:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Controle Financeiro',
                  'Caderneta de Fiado',
                  'Marketing com IA',
                  'Estúdio de Artes',
                  'Controle de Estoque',
                  'CRM e Clientes'
                ].map(tool => {
                  const isSelected = formData.initialTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{tool}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200 flex items-start gap-2.5 mt-4">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Tudo pronto!</strong> O sistema adaptou seu dashboard, o Assistente de IA e as recomendações de acordo com suas respostas. Você poderá editar tudo a qualquer momento nas Configurações.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95"
          >
            <span>{step === totalSteps ? 'Concluir e Abrir Plataforma' : 'Continuar'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
