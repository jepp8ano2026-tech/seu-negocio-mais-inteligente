import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  Bookmark,
  Trash2,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Users,
  Target
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isSaved?: boolean;
}

export const AssistantTab: React.FC = () => {
  const { business, sales, expenses, customers, receivables, products } = useApp();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('snmi_assistant_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `Olá, ${business.ownerName || 'amigo(a)'}! Sou o seu braço direito aqui na plataforma.\n\nJá conheço os detalhes de **${business.name}** (${business.segment} em ${business.city || 'sua região'}). Como posso te ajudar hoje? Posso sugerir ações para trazer mais clientes, organizar as contas da semana ou criar uma campanha atrativa!`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('snmi_assistant_messages', JSON.stringify(messages));
  }, [messages]);

  const quickPrompts = [
    { label: 'Como conseguir mais clientes na minha cidade?', icon: Users },
    { label: 'Como criar uma promoção para este fim de semana?', icon: Sparkles },
    { label: 'Como calcular o preço correto de um produto?', icon: DollarSign },
    { label: 'O que posso melhorar nesta semana com base nos meus números?', icon: TrendingUp },
    { label: 'Como fidelizar clientes que compraram apenas uma vez?', icon: Target },
    { label: 'Como organizar minhas despesas para sobrar mais dinheiro?', icon: HelpCircle }
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Build safe business context to send to server-side Gemini API
      const businessContext = {
        name: business.name,
        owner: business.ownerName,
        segment: business.segment,
        city: business.city,
        state: business.state,
        businessType: business.businessType,
        mainGoal: business.mainGoal,
        biggestDifficulty: business.biggestDifficulty,
        channels: business.channels,
        monthlySalesTotal: sales.reduce((a, s) => a + s.total, 0),
        totalReceivablesPending: receivables.filter(r => r.status !== 'quitado').reduce((a, r) => a + r.remainingAmount, 0)
      };

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          businessContext
        })
      });

      const data = await res.json();
      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.text || 'Desculpe, ocorreu uma instabilidade temporária ao conectar com a IA.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Ocorreu um erro na comunicação. Por favor tente novamente em instantes.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSaveMessage = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isSaved: !m.isSaved } : m));
  };

  const clearHistory = () => {
    if (window.confirm('Deseja limpar todo o histórico de conversas com o Assistente?')) {
      const welcome: Message = {
        id: `msg-welcome-${Date.now()}`,
        role: 'assistant',
        content: `Histórico reiniciado! Em que posso te apoiar hoje com **${business.name}**?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcome]);
      localStorage.removeItem('snmi_assistant_messages');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Assistant Header */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Meu Assistente Inteligente</h2>
              <span className="text-[10px] px-2 py-0.2 bg-emerald-500/20 text-emerald-300 rounded-full font-semibold">
                Online & Conectado
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Contexto sincronizado com {business.name} ({business.segment})
            </p>
          </div>
        </div>

        <button
          onClick={clearHistory}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg text-xs flex items-center gap-1 transition-colors"
          title="Limpar histórico"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Limpar Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto justify-end' : ''}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                {msg.content}

                <div className="flex items-center justify-between gap-4 mt-3 pt-2 border-t border-white/10 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                        title="Copiar resposta"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => toggleSaveMessage(msg.id)}
                        className={`hover:text-white flex items-center gap-1 transition-colors ${
                          msg.isSaved ? 'text-amber-400' : ''
                        }`}
                        title="Salvar resposta importante"
                      >
                        <Bookmark className="w-3 h-3" />
                        <span>{msg.isSaved ? 'Salvo' : 'Salvar'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>O Meu Assistente está analisando seus dados e formulando a melhor resposta...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">
          Perguntas rápidas:
        </span>
        {quickPrompts.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(p.label)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/20 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/40 text-slate-300 whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Icon className="w-3 h-3 text-indigo-400" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Pergunte algo sobre vendas, finanças, promoções ou clientes da ${business.name}...`}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white rounded-xl shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[10px] text-slate-400 mt-1.5 text-center">
          *A IA analisa os dados informados para oferecer recomendações práticas. As sugestões não garantem lucro nem substituem planejamento formal.
        </div>
      </div>
    </div>
  );
};
