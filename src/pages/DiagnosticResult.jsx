import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, FileText, Star, Award, Layers } from 'lucide-react';

const DiagnosticResult = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [hoveredQuadrant, setHoveredQuadrant] = useState(null);
  const [oathCompleted, setOathCompleted] = useState(() => localStorage.getItem('detective_oath_signed') === 'true');

  const quadrantInfo = {
    q1: {
      title: "AI 마스터 탐정",
      desc: "지식(개념)도 최고고, 비판적 팩트체크 실력도 최고인 완벽한 에이스 탐정님이에요! 인공지능이 어떻게 생각하는지 완전히 꿰뚫어 보고 있어요!",
      img: "/images/characters/듬이(자신감).png",
      color: "#906df4",
      bgClass: "bg-[#906df4]/95 text-white border-[#906df4]/50 shadow-[0_8px_30px_rgba(144,109,244,0.5)] backdrop-blur-sm"
    },
    q2: {
      title: "신중한 직관파 탐정",
      desc: "날카로운 눈썰미로 인공지능의 오류나 가짜 정보를 찾아내는 비판적 능력이 뛰어나요! 이제 인공지능 지식만 살짝 더 채우면 무적의 마스터 탐정이 돼요!",
      img: "/images/characters/냥이.png",
      color: "#00c5d6",
      bgClass: "bg-[#00c5d6]/95 text-white border-[#00c5d6]/50 shadow-[0_8px_30px_rgba(0,197,214,0.5)] backdrop-blur-sm"
    },
    q3: {
      title: "새내기 견습 탐정",
      desc: "우주탐정단에 갓 들어와 호기심이 몽실몽실 자라는 견습 탐정님이에요! 앞으로 대원들과 차근차근 재미있게 공부하며 무럭무럭 성장해 봐요!",
      img: "/images/characters/토리.png",
      color: "#6b7280",
      bgClass: "bg-gray-800/95 text-white border-gray-600/50 shadow-[0_8px_30px_rgba(107,114,128,0.5)] backdrop-blur-sm"
    },
    q4: {
      title: "이론파 돋보기 탐정",
      desc: "인공지능 개념과 이론 지식은 아주 최고지만, 인공지능이 그럴듯하게 거짓말하는 오류(할루시네이션)를 가려내는 비판적 팩트체크 연습이 더 필요해요!",
      img: "/images/characters/듬이(돋보기).png",
      color: "#e26212",
      bgClass: "bg-[#e26212]/95 text-white border-[#e26212]/50 shadow-[0_8px_30px_rgba(226,98,18,0.5)] backdrop-blur-sm"
    }
  };

  useEffect(() => {
    const rawResults = localStorage.getItem('diagnostic_results');
    if (rawResults) {
      setResults(JSON.parse(rawResults));
    } else {
      // Fallback if no diagnostic results exist
      const fallback = {
        conceptScore: 9,
        criticalScore: 9,
        isConceptHigh: true,
        isCriticalHigh: true,
        detectiveType: "AI 마스터 탐정 👑",
        recommendedLevel: 3,
        recommendedPath: "윤리의 별",
        hasConceptWeakness: false,
        hasCriticalWeakness: false,
        answersList: { K1: true, K2: true, K3: true, K4: true, K5: true, A1: true, A2: true, A3: true, A4: true, A5: true },
        questions: []
      };
      setResults(fallback);
    }
  }, []);

  if (!results) return null;

  const {
    conceptScore,
    criticalScore,
    isConceptHigh,
    isCriticalHigh,
    detectiveType,
    recommendedLevel,
    recommendedPath,
    hasConceptWeakness,
    hasCriticalWeakness,
    answersList
  } = results;

  const totalScore = conceptScore + criticalScore;

  // 🧭 Dynamic Description Generator based on results
  const getDescriptionAndRecommendation = () => {
    let description = "";
    let subRecommendation = "";

    const path = recommendedPath || "이해의 별";

    if (path.includes("이해")) {
      description = `${detectiveType}인 밀크티 탐정님은 인공지능이 어떻게 생각하고 움직이는지 원리를 배우면 훨씬 더 멋진 분석을 할 수 있어요! 추천하는 '이해의 별' 코스를 통해 인공지능이 스스로 공부하고 결정하는 원리를 아주 쉽고 재미있게 배워 보세요!`;
      subRecommendation = `※ 추천하는 다음 학습 코스는 [이해의 별 1차시: 인공지능이 뭐예요? 우리 곁에도 있나요?]예요. 꼭 함께해 봐요!`;
    } else if (path.includes("비판력") || path.includes("사고력") || path.includes("사고")) {
      description = `${detectiveType}인 밀크티 탐정님은 인공지능을 아주 잘 알고 있지만, 가끔 인공지능이 알려주는 그럴듯한 거짓말이나 한쪽으로 치우친 생각을 똑똑하게 구별해내는 연습이 필요해요. '비판력의 별' 코스를 통해 진짜와 가짜 정보를 콕 집어내는 멋진 탐정의 실력을 키워 보세요!`;
      subRecommendation = `※ 추천하는 다음 학습 코스는 [비판력 별 6차시: 인공지능의 자신 있는 거짓말]예요. 날카로운 눈으로 가려내 봐요!`;
    } else if (path.includes("윤리")) {
      description = `${detectiveType}인 밀크티 탐정님은 이미 인공지능에 대해 아주 잘 알고, 생각도 깊은 훌륭한 탐정님이에요! 뛰어난 실력을 가진 탐정님을 위해, 인공지능을 쓸 때 꼭 지켜야 할 저작권이나 개인정보 보호에 대해 배우는 '윤리의 별' 코스를 추천해요!`;
      subRecommendation = `※ 추천하는 다음 학습 코스는 [윤리의 별 12차시: 내 데이터는 어디로 갈까요?]예요. 착하고 정직한 AI 활용법을 배워 봐요!`;
    } else {
      description = `${detectiveType}인 밀크티 탐정님은 문제를 모두 맞힌 대단한 천재 탐정님이에요! 이 기세를 몰아, 인공지능에게 똑똑하게 질문하고 명령을 내리는 마법의 열쇠인 '프롬프트'를 직접 만들고 꾸며보는 '창의의 별' 미션에 도전해 보세요!`;
      subRecommendation = `※ 추천하는 다음 학습 코스는 [창의의 별 18차시: 인공지능에게 말 거는 법을 배워요]예요. 나만의 멋진 명령어를 만들어 봐요!`;
    }

    return { description, subRecommendation };
  };

  const { description, subRecommendation } = getDescriptionAndRecommendation();

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = days[today.getDay()];
    return `${year}-${month}-${date} (${day})`;
  };

  // 📈 Calculate actual correct percentages based on real answersList
  const correctConceptCount = [1, 2, 3, 4, 5].filter(num => answersList[`K${num}`] === true).length;
  const actualConceptPct = Math.round((correctConceptCount / 5) * 100);

  const correctCriticalCount = [1, 2, 3, 4, 5].filter(num => answersList[`A${num}`] === true).length;
  const actualCriticalPct = Math.round((correctCriticalCount / 5) * 100);

  // 🧭 Dynamic recommended lesson mapping for student checklist
  const getRecommendedLessonInfo = () => {
    const path = recommendedPath || "이해의 별";
    if (path.includes("이해")) {
      return { id: 1, title: "이해의 별 1차시", url: "/space-detective/dashboard", tab: "understanding" };
    } else if (path.includes("비판") || path.includes("사고")) {
      return { id: 6, title: "사고력 별 6차시", url: "/space-detective/learning", tab: "thinking" };
    } else if (path.includes("윤리")) {
      return { id: 12, title: "윤리의 별 12차시", url: "/space-detective/dashboard", tab: "ethics" };
    } else {
      return { id: 18, title: "창의의 별 18차시", url: "/space-detective/dashboard", tab: "creativity" };
    }
  };
  const recLesson = getRecommendedLessonInfo();

  const isMission1Completed = localStorage.getItem(`mission_completed_${recLesson.id}`) === 'true';
  const isMission2Completed = localStorage.getItem('badge_collection_opened') === 'true';

  const tableQuestions = [
    { num: 1, type: 'AI 개념', colorClass: 'bg-[#f0ebff] text-[#906df4]', target: 'AI가 데이터를 기반으로 스스로 판단한다는 핵심 개념을 아는지 확인', rate: '94%', key: 'K1' },
    { num: 2, type: 'AI 개념', colorClass: 'bg-[#f0ebff] text-[#906df4]', target: '기계학습(머신러닝)이라는 교과서 용어를 아는지 확인', rate: '93%', key: 'K2' },
    { num: 3, type: 'AI 개념', colorClass: 'bg-[#f0ebff] text-[#906df4]', target: '학습 데이터가 편향되면 결과도 편향된다는 인과관계를 이해하는지 확인', rate: '87%', key: 'K3' },
    { num: 4, type: 'AI 개념', colorClass: 'bg-[#f0ebff] text-[#906df4]', target: 'AI가 사실 확인 없이 그럴듯한 답을 만들어내는 오류 원리를 이해하는지 확인', rate: '72%', key: 'K4' },
    { num: 5, type: 'AI 개념', colorClass: 'bg-[#f0ebff] text-[#906df4]', target: 'AI가 스스로 검토하는 주체가 아니라는 원리를 이해하는지 확인', rate: '61%', key: 'K5' },
    { num: 6, type: '비판적 사고', colorClass: 'bg-[#e3fcfc] text-[#00a8b5]', target: '팩트체크라는 기본 행동 방향을 아는지 확인', rate: '93%', key: 'A1' },
    { num: 7, type: '비판적 사고', colorClass: 'bg-[#e3fcfc] text-[#00a8b5]', target: 'AI 과잉 의존의 핵심 문제가 학습 기회 손실임을 아는지 확인', rate: '89%', key: 'A2' },
    { num: 8, type: '비판적 사고', colorClass: 'bg-[#e3fcfc] text-[#00a8b5]', target: 'AI로 만든 가짜 영상이 존재한다는 것을 알고 확인하는 행동을 선택할 수 있는지 확인', rate: '81%', key: 'A3' },
    { num: 9, type: '비판적 사고', colorClass: 'bg-[#e3fcfc] text-[#00a8b5]', target: '저작권과 출처 표기라는 윤리 행동을 아는지 확인', rate: '87%', key: 'A4' },
    { num: 10, type: '비판적 사고', colorClass: 'bg-[#e3fcfc] text-[#00a8b5]', target: '데이터 편향의 결과를 상황에서 파악하고 올바른 해결 방향을 선택할 수 있는지 확인', rate: '68%', key: 'A5' },
  ];

  return (
    <div className="w-full h-full bg-[#f4f5f8] text-gray-800 select-none overflow-x-hidden overflow-y-auto relative font-sans">

      {/* 🟦 TOP HEADER BANNER (Real MilkT Deep Blue-to-Purple Gradient) */}
      <div className="w-full bg-gradient-to-r from-[#101b5a] via-[#1c3a96] to-[#7f1fa6] text-white py-10 px-6 md:px-12 relative overflow-hidden shadow-lg">
        {/* Floating background star particles */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full">
            <circle cx="150" cy="50" r="1.5" fill="white" />
            <circle cx="450" cy="180" r="2.5" fill="yellow" />
            <circle cx="850" cy="90" r="2" fill="white" />
            <circle cx="1050" cy="220" r="3" fill="cyan" />
          </svg>
        </div>

        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center justify-start gap-10 md:gap-20 relative z-10">

          {/* Left Contents */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-sm font-black tracking-wider text-[#00f0ff] uppercase">
              <span>🧬 밀크티 님의 AI 우주탐정단 진단평가 분석 결과</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-white">
              추천 학습 <span className="text-yellow-300">[AI 우주탐정단 {recommendedPath} 1차시]</span>
            </h1>
            <div className="flex items-center gap-4 text-sm font-bold text-gray-200 mt-1">
              <span>• 분석일 {getTodayDateString()}</span>
            </div>

            {/* Glowing neon teal description card */}
            <div className="border border-[#00f0ff]/50 rounded-2xl bg-black/25 p-5 mt-4 max-w-2xl relative shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <p className="text-base font-medium leading-relaxed text-gray-100">
                {description}
              </p>
              <span className="block text-[13px] font-bold text-[#00f0ff] mt-2.5">
                {subRecommendation}
              </span>
            </div>
          </div>

          {/* Right Mascot Robot & CTA button */}
          <div className="flex flex-col items-center gap-5 flex-shrink-0 md:mr-4">
            {/* Cute floating capsule robot */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center pointer-events-none"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl"></div>
              {/* Spaceship Mascot */}
              <img
                src="/images/characters/듬이.png"
                alt="듬이 탐정"
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,240,255,0.3)]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Ccircle cx='15' cy='9' r='2'/%3E%3C/svg%3E";
                }}
              />
            </motion.div>

            {/* White pill CTA button exactly like screenshot */}
            <button
              onClick={() => navigate('/space-detective/dashboard', { state: { activeTab: recLesson.tab } })}
              className="bg-white text-[#1c3a96] hover:bg-gray-100 hover:scale-105 px-9 py-4 rounded-full font-black text-base md:text-lg shadow-[0_10px_25px_rgba(255,255,255,0.25)] transition-all active:scale-95 flex items-center gap-2 border-2 border-white/40"
            >
              <span>추천 코스 학습하기</span>
              <span className="text-[#1c3a96] font-bold text-sm md:text-base">▶</span>
            </button>
          </div>

        </div>
      </div>

      {/* 🍦 LOWER BODY CONTENT (Real MilkT Soft Cream Canvas bg-[#f4f5f8]) */}
      <div className="max-w-[1240px] mx-auto px-6 py-8 flex flex-col gap-8 relative z-20">

        {/* SCORE ANALYSIS BLOCK */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-gray-800">점수 분석</h2>
              <span className="bg-[#906df4]/10 text-[#906df4] text-xs font-black px-2.5 py-1 rounded-md">
                내 총점: <strong className="font-extrabold">{totalScore}점</strong> (18점 만점)
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#906df4]"></span>내 점수
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#00c5d6]"></span>학년별 평균 점수(매일 자정마다 갱신)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left side: Comparative Bar Charts */}
            <div className="flex flex-col gap-6 bg-[#f8f9fc] p-6 rounded-2xl border border-gray-50 h-full">
              <h3 className="text-sm font-black text-gray-700">진단평가 영역별 점수 측정</h3>
              <div className="flex flex-col gap-5">

                {/* Bar 1: AI 개념 */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end text-sm font-bold text-gray-600">
                    <span className="text-sm font-black text-gray-800">AI 개념</span>
                    <div className="text-right flex flex-col gap-0.5 text-xs font-black">
                      <span className="text-[#906df4]">내 점수 {conceptScore}점</span>
                      <span className="text-[#00c5d6]">학년별 점수 6.2점</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-1.5">
                    {/* Row 1: 내 점수 */}
                    <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden p-[2px] relative shadow-inner">
                      <div
                        className="bg-[#906df4] h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-3 shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                        style={{ width: `${(conceptScore / 9) * 100}%` }}
                      >
                        <span className="text-[11px] text-white font-extrabold">{Math.round((conceptScore / 9) * 100)}%</span>
                      </div>
                    </div>
                    {/* Row 2: 학년별 점수 */}
                    <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden p-[2px] relative shadow-inner">
                      <div
                        className="bg-[#00c5d6] h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-3 shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                        style={{ width: `${(6.2 / 9) * 100}%` }}
                      >
                        <span className="text-[11px] text-white font-extrabold">68%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bar 2: 비판적 사고 */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end text-sm font-bold text-gray-600">
                    <span className="text-sm font-black text-gray-800">비판적 사고</span>
                    <div className="text-right flex flex-col gap-0.5 text-xs font-black">
                      <span className="text-[#906df4]">내 점수 {criticalScore}점</span>
                      <span className="text-[#00c5d6]">학년별 점수 5.4점</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-1.5">
                    {/* Row 1: 내 점수 */}
                    <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden p-[2px] relative shadow-inner">
                      <div
                        className="bg-[#906df4] h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-3 shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                        style={{ width: `${(criticalScore / 9) * 100}%` }}
                      >
                        <span className="text-[11px] text-white font-extrabold">{Math.round((criticalScore / 9) * 100)}%</span>
                      </div>
                    </div>
                    {/* Row 2: 학년별 점수 */}
                    <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden p-[2px] relative shadow-inner">
                      <div
                        className="bg-[#00c5d6] h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-3 shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
                        style={{ width: `${(5.4 / 9) * 100}%` }}
                      >
                        <span className="text-[11px] text-white font-extrabold">60%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: 2D Coordinates Grid Plot representing Computing Thinking */}
            <div className="flex flex-col justify-between gap-4 bg-[#f8f9fc] p-6 rounded-2xl border border-gray-50 h-full">
              <h3 className="text-sm font-black text-gray-700">우주 탐정 성향 분석 (Grid Map)</h3>

              {/* Interactive Quadrant Map Area */}
              <div className="relative aspect-square w-full max-w-[320px] mx-auto border-2 border-slate-200 rounded-xl bg-white flex flex-wrap shadow-sm overflow-hidden select-none">
                {/* Central axes */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 z-10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 z-10 pointer-events-none"></div>

                {/* Pulsing crosshair coordinate dot */}
                <div
                  className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center transition-all duration-1000 ease-out z-20 pointer-events-none"
                  style={{
                    left: `${15 + (conceptScore / 9) * 70}%`,
                    top: `${85 - (criticalScore / 9) * 70}%`
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-[#906df4] animate-ping opacity-55"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-white shadow-lg"></div>
                </div>

                {/* Grid Quadrants as 4 individual hoverable boxes */}
                {/* Q2: Top-Left (2사분면: 신중한 직관파 탐정) */}
                <div
                  onMouseEnter={() => setHoveredQuadrant('q2')}
                  onMouseLeave={() => setHoveredQuadrant(null)}
                  className="w-1/2 h-1/2 relative flex items-center justify-center p-3 cursor-pointer hover:bg-[#00c5d6]/5 transition-all"
                >
                  <span className="text-[15px] font-black text-[#00c5d6] bg-[#00c5d6]/5 px-2.5 py-1 rounded-md text-center">
                    신중한 직관파 탐정
                  </span>
                </div>

                {/* Q1: Top-Right (1사분면: AI 마스터 탐정) */}
                <div
                  onMouseEnter={() => setHoveredQuadrant('q1')}
                  onMouseLeave={() => setHoveredQuadrant(null)}
                  className="w-1/2 h-1/2 relative flex items-center justify-center p-3 cursor-pointer hover:bg-[#906df4]/5 transition-all"
                >
                  <span className="text-[15px] font-black text-[#906df4] bg-[#906df4]/5 px-2.5 py-1 rounded-md text-center">
                    AI 마스터 탐정
                  </span>
                </div>

                {/* Q3: Bottom-Left (3사분면: 새내기 견습 탐정) */}
                <div
                  onMouseEnter={() => setHoveredQuadrant('q3')}
                  onMouseLeave={() => setHoveredQuadrant(null)}
                  className="w-1/2 h-1/2 relative flex items-center justify-center p-3 cursor-pointer hover:bg-gray-500/5 transition-all"
                >
                  <span className="text-[15px] font-black text-gray-500 bg-gray-500/5 px-2.5 py-1 rounded-md text-center">
                    새내기 견습 탐정
                  </span>
                </div>

                {/* Q4: Bottom-Right (2사분면: 이론파 돋보기 탐정) */}
                <div
                  onMouseEnter={() => setHoveredQuadrant('q4')}
                  onMouseLeave={() => setHoveredQuadrant(null)}
                  className="w-1/2 h-1/2 relative flex items-center justify-center p-3 cursor-pointer hover:bg-[#e26212]/5 transition-all"
                >
                  <span className="text-[15px] font-black text-[#e26212] bg-[#e26212]/5 px-2.5 py-1 rounded-md text-center">
                    이론파 돋보기 탐정
                  </span>
                </div>

                {/* Axis Labels */}
                <span className="absolute right-2 top-[46%] text-[12px] text-gray-400 font-bold uppercase pointer-events-none z-10">개념 ▶</span>
                <span className="absolute left-[44%] top-2 text-[12px] text-gray-400 font-bold uppercase pointer-events-none z-10">▲ 비판</span>

                {/* Kid-friendly premium POPUP CARD OVERLAY directly on top of the hovered quadrant */}
                <AnimatePresence>
                  {hoveredQuadrant && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute inset-0 z-30 p-5 flex flex-col items-center justify-center gap-3 text-center border transition-all duration-300 pointer-events-none ${quadrantInfo[hoveredQuadrant].bgClass}`}
                    >
                      {/* Character Mascot Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 animate-bounce duration-[2000ms]">
                        <img
                          src={quadrantInfo[hoveredQuadrant].img}
                          alt="Mascot"
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                        />
                      </div>
                      {/* Content */}
                      <div className="flex flex-col gap-1 px-1">
                        <strong className="text-sm md:text-lg font-black tracking-wide block text-yellow-300">
                          {quadrantInfo[hoveredQuadrant].title}
                        </strong>
                        <p className="text-[12px] md:text-[12px] font-medium leading-relaxed text-gray-100">
                          {quadrantInfo[hoveredQuadrant].desc}
                        </p>
                      </div>
                      {/* Close hint */}
                      <span className="text-[10px] text-white/50 font-medium">마우스를 떼면 원래 그래프로 돌아와요</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sub hint below the grid */}
              <p className="text-[11px] font-bold text-gray-400 text-center mt-1 animate-pulse">
                <span>💡 사분면 지도의 각 칸에 마우스를 대면 멋진 탐정 카드와 설명이 짜잔 나타나요!</span>
              </p>
            </div>
          </div>
        </div>

        {/* 🕵️‍♂️ SECTION 3: 듬이 탐정의 특별 처방전 & 오늘의 미션 */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <div className="border-b border-gray-100 pb-4 flex justify-between items-end">
            <div>
              <h2 className="text-lg font-black text-gray-800">듬이 탐정의 특별 처방전 & 오늘의 미션 📝</h2>
              <p className="text-xs font-bold text-gray-400 mt-0.5">사분면 지도의 결과가 알쏭달쏭한 탐정님들을 위해 원인 분석과 도전 미션을 준비했어요.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Deumi's detailed prescription */}
            {(() => {
              const getQuadrantId = () => {
                if (isConceptHigh && isCriticalHigh) return 'q1';
                if (!isConceptHigh && isCriticalHigh) return 'q2';
                if (!isConceptHigh && !isCriticalHigh) return 'q3';
                return 'q4';
              };
              const quadId = getQuadrantId();
              const currentQuad = quadrantInfo[quadId];

              return (
                <div className="bg-[#f8f9fc] p-8 rounded-3xl border border-gray-50 flex flex-col items-center justify-center gap-6 shadow-inner text-center">
                  {/* Gentle Floating Motion replaces aggressive raw bounce */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0"
                  >
                    <img
                      src={currentQuad.img}
                      alt={currentQuad.title}
                      className="w-full h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.15)]"
                    />
                  </motion.div>

                  <div className="flex flex-col items-center gap-3 max-w-lg">
                    <span className="text-[14px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider text-white shadow-sm" style={{ backgroundColor: currentQuad.color }}>
                      나의 성향: {currentQuad.title}
                    </span>
                    <h3 className="text-lg font-black text-gray-800 mt-1">왜 이렇게 배정되었나요? 🤔</h3>
                    <p className="text-sm md:text-[13px] font-bold text-gray-600 leading-relaxed whitespace-pre-line text-left">
                      {quadId === 'q1' && "개념 지식과 비판적 팩트체크 능력이 모두 우주 최고 수준이에요!\n인공지능의 원리를 꿰뚫어 보고 가짜 정보에 속지 않는 완벽한 실력을 갖추었기 때문입니다."}
                      {quadId === 'q2' && "인공지능의 자신 있는 거짓말이나 오류를 날카롭게 짚어내는 생각의 눈은 아주 훌륭해요!\n다만, 인공지능이 데이터를 먹고 생각하는 원리와 기초 개념 지식을 조금 더 다진다면 실수가 전혀 없는 마스터 탐정이 될 수 있어요."}
                      {quadId === 'q3' && "우주탐정단에 갓 합류하여 호기심은 가득하지만, 아직 인공지능 핵심 개념이나 가짜 정보를 분별하는 능력이 자라나는 단계예요!\n듬이 탐정 및 대원들과 처음부터 하나씩 재밌게 공부하면 빠르게 성장할 수 있어요."}
                      {quadId === 'q4' && "인공지능 지식과 교과서 이론은 아주 척척박사처럼 잘 알고 있어요!\n다만, 인공지능이 알려주는 그럴듯한 오류나 편견을 팩트체크하여 걸러내는 '비판적 태도'가 조금 부족해요.\n생각하는 힘을 한 단계만 더 높여주면 최고의 마스터 탐정이 될 거예요."}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Right Column: Interactive Mission Checkbox list */}
            <div className="bg-[#fbf8f0] p-6 rounded-2xl border border-[#e26212]/10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#e26212] flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#e26212] fill-[#e26212]" />
                  오늘 완수해야 할 탐정 도전 과제!
                </h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Mission Item 1 */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between gap-3 shadow-sm hover:border-orange-100 transition-colors">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center font-extrabold text-xs transition-all ${isMission1Completed
                      ? 'border-[#10b981] bg-[#10b981] text-white'
                      : 'border-[#e26212] bg-orange-50 text-[#e26212]'
                      }`}>
                      ✓
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] md:text-[14px] font-black text-gray-800 truncate">{recLesson.title} 영상 보고 첫 배지 획득하기</span>
                      <span className="text-[11px] md:text-[12px] font-bold text-gray-400 mt-0.5">
                        {isMission1Completed ? "축하해요! 학습 완료 배지를 획득했어요 🎉" : `진행 상황: 미완료 (추천 코스: ${recLesson.title})`}
                      </span>
                    </div>
                  </div>
                  {isMission1Completed ? (
                    <span className="text-[11px] font-extrabold text-[#10b981] bg-[#10b981]/10 px-3 py-1.5 rounded-lg whitespace-nowrap">학습 완료 ✨</span>
                  ) : (
                    <button
                      onClick={() => navigate(recLesson.url, { state: { activeTab: recLesson.tab } })}
                      className="bg-[#e26212] hover:bg-[#c9530a] text-white font-extrabold text-[11px] px-3.5 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                    >
                      모험 떠나기 🚀
                    </button>
                  )}
                </div>

                {/* Mission Item 2 */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between gap-3 shadow-sm hover:border-orange-100 transition-colors">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center font-extrabold text-xs transition-all ${isMission2Completed
                      ? 'border-[#10b981] bg-[#10b981] text-white'
                      : 'border-[#e26212] bg-orange-50 text-[#e26212]'
                      }`}>
                      ✓
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] md:text-[14px] font-black text-gray-800">배지 수집함 열어보기</span>
                      <span className="text-[11px] md:text-[12px] font-bold text-gray-400 mt-0.5">
                        {isMission2Completed ? "배지 수집함을 열어 나의 멋진 배지들을 확인했어요! 🏆" : "모험을 완수하고 귀여운 배지를 채워봐요"}
                      </span>
                    </div>
                  </div>
                  {isMission2Completed ? (
                    <span className="text-[11px] font-extrabold text-[#10b981] bg-[#10b981]/10 px-3 py-1.5 rounded-lg whitespace-nowrap">확인 완료 👍</span>
                  ) : (
                    <button
                      onClick={() => {
                        localStorage.setItem('badge_collection_opened', 'true');
                        localStorage.setItem('open_badge_collection', 'true'); // triggers auto-open in lobby
                        navigate('/space-detective/dashboard');
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[11px] px-3.5 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                    >
                      배지함 보기 🏆
                    </button>
                  )}
                </div>

                {/* Mission Item 3 */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between gap-3 shadow-sm hover:border-orange-100 transition-colors">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center font-extrabold text-xs transition-all ${oathCompleted
                      ? 'border-[#10b981] bg-[#10b981] text-white'
                      : 'border-[#e26212] bg-orange-50 text-[#e26212]'
                      }`}>
                      ✓
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] md:text-[14px] font-black text-gray-800">오늘의 정직한 우주 탐정 선서하기</span>
                      <span className="text-[11px] md:text-[12px] font-bold text-gray-400 mt-0.5">
                        {oathCompleted ? "선서 완료! 자랑스러운 명예 우주 탐정대원 인증 ✍️" : "정직한 AI 사용을 약속하고 대원이 되어보세요!"}
                      </span>
                    </div>
                  </div>
                  {oathCompleted ? (
                    <span className="text-[11px] font-extrabold text-[#10b981] bg-[#10b981]/10 px-3 py-1.5 rounded-lg whitespace-nowrap">선서 완료 ✍️</span>
                  ) : (
                    <button
                      onClick={() => {
                        alert("📜 올바른 AI 활용을 다짐하는 우주 탐정 선서!\n\n\"나는 인공지능(AI)을 올바르고 정직하게 사용하며, 인공지능이 제공하는 정보의 팩트를 철저히 체크하여 가짜 거짓말에 속지 않는 자랑스러운 명예 우주 탐정이 될 것을 선서합니다!\"\n\n오늘부터 자랑스러운 우주 탐정단 정식 대원이 되신 것을 축하합니다! 🚀");
                        localStorage.setItem('detective_oath_signed', 'true');
                        setOathCompleted(true);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] px-3.5 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                    >
                      선서하기 📜
                    </button>
                  )}
                </div>
              </div>

              {/* Sub subtle reset link at the bottom of the column */}
              <div className="flex justify-end mt-1 border-t border-[#e26212]/5 pt-3">
                <button
                  onClick={() => {
                    if (window.confirm("진단평가를 처음부터 다시 받으시겠습니까?\n\n'확인'을 누르시면 임무 선택 화면으로 돌아갑니다.\n(새로운 진단평가를 완료하기 전까지 기존 결과가 유지됩니다.)")) {
                      navigate('/space-detective', { state: { openStartChoice: true } });
                    }
                  }}
                  className="text-[11px] text-gray-400 hover:text-red-500 font-bold underline flex items-center gap-1 transition-colors"
                >
                  진단평가 다시 하기 🔄
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 📝 SECTION 4: 문항별 분석 정오표 (Divided as requested) */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-black text-gray-800">문항별 분석</h2>
            <p className="text-xs font-bold text-gray-400 mt-0.5">각 문항별 평가 목표와 오답 패턴 분석 결과를 투명하게 확인해보세요.</p>
          </div>

          {/* Question by Question Table precisely styled matching tablet screenshots */}
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-inner mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fc] text-gray-500 text-sm font-black border-b border-gray-100">
                  <th className="p-4 text-center w-16">문항 번호</th>
                  <th className="p-4 w-32">평가 영역</th>
                  <th className="p-4 text-center w-24">채점 결과</th>
                  <th className="p-4 text-center w-24">평균 정답률</th>
                  <th className="p-4">문항별 진단 목표 요소</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                {tableQuestions.map((q) => {
                  const isCorrect = answersList[q.key] === true;
                  return (
                    <tr key={q.num} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-center text-gray-400 font-extrabold">{q.num}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full font-black text-[10px] uppercase shadow-sm ${q.colorClass}`}>
                          {q.type}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          {isCorrect ? (
                            <span className="text-lg font-black text-[#906df4]">O</span>
                          ) : (
                            <span className="text-lg font-black text-rose-500">X</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center text-gray-500 font-extrabold">{q.rate}</td>
                      <td className="p-4 text-gray-600 leading-normal">{q.target}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div >
  );
};

export default DiagnosticResult;
