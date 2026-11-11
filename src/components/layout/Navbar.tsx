import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Plus,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  TrendingDown,
  UserPlus,
  Calendar,
  CreditCard,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    business,
    theme,
    toggleTheme,
    isDemoMode,
    setIsDemoMode,
    setQuickActionModal,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentTab,
    setShowLandingPage,
    customers,
    products,
    receivables,
  } = useApp();

  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter search results
  const q = searchQuery.toLowerCase().trim();
  const searchResults = q ? {
    customers: customers.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 3),
    products: products.filter(p => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)).slice(0, 3),
    receivables: receivables.filter(r => r.customerName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)).slice(0, 3),
  } : null;

  const hasResults = searchResults && (searchResults.customers.length > 0 || searchResults.products.length > 0 || searchResults.receivables.length > 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">

        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 focus:outline-none"
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setCurrentTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-slate-700/80 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-05_at_13.27.08__1__2baa3e71.jpeg"
                alt="Logo Seu Negócio Mais Inteligente"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase leading-none">
                Seu Negócio.
              </div>
              <div className="text-sm font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                MAIS INTELIGENTE.
              </div>
            </div>
          </div>
        </div>

        {/* Center: Status Mode (Modo Demo vs Modo Real) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Demo Mode Badge */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`text-xs px-2.5 py-1.5 rounded-xl font-medium transition-colors border ${
              isDemoMode
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
            title="Clique para alternar entre dados de teste e seus dados reais"
          >
            {isDemoMode ? '🟡 Demonstração' : '🟢 Modo Real'}
          </button>
        </div>

        {/* Right: Actions, Search, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Search Trigger / Quick Search Bar */}
          <div className="relative hidden xl:block w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente, venda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/70 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Big Green Quick Sale Button */}
          <button
            onClick={() => setQuickActionModal('sale')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Venda</span>
          </button>

          {/* Quick Menu Dropdown for other actions */}
          <div className="relative">
            <button
              onClick={() => setShowQuickMenu(!showQuickMenu)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs transition-colors"
              title="Mais Ações Rápidas"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            {showQuickMenu && (
              <div
                className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs"
                onClick={() => setShowQuickMenu(false)}
              >
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">Outros Registros</div>
                <button
                  onClick={() => setQuickActionModal('fiado')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 hover:text-white"
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Anotar Fiado / A Receber</span>
                </button>
                <button
                  onClick={() => setQuickActionModal('expense')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 hover:text-white"
                >
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  <span>Adicionar Despesa</span>
                </button>
                <button
                  onClick={() => setQuickActionModal('appointment')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 hover:text-white"
                >
                  <Calendar className="w-4 h-4 text-violet-400" />
                  <span>Agendar Horário</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 relative transition-colors"
              aria-label="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>

            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden text-xs">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Avisos ({unreadNotificationsCount})</span>
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      Tudo em dia! Sem avisos pendentes.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkTab) setCurrentTab(n.linkTab as any);
                          setShowNotificationsMenu(false);
                        }}
                        className={`p-3 hover:bg-slate-800/80 cursor-pointer transition-colors ${
                          !n.read ? 'bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                          {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                          {n.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />}
                          {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                          <div className="flex-1">
                            <div className="font-medium text-slate-200">{n.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{n.message}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (Claro / Escuro) */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-indigo-300'
            }`}
            title={theme === 'light' ? 'Mudar para Tema Escuro' : 'Mudar para Tema Claro (Branco)'}
            aria-label="Alternar tema"
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline text-[11px] font-bold">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline text-[11px] font-bold">Escuro</span>
              </>
            )}
          </button>

          {/* Business Profile Avatar */}
          <div
            onClick={() => setCurrentTab('settings')}
            className="flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs uppercase group-hover:bg-indigo-600/30 transition-colors">
              {business.name.slice(0, 2)}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200 truncate max-w-[110px]">
                {business.name}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                {business.ownerName || 'Configurações'}
              </div>
            </div>
          </div>

          {/* Landing page link */}
          <button
            onClick={() => setShowLandingPage(true)}
            className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-300 px-2 py-1 rounded-lg hover:bg-slate-800"
            title="Ver Página Inicial"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Site</span>
          </button>
        </div>

      </div>
    </header>
  );
};
