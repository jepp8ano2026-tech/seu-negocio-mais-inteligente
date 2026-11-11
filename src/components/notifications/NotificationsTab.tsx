import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  CheckCheck,
  ArrowRight
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const NotificationsTab: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentTab
  } = useApp();

  const [filterType, setFilterType] = useState<string>('todos');

  const filtered = notifications.filter(n => {
    if (filterType === 'todos') return true;
    if (filterType === 'nao_lidas') return !n.read;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-1">
            <Bell className="w-3.5 h-3.5" />
            <span>Central de Avisos & Lembretes</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Notificações & Alertas Operacionais
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fique por dentro de contas a vencer, fiados atrasados, estoque em nível crítico e clientes prioritários.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-center transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-indigo-400" />
          <span>Marcar Todas como Lidas</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'todos', label: 'Todas as Notificações' },
          { id: 'nao_lidas', label: 'Não Lidas' },
          { id: 'alert', label: 'Alertas Urgentes' },
          { id: 'warning', label: 'Avisos & Estoque' },
          { id: 'info', label: 'Informativos' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              filterType === f.id
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Nenhuma notificação encontrada nesta categoria.
          </div>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.linkTab) setCurrentTab(notif.linkTab as any);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'bg-slate-950 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                {notif.type === 'alert' && (
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
                {notif.type === 'warning' && (
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
                {notif.type === 'info' && (
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Info className="w-4 h-4" />
                  </div>
                )}
                {notif.type === 'success' && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-bold ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{formatDate(notif.createdAt)}</span>
                  </div>
                </div>
              </div>

              {notif.linkTab && (
                <div className="flex items-center gap-1 text-xs text-indigo-400 font-semibold shrink-0">
                  <span>Acessar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
