import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Calendar,
  Sparkles,
  Receipt,
  X
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const FinancialTab: React.FC = () => {
  const {
    sales,
    expenses,
    addExpense,
    deleteExpense,
    toggleExpensePaid,
    setQuickActionModal
  } = useApp();

  // Filtro simples de visualização
  const [filterType, setFilterType] = useState<'todos' | 'entradas' | 'saidas' | 'pendentes'>('todos');

  // Modal simples para registrar novo gasto
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPaidNow, setIsPaidNow] = useState(true);

  // Cálculos diretos e simples
  const totalEntradas = useMemo(() => {
    return sales.reduce((acc, s) => acc + s.total, 0);
  }, [sales]);

  const totalSaidas = useMemo(() => {
    return expenses.reduce((acc, e) => acc + e.amount, 0);
  }, [expenses]);

  const saldoNoBolso = useMemo(() => {
    return totalEntradas - totalSaidas;
  }, [totalEntradas, totalSaidas]);

  const contasPendentes = useMemo(() => {
    return expenses.filter(e => !e.isPaid);
  }, [expenses]);

  const totalPendente = useMemo(() => {
    return contasPendentes.reduce((acc, e) => acc + e.amount, 0);
  }, [contasPendentes]);

  // Lista unificada de movimentações (Extrato simples)
  const movimentacoes = useMemo(() => {
    const list: Array<{
      id: string;
      tipo: 'entrada' | 'saida';
      titulo: string;
      detalhe: string;
      data: string;
      valor: number;
      isPaid?: boolean;
      originalExpenseId?: string;
    }> = [];

    // Adiciona vendas como entradas
    sales.forEach(s => {
      list.push({
        id: `sale-${s.id}`,
        tipo: 'entrada',
        titulo: s.customerName ? `Venda • ${s.customerName}` : `Venda ${s.saleNumber}`,
        detalhe: s.paymentMethod ? s.paymentMethod.replace('_', ' ').toUpperCase() : 'RECEBIDO',
        data: s.createdAt,
        valor: s.total,
        isPaid: true
      });
    });

    // Adiciona despesas como saídas
    expenses.forEach(e => {
      list.push({
        id: `exp-${e.id}`,
        tipo: 'saida',
        titulo: e.description,
        detalhe: e.category.toUpperCase(),
        data: e.dueDate || e.createdAt,
        valor: e.amount,
        isPaid: e.isPaid,
        originalExpenseId: e.id
      });
    });

    // Ordena do mais recente para o mais antigo
    list.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    // Aplica o filtro selecionado
    if (filterType === 'entradas') {
      return list.filter(m => m.tipo === 'entrada');
    }
    if (filterType === 'saidas') {
      return list.filter(m => m.tipo === 'saida');
    }
    if (filterType === 'pendentes') {
      return list.filter(m => m.tipo === 'saida' && !m.isPaid);
    }
    return list;
  }, [sales, expenses, filterType]);

  const handleSalvarGasto = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNum = parseFloat(amount.replace(',', '.'));
    if (!desc.trim() || isNaN(valorNum) || valorNum <= 0) {
      alert('Por favor, informe uma descrição e um valor válido.');
      return;
    }

    addExpense({
      description: desc.trim(),
      category: 'outros',
      amount: valorNum,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      isPaid: isPaidNow,
      recurring: false
    });

    setDesc('');
    setAmount('');
    setIsPaidNow(true);
    setShowAddExpense(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* 1. TOPO SIMPLES COM BOTÕES DE AÇÃO RÁPIDA */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Controle Fácil do Caixa</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Financeiro do Seu Negócio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sem complicação: acompanhe o dinheiro que entra, o que sai e o que fica com você.
          </p>
        </div>

        {/* Botões grandes e fáceis */}
        <div className="flex items-center gap-2.5 sm:self-center">
          <button
            onClick={() => setQuickActionModal('sale')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar Venda</span>
          </button>

          <button
            onClick={() => setShowAddExpense(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Anotar Gasto</span>
          </button>
        </div>
      </div>

      {/* 2. OS 3 NÚMEROS ESSENCIAIS (ENTRADA, SAÍDA E SALDO NO BOLSO) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Entrou (Vendas) */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">🟢 Total que Entrou</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalEntradas)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {sales.length} {sales.length === 1 ? 'venda registrada' : 'vendas registradas'}
          </div>
        </div>

        {/* Saiu (Gastos) */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold">🔴 Total que Saiu</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {formatCurrency(totalSaidas)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {contasPendentes.length > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {contasPendentes.length} conta(s) a pagar ({formatCurrency(totalPendente)})
              </span>
            ) : (
              <span>Todas as contas estão em dia!</span>
            )}
          </div>
        </div>

        {/* Sobrou no Caixa (Saldo Livre) */}
        <div className={`p-5 rounded-2xl border shadow-sm ${
          saldoNoBolso >= 0
            ? 'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 border-emerald-200 dark:border-emerald-500/30'
            : 'bg-gradient-to-br from-rose-50 to-white dark:from-rose-950/20 dark:to-slate-900 border-rose-200 dark:border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-2">
            <span className="font-bold">💰 Sobrou no Caixa</span>
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className={`text-2xl font-black ${
            saldoNoBolso >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {formatCurrency(saldoNoBolso)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {saldoNoBolso >= 0 ? 'Seu saldo livre acumulado' : 'Atenção: saídas maiores que entradas'}
          </div>
        </div>

      </div>

      {/* 3. DICA RÁPIDA E AMIGÁVEL */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-slate-900 dark:text-white">Dica Simples do Seu Negócio: </span>
          <span className="text-slate-600 dark:text-slate-300">
            {contasPendentes.length > 0 ? (
              <>Você tem <strong>{contasPendentes.length} conta(s) pendente(s)</strong> somando <strong>{formatCurrency(totalPendente)}</strong>. Ao pagar uma conta, basta clicar no botão amarelo na lista abaixo para marcar como paga!</>
            ) : (
              <>Parabéns! Todas as suas despesas lançadas já estão pagas. Registre cada venda e cada gasto do dia a dia para ter o controle do seu lucro sem estresse.</>
            )}
          </span>
        </div>
      </div>

      {/* 4. EXTRATO SIMPLES DAS MOVIMENTAÇÕES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Barra de Filtros Diretos */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Extrato de Movimentações</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Todas as entradas e saídas em ordem cronológica.
            </p>
          </div>

          {/* Filtros em botões fáceis */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setFilterType('todos')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filterType === 'todos'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tudo ({movimentacoes.length})
            </button>
            <button
              onClick={() => setFilterType('entradas')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filterType === 'entradas'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-800'
              }`}
            >
              🟢 Entradas ({sales.length})
            </button>
            <button
              onClick={() => setFilterType('saidas')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                filterType === 'saidas'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-700 dark:text-rose-400 hover:text-rose-800'
              }`}
            >
              🔴 Saídas ({expenses.length})
            </button>
            {contasPendentes.length > 0 && (
              <button
                onClick={() => setFilterType('pendentes')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  filterType === 'pendentes'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-amber-700 dark:text-amber-400 hover:text-amber-800'
                }`}
              >
                ⏳ A Pagar ({contasPendentes.length})
              </button>
            )}
          </div>
        </div>

        {/* Lista das Movimentações */}
        {movimentacoes.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <DollarSign className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nenhuma movimentação encontrada
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Use os botões no topo para registrar sua primeira venda ou anotar um gasto do negócio.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {movimentacoes.map(item => (
              <div
                key={item.id}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {/* Ícone + Descrição */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.tipo === 'entrada'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}>
                    {item.tipo === 'entrada' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.titulo}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.data)}
                      </span>
                      <span>•</span>
                      <span className="text-[11px] uppercase font-semibold text-slate-400">
                        {item.detalhe}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status de Pagamento (para despesas) + Valor + Excluir */}
                <div className="flex items-center gap-3 shrink-0">
                  {item.tipo === 'saida' && item.originalExpenseId && (
                    <button
                      onClick={() => toggleExpensePaid(item.originalExpenseId!)}
                      title="Clique para alternar entre pago e pendente"
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        item.isPaid
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
                          : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                      }`}
                    >
                      {item.isPaid ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Pago</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Pendente</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Valor bem visível */}
                  <div className={`text-base font-black font-mono text-right min-w-[100px] ${
                    item.tipo === 'entrada'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {item.tipo === 'entrada' ? '+' : '-'} {formatCurrency(item.valor)}
                  </div>

                  {/* Botão de excluir se for despesa */}
                  {item.tipo === 'saida' && item.originalExpenseId && (
                    <button
                      onClick={() => {
                        if (confirm(`Deseja apagar "${item.titulo}"?`)) {
                          deleteExpense(item.originalExpenseId!);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Excluir este gasto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. MODAL SIMPLES E DIRETO: ANOTAR GASTO */}
      {showAddExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Anotar Gasto / Conta
                </h3>
              </div>
              <button
                onClick={() => setShowAddExpense(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarGasto} className="space-y-4">
              
              {/* Descrição */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  O que você pagou ou vai pagar?
                </label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ex: Conta de Luz, Fornecedor, Aluguel, Embalagens..."
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Valor e Data */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Qual o valor (R$)?
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Ex: 85,00"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Data
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Status: Já pagou ou é a pagar? */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Situação desta conta:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPaidNow(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      isPaidNow
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Já foi Paga</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaidNow(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      !isPaidNow
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Vence Depois (A Pagar)</span>
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  Salvar Gasto
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
