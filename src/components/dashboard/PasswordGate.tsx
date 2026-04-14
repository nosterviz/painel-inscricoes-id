import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const HASH_ID_2025 = '52f4092ed136000ed1ac614f01730481d7b4c30ea8c764c69ef3bf66c9afbbd8';

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    sessionStorage.getItem('auth_id_consultoria') === 'true'
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  async function sha256(message: string) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsChecking(true);
    setError('');
    try {
      const hash = await sha256(password);
      if (hash === HASH_ID_2025) {
        sessionStorage.setItem('auth_id_consultoria', 'true');
        setIsAuthenticated(true);
      } else {
        setError('Senha incorreta.');
      }
    } catch (err) {
      setError('Erro na validação.');
    } finally {
      setIsChecking(false);
    }
  };

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#050A0F] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(43,189,206,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(43,189,206,0.05) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="max-w-md w-full relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#061A1F] border border-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <Lock className="w-8 h-8 text-[#FFD700]" />
          </div>
          <div className="text-center">
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#FFD700] uppercase block mb-2">O GRANDE FILTRO</span>
            <h1 className="font-heading text-3xl font-bold text-white mb-2">Painel de Inscrições</h1>
            <p className="text-zinc-500 text-sm">Acesso restrito à equipe ID Consultoria</p>
          </div>
        </div>
        <form onSubmit={handleLogin} className="bg-[#061A1F] border border-white/5 p-8 rounded-2xl shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#FFD700]/20" />
          <div>
            <label className="block font-mono text-[10px] uppercase text-zinc-500 mb-2 tracking-wide">Senha de Acesso</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite a senha..." className="w-full bg-[#050A0F] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#FFD700]/50 transition-colors" autoFocus />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && <div className="flex items-center gap-2 text-[#EF4444] text-xs font-medium bg-[#EF4444]/10 p-3 rounded-lg border border-[#EF4444]/20"><ShieldCheck className="w-4 h-4" />{error}</div>}
          <button type="submit" disabled={!password || isChecking} className="w-full bg-[#FFD700] hover:bg-[#34d2e4] disabled:bg-zinc-800 disabled:text-zinc-600 text-[#050A0F] font-bold py-3 rounded-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            {isChecking ? <div className="w-5 h-5 border-2 border-[#050A0F]/20 border-t-[#050A0F] rounded-full animate-spin" /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
