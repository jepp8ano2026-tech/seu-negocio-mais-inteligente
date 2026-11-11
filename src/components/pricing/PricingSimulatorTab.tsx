import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart,
  Lightbulb
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const PricingSimulatorTab: React.FC = () => {
  const { business } = useApp();

  const [productName, setProductName] = useState('Vestido Midi Floral Primavera');
  const [cost, setCost] = useState('58.00');
  const [packaging, setPackaging] = useState('5.00');
  const [cardFeePercent, setCardFeePercent] = useState('3.5');
  const [taxPercent, setTaxPercent] = useState('4.0');
  const [overheadPercent, setOverheadPercent] = useState('12.0');
  const [desiredMarginPercent, setDesiredMarginPercent] = useState('35.0');

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Client-side instant calculation
  const numCost = parseFloat(cost.replace(',', '.')) || 0;
  const numPackaging = parseFloat(packaging.replace(',', '.')) || 0;
  const numCardFee = parseFloat(cardFeePercent.replace(',', '.')) || 0;
  const numTax = parseFloat(taxPercent.replace(',', '.')) || 0;
  const numOverhead = parseFloat(overheadPercent.replace(',', '.')) || 0;
  const numMargin = parseFloat(desiredMarginPercent.replace(',', '.')) || 0;

  const totalDirectCost = numCost + numPackaging;
  const totalDeductionsPercent = numCardFee + numTax + numOverhead + numMargin;
  const divisor = 1 - (totalDeductionsPercent / 100);

  const suggestedPrice = divisor > 0.05 ? totalDirectCost / divisor : totalDirectCost * 2;
  const cardFeeAmount = suggestedPrice * (numCardFee / 100);
  const taxAmount = suggestedPrice * (numTax / 100);
  const overheadAmount = suggestedPrice * (numOverhead / 100);
  const netProfitAmount = suggestedPrice * (numMargin / 100);

  const handleSimulateAi = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cost: numCost,
          packaging: numPackaging,
          cardFee: numCardFee,
          tax: numTax,
          overhead: numOverhead,
          margin: numMargin,
          productDescription: productName,
          segment: business.segment
        })
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao calcular com IA. Usando cálculo matemático interno.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>Consultor Financeiro & Simulador de Precificação</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Formação de Preço Inteligente
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Descubra o preço de venda ideal considerando todos os custos diretos, taxas de cartão, impostos e sua margem de lucro real.
          </p>
        </div>

        <button
          onClick={handleSimulateAi}
          disabled={isAiLoading}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-amber-600/20 active:scale-95 transition-all self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAiLoading ? 'Analisando Mercado com IA...' : 'Auditar Preço com IA'}</span>
        </button>
      </div>

      {/* Calculator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white">1. Custos Diretos & Insumos</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Produto ou Serviço</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: Vestido Midi Floral ou Corte Masculino"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Custo do Produto / Peça (R$)</label>
                <input
                  type="text"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="58,00"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Embalagem / Insumo Direto (R$)</label>
                <input
                  type="text"
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                  placeholder="5,00"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <h2 className="text-sm font-bold text-white pt-2 border-t border-slate-800">
              2. Deduções, Taxas e Margem Desejada
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Taxa Média da Maquininha (%)</label>
                <input
                  type="text"
                  value={cardFeePercent}
                  onChange={(e) => setCardFeePercent(e.target.value)}
                  placeholder="3.5"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Impostos / Simples Nacional (%)</label>
                <input
                  type="text"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                  placeholder="4.0"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Rateio Custos Fixos (%)</label>
                <input
                  type="text"
                  value={overheadPercent}
                  onChange={(e) => setOverheadPercent(e.target.value)}
                  placeholder="12.0"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Margem de Lucro Líquida (%)</label>
                <input
                  type="text"
                  value={desiredMarginPercent}
                  onChange={(e) => setDesiredMarginPercent(e.target.value)}
                  placeholder="35.0"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              ℹ️ O cálculo utiliza o método de <strong>Markup Divisor</strong>, que garante que a margem desejada seja exatamente o percentual sobre o preço final de venda.
            </div>
          </div>
        </div>

        {/* Live Calculation Output & Memory */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">

            {/* Price Badge */}
            <div className="p-6 bg-gradient-to-br from-indigo-950/60 via-slate-950 to-slate-950 border border-indigo-500/40 rounded-2xl text-center space-y-1">
              <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                Preço de Venda Sugerido
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {formatCurrency(suggestedPrice)}
              </div>
              <div className="text-xs text-emerald-400 font-semibold pt-1">
                Lucro Líquido no Bolso: {formatCurrency(netProfitAmount)} ({numMargin}% de margem)
              </div>
            </div>

            {/* Memory of Calculation Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Memória de Cálculo Detalhada (Por Unidade)
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-slate-300">Custo Base do Produto:</span>
                  <span className="font-mono text-slate-200 font-semibold">{formatCurrency(numCost)}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-slate-300">Embalagem e Insumos:</span>
                  <span className="font-mono text-slate-200 font-semibold">{formatCurrency(numPackaging)}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-slate-300">Taxa da Maquininha ({numCardFee}%):</span>
                  <span className="font-mono text-rose-400 font-semibold">- {formatCurrency(cardFeeAmount)}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-slate-300">Impostos Estimados ({numTax}%):</span>
                  <span className="font-mono text-rose-400 font-semibold">- {formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-slate-300">Custos Fixos Rateados ({numOverhead}%):</span>
                  <span className="font-mono text-slate-400 font-semibold">- {formatCurrency(overheadAmount)}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-emerald-950/20 rounded-xl border border-emerald-500/30">
                  <span className="text-emerald-300 font-bold">Sobram Líquidos para o Negócio ({numMargin}%):</span>
                  <span className="font-mono text-emerald-400 font-bold">{formatCurrency(netProfitAmount)}</span>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="text-[10px] text-slate-500 text-center leading-relaxed">
              *Aviso importante: Esta ferramenta realiza simulações gerenciais de apoio à tomada de decisão e não constitui aconselhamento contábil, tributário ou fiscal.
            </div>

          </div>

          {/* AI Strategic Recommendations if audited */}
          {aiResult && (
            <div className="p-6 bg-slate-900 border border-amber-500/30 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                <Lightbulb className="w-4 h-4" />
                <span>Recomendações Estratégicas do Consultor IA</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {(aiResult.recommendations || []).map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
