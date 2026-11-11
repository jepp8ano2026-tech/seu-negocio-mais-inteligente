import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Package,
  Plus,
  AlertTriangle,
  Search,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Trash2,
  Edit2,
  ArrowUpDown,
  Archive
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const InventoryTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, adjustStock, business } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');

  // Product Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Geral');
  const [cost, setCost] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [minStock, setMinStock] = useState('5');
  const [supplier, setSupplier] = useState('');

  // Stock Adjustment Modal
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('Entrada de Mercadoria');
  const [adjustType, setAdjustType] = useState<'in' | 'out'>('in');

  const categories = ['todas', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.supplier && p.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'todas' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalStockValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const totalCostValue = products.reduce((acc, p) => acc + (p.cost * p.stock), 0);

  const openCreateModal = () => {
    setEditingId(null);
    setCode(`PROD-${Math.floor(100 + Math.random() * 900)}`);
    setName('');
    setCategory('Vestuário');
    setCost('');
    setPrice('');
    setStock('10');
    setMinStock('5');
    setSupplier('');
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setCode(p.code);
    setName(p.name);
    setCategory(p.category);
    setCost(p.cost.toString());
    setPrice(p.price.toString());
    setStock(p.stock.toString());
    setMinStock(p.minStock.toString());
    setSupplier(p.supplier || '');
    setShowModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numCost = parseFloat(cost.replace(',', '.')) || 0;
    const numPrice = parseFloat(price.replace(',', '.')) || 0;
    const numStock = parseInt(stock) || 0;
    const numMin = parseInt(minStock) || 0;

    if (editingId) {
      updateProduct(editingId, {
        code,
        name,
        category,
        cost: numCost,
        price: numPrice,
        stock: numStock,
        minStock: numMin,
        supplier: supplier || undefined
      });
    } else {
      addProduct({
        code,
        name,
        category,
        cost: numCost,
        price: numPrice,
        stock: numStock,
        minStock: numMin,
        supplier: supplier || undefined,
        unit: 'un',
        active: true
      });
    }

    setShowModal(false);
  };

  const handleExecuteAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    const qty = parseInt(adjustQty) || 0;
    if (qty <= 0) {
      alert('Informe uma quantidade válida.');
      return;
    }

    const delta = adjustType === 'in' ? qty : -qty;
    adjustStock(adjustingProduct.id, delta, adjustReason);
    setAdjustingProduct(null);
    setAdjustQty('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>Gestão de Produtos & Estoque</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Catálogo & Controle de Estoque
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre itens, monitore níveis mínimos de reposição e atualize estoques automaticamente com cada venda.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs text-slate-400 mb-1">Total de Itens Cadastrados</div>
          <div className="text-2xl font-black text-white">{products.length} produtos</div>
          <div className="text-[11px] text-slate-400 mt-1">Em {categories.length - 1} categorias</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-xs text-slate-400 mb-1">Valor do Estoque a Preço de Venda</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {formatCurrency(totalStockValue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Custo investido: {formatCurrency(totalCostValue)}
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${
          lowStockCount > 0
            ? 'bg-rose-950/20 border-rose-500/40'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="text-xs text-rose-300 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Itens em Nível Crítico</span>
          </div>
          <div className="text-2xl font-black text-rose-300 font-mono">
            {lowStockCount} itens
          </div>
          <div className="text-[11px] text-rose-400 mt-1">
            {lowStockCount > 0 ? 'Abaixo do estoque mínimo' : 'Estoque abastecido'}
          </div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, nome ou fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Código</th>
                <th className="py-2.5 px-3">Produto</th>
                <th className="py-2.5 px-3">Categoria</th>
                <th className="py-2.5 px-3 text-right">Custo</th>
                <th className="py-2.5 px-3 text-right">Preço de Venda</th>
                <th className="py-2.5 px-3 text-center">Estoque Atual</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map(p => {
                const isLow = p.stock <= p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-indigo-400">{p.code}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-200">{p.name}</div>
                      {p.supplier && (
                        <div className="text-[10px] text-slate-500">Fornecedor: {p.supplier}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{p.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                      {formatCurrency(p.cost)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold">
                      <span className={`px-2.5 py-0.5 rounded-full ${
                        isLow ? 'bg-rose-500/20 text-rose-300 font-mono' : 'text-slate-200 font-mono'
                      }`}>
                        {p.stock} {p.unit}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isLow
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {isLow ? `Baixo (Mín: ${p.minStock})` : 'Normal'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setAdjustingProduct(p)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded text-[11px] font-semibold"
                          title="Entrada / Saída Manual"
                        >
                          Ajustar
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Deseja excluir o produto ${p.name}?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Product */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingId ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Código / Referência</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Vestidos, Calças, etc."
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Vestido Midi Floral"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Custo Unitário (R$)</label>
                  <input
                    type="text"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="Ex: 50,00"
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preço de Venda (R$)</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ex: 129,90"
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estoque Inicial (Qtd)</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estoque Mínimo (Alerta)</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fornecedor (Opcional)</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Ex: Confecções Brás"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Stock Adjustment */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Ajuste de Estoque: {adjustingProduct.name}
            </h3>
            <p className="text-xs text-slate-400">
              Estoque atual: <strong className="text-white">{adjustingProduct.stock} {adjustingProduct.unit}</strong>
            </p>

            <form onSubmit={handleExecuteAdjustment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Movimento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('in')}
                    className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                      adjustType === 'in'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Entrada (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('out')}
                    className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                      adjustType === 'out'
                        ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4" />
                    <span>Saída (-)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quantidade</label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  placeholder="Ex: 5"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Motivo do Ajuste</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ex: Compra de mercadoria, perda, devolução..."
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
