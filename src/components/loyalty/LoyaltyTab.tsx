import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LoyaltyReward } from '../../types';
import {
  Award,
  Sparkles,
  Gift,
  Plus,
  Trash2,
  CheckCircle2,
  Users,
  Settings,
  Tag,
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const LoyaltyTab: React.FC = () => {
  const { loyaltyProgram, updateLoyaltyProgram, customers, updateCustomer, business } = useApp();

  const [pointsPerReal, setPointsPerReal] = useState<number>(loyaltyProgram.pointsPerReal || 0.1);
  const [minPointsToRedeem, setMinPointsToRedeem] = useState<number>(loyaltyProgram.minPointsToRedeem || 50);

  // New Reward Modal
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardName, setRewardName] = useState('');
  const [rewardPoints, setRewardPoints] = useState('50');
  const [rewardDiscount, setRewardDiscount] = useState('20');
  const [rewardDesc, setRewardDesc] = useState('');

  // Redeem points modal
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedRewardId, setSelectedRewardId] = useState<string>(loyaltyProgram.rewards[0]?.id || '');

  const handleSaveProgramSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateLoyaltyProgram({
      pointsPerReal,
      minPointsToRedeem
    });
    alert('Configurações do programa de fidelidade salvas!');
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardName.trim()) return;

    const newReward: LoyaltyReward = {
      id: `rew-${Date.now()}`,
      name: rewardName,
      pointsRequired: parseInt(rewardPoints) || 50,
      discountValue: parseFloat(rewardDiscount) || 0,
      description: rewardDesc,
      active: true
    };

    updateLoyaltyProgram({
      rewards: [...loyaltyProgram.rewards, newReward]
    });

    setRewardName('');
    setRewardDesc('');
    setShowRewardModal(false);
  };

  const handleDeleteReward = (rewardId: string) => {
    updateLoyaltyProgram({
      rewards: loyaltyProgram.rewards.filter(r => r.id !== rewardId)
    });
  };

  const handleExecuteRedeem = () => {
    const cust = customers.find(c => c.id === selectedCustomerId);
    const rew = loyaltyProgram.rewards.find(r => r.id === selectedRewardId);

    if (!cust || !rew) return;

    if (cust.loyaltyPoints < rew.pointsRequired) {
      alert(`Pontos insuficientes! ${cust.name} tem ${cust.loyaltyPoints} pontos e são necessários ${rew.pointsRequired}.`);
      return;
    }

    const newPoints = cust.loyaltyPoints - rew.pointsRequired;
    updateCustomer(cust.id, { loyaltyPoints: newPoints });

    alert(`Resgate confirmado com sucesso! ${rew.pointsRequired} pontos deduzidos de ${cust.name}. Novo saldo: ${newPoints} pontos.`);
    setShowRedeemModal(false);
  };

  // Top loyal customers
  const topLoyalCustomers = [...customers].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Programa de Fidelidade & Cupons</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Clube de Vantagens da {business.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Recompense seus clientes fiéis com pontos a cada compra, gere cupons de desconto e aumente a recompra.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setShowRedeemModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Resgatar Recompensa</span>
          </button>
          <button
            onClick={() => setShowRewardModal(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Cupom / Brinde</span>
          </button>
        </div>
      </div>

      {/* Program Rule Settings */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          <span>Regras de Acúmulo de Pontos</span>
        </h2>

        <form onSubmit={handleSaveProgramSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Pontos por Real Gasto (R$)</label>
            <select
              value={pointsPerReal}
              onChange={(e) => setPointsPerReal(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value={0.1}>1 Ponto a cada R$ 10,00 gastos</option>
              <option value={0.2}>1 Ponto a cada R$ 5,00 gastos</option>
              <option value={0.5}>1 Ponto a cada R$ 2,00 gastos</option>
              <option value={1}>1 Ponto a cada R$ 1,00 gasto</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Mínimo de Pontos para Resgatar</label>
            <input
              type="number"
              value={minPointsToRedeem}
              onChange={(e) => setMinPointsToRedeem(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold border border-slate-700 transition-colors"
            >
              Atualizar Regras
            </button>
          </div>
        </form>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Catálogo de Recompensas Ativas ({loyaltyProgram.rewards.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loyaltyProgram.rewards.map(reward => (
            <div key={reward.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    {reward.pointsRequired} pontos
                  </span>
                  {reward.discountValue > 0 && (
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {formatCurrency(reward.discountValue)} OFF
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-white">{reward.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {reward.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-medium">Pronto para resgate</span>
                <button
                  onClick={() => handleDeleteReward(reward.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                  title="Excluir Recompensa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loyal Customers Leaderboard */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-400" />
          <span>Ranking de Clientes Mais Fiéis</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Cliente</th>
                <th className="py-2.5 px-3">Saldo de Pontos</th>
                <th className="py-2.5 px-3">Total Comprado</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topLoyalCustomers.map((cust, idx) => (
                <tr key={cust.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                    <span className="text-indigo-400 mr-2 font-mono">#{idx + 1}</span>
                    {cust.name}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-300">
                    {cust.loyaltyPoints} pontos
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400">
                    {formatCurrency(cust.totalPurchases)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      cust.loyaltyPoints >= loyaltyProgram.minPointsToRedeem
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {cust.loyaltyPoints >= loyaltyProgram.minPointsToRedeem ? 'Pode Resgatar' : 'Acumulando'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedCustomerId(cust.id);
                        setShowRedeemModal(true);
                      }}
                      className="text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      Resgatar Prêmio →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Reward */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Criar Nova Recompensa / Cupom</h3>
            <form onSubmit={handleCreateReward} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Recompensa</label>
                <input
                  type="text"
                  value={rewardName}
                  onChange={(e) => setRewardName(e.target.value)}
                  placeholder="Ex: Cupom de R$ 30 OFF ou Brinde Surpresa"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pontos Necessários</label>
                  <input
                    type="number"
                    value={rewardPoints}
                    onChange={(e) => setRewardPoints(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Desconto Estimado (R$)</label>
                  <input
                    type="number"
                    value={rewardDiscount}
                    onChange={(e) => setRewardDiscount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Regras e Descrição</label>
                <textarea
                  rows={2}
                  value={rewardDesc}
                  onChange={(e) => setRewardDesc(e.target.value)}
                  placeholder="Válido em compras acima de R$ 100 na loja ou via WhatsApp."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRewardModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  Criar Recompensa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Redeem */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Resgatar Prêmio de Fidelidade</h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.loyaltyPoints} pontos acumulados)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Recompensa Desejada</label>
                <select
                  value={selectedRewardId}
                  onChange={(e) => setSelectedRewardId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {loyaltyProgram.rewards.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {r.pointsRequired} pontos
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRedeemModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteRedeem}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Confirmar Resgate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
