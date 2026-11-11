import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, Task } from '../../types';
import {
  CalendarDays,
  CheckSquare,
  Plus,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Calendar as CalendarIcon,
  Filter
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ScheduleTab: React.FC = () => {
  const {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    customers,
    business
  } = useApp();

  const [activeView, setActiveView] = useState<'compromissos' | 'tarefas'>('compromissos');
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Appointment Modal
  const [showAppModal, setShowAppModal] = useState(false);
  const [appTitle, setAppTitle] = useState('');
  const [appType, setAppType] = useState<Appointment['type']>('atendimento');
  const [appCustomer, setAppCustomer] = useState('');
  const [appDate, setAppDate] = useState(new Date().toISOString().split('T')[0]);
  const [appTime, setAppTime] = useState('14:00');
  const [appNotes, setAppNotes] = useState('');

  // Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<Task['priority']>('alta');
  const [taskCategory, setTaskCategory] = useState('Financeiro');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appTitle.trim()) return;

    addAppointment({
      title: appTitle,
      type: appType,
      customerName: appCustomer || undefined,
      date: appDate,
      time: appTime,
      durationMinutes: 30,
      status: 'pendente',
      notes: appNotes || undefined
    });

    setAppTitle('');
    setAppNotes('');
    setShowAppModal(false);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle,
      priority: taskPriority,
      category: taskCategory,
      dueDate: taskDueDate
    });

    setTaskTitle('');
    setShowTaskModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 mb-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Organização & Tempo</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Agenda & Tarefas do Dia a Dia
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie atendimentos, entregas de fornecedores, retornos de clientes e tarefas prioritárias.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Nova Tarefa</span>
          </button>
          <button
            onClick={() => setShowAppModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-violet-600/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Compromisso</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveView('compromissos')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeView === 'compromissos'
              ? 'border-violet-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Compromissos Agendados ({appointments.length})</span>
        </button>
        <button
          onClick={() => setActiveView('tarefas')}
          className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeView === 'tarefas'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Lista de Tarefas & Prioridades ({tasks.filter(t => !t.completed).length} pendentes)</span>
        </button>
      </div>

      {/* 1. COMPROMISSOS VIEW */}
      {activeView === 'compromissos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map(app => (
              <div
                key={app.id}
                className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {app.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-300">
                      {app.time}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{app.title}</h3>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatDate(app.date)}</span>
                  </div>

                  {app.customerName && (
                    <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      <span>{app.customerName}</span>
                    </div>
                  )}

                  {app.notes && (
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 mt-3">
                      {app.notes}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      const next = app.status === 'pendente' ? 'concluido' : 'pendente';
                      updateAppointment(app.id, { status: next });
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                      app.status === 'concluido'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{app.status === 'concluido' ? 'Concluído' : 'Marcar Feito'}</span>
                  </button>

                  <button
                    onClick={() => deleteAppointment(app.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TAREFAS VIEW */}
      {activeView === 'tarefas' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-white">To-Do List Operacional</h2>
              <p className="text-xs text-slate-400">Tarefas ordenadas por prioridade.</p>
            </div>
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Tarefa</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  task.completed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 cursor-pointer"
                  />
                  <div>
                    <span className={`font-semibold ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{task.category}</span>
                      {task.dueDate && <span>• Prazo: {formatDate(task.dueDate)}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    task.priority === 'alta'
                      ? 'bg-rose-500/20 text-rose-300'
                      : task.priority === 'media'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {task.priority}
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Appointment */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Agendar Compromisso</h3>
            <form onSubmit={handleSaveAppointment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título do Compromisso</label>
                <input
                  type="text"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  placeholder="Ex: Atendimento VIP ou Entrega de Tecidos"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo</label>
                  <select
                    value={appType}
                    onChange={(e) => setAppType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="atendimento">Atendimento Cliente</option>
                    <option value="entrega">Recebimento / Entrega</option>
                    <option value="reuniao">Reunião / Parceria</option>
                    <option value="retorno">Retorno Pós-Venda</option>
                    <option value="lembrete">Lembrete</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente Vinculado</label>
                  <input
                    type="text"
                    value={appCustomer}
                    onChange={(e) => setAppCustomer(e.target.value)}
                    placeholder="Nome do cliente"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Data</label>
                  <input
                    type="date"
                    value={appDate}
                    onChange={(e) => setAppDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Horário</label>
                  <input
                    type="time"
                    value={appTime}
                    onChange={(e) => setAppTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Observações</label>
                <textarea
                  rows={2}
                  value={appNotes}
                  onChange={(e) => setAppNotes(e.target.value)}
                  placeholder="Separar vestidos tamanho M..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAppModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold"
                >
                  Salvar Compromisso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Task */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Adicionar Tarefa</h3>
            <form onSubmit={handleSaveTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Tarefa</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Ex: Pagar guia DAS MEI até o dia 20"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Prioridade</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Financeiro">Financeiro</option>
                    <option value="Estoque">Estoque</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Atendimento">Atendimento</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Data Limite (Prazo)</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  Salvar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
