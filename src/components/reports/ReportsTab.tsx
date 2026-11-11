import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Sparkles,
  Download,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  Receipt,
  Package,
  Users,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ReportsTab: React.FC = () => {
  const { business, sales, expenses, customers, products, receivables } = useApp();

  const [reportType, setReportType] = useState<'financeiro' | 'vendas' | 'estoque' | 'clientes'>('financeiro');
  const [executiveSummary, setExecutiveSummary] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const totalSales = sales.reduce((a, s) => a + s.total, 0);
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const estimatedProfit = totalSales - totalExpenses;

  const handleGenerateExecutiveSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summaryData: {
            totalSales,
            totalExpenses,
            estimatedProfit,
            salesCount: sales.length,
            customersCount: customers.length,
            productsCount: products.length,
            lowStockCount: products.filter(p => p.stock <= p.minStock).length,
            pendingFiadosTotal: receivables.reduce((a, r) => a + r.remainingAmount, 0)
          },
          businessContext: {
            name: business.name,
            segment: business.segment,
            city: business.city
          }
        })
      });

      const data = await res.json();
      setExecutiveSummary(data.report || 'Relatório executivo gerado com sucesso.');
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar relatório com IA.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const exportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'vendas') {
      csvContent += 'Numero,Cliente,Total,FormaPagamento,Data\n';
      sales.forEach(s => {
        csvContent += `"${s.saleNumber}","${s.customerName}","${s.total}","${s.paymentMethod}","${s.createdAt}"\n`;
      });
    } else if (reportType === 'estoque') {
      csvContent += 'Codigo,Nome,Categoria,Custo,Preco,Estoque,EstoqueMinimo\n';
      products.forEach(p => {
        csvContent += `"${p.code}","${p.name}","${p.category}","${p.cost}","${p.price}","${p.stock}","${p.minStock}"\n`;
      });
    } else if (reportType === 'clientes') {
      csvContent += 'Nome,Telefone,Email,TotalComprado,PontosFidelidade,UltimaCompra\n';
      customers.forEach(c => {
        csvContent += `"${c.name}","${c.phone}","${c.email}","${c.totalPurchases}","${c.loyaltyPoints}","${c.lastPurchaseDate || ''}"\n`;
      });
    } else {
      csvContent += 'Tipo,Descricao,Valor,Vencimento,Status\n';
      expenses.forEach(e => {
        csvContent += `"Despesa","${e.description}","${e.amount}","${e.dueDate}","${e.isPaid ? 'Pago' : 'Pendente'}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio-${reportType}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Relatórios & Auditoria</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Relatórios Inteligentes do Negócio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Analise dados consolidados, gere resumos executivos com IA e exporte para CSV ou impressão.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleGenerateExecutiveSummary}
            disabled={isGeneratingAi}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingAi ? 'Gerando com IA...' : 'Resumo Executivo IA'}</span>
          </button>
          <button
            onClick={exportCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* AI Executive Summary Card */}
      {executiveSummary && (
        <div className="p-6 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Resumo Executivo Gerado por Inteligência Artificial</span>
            </div>
            <span className="text-[10px] text-slate-400">Baseado nos dados reais do sistema</span>
          </div>
          <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
            {executiveSummary}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold">
        {[
          { id: 'financeiro', label: 'Relatório Financeiro', icon: TrendingUp },
          { id: 'vendas', label: 'Relatório de Vendas', icon: Receipt },
          { id: 'estoque', label: 'Relatório de Estoque', icon: Package },
          { id: 'clientes', label: 'Relatório de Clientes', icon: Users }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setReportType(t.id as any)}
              className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
                reportType === t.id
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

      {/* Table Data Preview */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        {reportType === 'financeiro' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Receitas</span>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">{formatCurrency(totalSales)}</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Despesas</span>
                <div className="text-xl font-black text-rose-300 font-mono mt-1">{formatCurrency(totalExpenses)}</div>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Resultado Estimado</span>
                <div className="text-xl font-black text-indigo-300 font-mono mt-1">{formatCurrency(estimatedProfit)}</div>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              {expenses.length} lançamentos de despesas registrados no período.
            </div>
          </div>
        )}

        {reportType === 'vendas' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Pedido</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Itens</th>
                  <th className="py-2.5 px-3">Forma</th>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sales.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono text-indigo-400">{s.saleNumber}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{s.customerName}</td>
                    <td className="py-2.5 px-3 text-slate-400">{s.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}</td>
                    <td className="py-2.5 px-3 text-slate-300 capitalize">{s.paymentMethod.replace('_', ' ')}</td>
                    <td className="py-2.5 px-3 text-slate-400">{formatDate(s.createdAt)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">{formatCurrency(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'estoque' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Produto</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3 text-right">Custo</th>
                  <th className="py-2.5 px-3 text-right">Preço</th>
                  <th className="py-2.5 px-3 text-center">Estoque</th>
                  <th className="py-2.5 px-3">Mínimo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono text-indigo-400">{p.code}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{p.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{p.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">{formatCurrency(p.cost)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">{formatCurrency(p.price)}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-200">{p.stock}</td>
                    <td className="py-2.5 px-3 text-slate-400">{p.minStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'clientes' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Nome</th>
                  <th className="py-2.5 px-3">Telefone</th>
                  <th className="py-2.5 px-3">E-mail</th>
                  <th className="py-2.5 px-3 text-right">Total Comprado</th>
                  <th className="py-2.5 px-3 text-center">Pontos</th>
                  <th className="py-2.5 px-3">Última Compra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{c.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{c.phone}</td>
                    <td className="py-2.5 px-3 text-slate-400">{c.email}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">{formatCurrency(c.totalPurchases)}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-indigo-300">{c.loyaltyPoints}</td>
                    <td className="py-2.5 px-3 text-slate-400">{formatDate(c.lastPurchaseDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
