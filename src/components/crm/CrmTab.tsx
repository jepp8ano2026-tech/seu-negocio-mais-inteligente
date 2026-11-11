import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  ShoppingBag,
  Award,
  MessageCircle,
  Copy,
  Check,
  Trash2,
  Edit2,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';

export const CrmTab: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, business, setQuickActionModal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('todos');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);

  // New/Edit Customer modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('VIP, Recorrente');
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'todos' || c.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setEmail('');
    setBirthDate('');
    setAddress('');
    setNotes('');
    setTagsInput('VIP, Recorrente');
    setShowModal(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingId(c.id);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email);
    setBirthDate(c.birthDate || '');
    setAddress(c.address || '');
    setNotes(c.notes || '');
    setTagsInput(c.tags.join(', '));
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tagsArr = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (editingId) {
      updateCustomer(editingId, {
        name,
        phone,
        email,
        birthDate: birthDate || undefined,
        address: address || undefined,
        notes: notes || undefined,
        tags: tagsArr
      });
    } else {
      const created = addCustomer({
        name,
        phone,
        email,
        birthDate: birthDate || undefined,
        address: address || undefined,
        notes: notes || undefined,
        tags: tagsArr
      });
      setSelectedCustomer(created);
    }
    setShowModal(false);
  };

  // Generate friendly personalized message for WhatsApp
  const generateWhatsAppMessage = (customer: Customer, type: 'retorno' | 'aniversario' | 'novidade') => {
    if (type === 'retorno') {
      return `Olá, ${customer.name}! Tudo bem com você? Aqui é da ${business.name}. Notamos que faz um tempinho que você não nos visita e estamos com saudades! Preparamos condições especiais para sua próxima visita. Quando puder, dá uma passadinha aqui ou me avisa se quiser ver as novidades pelo WhatsApp! 🌸✨`;
    }
    if (type === 'aniversario') {
      return `Parabéns, ${customer.name}! 🎂🎉 A equipe da ${business.name} deseja um dia maravilhoso e repleto de conquistas! Como presente especial de aniversário, você tem um mimo exclusivo na sua próxima compra com a gente. Um grande abraço!`;
    }
    return `Oi, ${customer.name}! Tudo bem? Passando para te mostrar em primeira mão as novidades que acabaram de chegar na ${business.name}! Como sei do seu bom gosto, separei algumas fotos para você dar uma olhadinha. Posso te enviar? 👗📲`;
  };

  const copyAndOpenWhatsApp = (text: string, rawPhone: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);

    const cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone) {
      const fullNumber = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
      window.open(`https://wa.me/${fullNumber}?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      alert('Mensagem copiada para a área de transferência! Cole no seu WhatsApp.');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>CRM & Relacionamento</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Clientes & Fidelização
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhe o histórico de compras, aniversários, pontos acumulados e mantenha contato ativo.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-sky-600/20 active:scale-95 transition-all self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Cliente</span>
        </button>
      </div>

      {/* Main CRM split workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Customer Directory & Search */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome, telefone ou e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Tag Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['todos', 'VIP', 'Recorrente', 'Inativo', 'WhatsApp'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Customers List */}
          <div className="space-y-2 max-h-[550px] overflow-y-auto">
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                Nenhum cliente encontrado com os filtros aplicados.
              </div>
            ) : (
              filteredCustomers.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedCustomer?.id === c.id
                      ? 'bg-slate-800/90 border-indigo-500 shadow-md'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600/30 to-indigo-600/30 border border-sky-500/30 text-sky-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{c.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{formatPhone(c.phone)}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {formatCurrency(c.totalPurchases)}
                      </div>
                      <div className="text-[10px] text-indigo-300 font-semibold mt-0.5">
                        {c.loyaltyPoints} pts
                      </div>
                    </div>
                  </div>

                  {c.tags && c.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-slate-800/60">
                      {c.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Customer Details, Purchase History & Smart WhatsApp Messages */}
        <div className="lg:col-span-7 space-y-4">
          {selectedCustomer ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">

              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-black text-base flex items-center justify-center">
                    {selectedCustomer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedCustomer.name}</h2>
                    <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{formatPhone(selectedCustomer.phone)}</span>
                      </span>
                      {selectedCustomer.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{selectedCustomer.email}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(selectedCustomer)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Editar Dados"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Deseja excluir o cliente ${selectedCustomer.name}?`)) {
                        deleteCustomer(selectedCustomer.id);
                        setSelectedCustomer(customers.find(c => c.id !== selectedCustomer.id) || null);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Excluir Cliente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Customer Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total em Compras</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-1">
                    {formatCurrency(selectedCustomer.totalPurchases)}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Pontos de Fidelidade</div>
                  <div className="text-sm font-bold text-indigo-300 font-mono mt-1">
                    {selectedCustomer.loyaltyPoints} pontos
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Última Compra</div>
                  <div className="text-xs font-semibold text-slate-200 mt-1">
                    {formatDate(selectedCustomer.lastPurchaseDate)}
                  </div>
                </div>
              </div>

              {/* Notes & Preferences */}
              {selectedCustomer.notes && (
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-slate-400 uppercase text-[10px] block mb-1">
                    Observações & Preferências:
                  </span>
                  {selectedCustomer.notes}
                </div>
              )}

              {/* Smart AI Messages for WhatsApp */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Mensagens Personalizadas para WhatsApp
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Mensagem de Retorno */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-xs font-bold text-sky-300 mb-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Lembrete de Retorno / Saudades</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                        {generateWhatsAppMessage(selectedCustomer, 'retorno')}
                      </p>
                    </div>

                    <button
                      onClick={() => copyAndOpenWhatsApp(generateWhatsAppMessage(selectedCustomer, 'retorno'), selectedCustomer.phone)}
                      className="w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/30"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Enviar no WhatsApp</span>
                    </button>
                  </div>

                  {/* Mensagem de Novidade / Lançamento */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Novidades em Primeira Mão</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                        {generateWhatsAppMessage(selectedCustomer, 'novidade')}
                      </p>
                    </div>

                    <button
                      onClick={() => copyAndOpenWhatsApp(generateWhatsAppMessage(selectedCustomer, 'novidade'), selectedCustomer.phone)}
                      className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-indigo-500/30"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Enviar no WhatsApp</span>
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center">
                  *O envio no WhatsApp respeita o consentimento do cliente com abertura direta oficial do aplicativo.
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              Selecione um cliente ao lado para ver o perfil completo.
            </div>
          )}
        </div>

      </div>

      {/* Modal Create/Edit Customer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              {editingId ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Camila Rodrigues"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cliente@email.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Data de Aniversário</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="VIP, Atacado, Indicação"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Endereço / Bairro</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua das Flores, 120 - Moema, SP"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Observações & Preferências</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gosta de peças na cor azul, veste tamanho M, prefere ser atendida à tarde."
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
