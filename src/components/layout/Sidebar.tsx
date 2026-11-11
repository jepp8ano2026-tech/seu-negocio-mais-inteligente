import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import {
  LayoutDashboard,
  Receipt,
  Megaphone,
  MessageSquareHeart,
  DollarSign,
  CalendarDays,
  Palette,
  BarChart3,
  Settings,
  Share2,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    currentTab,
    setCurrentTab,
    theme,
    toggleTheme,
    receivables,
    business
  } = useApp();

  const pendingFiadosCount = receivables.filter(r => r.status === 'pendente' || r.status === 'vencido').length;

  // VISÃO COMPLETA SIMPLIFICADA
  const completeSections = [
    {
      title: 'Principal',
      items: [
        { id: 'overview' as TabType, label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'assistant' as TabType, label: 'Meu Assistente IA', icon: MessageSquareHeart, isAi: true },
      ]
    },
    {
      title: 'Vendas & Divulgação',
      items: [
        { id: 'fiado' as TabType, label: 'Vendas & Fiados', icon: Receipt, badge: pendingFiadosCount > 0 ? pendingFiadosCount : undefined },
        { id: 'marketing' as TabType, label: 'Marketing com IA', icon: Megaphone, isAi: true },
        { id: 'studio' as TabType, label: 'Estúdio de Artes', icon: Palette, isAi: true },
        { id: 'social' as TabType, label: 'Redes Sociais', icon: Share2 },
      ]
    },
    {
      title: 'Gestão Financeira & Rotina',
      items: [
        { id: 'financial' as TabType, label: 'Controle Financeiro', icon: DollarSign },
        { id: 'schedule' as TabType, label: 'Agenda & Horários', icon: CalendarDays },
        { id: 'reports' as TabType, label: 'Relatórios do Mês', icon: BarChart3 },
        { id: 'settings' as TabType, label: 'Configurações', icon: Settings },
      ]
    }
  ];

  const handleNavClick = (tabId: TabType) => {
    setCurrentTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation scrollable area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">

          {/* NAVEGAÇÃO UNIFICADA E INTUITIVA */}
          <div className="space-y-4">
            {completeSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25 font-semibold'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : item.isAi ? 'text-indigo-400' : 'text-slate-400'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge !== undefined && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                              {item.badge}
                            </span>
                          )}
                          {item.isAi && !isActive && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-bold uppercase">
                              IA
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Store Card & Theme Toggle */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          {/* Theme Quick Switcher in Sidebar */}
          <div className="flex items-center justify-between p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Claro</span>
            </button>
            <button
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`flex-1 py-1 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Escuro</span>
            </button>
          </div>

          <div
            onClick={() => handleNavClick('settings')}
            className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center gap-2.5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
              {business.name.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">
                {business.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {business.city || 'Brasil'} • Configurar
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
