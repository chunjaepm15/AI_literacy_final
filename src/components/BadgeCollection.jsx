import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, CheckCircle, Flame, Trophy, Star, Gift, Coins } from 'lucide-react';

const badgesData = [
  // 1파트: 이해의 별 (1~5차시)
  { id: 1, part: '이해의 별', key: 'understanding', name: 'AI 탐정 입문 배지', desc: '1차시 — 인공지능이 뭐예요?', img: '/images/badges/badge_01.png' },
  { id: 2, part: '이해의 별', key: 'understanding', name: '패턴 분석가 배지', desc: '2차시 — 인공지능은 어떻게 생각하나요?', img: '/images/badges/badge_02.png' },
  { id: 3, part: '이해의 별', key: 'understanding', name: 'AI 추리 마스터 배지', desc: '3차시 — 인공지능 답변에 숨겨진 비밀', img: '/images/badges/badge_03.png' },
  { id: 4, part: '이해의 별', key: 'understanding', name: '데이터 수집가 배지', desc: '4차시 — 세상의 모든 것은 데이터예요', img: '/images/badges/badge_04.png' },
  { id: 5, part: '이해의 별', key: 'understanding', name: '데이터 분석가 배지', desc: '5차시 — 인공지능은 데이터를 먹고 자라요', img: '/images/badges/badge_05.png' },

  // 2파트: 사고력 별 (6~11차시)
  { id: 6, part: '사고력 별', key: 'thinking', name: '팩트체커 배지', desc: '6차시 — 인공지능의 자신 있는 거짓말', img: '/images/badges/badge_06.png' },
  { id: 7, part: '사고력 별', key: 'thinking', name: '진실 감별사 배지', desc: '7차시 — 이 정보를 믿어도 될까요?', img: '/images/badges/badge_07.png' },
  { id: 8, part: '사고력 별', key: 'thinking', name: '정보 검증 탐정 배지', desc: '8차시 — 진짜일까요, 가짜일까요?', img: '/images/badges/badge_08.png' },
  { id: 9, part: '사고력 별', key: 'thinking', name: '편향 탐지자 배지', desc: '9차시 — 인공지능에도 편견이 있어요', img: '/images/badges/badge_09.png' },
  { id: 10, part: '사고력 별', key: 'thinking', name: '공정 수호자 배지', desc: "10차시 — 공정한 데이터 만들기", img: '/images/badges/badge_10.png' },
  { id: 11, part: '사고력 별', key: 'thinking', name: '올바른 선택 배지', desc: '11차시 — 인공지능 탐정의 올바른 선택', img: '/images/badges/badge_11.png' },

  // 3파트: 윤리의 별 (12~17차시)
  { id: 12, part: '윤리의 별', key: 'ethics', name: '정보 수호자 배지', desc: '12차시 — 내 데이터는 어디로 갈까요?', img: '/images/badges/badge_12.png' },
  { id: 13, part: '윤리의 별', key: 'ethics', name: '출처 탐정 배지', desc: '13차시 — 인공지능 결과물의 주인은 누구일까요?', img: '/images/badges/badge_13.png' },
  { id: 14, part: '윤리의 별', key: 'ethics', name: '정직한 용기 배지', desc: "14차시 — 정직한 인공지능", img: '/images/badges/badge_14.png' },
  { id: 15, part: '윤리의 별', key: 'ethics', name: '진실 방패 배지', desc: '15차시 — 가짜 정보의 확산을 막는 용기', img: '/images/badges/badge_15.png' },
  { id: 16, part: '윤리의 별', key: 'ethics', name: '디지털 시민 배지', desc: '16차시 — 세상을 바꾸는 선한 영향력', img: '/images/badges/badge_16.png' },
  { id: 17, part: '윤리의 별', key: 'ethics', name: '품격있는 탐정 배지', desc: '17차시 — 인공지능을 대하는 나의 품격', img: '/images/badges/badge_17.png' },

  // 4파트: 창의의 별 (18~24차시)
  { id: 18, part: '창의의 별', key: 'creativity', name: '질문 마법사 배지', desc: '18차시 — 인공지능에게 말 거는 법', img: '/images/badges/badge_18.png' },
  { id: 19, part: '창의의 별', key: 'creativity', name: '질문 설계자 배지', desc: '19차시 — 질문에 따라 결과가 달라지는 이유', img: '/images/badges/badge_19.png' },
  { id: 20, part: '창의의 별', key: 'creativity', name: '질문 마스터 배지', desc: '20차시 — 나만의 프롬프트 공식', img: '/images/badges/badge_20.png' },
  { id: 21, part: '창의의 별', key: 'creativity', name: '공감 요원 배지', desc: '21차시 — 인공지능도 못 하는 것', img: '/images/badges/badge_21.png' },
  { id: 22, part: '창의의 별', key: 'creativity', name: '미래 파일럿 배지', desc: '22차시 — 인공지능 프로젝트를 기획', img: '/images/badges/badge_22.png' },
  { id: 23, part: '창의의 별', key: 'creativity', name: '미래 직업 도전자 배지', desc: '23차시 — 변화하는 직업과 나의 꿈', img: '/images/badges/badge_23.png' },
  { id: 24, part: '창의의 별', key: 'creativity', name: '미래 하루 스케치 배지', desc: '24차시 — 10년 뒤 나의 하루', img: '/images/badges/badge_24.png' },
];

