import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // 시연용이므로 폼 제출 시 우주탐정단 페이지로 이동
    navigate('/space-detective');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#05061a] overflow-hidden select-none px-4 font-sans">

      {/* 🌌 High-Fidelity Starry Space Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg viewBox="0 0 1280 720" className="w-full h-full object-cover opacity-60">
          <rect width="1280" height="720" fill="#05061a"></rect>
          {/* Twinkling Stars */}
          <circle cx="150" cy="120" r="1.5" fill="white" className="animate-pulse"></circle>
          <circle cx="350" cy="220" r="2" fill="white" opacity="0.6"></circle>
          <circle cx="850" cy="140" r="1.5" fill="white" className="animate-pulse"></circle>
          <circle cx="1150" cy="300" r="2.5" fill="white" opacity="0.8"></circle>
          <circle cx="650" cy="180" r="1.5" fill="white" className="animate-pulse"></circle>
          <circle cx="950" cy="540" r="2" fill="white" opacity="0.5"></circle>
          <circle cx="250" cy="600" r="1.5" fill="white" className="animate-pulse"></circle>

          {/* Nebula Glows */}
          <ellipse cx="200" cy="150" rx="300" ry="200" fill="#b388ff" opacity="0.08"></ellipse>
          <ellipse cx="1080" cy="570" rx="350" ry="250" fill="#80cbc4" opacity="0.06"></ellipse>

          {/* Saturn */}
          <ellipse cx="1100" cy="150" rx="90" ry="18" fill="none" stroke="#f48fb1" strokeWidth="8" opacity="0.4"></ellipse>
          <circle cx="1100" cy="150" r="45" fill="#ffcc02" opacity="0.6"></circle>

          {/* Moon */}
          <circle cx="180" cy="500" r="60" fill="#ffb300" opacity="0.5"></circle>
        </svg>
      </div>

      {/* 🔐 Premium Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#0c0f2e]/85 backdrop-blur-xl rounded-3xl p-10 border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.2)] z-10 relative overflow-hidden"
      >
        {/* Glowing Corners */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

        <div className="text-center mb-10">
          <div className="inline-block bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-3">
            <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">MILK-T SPACE DETECTIVE</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            AI 우주탐정단
          </h1>
          <p className="text-gray-400 text-sm">시연용 로그인 스테이션</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-cyan-400 tracking-wider mb-2 uppercase">아이디 (ID)</label>
            <input
              type="text"
              className="w-full bg-[#05061a]/60 text-white placeholder-gray-600 px-5 py-4 rounded-2xl border border-blue-500/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all font-semibold"
              placeholder="아이디를 입력하세요"
              defaultValue="tester"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-cyan-400 tracking-wider mb-2 uppercase">비밀번호 (PASSWORD)</label>
            <input
              type="password"
              className="w-full bg-[#05061a]/60 text-white placeholder-gray-600 px-5 py-4 rounded-2xl border border-blue-500/20 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all font-semibold"
              placeholder="비밀번호를 입력하세요"
              defaultValue="password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#ffea59] hover:from-[#ffed4a] hover:to-[#fff9a6] text-[#4a3000] font-black text-xl py-4.5 rounded-2xl transition-all duration-300 transform active:scale-98 shadow-[0_0_25px_rgba(255,215,0,0.3)] mt-8 tracking-wider"
          >
            로그인 임무 개시
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
