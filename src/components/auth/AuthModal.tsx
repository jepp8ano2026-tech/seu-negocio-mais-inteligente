import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, loginUser, setShowOnboardingModal } = useApp();
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor preencha todos os campos obrigatórios.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setError('');
    loginUser(email, name || undefined);

    if (isRegister) {
      // Trigger onboarding for new registrations!
      setShowOnboardingModal(true);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Informe seu e-mail para recuperação.');
      return;
    }
    setError('');
    setForgotSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-black border border-slate-700/80 shrink-0 flex items-center justify-center">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-11-05_at_13.27.08__1__2baa3e71.jpeg"
              alt="Logo Seu Negócio Mais Inteligente"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Seu Negócio.</span>
            <span className="text-xs font-black text-white">MAIS INTELIGENTE.</span>
          </div>
        </div>

        {isForgotPassword ? (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Recuperar Senha</h2>
            <p className="text-xs text-slate-400 mb-6">
              Informe seu e-mail cadastrado e enviaremos o link de redefinição com segurança.
            </p>

            {forgotSent ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-xs font-semibold text-emerald-200">
                  Link de recuperação enviado com sucesso!
                </div>
                <div className="text-[11px] text-slate-400">
                  Verifique a caixa de entrada do e-mail <strong>{email}</strong>.
                </div>
                <button
                  onClick={() => {
                    setIsForgotPassword(false);
                    setForgotSent(false);
                  }}
                  className="mt-2 text-xs text-indigo-400 hover:underline block mx-auto font-medium"
                >
                  Voltar para o Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                {error && <div className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg">{error}</div>}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Cadastrado</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com.br"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
                >
                  Enviar Link de Recuperação
                </button>

                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancelar e voltar
                </button>
              </form>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {isRegister ? 'Crie sua conta gratuitamente' : 'Bem-vindo de volta'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              {isRegister
                ? 'Comece agora a transformar a gestão do seu negócio com IA.'
                : 'Acesse seu painel com segurança e acompanhe sua operação.'}
            </p>

            {error && (
              <div className="mb-4 text-xs text-rose-400 bg-rose-950/50 border border-rose-500/30 p-2.5 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegister && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Seu Nome Completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Mariana Silveira"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">E-mail Profissional</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@seu-negocio.com.br"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">Senha de Acesso</label>
                  {!isRegister && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>{isRegister ? 'Criar Minha Conta Grátis' : 'Entrar no Sistema'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              {isRegister ? (
                <span>
                  Já tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setError('');
                    }}
                    className="text-indigo-400 hover:underline font-semibold"
                  >
                    Fazer Login
                  </button>
                </span>
              ) : (
                <span>
                  Não tem cadastro ainda?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(true);
                      setError('');
                    }}
                    className="text-indigo-400 hover:underline font-semibold"
                  >
                    Cadastre-se Gratuitamente
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