const categoryColors = {
  '이해의 별': 'text-blue-600 bg-blue-50 border-blue-200',
  '사고력 별': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '윤리의 별': 'text-violet-600 bg-violet-50 border-violet-200',
  '창의의 별': 'text-rose-600 bg-rose-50 border-rose-200',
};

const BadgeCollection = ({ isOpen, onClose }) => {
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [totalCups, setTotalCups] = useState(0);
  const [diagnosticDone, setDiagnosticDone] = useState(false);
  const [diagExchanged, setDiagExchanged] = useState(false);
  const [exchangedStarKeys, setExchangedStarKeys] = useState([]);

  // For nice float animations
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // 1. 뱃지 해금 현황
    const completedList = [];
    badgesData.forEach(badge => {
      if (localStorage.getItem(`mission_completed_${badge.id}`) === 'true') {
        completedList.push(badge.id);
      }
    });
    setUnlockedIds(completedList);

    // 2. 총 컵 개수
    const savedCups = parseInt(localStorage.getItem('total_cups') || '0', 10);
    setTotalCups(savedCups);

    // 3. 진단평가 참여 및 교환 현황
    setDiagnosticDone(!!localStorage.getItem('diagnostic_results'));
    setDiagExchanged(localStorage.getItem('cup_exchanged_diagnostic') === 'true');

    // 4. 단원별 교환 현황
    const stars = ['understanding', 'thinking', 'ethics', 'creativity'];
    const doneStars = stars.filter(key => localStorage.getItem(`cup_exchanged_${key}`) === 'true');
    setExchangedStarKeys(doneStars);

  }, [isOpen]);

  if (!isOpen) return null;

  // Helpers
  const updateCups = (addAmount) => {
    const newTotal = totalCups + addAmount;
    localStorage.setItem('total_cups', newTotal.toString());
    setTotalCups(newTotal);

    // 애니메이션 촉발
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleExchangeDiagnostic = () => {
    if (diagExchanged) return;
    localStorage.setItem('cup_exchanged_diagnostic', 'true');
    setDiagExchanged(true);
    updateCups(5);
    alert("🎁 진단평가 참여 보상으로 '5 CUP'을 획득했습니다!");
  };

  const handleExchangeStar = (starKey, potentialCups) => {
    if (exchangedStarKeys.includes(starKey)) return;

    localStorage.setItem(`cup_exchanged_${starKey}`, 'true');
    setExchangedStarKeys(prev => [...prev, starKey]);
    updateCups(potentialCups);

    alert(`🌟 축하합니다!\n단원 미션 완료 보상으로 '${potentialCups} CUP'을 획득했습니다!`);
  };

  const getUnitAssessmentStatus = (starKey) => {
    const isDone = localStorage.getItem(`unit_assessment_${starKey}_completed`) === 'true' ||
      (starKey !== 'thinking' && localStorage.getItem(`mission_completed_final_${starKey === 'understanding' ? '1' : starKey === 'ethics' ? '3' : '4'}`) === 'true'); // Fallback mock
    const score = parseInt(localStorage.getItem(`unit_assessment_${starKey}_score`) || '0', 10);
    return { isDone, score };
  };

  // Data Processing
  const totalBadgesCount = badgesData.length;
  const unlockedCount = unlockedIds.length;
  const completionPct = Math.round((unlockedCount / totalBadgesCount) * 100);

  const groupedBadges = badgesData.reduce((acc, badge) => {
    if (!acc[badge.part]) acc[badge.part] = [];
    acc[badge.part].push(badge);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white text-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col relative font-sans max-h-[90vh] border border-slate-200"
        >

          {/* 🎇 CONFETTI ANIMATION OVERLAY */}
          {showConfetti && (
            <div className="absolute inset-0 z-[999] pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, x: `${Math.random() * 100}%`, rotate: 0 }}
                  animate={{ y: '100vh', rotate: 360 }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="absolute text-2xl"
                >
                  {['🏆', '🥛', '✨', '⭐'][i % 4]}
                </motion.div>
              ))}
            </div>
          )}

          {/* Header */}
          <div className="bg-slate-50 py-5 px-7 flex items-center justify-between border-b border-slate-200 relative">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2.5 rounded-2xl border border-indigo-200 shadow-sm">
                <Award className="w-7 h-7 text-indigo-600 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-800 block mb-0.5">나의 AI 탐정 배지 수집함</span>
                <span className="text-sm font-semibold text-slate-500">미션을 클리어하고 모은 배지를 CUP 보상으로 교환해 보세요!</span>
              </div>
            </div>

            {/* 💰 TOTAL CUPS WALLET CONTAINER */}
            <div className="flex items-center gap-3 mr-4">
              <motion.div
                animate={showConfetti ? { scale: [1, 1.2, 1] } : {}}
                className="flex items-center gap-2.5 bg-amber-50 border-2 border-amber-200 px-5 py-2.5 rounded-2xl shadow-[inset_0_2px_4px_rgba(251,191,36,0.1)]"
              >
                <div className="bg-amber-400 p-1.5 rounded-full shadow-md">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-amber-600 tracking-tight leading-none">MY CUP WALLET</span>
                  <span className="text-xl font-black text-slate-800 leading-tight tabular-nums">
                    {totalCups} <span className="text-sm font-bold text-slate-500 ml-0.5">CUP</span>
                  </span>
                </div>
              </motion.div>

              <button onClick={onClose} className="p-2.5 bg-white hover:bg-slate-100 rounded-full transition-colors border border-slate-200 shadow-sm ml-2">
                <X className="w-5 h-5 text-slate-500 hover:text-slate-700" />
              </button>
            </div>
          </div>

          {/* Global Progress Section */}
          <div className="bg-white py-4 px-8 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-6 justify-between shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-1.5 rounded-full">
                <Flame className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-base font-black text-slate-700">
                전체 수집 진행률: <span className="text-indigo-600">{unlockedCount}</span> / {totalBadgesCount}
              </span>
            </div>
            <div className="flex-1 max-w-lg w-full flex items-center gap-4">
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-[2px] border border-slate-200 relative shadow-inner">
                <div
                  className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${completionPct}%` }}
                >
                </div>
              </div>
              <span className="text-base font-black text-indigo-600 w-10 text-right">{completionPct}%</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-8 overflow-y-auto max-h-[60vh] bg-slate-50 custom-scrollbar flex flex-col gap-6">

            {/* 🎁 1. 진단평가 특별 보상 로우 (Diagnostic Reward Row) */}
            {diagnosticDone && (
              <div className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${diagExchanged
                ? 'bg-slate-100 border-slate-200 opacity-75'
                : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 shadow-md shadow-cyan-500/5'
                }`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl shadow-sm ${diagExchanged ? 'bg-slate-200 text-slate-500' : 'bg-cyan-100 text-cyan-600'}`}>
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-lg">진단평가 참여 보상 🎉</h4>
                    <p className="text-sm font-semibold text-slate-500">첫 AI 탐정 입문을 환영하는 특별 보너스 컵입니다.</p>
                  </div>
                </div>
                <button
                  onClick={handleExchangeDiagnostic}
                  disabled={diagExchanged}
                  className={`px-6 py-3 rounded-xl font-black text-base flex items-center gap-2 transition-all active:scale-95 ${diagExchanged
                      ? 'bg-white text-slate-400 border border-slate-200 cursor-default'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 animate-pulse hover:animate-none'
                    }`}
                >
                  {diagExchanged ? (
                    <><CheckCircle className="w-5 h-5" /> 교환 완료</>
                  ) : (
                    <><Coins className="w-5 h-5" /> 5 CUP 받기</>
                  )}
                </button>
              </div>
            )}

            {/* 2. 단원별 배지 및 일괄 교환 UI */}
            {Object.entries(groupedBadges).map(([partName, badges], index) => {
              const starKey = badges[0].key;
              const partUnlockedCount = badges.filter(b => unlockedIds.includes(b.id)).length;
              const isAllBadgesUnlocked = partUnlockedCount === badges.length;

              const assessment = getUnitAssessmentStatus(starKey);
              const isUnitAssessmentDone = assessment.isDone;

              // Calculate cup rewards explicitly per user logic
              const baseCupReward = badges.length * 3; // Lesson rewards
              const assessReward = isUnitAssessmentDone ? (assessment.score >= 80 ? 5 : 3) : 0;
              const potentialCups = baseCupReward + (isUnitAssessmentDone ? assessReward : 5); // Assume best if not done for UI projection, or total accumulated

              const canExchange = isAllBadgesUnlocked && isUnitAssessmentDone;
              const isExchanged = exchangedStarKeys.includes(starKey);

              return (
                <div key={partName} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col gap-5">
                  {/* Group Header + Exchange CTA */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1.5 rounded-xl text-sm font-black border shadow-sm ${categoryColors[partName]}`}>
                        {partName}
                      </div>
                      <span className="text-sm font-bold text-slate-500">
                        차시 배지 <span className="text-indigo-600">{partUnlockedCount}</span> / {badges.length}
                      </span>
                      <span className={`text-xs font-black px-2 py-1 rounded-lg ${isUnitAssessmentDone ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                        단원평가 {isUnitAssessmentDone ? '완료 🏆' : '미완료'}
                      </span>
                    </div>

                    {/* 💰 STAR BATCH EXCHANGE BUTTON */}
                    <button
                      onClick={() => handleExchangeStar(starKey, potentialCups)}
                      disabled={!canExchange || isExchanged}
                      className={`flex items-center justify-between gap-4 px-5 py-3 rounded-2xl font-black text-sm md:text-base transition-all shadow-md min-w-[180px] ${isExchanged
                          ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default shadow-none'
                          : canExchange
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-orange-500/30 hover:scale-[1.02] active:scale-95 animate-bounce-subtle'
                            : 'bg-white text-slate-400 border-2 border-dashed border-slate-200 cursor-not-allowed opacity-70'
                        }`}
                      style={canExchange && !isExchanged ? { animation: 'pulseGlow 2s infinite' } : {}}
                    >
                      <span className="flex items-center gap-2">
                        {isExchanged ? <CheckCircle className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                        {isExchanged ? '단원 보상 수령 완료' : '단원 컵 일괄 교환'}
                      </span>
                      {!isExchanged && (
                        <span className={`px-2.5 py-1 rounded-lg text-xs ${canExchange ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {potentialCups} CUP
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Group Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {badges.map((badge) => {
                      const isUnlocked = unlockedIds.includes(badge.id);
                      return (
                        <div
                          key={badge.id}
                          className={`rounded-2xl p-3 border flex flex-col items-center justify-center gap-2 relative transition-all aspect-square ${isUnlocked
                              ? 'bg-white border-indigo-200 shadow-sm hover:-translate-y-1'
                              : 'bg-slate-50/50 border-slate-200 opacity-60 grayscale'
                            }`}
                        >
                          <span className={`absolute top-1.5 left-1.5 text-[9px] font-black px-1.5 py-0.5 rounded-md z-20 ${isUnlocked ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                            {badge.id}차시
                          </span>

                          <div className="w-full h-full relative flex items-center justify-center p-1">
                            <img
                              src={badge.img}
                              alt={badge.name}
                              className="w-full h-full object-contain drop-shadow-sm"
                              onError={(e) => e.target.src = `/images/badges/badge_${String(badge.id).padStart(2, '0')}.png`}
                            />
                          </div>

                          {isUnlocked && (
                            <div className="absolute bottom-1.5 right-1.5 bg-emerald-500 rounded-full p-0.5 shadow-sm">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CSS Keyframes for Animations */}
          <style jsx>{`
            @keyframes pulseGlow {
              0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
              70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
              100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
            }
            .animate-bounce-subtle {
              animation: bounceSubtle 3s infinite;
            }
            @keyframes bounceSubtle {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
          `}</style>

          {/* Footer */}
          <div className="p-5 border-t border-slate-200 bg-white flex justify-between items-center rounded-b-3xl relative z-10">
            <div className="flex flex-col gap-1 text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5 text-amber-600"><Coins className="w-3.5 h-3.5" /> 컵(CUP) 적립 기준</span>
              <span>• 기본 보상: 각 차시 학습 완료 시 3 CUP</span>
              <span>• 단원평가 보상: 응시 완료 시 3 CUP (80점 이상 달성 시 추가 2 CUP 보너스!)</span>
            </div>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white font-black py-3 px-10 rounded-xl transition-all active:scale-95 text-sm shadow-md flex items-center gap-2"
            >
              수집함 닫기 🚀
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BadgeCollection;
