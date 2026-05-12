import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, HelpCircle, Award, BookOpen, LayoutGrid, CheckCircle, FileText, Play, X } from 'lucide-react';
import HelpModal from '../components/HelpModal';
import BadgeCollection from '../components/BadgeCollection';

const tabCurriculum = {
  understanding: {
    title: '이해의 별',
    desc: '인공지능의 원리를 정복해보세요.',
    classes: [
      { id: 1, title: '인공지능이 뭐예요?\n우리 곁에도 있나요?', status: '학습하기', top: '28%', left: '10%' },
      { id: 2, title: '인공지능은 어떻게 생각하나요?', status: '학습하기', top: '52%', left: '26%' },
      { id: 3, title: '인공지능 답변에 숨겨진 비밀', status: '학습하기', top: '30%', left: '42%' },
      { id: 4, title: '세상의 모든 것은 데이터예요', status: '학습하기', top: '55%', left: '58%' },
      { id: 5, title: '인공지능은 데이터를 먹고 자라요', status: '학습하기', top: '32%', left: '74%' },
      { id: 'final_1', title: '최종 관문\n이해의 별 단원평가', status: '도전하기', top: '45%', left: '90%', isFinal: true }
    ]
  },
  thinking: {
    title: '사고력 별',
    desc: '인공지능의 편견과 한계를 알아봐요.',
    classes: [
      { id: 6, title: '인공지능의 자신 있는 거짓말', status: '학습하기', top: '28%', left: '10%' },
      { id: 7, title: '이 정보를 믿어도 될까요?', status: '학습하기', top: '52%', left: '23%' },
      { id: 8, title: '진짜일까요, 가짜일까요?', status: '학습하기', top: '30%', left: '36%' },
      { id: 9, title: '인공지능에도 편견이 있어요', status: '학습하기', top: '55%', left: '49%' },
      { id: 10, title: '골고루 섞인 \'공정한 데이터\' 만들기', status: '학습하기', top: '32%', left: '62%' },
      { id: 11, title: '인공지능 탐정의 올바른 선택', status: '학습하기', top: '48%', left: '75%' },
      { id: 'final_2', title: '최종 관문\n사고력 별 단원평가', status: '도전하기', top: '42%', left: '90%', isFinal: true }
    ]
  },
  ethics: {
    title: '윤리의 별',
    desc: '인공지능을 대하는 나의 올바른 품격.',
    classes: [
      { id: 12, title: '내 데이터는 어디로 갈까요?', status: '학습하기', top: '28%', left: '10%' },
      { id: 13, title: '인공지능 결과물의 주인은 누구일까요?', status: '학습하기', top: '52%', left: '23%' },
      { id: 14, title: '나를 위한 공부, \'정직한 인공지능\'', status: '학습하기', top: '30%', left: '36%' },
      { id: 15, title: '가짜 정보의 확산을 막는 용기', status: '학습하기', top: '55%', left: '49%' },
      { id: 16, title: '세상을 바꾸는 선한 영향력', status: '학습하기', top: '32%', left: '62%' },
      { id: 17, title: '인공지능을 대하는 나의 품격', status: '학습하기', top: '48%', left: '75%' },
      { id: 'final_3', title: '최종 관문\n윤리의 별 단원평가', status: '도전하기', top: '42%', left: '90%', isFinal: true }
    ]
  },
  creativity: {
    title: '창의의 별',
    desc: '프롬프트 공식을 만들고 미래를 상상해요.',
    classes: [
      { id: 18, title: '인공지능에게 말 거는 법을 배워요', status: '학습하기', top: '28%', left: '10%' },
      { id: 19, title: '질문에 따라 결과가 달라지는 이유', status: '학습하기', top: '50%', left: '21%' },
      { id: 20, title: '나만의 프롬프트 공식을 만들어요', status: '학습하기', top: '30%', left: '32%' },
      { id: 21, title: '인공지능도 못 하는 것이 있어요!', status: '학습하기', top: '54%', left: '43%' },
      { id: 22, title: '인공지능 프로젝트를 기획해봐요', status: '학습하기', top: '32%', left: '54%' },
      { id: 23, title: '변화하는 직업과 나의 꿈', status: '학습하기', top: '52%', left: '65%' },
      { id: 24, title: '10년 뒤 나의 하루를 그려요', status: '학습하기', top: '30%', left: '76%' },
      { id: 'final_4', title: '최종 관문\n창의의 별 단원평가', status: '도전하기', top: '42%', left: '90%', isFinal: true }
    ]
  }
};

const MainLobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('understanding');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [dummyModalClass, setDummyModalClass] = useState(null);
  const [recommendedLevel, setRecommendedLevel] = useState(1);
  const [hasNewBadge, setHasNewBadge] = useState(localStorage.getItem('new_badge_available') === 'true');

  useEffect(() => {
    // 1. Priority: If we return with specific tab state (e.g. from assessments)
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    // 2. Secondary: Determine recommended level highlight from diagnostics
    const rawResults = localStorage.getItem('diagnostic_results');
    if (rawResults) {
      const parsed = JSON.parse(rawResults);
      const level = parsed.recommendedLevel || 1;
      setRecommendedLevel(level);

      // Only auto-switch based on recommendation if NOT explicitly driven by navigation state
      if (!location.state?.activeTab) {
        if (level === 1) setActiveTab('understanding');
        else if (level === 2) setActiveTab('thinking');
        else if (level === 3) setActiveTab('ethics');
        else if (level === 4) setActiveTab('creativity');
      }
    }

    // Auto-open badge collection if redirected from diagnostic results
    if (localStorage.getItem('open_badge_collection') === 'true') {
      setIsBadgeOpen(true);
      localStorage.removeItem('open_badge_collection');
    }
  }, [location.state]);

  return (
    <div className="w-full h-full max-h-full flex bg-[#03051a] text-white overflow-hidden select-none relative font-sans">

      {/* 🛠️ LEFT SIDEBAR NAVIGATION PANEL */}
      <div className="w-[280px] bg-[#0c0f2e] border-r border-blue-500/10 flex flex-shrink-0 flex-col p-6 justify-between relative z-10">
        <div className="flex flex-col gap-6">
          {/* Logo & Title */}
          <div className="flex flex-col items-center border-b border-blue-500/15 pb-4">
            <img
              src="/images/LOGO.png"
              alt="우주탐정단 AI LITERACY"
              className="w-full h-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40' viewBox='0 0 100 40'%3E%3Ctext x='10' y='25' fill='%2300C853' font-weight='bold' font-size='16'%3E우주탐정단%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Active Navigation Tabs */}
          <div className="flex flex-col gap-3">
            {Object.keys(tabCurriculum).map((key) => {
              const item = tabCurriculum[key];
              const isSelected = activeTab === key;

              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full text-left p-4 rounded-2xl font-bold text-base transition-all flex items-center justify-between ${isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-[#1a3a8a] text-white shadow-lg border border-blue-400/30'
                    : 'bg-[#10153f]/40 hover:bg-[#10153f]/80 text-gray-400 hover:text-gray-200 border border-white/5'
                    }`}
                >
                  <span>{item.title}</span>
                  <Star className={`w-4 h-4 ${isSelected ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* 🐻 Mascot Character Footer with Floating Main-Area Bubble */}
        <div className="mt-auto flex flex-col items-center pt-6 pb-20 border-t border-blue-500/10 relative">
          {/* Circular Frame - Back to Large & Bold */}
          <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center relative shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-[#090d2a]/80 backdrop-blur-md border border-blue-500/30 transition-all duration-300 hover:scale-105 z-10">
            <img
              src="/images/characters/듬이.png"
              alt="듬이 대장"
              className="w-24 h-24 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E";
              }}
            />
          </div>

          {/* Message Bubble - Absolute Position Floating into Main Map Area */}
          <div className="absolute left-[calc(100%+36px)] bottom-30 bg-[#10153f]/95 backdrop-blur-md rounded-2xl py-3.5 px-5 border border-blue-500/25 w-[260px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] transform transition-all z-50">
            {/* Speech Bubble Tail/Pointer */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-2.5 w-0 h-0 border-y-[8px] border-y-transparent border-r-[10px] border-r-[#10153f] opacity-95"></div>

            <p className="text-sm text-blue-300 font-bold mb-1.5 tracking-wider">🐻 듬이 탐정 대장</p>
            <p className="text-sm font-bold leading-relaxed text-gray-200 tracking-tight">
              "{
                activeTab === 'understanding' ? "인공지능이 우리 곁에 어떻게 숨어 있는지 함께 파헤쳐 보자!" :
                  activeTab === 'thinking' ? "진짜와 가짜를 구별하는 인공지능 탐정의 날카로운 눈이 필요해!" :
                    activeTab === 'ethics' ? "인공지능을 대하는 우리의 멋진 태도를 보여줄 차례야, 출발!" :
                      activeTab === 'creativity' ? "너의 상상력을 마음껏 발휘해서 미래의 지도를 완성해 줘!" :
                        `${tabCurriculum[activeTab].title} 단계에 어서 와!`
              }"
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 CENTRAL SPACE STATION PANEL */}
      <div className="flex-1 flex flex-col relative overflow-hidden">

        {/* TOP STATUS BAR */}
        <div className="h-16 border-b border-blue-500/10 bg-[#060921]/90 flex items-center justify-between px-8 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
            <span>🛰️ 본부 통신망: 가동 중</span>
            <span className="text-cyan-400">추천 코스: {
              recommendedLevel === 2 ? '사고력 별' :
                recommendedLevel === 3 ? '윤리의 별' :
                  recommendedLevel === 4 ? '창의의 별' : '이해의 별'
            }</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            {/* 1. 배지 수집함 */}
            <button
              onClick={() => {
                setIsBadgeOpen(true);
                localStorage.removeItem('new_badge_available');
                setHasNewBadge(false);
              }}
              className="bg-[#a855f7]/15 hover:bg-[#a855f7]/25 border border-purple-500/20 px-4 py-2 rounded-xl text-xs font-black text-purple-300 hover:text-purple-200 transition-all flex items-center gap-1.5 cursor-pointer relative"
            >
              {hasNewBadge && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500 border border-white/20 shadow-[0_0_8px_rgba(236,72,153,0.6)]"></span>
                </span>
              )}
              <Award className="w-4 h-4 text-purple-400" />
              배지 수집함
            </button>

            <span className="text-blue-500/30">|</span>

            {/* 2. 학습 안내 */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-gray-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              학습 안내
            </button>

            <span className="text-blue-500/30">|</span>

            {/* 3. 진단평가 결과 */}
            <button
              onClick={() => navigate('/space-detective/diagnostic-result')}
              className="text-gray-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              진단평가 결과
            </button>
          </div>
        </div>

        {/* COCKPIT MAP WITH FLOATING LESSON STARS */}
        <div
          className="flex-1 bg-cover bg-center relative overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent flex flex-col justify-end"
          style={{ backgroundImage: "linear-gradient(to bottom, rgba(5,6,26,0.3), rgba(5,6,26,0.5)), url('/images/backgrounds/BG_Universe_Peace.png')" }}
        >
          {/* Scrollable Map Inner Container - Spacious width prevents ANY overlapping */}
          <div className="w-[1500px] md:w-[1700px] h-full relative flex-shrink-0">
            {/* Floating Magenta Lesson Stars */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-0 pointer-events-none"
              >
                {/* ✨ Cosmic Constellation Dotted Path connecting the stars */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d={tabCurriculum[activeTab].classes.reduce((acc, cls, idx) => {
                      const x = parseFloat(cls.left);
                      const y = parseFloat(cls.top);
                      if (idx === 0) return `M ${x} ${y}`;
                      return `${acc} L ${x} ${y}`;
                    }, "")}
                    fill="transparent"
                    stroke="url(#constellationGradient)"
                    strokeWidth="0.4"
                    strokeDasharray="1.5,1.5"
                    className="transition-all duration-1000 ease-in-out animate-pulse"
                  />
                  <defs>
                    <linearGradient id="constellationGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>
                </svg>

                {tabCurriculum[activeTab].classes.map((cls, idx) => {
                  const isCompleted = localStorage.getItem(`mission_completed_${cls.id}`) === 'true' || cls.status === '완료';
                  const compDate = localStorage.getItem(`mission_completed_date_${cls.id}`) || '2026-05-06';
                  
                  // Check if this is the final exam and all regular lessons are done
                  const regularClasses = tabCurriculum[activeTab].classes.filter(c => !c.isFinal);
                  const allRegularCompleted = regularClasses.every(c => localStorage.getItem(`mission_completed_${c.id}`) === 'true' || c.status === '완료');
                  const isLocked = cls.isFinal && !allRegularCompleted;

                  return (
                    <button
                      key={cls.id}
                      onClick={() => {
                        if (cls.isFinal) {
                          if (isLocked) {
                            alert("🕵️‍♂️ 탐정님, 모든 차시 미션을 해결해야 최종 관문이 열립니다! (🔒)");
                            return;
                          }
                          if (activeTab === 'thinking') {
                            navigate('/space-detective/assessment');
                          } else {
                            alert("🚧 현재 MVP 버전에서는 '사고력 별' 단원평가만 플레이할 수 있습니다!");
                          }
                          return;
                        }
                        if (cls.id === 6) {
                          navigate('/space-detective/learning');
                        } else {
                          setDummyModalClass(cls);
                        }
                      }}
                      className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10 ${isLocked ? 'opacity-50' : 'opacity-100'}`}
                      style={{ top: cls.top, left: cls.left }}
                    >
                      {/* Compact Gorgeous Star Container - Bigger for Final! */}
                      <div className={`relative flex items-center justify-center transition-transform duration-300 ${isLocked ? '' : 'group-hover:scale-110'} ${cls.isFinal ? 'w-32 h-32' : 'w-24 h-24 md:w-28 md:h-28'}`}>
                        {isLocked && (
                          <div className="absolute z-20 bg-black/60 p-2 rounded-full border border-white/20 backdrop-blur-sm">
                            <X className="w-6 h-6 text-gray-400" /> {/* Lock indicator alternative: X or similar, fallback to X from react-lucide */}
                          </div>
                        )}
                        {/* SVG star in the background */}
                        <svg
                          viewBox="0 0 24 24"
                          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible filter drop-shadow-[0_4px_8px_rgba(5,6,26,0.5)]"
                        >
                          <defs>
                            {/* 3D Gold Gradient */}
                            <linearGradient id={`goldGrad-${cls.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#fffbeb" />
                              <stop offset="50%" stopColor="#fbbf24" />
                              <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                            {/* 3D Blue Gradient */}
                            <linearGradient id={`blueGrad-${cls.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#f0f9ff" />
                              <stop offset="50%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                          </defs>

                          {/* Sharp thin stroke and shiny gradient fill */}
                          <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            fill={isCompleted ? `url(#blueGrad-${cls.id})` : `url(#goldGrad-${cls.id})`}
                            stroke={isCompleted ? '#2563eb' : '#fbbf24'}
                            strokeWidth="1.2"
                            strokeLinejoin="round"
                            className={`transition-all duration-300 ${isCompleted
                              ? 'drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]'
                              : 'drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]'
                              }`}
                          />
                        </svg>

                        <span className={`font-black tracking-tight z-10 select-none flex items-center justify-center ${isCompleted ? 'text-white' : 'text-amber-950'} ${cls.isFinal ? 'text-xl' : 'text-sm md:text-base'}`}>
                          {cls.isFinal ? (
                            <Award className={`w-8 h-8 mb-1 ${isCompleted ? 'text-blue-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-amber-900 opacity-80'}`} />
                          ) : cls.id}
                        </span>
                      </div>

                      {/* Elegant Semi-transparent Rounded Capsule for Title & Status */}
                      <div className={`mt-2.5 px-5 py-3.5 rounded-2xl backdrop-blur-md border shadow-xl max-w-[180px] md:max-w-[190px] text-center flex flex-col items-center gap-1.5 transition-all duration-300 ${isCompleted
                        ? 'bg-[#0f1d4a]/85 border-blue-500/30 text-blue-100 group-hover:bg-[#152763]/90'
                        : 'bg-[#0c0f24]/85 border-blue-500/10 text-gray-200 group-hover:bg-[#121636]/90 group-hover:border-blue-400/30'
                        }`}>
                        <p className="font-extrabold text-xs md:text-sm leading-snug tracking-tight whitespace-pre-line break-keep w-full">
                          {cls.title}
                        </p>
                        <div className={`text-[10px] md:text-[11px] font-bold opacity-80 flex items-center justify-center gap-1 whitespace-nowrap ${isCompleted ? 'text-blue-200' : 'text-gray-400'}`}>
                          <span className="flex-shrink-0">학습일</span>
                          <span className={`w-[64px] tabular-nums ${isCompleted ? 'text-left' : 'text-center'}`}>{isCompleted ? compDate : '-'}</span>
                        </div>
                      </div>

                      {/* 🚀 Dedicated, Glowing CTA Button Outside the Capsule */}
                      <div className={`mt-2 px-4 py-1.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md ${isCompleted
                        ? 'bg-gradient-to-r from-blue-600/90 to-blue-500/95 text-white border border-blue-400/30 group-hover:scale-105 shadow-[0_4px_10px_rgba(37,99,235,0.25)]'
                        : 'bg-gradient-to-r from-[#fbbf24]/90 to-[#f59e0b]/95 text-amber-950 border border-yellow-300/30 group-hover:scale-105 shadow-[0_4px_10px_rgba(245,158,11,0.25)]'
                        }`}>
                        <span>
                          {cls.isFinal 
                            ? (isLocked ? '🔒 잠김' : '🏆 도전하기') 
                            : (isCompleted ? '🔄 복습하기' : '✏️ 학습하기')
                          }
                        </span>
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MODAL OVERLAYS */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <BadgeCollection isOpen={isBadgeOpen} onClose={() => setIsBadgeOpen(false)} />

      {/* 시연용 가짜 모달 (Dummy Modal) */}
      <AnimatePresence>
        {dummyModalClass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative shadow-2xl border border-blue-100 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-blue-500 ml-1" />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1">{dummyModalClass.id}차시 영상 학습</h3>
              <p className="text-slate-500 text-sm font-semibold mb-6">
                현재 샘플 버전에서는 콘텐츠가 재생 중이라고 가정합니다.
                <br /><span className="text-blue-500 mt-2 block">(창을 닫으면 배지가 즉시 획득됩니다!)</span>
              </p>

              <button
                onClick={() => {
                  // 창을 닫는 순간 즉시 완료 처리!
                  const todayStr = new Date().toISOString().split('T')[0];
                  localStorage.setItem(`mission_completed_${dummyModalClass.id}`, 'true');
                  localStorage.setItem(`mission_completed_date_${dummyModalClass.id}`, todayStr);

                  // 🔔 새 배지 알림 활성화!
                  localStorage.setItem('new_badge_available', 'true');
                  setHasNewBadge(true);

                  setDummyModalClass(null);
                }}
                className="w-full bg-slate-800 text-white font-black py-3.5 rounded-xl hover:bg-slate-700 transition-colors shadow-md shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> 학습 창 닫기 (완료 처리)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLobby;
