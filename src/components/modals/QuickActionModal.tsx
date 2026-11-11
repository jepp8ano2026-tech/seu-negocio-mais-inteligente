import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  DollarSign,
  TrendingDown,
  UserPlus,
  Calendar,
  Receipt,
  Search,
  ChevronDown,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const QuickActionModal: React.FC = () => {
  const {
    quickActionModal,
    setQuickActionModal,
    products,
    customers,
    addSale,
    addExpense,
    addCustomer,
    addAppointment,
    addReceivable
  } = useApp();

  // Feedback State (Clean, modal-internal toast/banner avoiding window.alert)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
  } | null>(null);

  // --- SALE STATE ---
  const [productQuery, setProductQuery] = useState<string>(products[0]?.name || '');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [unitPriceInput, setUnitPriceInput] = useState<string>(products[0]?.price?.toString() || '0');
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [saleQuantity, setSaleQuantity] = useState<number>(1);
  const [saleCustomerId, setSaleCustomerId] = useState<string>('');
  const [saleCustomerName, setSaleCustomerName] = useState('Consumidor Balcão');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'fiado'>('pix');
  const [saleDiscount, setSaleDiscount] = useState('0');

  // --- EXPENSE STATE ---
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCat, setExpCat] = useState<'fornecedores' | 'aluguel' | 'marketing' | 'impostos' | 'salarios' | 'utilidades' | 'outros'>('fornecedores');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  // --- CUSTOMER STATE ---
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');

  // --- APPOINTMENT STATE ---
  const [appTitle, setAppTitle] = useState('');
  const [appDate, setAppDate] = useState(new Date().toISOString().split('T')[0]);
  const [appTime, setAppTime] = useState('14:30');

  // --- FIADO STATE ---
  const [fiadoCustomer, setFiadoCustomer] = useState(customers[0]?.name || '');
  const [fiadoDesc, setFiadoDesc] = useState('');
  const [fiadoAmount, setFiadoAmount] = useState('');
  const [fiadoDueDate, setFiadoDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  if (!quickActionModal) return null;

  // Filtered products for live search / suggestions
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(productQuery.toLowerCase()) ||
    (p.code && p.code.toLowerCase().includes(productQuery.toLowerCase()))
  );

  // Selected product calculation
  const unitPrice = parseFloat(unitPriceInput.replace(',', '.')) || 0;
  const subtotal = unitPrice * saleQuantity;
  const discountVal = parseFloat(saleDiscount.replace(',', '.')) || 0;
  const totalSale = Math.max(0, subtotal - discountVal);

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productQuery.trim()) {
      setFeedback({
        type: 'error',
        title: 'Nome obrigatório',
        message: 'Por favor, digite o nome do produto ou serviço vendido.'
      });
      return;
    }

    if (unitPrice <= 0) {
      setFeedback({
        type: 'error',
        title: 'Preço inválido',
        message: 'Informe um valor unitário maior que zero para o produto.'
      });
      return;
    }

    const matchedProd = products.find(
      p => p.id === selectedProductId || p.name.toLowerCase() === productQuery.trim().toLowerCase()
    );
    const finalProductId = matchedProd ? matchedProd.id : `prod-custom-${Date.now()}`;
    const finalProductName = productQuery.trim();

    addSale({
      customerId: saleCustomerId || undefined,
      customerName: saleCustomerName.trim() || 'Consumidor Balcão',
      items: [
        {
          productId: finalProductId,
          productName: finalProductName,
          quantity: saleQuantity,
          unitPrice: unitPrice,
          total: subtotal
        }
      ],
      subtotal,
      discount: discountVal,
      total: totalSale,
      paymentMethod,
      isPaid: paymentMethod !== 'fiado'
    });

    setFeedback({
      type: 'success',
      title: 'Venda Concluída!',
      message: `Venda de "${finalProductName}" registrada com sucesso. Total: ${formatCurrency(totalSale)}`
    });

    setTimeout(() => {
      setFeedback(null);
      setQuickActionModal(null);
    }, 1500);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(expAmount.replace(',', '.'));
    if (!expDesc.trim() || isNaN(val) || val <= 0) {
      setFeedback({
        type: 'error',
        title: 'Dados incompletos',
        message: 'Preencha a descrição e um valor válido para a despesa.'
      });
      return;
    }

    addExpense({
      description: expDesc,
      category: expCat,
      amount: val,
      dueDate: expDate,
      isPaid: false,
      recurring: false
    });

    setFeedback({
      type: 'success',
      title: 'Despesa Salva!',
      message: `Despesa de ${formatCurrency(val)} lançada no controle financeiro.`
    });

    setTimeout(() => {
      setFeedback(null);
      setQuickActionModal(null);
    }, 1500);
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) {
      setFeedback({
        type: 'error',
        title: 'Nome obrigatório',
        message: 'Preencha o nome do cliente.'
      });
      return;
    }

    addCustomer({
      name: custName,
      phone: custPhone,
      email: custEmail,
      tags: ['Novo']
    });

    setFeedback({
      type: 'success',
      title: 'Cliente Cadastrado!',
      message: `${custName} foi adicionado à sua carteira de clientes.`
    });

    setTimeout(() => {
      setFeedback(null);
      setQuickActionModal(null);
    }, 1500);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appTitle.trim()) {
      setFeedback({
        type: 'error',
        title: 'Título obrigatório',
        message: 'Informe o título do compromisso.'
      });
      return;
    }

    addAppointment({
      title: appTitle,
      type: 'atendimento',
      date: appDate,
      time: appTime,
      durationMinutes: 30,
      status: 'pendente'
    });

    setFeedback({
      type: 'success',
      title: 'Compromisso Agendado!',
      message: `Horário reservado para ${appDate} às ${appTime}.`
    });

    setTimeout(() => {
      setFeedback(null);
      setQuickActionModal(null);
    }, 1500);
  };

  const handleFiadoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(fiadoAmount.replace(',', '.'));
    if (!fiadoCustomer.trim() || isNaN(val) || val <= 0) {
      setFeedback({
        type: 'error',
        title: 'Dados incompletos',
        message: 'Informe o cliente e um valor válido para anotar o fiado.'
      });
      return;
    }

    addReceivable({
      customerId: 'cust-generic',
      customerName: fiadoCustomer,
      description: fiadoDesc || 'Compras a prazo',
      totalAmount: val,
      dueDate: fiadoDueDate
    });

    setFeedback({
      type: 'success',
      title: 'Fiado Anotado!',
      message: `Lançado ${formatCurrency(val)} na caderneta de ${fiadoCustomer}.`
    });

    setTimeout(() => {
      setFeedback(null);
      setQuickActionModal(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
        {/* Close Button */}
        <button
          onClick={() => {
            setFeedback(null);
            setQuickActionModal(null);
          }}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            className={`p-3 rounded-xl border flex items-start gap-3 animate-in fade-in duration-150 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <h4 className="font-bold">{feedback.title}</h4>
              <p className="opacity-90">{feedback.message}</p>
            </div>
          </div>
        )}

        {/* 1. REGISTRAR VENDA */}
        {quickActionModal === 'sale' && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Registrar Nova Venda</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Digite o nome do produto ou selecione do estoque. Deduz o estoque e pontua no fidelidade.
            </p>

            <form onSubmit={handleSaleSubmit} className="space-y-3.5 text-xs">
              {/* Product Search & Autocomplete Input */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300">Produto ou Serviço Vendido</label>
                  <span className="text-[10px] text-indigo-400">Digite ou escolha da lista</span>
                </div>

                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={productQuery}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProductQuery(val);
                      setShowProductSuggestions(true);
                      const match = products.find(p => p.name.toLowerCase() === val.trim().toLowerCase());
                      if (match) {
                        setSelectedProductId(match.id);
                        setUnitPriceInput(match.price.toString());
                      } else {
                        setSelectedProductId('');
                      }
                    }}
                    onFocus={() => setShowProductSuggestions(true)}
                    placeholder="Digite o nome do produto ou selecione..."
                    className="w-full pl-9 pr-16 py-2.5 bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none text-xs transition-colors"
                  />
                  {productQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        setProductQuery('');
                        setSelectedProductId('');
                        setShowProductSuggestions(true);
                      }}
                      className="absolute right-9 text-slate-400 hover:text-white p-1"
                      title="Limpar texto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setShowProductSuggestions(prev => !prev)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-200 p-1 rounded"
                    title="Ver catálogo de produtos"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${showProductSuggestions ? 'rotate-180 text-indigo-400' : ''}`} />
                  </button>
                </div>

                {/* Autocomplete Dropdown */}
                {showProductSuggestions && (
                  <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1">
                    <div className="flex items-center justify-between px-2 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                      <span>Catálogo de Produtos</span>
                      <button
                        type="button"
                        onClick={() => setShowProductSuggestions(false)}
                        className="text-slate-500 hover:text-slate-300"
                      >
                        Fechar
                      </button>
                    </div>

                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => {
                        const isSelected = p.id === selectedProductId;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setProductQuery(p.name);
                              setSelectedProductId(p.id);
                              setUnitPriceInput(p.price.toString());
                              setShowProductSuggestions(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-indigo-600/30 border border-indigo-500/50 text-white'
                                : 'hover:bg-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div className="font-medium text-xs truncate">{p.name}</div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">{p.category}</span>
                                <span>
                                  Estoque: <strong className={p.stock <= p.minStock ? 'text-amber-400' : 'text-slate-300'}>{p.stock}</strong> {p.unit}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-mono font-bold text-emerald-400 text-xs">
                                {formatCurrency(p.price)}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 ml-auto mt-0.5" />}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3 py-3 text-center">
                        <p className="text-xs text-slate-300 font-medium">Nenhum produto cadastrado com esse nome.</p>
                        <p className="text-[11px] text-indigo-300 mt-1">
                          Você pode continuar digitando! O item <strong>"{productQuery}"</strong> será registrado como item avulso.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowProductSuggestions(false)}
                          className="mt-2 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1 rounded-md"
                        >
                          Confirmar este produto
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity, Unit Price and Discount */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min={1}
                    value={saleQuantity}
                    onChange={(e) => setSaleQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Preço Unit. (R$)</label>
                  <input
                    type="text"
                    value={unitPriceInput}
                    onChange={(e) => setUnitPriceInput(e.target.value)}
                    placeholder="0,00"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Desconto (R$)</label>
                  <input
                    type="text"
                    value={saleDiscount}
                    onChange={(e) => setSaleDiscount(e.target.value)}
                    placeholder="0,00"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Customer */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cliente</label>
                <input
                  type="text"
                  value={saleCustomerName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSaleCustomerName(val);
                    const matched = customers.find(c => c.name.toLowerCase() === val.toLowerCase());
                    setSaleCustomerId(matched ? matched.id : '');
                  }}
                  placeholder="Nome do cliente ou Balcão"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                {/* Quick Customer Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="text-[10px] text-slate-400">Atalhos:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSaleCustomerName('Consumidor Balcão');
                      setSaleCustomerId('');
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] transition-colors ${
                      saleCustomerName === 'Consumidor Balcão'
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Balcão
                  </button>
                  {customers.slice(0, 3).map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSaleCustomerName(c.name);
                        setSaleCustomerId(c.id);
                      }}
                      className={`px-2 py-0.5 rounded-md text-[10px] transition-colors truncate max-w-[110px] ${
                        saleCustomerName === c.name
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Forma de Pagamento</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="pix">Pix (À vista com baixa imediata)</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="dinheiro">Dinheiro em Espécie</option>
                  <option value="fiado">Fiado (A Prazo / Caderneta Digital)</option>
                </select>
              </div>

              {/* Total preview with live math breakdown */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Cálculo: {saleQuantity} x {formatCurrency(unitPrice)} {discountVal > 0 ? `(- ${formatCurrency(discountVal)})` : ''}</span>
                  <span>Subtotal: {formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20">
                  <span className="text-slate-200 font-bold">Valor Total a Cobrar:</span>
                  <span className="font-mono text-base font-black text-emerald-400">
                    {formatCurrency(totalSale)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Concluir e Salvar Venda
              </button>
            </form>
          </div>
        )}

        {/* 2. ADICIONAR DESPESA */}
        {quickActionModal === 'expense' && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold text-white">Adicionar Despesa</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Lançamento rápido no seu controle financeiro.
            </p>

            <form onSubmit={handleExpenseSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Descrição</label>
                <input
                  type="text"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Ex: Embalagens ou Conta de Luz"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Valor (R$)</label>
                  <input
                    type="text"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    placeholder="150,00"
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Vencimento</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Categoria</label>
                <select
                  value={expCat}
                  onChange={(e) => setExpCat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="fornecedores">Fornecedores</option>
                  <option value="aluguel">Aluguel & Ponto</option>
                  <option value="marketing">Marketing & Anúncios</option>
                  <option value="impostos">DAS MEI & Impostos</option>
                  <option value="salarios">Salários & Pró-labore</option>
                  <option value="utilidades">Energia, Internet & Água</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Salvar Despesa
              </button>
            </form>
          </div>
        )}

        {/* 3. CADASTRAR CLIENTE */}
        {quickActionModal === 'customer' && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-bold text-white">Cadastrar Cliente</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">Adicione rapidamente um novo cliente ao CRM.</p>

            <form onSubmit={handleCustomerSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Nome do cliente"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">E-mail (Opcional)</label>
                <input
                  type="email"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold transition-all shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Salvar Cliente
              </button>
            </form>
          </div>
        )}

        {/* 4. AGENDAR COMPROMISSO */}
        {quickActionModal === 'appointment' && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-violet-400" />
              <h2 className="text-base font-bold text-white">Agendar Compromisso</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">Adicione um horário na sua agenda digital.</p>

            <form onSubmit={handleAppointmentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Título</label>
                <input
                  type="text"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  placeholder="Ex: Prova de roupa VIP ou Reunião"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Data</label>
                  <input
                    type="date"
                    value={appDate}
                    onChange={(e) => setAppDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Horário</label>
                  <input
                    type="time"
                    value={appTime}
                    onChange={(e) => setAppTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold transition-all shadow-md shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Salvar Compromisso
              </button>
            </form>
          </div>
        )}

        {/* 5. ANOTAR FIADO */}
        {quickActionModal === 'fiado' && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Anotar Fiado / A Receber</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Registre compras fiadas com data combinada de vencimento.
            </p>

            <form onSubmit={handleFiadoSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  value={fiadoCustomer}
                  onChange={(e) => setFiadoCustomer(e.target.value)}
                  placeholder="Nome do cliente"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Valor Total (R$)</label>
                  <input
                    type="text"
                    value={fiadoAmount}
                    onChange={(e) => setFiadoAmount(e.target.value)}
                    placeholder="180,00"
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    value={fiadoDueDate}
                    onChange={(e) => setFiadoDueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Descrição das Peças / Serviços</label>
                <input
                  type="text"
                  value={fiadoDesc}
                  onChange={(e) => setFiadoDesc(e.target.value)}
                  placeholder="Ex: 1x Vestido Floral + 1x Cinto"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all shadow-md shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Salvar na Caderneta
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
