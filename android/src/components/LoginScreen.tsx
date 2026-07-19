import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, KeyRound, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginScreen: React.FC = () => {
  const { login, register } = useApp();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only numbers up to 4 digits
    if (/^\d*$/.test(val) && val.length <= 4) {
      setPin(val);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || pin.length !== 4) {
      setErrorMsg('Por favor introduce un correo válido y un PIN de 4 números.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const result = isLoginMode 
        ? await login(email, pin) 
        : await register(email, pin);

      if (!result.success) {
        setErrorMsg(result.error || 'Ocurrió un error inesperado');
      }
    } catch (err) {
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white font-sans relative p-4 overflow-hidden">
      
      {/* Background neon grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />
      
      {/* Glowing background circles for cyberpunk visual texture */}
      <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-yellow-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-red-500/10 blur-[130px] pointer-events-none" />

      {/* Main card wrapper styled like our smartphone dashboard container */}
      <div className="w-full max-w-[390px] bg-zinc-900/60 border border-zinc-800 rounded-[44px] shadow-[0_25px_60px_rgba(0,0,0,0.5)] p-8 backdrop-blur-xl relative z-10 space-y-6 flex flex-col justify-between">
        
        {/* Top Header Pinwheel Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#fca5a5] text-zinc-950 flex items-center justify-center shadow-lg transform rotate-45 animate-spin" style={{ animationDuration: '60s' }}>
            <svg className="w-6 h-6 stroke-current stroke-[2]" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
            </svg>
          </div>
          
          <div className="text-center">
            <h1 className="font-display text-3xl font-black tracking-[0.16em] uppercase text-white leading-none">
              AQUÍ // ALLÁ
            </h1>
            <span className="text-[9px] font-mono font-bold tracking-[0.25em] mt-1.5 uppercase text-zinc-500 block">
              PLATAFORMA DE CURACIÓN
            </span>
          </div>
        </div>

        {/* Tab mode toggler (Login vs Register) */}
        <div className="flex bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              isLoginMode
                ? 'bg-zinc-800 text-white shadow-md'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Entrar
          </button>
          
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              !isLoginMode
                ? 'bg-zinc-800 text-white shadow-md'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5 uppercase pl-1">
              <Mail className="w-3.5 h-3.5 text-zinc-500" />
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-750 focus:outline-none transition-all font-sans"
            />
          </div>

          {/* Password PIN input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5 uppercase pl-1">
              <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
              PIN de Acceso (4 números)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                maxLength={4}
                pattern="\d{4}"
                inputMode="numeric"
                placeholder="••••"
                value={pin}
                onChange={handlePinChange}
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 rounded-xl py-3 px-4 text-sm text-center text-white tracking-[1.5em] placeholder-zinc-800 focus:outline-none transition-all font-mono"
              />
            </div>
            
            {/* PIN circle indicators */}
            <div className="flex justify-center gap-3 pt-2">
              {[0, 1, 2, 3].map((idx) => (
                <div 
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                    pin.length > idx 
                      ? 'bg-yellow-400 border-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.6)]' 
                      : 'bg-zinc-900 border-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Error Message alert */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-xs text-red-400 font-sans leading-snug">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email.trim() || pin.length !== 4}
            className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 mt-2 flex items-center justify-center gap-2 cursor-pointer ${
              isLoginMode
                ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.35)] disabled:bg-zinc-850 disabled:text-zinc-600 disabled:shadow-none'
                : 'bg-red-500 text-white hover:bg-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.35)] disabled:bg-zinc-850 disabled:text-zinc-600 disabled:shadow-none'
            }`}
          >
            {loading ? (
              <span>Procesando...</span>
            ) : (
              <>
                <span>{isLoginMode ? 'Ingresar a mi colección' : 'Registrar y Crear Cuenta'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info message */}
        <div className="flex items-center gap-2 justify-center border-t border-zinc-850 pt-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
          <span>Local SQLite Connection Secured</span>
        </div>
      </div>
    </div>
  );
};
