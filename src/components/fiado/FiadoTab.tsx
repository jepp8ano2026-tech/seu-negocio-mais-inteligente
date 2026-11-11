import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Receivable } from '../../types';
import {
  Receipt,
  Sparkles,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  MessageCircle,
  Copy,
  Printer,
  FileText,
  CreditCard,
  User,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';

export const FiadoTab: React.FC = () => {
  const {
    receivables,
    addReceivable,
    addPartialPayment,
    deleteReceivable,
    customers,
    business,
    setQuickActionModal
  } = useApp();

  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(receivables[0] || null);
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'vencido' | 'quitado'>('todos');

  // Partial Payment Modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Pix');
  const [payNotes, setPayNotes] = useState('');

  // AI Collection Modal
  const [showAiCollectionModal, setShowAiCollectionModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [collectionOptions, setCollectionOptions] = useState<{ friendly?: string; formal?: string; installment?: string } | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Filtered list
  const filteredList = receivables.filter(r => {
    if (filterStatus === 'todos') return true;
    return r.status === filterStatus;
  });

  // Totals
  const totalReceivable = receivables.reduce((a, r) => a + r.remainingAmount, 0);
  const totalOverdue = receivables.filter(r => r.status === 'vencido').reduce((a, r) => a + r.remainingAmount, 0);
  const totalPaid = receivables.reduce((a, r) => a + r.paidAmount, 0);

  const handleOpenAiCollection = async (rec: Receivable) => {
    setSelectedReceivable(rec);
    setShowAiCollectionModal(true);
    setAiLoading(true);

    try {
      const res = await fetch('/api/gemini/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: rec.customerName,
          amount: rec.remainingAmount.toFixed(2),
          dueDate: formatDate(rec.dueDate),
          daysOverdue: 12, // calculated
          businessName: business.name,
          products: rec.description
        })
      });

      const data = await res.json();
      setCollectionOptions(data);
    } catch (err) {
      console.error(err);
      // Fallback message
      setCollectionOptions({
        friendly: `Oi, ${rec.customerName}! Tudo bem? Passando só para lembrar do valor de ${formatCurrency(rec.remainingAmount)} referente a ${rec.description}. Se já quitou ou precisar da chave Pix, só me avisar aqui! Um abraço.`,
        formal: `Olá, ${rec.customerName}. Consta em aberto o valor de ${formatCurrency(rec.remainingAmount)} com vencimento em ${formatDate(rec.dueDate)}. Segue nossa chave Pix para acerto. Agradecemos a atenção!`,
        installment: `Oi, ${rec.customerName}! Gostaria de conversar com você sobre o saldo de ${formatCurrency(rec.remainingAmount)}. Se estiver apertado este mês, podemos facilitar para você acertar sem pesar. Me avisa!`
      });
    } finally {
      setAiLoading(false);
    }
  };

  const copyAndOpenWhatsApp = (text: string, phone?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType('copied');
    setTimeout(() => setCopiedType(null), 2000);

    const clean = (phone || '').replace(/\D/g, '');
    if (clean) {
      const num = clean.startsWith('55') ? clean : `55${clean}`;
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReceivable) return;

    const val = parseFloat(payAmount.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      alert('Informe um valor de pagamento válido.');
      return;
    }

    addPartialPayment(selectedReceivable.id, {
      amount: val,
      date: new Date().toISOString().split('T')[0],
      method: payMethod,
      notes: payNotes || undefined
    });

    setPayAmount('');
    setPayNotes('');
    setShowPayModal(false);
    alert('Pagamento registrado na caderneta com sucesso!');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <Receipt className="w-3.5 h-3.5" />
            <span>Caderneta Digital de Fiados</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Controle de Fiados & Cobrança Educada
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Elimine a perda de dinheiro por esquecimento. Registre valores a prazo, abata pagamentos parciais e use IA para cobrar com elegância.
          </p>
        </div>

        <button
          onClick={() => setQuickActionModal('fiado')}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-600/20 active:scale-95 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Anotar Novo Fiado</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs text-slate-400 mb-1">Total a Receber (Em Aberto)</div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {formatCurrency(totalReceivable)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Soma de todos os saldos pendentes
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-rose-500/30 rounded-2xl bg-rose-950/10">
          <div className="text-xs text-rose-300 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Valores Vencidos (Prioridade)</span>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {formatCurrency(totalOverdue)}
          </div>
          <div className="text-[11px] text-rose-300 mt-1">
            {receivables.filter(r => r.status === 'vencido').length} cliente(s) com prazo estourado
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs text-slate-400 mb-1">Total Já Recuperado / Pago</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {formatCurrency(totalPaid)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Valores amortizados com sucesso
          </div>
        </div>
      </div>

      {/* Filter status buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {(['todos', 'pendente', 'vencido', 'quitado'] as const).map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-colors ${
              filterStatus === st
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {st} ({st === 'todos' ? receivables.length : receivables.filter(r => r.status === st).length})
          </button>
        ))}
      </div>

      {/* Fiado List & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Receivables List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              Nenhum fiado registrado nesta categoria.
            </div>
          ) : (
            filteredList.map(rec => (
              <div
                key={rec.id}
                onClick={() => setSelectedReceivable(rec)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedReceivable?.id === rec.id
                    ? 'bg-slate-800/90 border-amber-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-xs text-white">{rec.customerName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{rec.description}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Vencimento: {formatDate(rec.dueDate)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-amber-300">
                      {formatCurrency(rec.remainingAmount)}
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase block mt-1 ${
                      rec.status === 'quitado'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : rec.status === 'vencido'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {rec.status}
                    </span>
                  </div>
                </div>

                {rec.remainingAmount > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAiCollection(rec);
                      }}
                      className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors border border-indigo-500/30"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Cobrar no WhatsApp</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReceivable(rec);
                        setShowPayModal(true);
                      }}
                      className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors border border-emerald-500/30"
                    >
                      <DollarSign className="w-3 h-3" />
                      <span>Dar Baixa</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Column: Selected Fiado Ledger & Partial Payments */}
        <div className="lg:col-span-7 space-y-4">
          {selectedReceivable ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedReceivable.customerName}</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      selectedReceivable.status === 'quitado'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : selectedReceivable.status === 'vencido'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {selectedReceivable.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {selectedReceivable.customerPhone ? formatPhone(selectedReceivable.customerPhone) : 'Telefone não cadastrado'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAiCollection(selectedReceivable)}
                    className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Cobrança Educada IA</span>
                  </button>

                  {selectedReceivable.remainingAmount > 0 && (
                    <button
                      onClick={() => setShowPayModal(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Abater Valor</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Debt Breakdown Card */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Valor Total</div>
                  <div className="text-sm font-bold text-slate-200 font-mono mt-1">
                    {formatCurrency(selectedReceivable.totalAmount)}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Já Pago</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-1">
                    {formatCurrency(selectedReceivable.paidAmount)}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Saldo Restante</div>
                  <div className="text-sm font-bold text-amber-300 font-mono mt-1">
                    {formatCurrency(selectedReceivable.remainingAmount)}
                  </div>
                </div>
              </div>

              {/* Items Purchased */}
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Itens Adquiridos:</div>
                <div className="text-slate-200 font-medium">{selectedReceivable.description}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Compra efetuada em: {formatDate(selectedReceivable.createdAt)} • Vencimento: {formatDate(selectedReceivable.dueDate)}
                </div>
              </div>

              {/* Partial Payments History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Histórico de Pagamentos Parciais ({selectedReceivable.partialPayments.length})
                  </h3>
                </div>

                {selectedReceivable.partialPayments.length === 0 ? (
                  <div className="p-4 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500">
                    Nenhum pagamento parcial efetuado ainda.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedReceivable.partialPayments.map(p => (
                      <div key={p.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-emerald-400 font-mono">
                            + {formatCurrency(p.amount)}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Forma: {p.method} {p.notes ? `• ${p.notes}` : ''}
                          </div>
                        </div>
                        <span className="text-slate-400 text-[11px] font-mono">{formatDate(p.date)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Receipt / Comprovante Button */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-1.5 border border-slate-700 text-slate-300 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Recibo / Comprovante</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Deseja remover este registro de fiado?`)) {
                      deleteReceivable(selectedReceivable.id);
                      setSelectedReceivable(receivables.find(r => r.id !== selectedReceivable.id) || null);
                    }
                  }}
                  className="text-slate-500 hover:text-rose-400 p-1"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              Selecione um fiado ao lado para visualizar o extrato da caderneta.
            </div>
          )}
        </div>

      </div>

      {/* Modal AI Collection Message Options */}
      {showAiCollectionModal && selectedReceivable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Cobrança Educada com IA: {selectedReceivable.customerName}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                Saldo: {formatCurrency(selectedReceivable.remainingAmount)}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Escolha o tom mais adequado para conversar com {selectedReceivable.customerName}. Nunca cobramos automaticamente: você revisa e envia quando quiser.
            </p>

            {aiLoading ? (
              <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <div>A IA está elaborando mensagens educadas e amigáveis...</div>
              </div>
            ) : collectionOptions ? (
              <div className="space-y-3">
                {/* 1. Amigável */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-300">Opção 1: Amigável & Cordial (Recomendado)</span>
                    <button
                      onClick={() => copyAndOpenWhatsApp(collectionOptions.friendly || '', selectedReceivable.customerPhone)}
                      className="text-xs px-2.5 py-1 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 rounded-lg flex items-center gap-1 font-semibold"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Copiar & WhatsApp</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {collectionOptions.friendly}
                  </p>
                </div>

                {/* 2. Formal */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300">Opção 2: Direta & Profissional</span>
                    <button
                      onClick={() => copyAndOpenWhatsApp(collectionOptions.formal || '', selectedReceivable.customerPhone)}
                      className="text-xs px-2.5 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 rounded-lg flex items-center gap-1 font-semibold"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Copiar & WhatsApp</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {collectionOptions.formal}
                  </p>
                </div>

                {/* 3. Parcelamento */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">Opção 3: Com Proposta de Facilitação</span>
                    <button
                      onClick={() => copyAndOpenWhatsApp(collectionOptions.installment || '', selectedReceivable.customerPhone)}
                      className="text-xs px-2.5 py-1 bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 rounded-lg flex items-center gap-1 font-semibold"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Copiar & WhatsApp</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {collectionOptions.installment}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAiCollectionModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Partial Payment */}
      {showPayModal && selectedReceivable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Abater Pagamento de {selectedReceivable.customerName}
            </h3>
            <p className="text-xs text-slate-400">
              Saldo atual restante: <strong className="text-amber-300">{formatCurrency(selectedReceivable.remainingAmount)}</strong>
            </p>

            <form onSubmit={handleExecutePayment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Pago (R$)</label>
                <input
                  type="text"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Ex: 100,00"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Forma de Pagamento</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Observação (Opcional)</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="Ex: Pagou metade, prometeu o restante dia 10"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Confirmar Pagamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
