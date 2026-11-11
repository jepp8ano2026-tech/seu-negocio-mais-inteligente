import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  DollarSign,
  TrendingUp,
  Receipt,
  Plus,
  MessageCircle,
  Megaphone,
  AlertTriangle,
  ArrowRight,
  Package,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const DashboardTab: React.FC = () => {
  const {
    business,
    sales,
    expenses,
    receivables,
    customers,
    products,
    setCurrentTab,
    setQuickActionModal,
    isDemoMode,
    setIsDemoMode
  } = useApp();

  const [showDetailedCharts, setShowDetailedCharts] = useState(false);

  // Core calculations
  const totalSalesMonth = useMemo(() => sales.reduce((acc, s) => acc + s.total, 0), [sales]);
  const totalExpensesMonth = useMemo(() => expenses.reduce((acc, e) => acc + e.amount, 0), [expenses]);
  const estimatedProfit = totalSalesMonth - totalExpensesMonth;

  const totalReceivables = useMemo(() => {
    return receivables
      .filter(r => r.status !== 'quitado')
      .reduce((acc, r) => acc + r.remainingAmount, 0);
  }, [receivables]);

  const overdueReceivables = useMemo(() => {
    return receivables.filter(r => r.status === 'vencido');
  }, [receivables]);

  // Greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>
              <strong>Modo Demonstração:</strong> Você está vendo dados de exemplo de uma loja de roupas em SP.
            </span>
          </div>
          <button
            onClick={() => setIsDemoMode(false)}
            className="text-amber-300 hover:underline font-bold text-xs"
          >
            Usar Meus Dados Reais
          </button>
        </div>
      )}

      {/* Top Clean Greeting Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            {greeting}, {business.ownerName || 'Empreendedor'}!
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aqui está o que mais importa para <strong>{business.name}</strong> hoje.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('assistant')}
          className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 self-start md:self-center transition-all"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Falar com Meu Assistente</span>
        </button>
      </div>

      {/* 3 BIG FAST ACTION BUTTONS (Super easy for anyone to use!) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Action 1: Nova Venda */}
        <button
          onClick={() => setQuickActionModal('sale')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/70 hover:shadow-lg hover:shadow-emerald-600/10 text-left transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
            + Registrar Venda
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Lançar venda rápida com Pix, cartão ou dinheiro.
          </div>
        </button>

        {/* Action 2: Caderneta de Fiado */}
        <button
          onClick={() => setCurrentTab('fiado')}
          className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 hover:border-amber-500/70 hover:shadow-lg hover:shadow-amber-600/10 text-left transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Receipt className="w-6 h-6" />
          </div>
          <div className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
            Caderneta de Fiados
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {overdueReceivables.length > 0 ? (
              <span className="text-rose-400 font-semibold">{overdueReceivables.length} cobrança(s) pendente(s)</span>
            ) : (
              <span>Ver clientes a receber e cobrar com Pix</span>
            )}
          </div>
        </button>

        {/* Action 3: Divulgar no WhatsApp / Redes */}
        <button
          onClick={() => setCurrentTab('marketing')}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/70 hover:shadow-lg hover:shadow-indigo-600/10 text-left transition-all group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Megaphone className="w-6 h-6" />
          </div>
          <div className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
            Divulgar com IA
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Criar textos prontos para WhatsApp e Instagram.
          </div>
        </button>
      </div>

      {/* 3 CLEAN ESSENTIAL KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Vendas */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs text-slate-400 font-medium">Vendas Este Mês</div>
          <div className="text-2xl font-black text-white mt-1">
            {formatCurrency(totalSalesMonth)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            {sales.length} vendas registradas
          </div>
        </div>

        {/* Fiados a Receber */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs text-slate-400 font-medium">Fiados & A Receber</div>
          <div className="text-2xl font-black text-amber-300 font-mono mt-1">
            {formatCurrency(totalReceivables)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{receivables.filter(r => r.status !== 'quitado').length} clientes pendentes</span>
            {overdueReceivables.length > 0 && (
              <span className="text-rose-400 font-bold">{overdueReceivables.length} vencidos</span>
            )}
          </div>
        </div>

        {/* Lucro Estimado */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs text-slate-400 font-medium">Saldo / Lucro Estimado*</div>
          <div className={`text-2xl font-black mt-1 ${estimatedProfit >= 0 ? 'text-indigo-200' : 'text-rose-400'}`}>
            {formatCurrency(estimatedProfit)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            *Cálculo gerencial (Receitas - Despesas)
          </div>
        </div>
      </div>

      {/* "O QUE FAZER HOJE?" - Practical, focused single recommendation card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/40 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Recomendação da IA para Hoje
          </h2>
        </div>

        {overdueReceivables.length > 0 ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-rose-500/30">
            <div>
              <div className="font-bold text-xs text-white">
                Recupere {formatCurrency(overdueReceivables[0].remainingAmount)} com {overdueReceivables[0].customerName}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                O pagamento de {overdueReceivables[0].description} está vencido. Use a cobrança educada da IA para mandar no WhatsApp com chave Pix.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('fiado')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shrink-0 shadow-md shadow-indigo-600/30"
            >
              Cobrar com IA →
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
            <div>
              <div className="font-bold text-xs text-white">
                Finanças e atendimentos em dia!
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Que tal criar uma campanha no WhatsApp ou Instagram para aquecer suas vendas esta semana?
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('marketing')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shrink-0 shadow-md shadow-indigo-600/30"
            >
              Criar Divulgação →
            </button>
          </div>
        )}
      </div>

      {/* Expandable Section for Detailed Charts & Full Audit (Keeps the main view super clean!) */}
      <div className="text-center pt-2">
        <button
          onClick={() => setShowDetailedCharts(!showDetailedCharts)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
        >
          <span>{showDetailedCharts ? 'Ocultar Gráficos e Detalhes' : 'Ver Gráficos e Comparativos Avançados'}</span>
          {showDetailedCharts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {showDetailedCharts && (
        <div className="space-y-6 pt-2 animate-in fade-in duration-300">
          {/* Financial Bar */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Comparativo: Receitas vs. Despesas</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Entradas (Vendas)</span>
                  <span className="text-emerald-400 font-mono font-bold">{formatCurrency(totalSalesMonth)}</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(15, (totalSalesMonth / (totalSalesMonth + totalExpensesMonth || 1)) * 100))}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Saídas (Despesas)</span>
                  <span className="text-rose-400 font-mono font-bold">{formatCurrency(totalExpensesMonth)}</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(15, (totalExpensesMonth / (totalSalesMonth + totalExpensesMonth || 1)) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
