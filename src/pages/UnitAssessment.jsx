import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle, AlertCircle, Shield, Award, ArrowRight, Terminal, ArrowLeft } from 'lucide-react';

const quizData = [
  {
    id: 1,
    question: "다음 ( ) 안에 들어갈 알맞은 말을 고르세요.\n\n인공지능이 틀린 정보를 사실인 것처럼 자신 있게 말하는 현상을 ( )라고 합니다.",
    options: ["데이터 편향", "팩트체크", "AI 오류", "알고리즘"],
    correctIndex: 2
  },
  {
    id: 2,
    question: "다음 중 인공지능의 AI 오류에 대한 설명으로 틀린 것을 고르세요.",
    options: [
      "인공지능은 틀린 정보를 자신 있게 말할 수 있다",
      "인공지능이 자신 있게 말하면 항상 맞는 정보다",
      "인공지능은 확인하지 않고 그럴듯한 답을 만들어낼 수 있다",
      "인공지능의 답변은 다른 곳에서 확인해보는 것이 좋다"
    ],
    correctIndex: 1
  },
  {
    id: 3,
    passage: `수아: "AI한테 우리 학교 급식 메뉴 물어봤더니 오늘 피자래. 맞겠지?"\n태민: "AI는 실시간 정보를 모를 수 있어. 학교 홈페이지에서 확인해봐.”\n수아: "AI가 자신 있게 말했는데 왜 의심해?"`,
    question: "이 대화에서 올바른 판단을 하고 있는 사람과 그 이유를 바르게 짝지은 것을 고르세요.",
    options: [
      "수아 — AI가 자신 있게 말하면 맞을 가능성이 높다",
      "수아 — 급식 메뉴는 중요하지 않아서 확인할 필요 없다",
      "태민 — AI는 틀린 정보를 자신 있게 말할 수 있어서 확인이 필요하다",
      "태민 — AI는 항상 틀리기 때문에 절대 믿으면 안 된다"
    ],
    correctIndex: 2
  },
  {
    id: 4,
    question: "인공지능이 알려준 정보가 사실인지 여러 곳의 자료를 비교해서 확인하는 것을 무엇이라고 하나요?",
    options: ["데이터 학습", "알고리즘", "업데이트", "팩트체크"],
    correctIndex: 3
  },
  {
    id: 5,
    question: "인공지능 정보를 확인하는 올바른 방법과 그 이유를 바르게 짝지은 것을 고르세요.",
    options: [
      "같은 질문을 AI에게 한 번 더 한다 — AI가 두 번 같은 말을 하면 맞다",
      "교과서나 믿을 수 있는 자료에서 확인한다 — AI는 틀린 정보를 말할 수 있다",
      "조회수가 높은 자료를 찾는다 — 인기 있는 정보가 정확하다",
      "친구한테 물어본다 — 친구가 더 잘 알 수 있다"
    ],
    correctIndex: 1
  },
  {
    id: 6,
    passage: `지호: "AI가 독도는 일본 영토라고 했어."\n민서: "그거 이상한데. 뉴스랑 교과서에서 확인해봐야 해."\n지호: "아냐 AI가 맞다고 했어 얘 엄청 똑똑하단 말야."`,
    question: "지호의 생각에서 잘못된 부분을 찾아 고르세요.",
    options: [
      "독도에 대해 관심이 없다",
      "민서의 말을 무시해서 예의가 없다",
      "인공지능이 항상 정확하다고 믿어서 스스로 확인하려 하지 않는다",
      "뉴스보다 AI가 더 정확하다고 생각한다"
    ],
    correctIndex: 2
  },
  {
    id: 7,
    question: "다음 ( ) 안에 들어갈 알맞은 말을 고르세요.\n\n인공지능 기술로 실제처럼 보이는 가짜 영상이나 사진을 만드는 것을 ( ) 조작이라고 합니다.",
    options: ["데이터", "알고리즘", "AI 합성", "팩트체크"],
    correctIndex: 2
  },
  {
    id: 8,
    question: "다음 설명이 맞으면 O, 틀리면 X를 고르세요.\n\n\"인터넷에서 유명인이 나오는 영상은 모두 진짜이므로 믿어도 된다.\"",
    options: ["O", "X"],
    correctIndex: 1
  },
  {
    id: 9,
    question: "유명 가수가 이상한 말을 하는 영상이 인터넷에 퍼졌어요. 이때 가장 올바른 행동은 무엇인가요?",
    options: [
      "유명인이 나오니까 진짜라고 믿는다",
      "재미있으니까 친구들에게 바로 퍼뜨린다",
      "조회수가 높으니까 진짜라고 판단한다",
      "가짜 영상일 수 있으니 공식 채널에서 먼저 확인한다"
    ],
    correctIndex: 3
  },
  {
    id: 10,
    passage: `하은: "우리 선생님이 이상한 말 하는 영상이 단톡방에 올라왔어."\n준호: "그거 AI로 만든 가짜 영상일 수 있어. 퍼뜨리면 안 돼."\n하은: "진짜처럼 보이는데? 그냥 재미로 보는 거잖아."`,
    question: "준호가 퍼뜨리면 안 된다고 말한 이유로 가장 적절한 것을 고르세요.",
    options: [
      "선생님 영상은 봐서는 안 된다",
      "단톡방에 올리는 건 항상 나쁜 행동이다",
      "재미로 보는 것도 허용되지 않는다",
      "가짜 영상이 퍼지면 진짜처럼 오해되어 선생님이 피해를 입을 수 있다"
    ],
    correctIndex: 3
  },
  {
    id: 11,
    question: "인공지능에게 \"의사를 그려줘\"라고 했더니 항상 남성 이미지만 나왔어요. 이런 일이 생긴 이유는 무엇인가요?",
    options: [
      "인공지능이 여성을 싫어해서",
      "의사는 원래 남성이 많아서",
      "학습 데이터에 남성 의사 이미지가 훨씬 많았기 때문에",
      "인공지능이 그림을 잘 못 그려서"
    ],
    correctIndex: 2
  },
  {
    id: 12,
    question: "다음 중 데이터 편향에 대한 설명으로 틀린 것을 고르세요.",
    options: [
      "한쪽으로 치우친 데이터를 배우면 결과도 치우칠 수 있다",
      "인공지능은 스스로 편향을 발견하고 자동으로 고친다",
      "편향된 인공지능은 특정 집단에 불공정한 결과를 낼 수 있다",
      "공정한 결과를 위해서는 다양한 데이터가 필요하다"
    ],
    correctIndex: 1
  },
  {
    id: 13,
    passage: `세진: "AI가 우리 반에서 달리기를 제일 잘할 것 같은 사람으로 키 큰 애를 골랐어."\n나영: "그거 이상하지 않아? AI가 어떤 자료를 보고 판단한 걸까?"\n세진: "AI가 골랐으니까 공정한 거 아니야?"`,
    question: "나영이 이상하다고 생각한 이유로 가장 적절한 것을 고르세요.",
    options: [
      "AI는 달리기를 모른다",
      "키 큰 사람이 달리기를 잘하는 건 당연하다",
      "AI가 고른 결과는 항상 공정하다",
      "AI가 배운 자료가 한쪽으로 치우쳐 있으면 결과도 치우칠 수 있다"
    ],
    correctIndex: 3
  },
  {
    id: 14,
    question: "다음 ( ) 안에 들어갈 알맞은 말을 고르세요.\n\n인공지능이 특정 집단에 대한 정보가 지나치게 많거나 적어서 한쪽으로 치우친 결과를 내는 현상을 ( )이라고 합니다.",
    options: ["알고리즘 오작동", "시스템 오류", "데이터 편향", "네트워크 오류"],
    correctIndex: 2
  },
  {
    id: 15,
    question: "인공지능이 공정한 결과를 내려면 학습 데이터가 어떻게 구성되어야 하나요?",
    options: [
      "가장 많이 사용되는 데이터만 모은다",
      "최신 데이터만 사용한다",
      "다양한 집단과 상황을 골고루 포함해야 한다",
      "데이터의 양만 많으면 된다"
    ],
    correctIndex: 2
  },
  {
    id: 16,
    question: "편향된 인공지능을 고치는 방법과 그 이유를 바르게 짝지은 것을 고르세요.",
    options: [
      "인공지능 사용을 중단한다 — 편향된 AI는 쓸 수 없다",
      "인공지능의 속도를 높인다 — 빠를수록 정확해진다",
      "특정 집단 데이터를 더 추가한다 — 많을수록 좋다",
      "다양한 집단의 데이터를 골고루 추가한다 — 데이터가 다양해야 공정한 결과가 나온다"
    ],
    correctIndex: 3
  },
  {
    id: 17,
    passage: `현우: "AI가 외국인 얼굴을 잘 인식 못한대. 왜 그럴까?"\n소희: "아마 학습할 때 특정 나라 사람 사진만 많이 봤을 거야."\n현우: "그럼 어떻게 고치면 돼?"`,
    question: "소희의 말을 바탕으로 이 문제를 해결하는 방법으로 가장 적절한 것을 고르세요.",
    options: [
      "외국인 얼굴 인식 기능을 삭제한다",
      "인공지능을 새로 만든다",
      "특정 나라 사람 사진을 더 많이 추가한다",
      "다양한 나라 사람들의 얼굴 사진을 골고루 추가해서 다시 학습시킨다"
    ],
    correctIndex: 3
  },
  {
    id: 18,
    question: "다음 설명이 맞으면 O, 틀리면 X를 고르세요.\n\n\"인공지능이 써준 글을 숙제로 내는 것은 내가 직접 생각하고 배우는 기회를 없애는 행동이다.\"",
    options: ["O", "X"],
    correctIndex: 0
  },
  {
    id: 19,
    question: "다음 중 인공지능을 올바르게 활용하는 방법으로 틀린 것을 고르세요.",
    options: [
      "인공지능의 답변을 참고 자료로 활용한다",
      "내가 먼저 생각해보고 인공지능을 활용한다",
      "모든 답을 인공지능에게 맡기고 그대로 사용한다",
      "인공지능의 답변이 맞는지 확인하는 습관을 기른다"
    ],
    correctIndex: 2
  },
  {
    id: 20,
    passage: `민재: "나는 모르는 게 있으면 무조건 AI한테 먼저 물어봐. 훨씬 빠르잖아."\n유나: "나는 먼저 스스로 생각해보고 그래도 모르면 AI를 써."\n민재: "그게 왜 좋아? AI가 더 잘 아는데."`,
    question: "유나의 방식이 더 좋은 이유로 가장 적절한 것을 고르세요.",
    options: [
      "인공지능을 사용하는 건 나쁜 습관이라서",
      "빠른 것보다 느린 게 항상 좋기 때문에",
      "스스로 생각하는 과정이 쌓여야 판단력과 실력이 길러지기 때문에",
      "인공지능은 항상 틀리기 때문에"
    ],
    correctIndex: 2
  }
];

const UnitAssessment = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(new Array(quizData.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);

  const currentQuestion = quizData[currentIndex];

  const handleOptionSelect = (index) => {
    const updated = [...userAnswers];
    updated[currentIndex] = index;
    setUserAnswers(updated);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (userAnswers[currentIndex] === null) return;

    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate final stats and store
      const correctCount = quizData.filter((q, i) => userAnswers[i] === q.correctIndex).length;
      const scorePct = Math.round((correctCount / quizData.length) * 100);
      
      localStorage.setItem('unit_assessment_thinking_completed', 'true');
      localStorage.setItem('unit_assessment_thinking_score', scorePct.toString());
      localStorage.setItem('mission_completed_final_2', 'true'); // For consistency with UI
      
      setIsFinished(true);
    }
  };

  // ⏩ Demo Shortcut: Immediately bypass assessment for showcase (w/ 3 intentional errors)
  const handleSkipDemo = () => {
    if (!window.confirm("시연용 기능: 대부분의 문항을 정답 처리(3개 오답 포함)하고 즉시 최종 결과 화면으로 넘어가겠습니까?")) return;
    
    const demoAnswers = quizData.map((q, idx) => {
      // Intentionally fail indices 2, 8, and 15 to showcase the incorrect answers review list
      if (idx === 2 || idx === 8 || idx === 15) {
        return (q.correctIndex + 1) % q.options.length;
      }
      return q.correctIndex;
    });
    setUserAnswers(demoAnswers);

    const correctCount = quizData.filter((q, i) => demoAnswers[i] === q.correctIndex).length;
    const scorePct = Math.round((correctCount / quizData.length) * 100);
    
    localStorage.setItem('unit_assessment_thinking_completed', 'true');
    localStorage.setItem('unit_assessment_thinking_score', scorePct.toString());
    localStorage.setItem('mission_completed_final_2', 'true'); 
    
    setIsFinished(true);
  };

  // Final View Logic
  const correctCount = quizData.filter((q, i) => userAnswers[i] === q.correctIndex).length;
  const incorrectList = quizData
    .map((q, i) => ({ 
      data: q, 
      selected: userAnswers[i], 
      isCorrect: userAnswers[i] === q.correctIndex 
    }))
    .filter(ans => !ans.isCorrect);

  if (isFinished) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#05061a] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 0.8, y: 0 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="relative z-10 bg-white backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-10 max-w-4xl w-full text-center shadow-[0_30px_80px_rgba(0,0,0,0.3)] origin-center overflow-hidden"
        >
          {/* Top Abstract Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none"></div>

          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-[#1a3a8a] rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10"
          >
            <Award className="w-12 h-12 text-white drop-shadow-md" />
          </motion.div>

          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight relative z-10">🕵️‍♂️ AI 탐정 성장 리포트</h1>
          <p className="text-gray-500 font-bold mb-6 relative z-10">
            {correctCount === quizData.length
              ? "완벽합니다! 완벽한 탐지력으로 모든 사건을 해결했습니다."
              : "성실히 임무를 수행했습니다. 오늘의 과정이 더 큰 성장의 밑거름이 될 것입니다."}
          </p>

          {/* Summary Progress */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-8 flex items-center gap-6">
            <div className="flex flex-col items-start flex-1">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-black text-gray-400 tracking-widest">MISSION ACCOMPLISHED</span>
                <span className="text-[#1a3a8a] font-black text-lg">{Math.round((correctCount / quizData.length) * 100)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(correctCount / quizData.length) * 100}%` }}
                  transition={{ duration: 1.2, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-[#1a3a8a]"
                />
              </div>
            </div>
            <div className="h-12 w-[1px] bg-gray-200"></div>
            <div className="text-center pr-2">
              <p className="text-[10px] text-gray-400 font-bold mb-0.5">정답 문항</p>
              <p className="text-xl font-black text-gray-900"><span className="text-[#1a3a8a]">{correctCount}</span> / {quizData.length}</p>
            </div>
          </div>

          {/* 3 Detailed Feedback Pillars */}
          <div className="grid grid-cols-3 gap-6 mb-10 text-left">
            {/* Pillar 1 */}
            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex flex-col hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-3 text-blue-700">
                <div className="bg-white p-1.5 rounded-lg shadow-sm text-lg">📈</div>
                <h3 className="font-extrabold text-[16px]">과정과 노력</h3>
              </div>
              <p className="text-sm font-bold text-gray-600 leading-relaxed">
                끈기 있게 문제를 해결한 노력을 칭찬합니다! 스스로 생각하고 결론을 도출해 낸 준비 과정 자체가 큰 성장입니다.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl flex flex-col hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-3 text-orange-700">
                <div className="bg-white p-1.5 rounded-lg shadow-sm text-lg">🔍</div>
                <h3 className="font-extrabold text-[16px]">성장 인사이트</h3>
              </div>
              <p className="text-sm font-bold text-gray-600 leading-relaxed">
                틀린 문제는 개념 부족인지 단순 실수인지 점검해 보세요. 어느 단계에서 헷갈렸는지 되짚어보면 사고력이 강해집니다.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-green-50/50 border border-green-100 p-6 rounded-2xl flex flex-col hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-3 text-green-700">
                <div className="bg-white p-1.5 rounded-lg shadow-sm text-lg">🛠️</div>
                <h3 className="font-extrabold text-[16px]">액션 플랜</h3>
              </div>
              <p className="text-sm font-bold text-gray-600 leading-relaxed">
                틀린 문제만 다시 풀어보며 완벽한 이해를 확인해 보세요! 모르는 부분은 질문을 통해 하나씩 채워가면 충분합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 max-w-xl mx-auto relative z-10">
            {incorrectList.length > 0 && (
              <button
                onClick={() => setShowMistakes(true)}
                className="flex-1 bg-white border-2 border-[#1a3a8a] text-[#1a3a8a] font-bold py-4 rounded-xl hover:bg-[#1a3a8a]/5 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-[17px]"
              >
                🔍 오답 모아보기
              </button>
            )}
            <button
              onClick={() => navigate('/space-detective/dashboard', { state: { activeTab: 'thinking' } })}
              className={`flex-1 bg-[#1a3a8a] hover:bg-[#152c6b] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[#1a3a8a]/30 active:scale-95 flex items-center justify-center gap-2 text-[17px] group ${incorrectList.length === 0 ? 'max-w-md mx-auto w-full' : ''}`}
            >
              확인 및 로비 복귀 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Mistakes Review Overlay Modal */}
        <AnimatePresence>
          {showMistakes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-white/20"
              >
                {/* Modal Header */}
                <div className="bg-[#1a3a8a] p-6 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-black">오답 분석 및 복습</h2>
                      <p className="text-xs text-blue-200 font-bold opacity-90">틀린 문제의 핵심을 다시 한번 되짚어 보세요.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMistakes(false)}
                    className="bg-black/20 hover:bg-black/40 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                  >
                    닫기 ✕
                  </button>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">
                  {incorrectList.map((item, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                      {/* Question Section */}
                      <div className="p-5 border-b border-gray-100 bg-white">
                        <div className="inline-block px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-[11px] font-black mb-3 border border-red-100">
                          Question {item.data.id}
                        </div>
                        <h3 className="text-[16px] font-extrabold text-gray-900 leading-relaxed whitespace-pre-line">
                          {item.data.question}
                        </h3>
                      </div>

                      {/* Answers Analysis Section */}
                      <div className="p-5 flex flex-col sm:flex-row gap-4 bg-slate-50/50">
                        <div className="flex-1 bg-red-50/50 border border-red-100 rounded-xl p-4">
                          <p className="text-[11px] font-black text-red-500 mb-2 uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> 내가 선택한 답
                          </p>
                          <p className="text-[14px] font-bold text-gray-800 leading-snug">
                            {item.data.options[item.selected]}
                          </p>
                        </div>

                        <div className="flex items-center justify-center opacity-40 hidden sm:flex">
                          <ArrowRight className="text-gray-400" />
                        </div>

                        <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-4 relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-bl-lg">정답</div>
                          <p className="text-[11px] font-black text-emerald-600 mb-2 uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 올바른 정답
                          </p>
                          <p className="text-[14px] font-extrabold text-emerald-900 leading-snug">
                            {item.data.options[item.data.correctIndex]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#030412] relative overflow-hidden">
      {/* Dynamic subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,8,38,1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,8,38,1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>

      {/* Header Navigation */}
      <div className="relative z-10 bg-[#090d2a]/80 backdrop-blur-md border-b border-blue-500/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-0.5">
              <Shield className="w-3 h-3" />
              <span>FINAL MISSION</span>
            </div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">사고력 별 최종 단원평가</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* 🚀 Demo Skip Button */}
          <button 
            onClick={handleSkipDemo}
            className="bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-[11px] font-black px-3 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1 shadow-sm"
            title="시연용 즉시 통과"
          >
            ⏩ Skip Test
          </button>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-500 mb-1">진행 상태</span>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-blue-300">{currentIndex + 1}</span>
              <span className="text-gray-600 font-bold text-sm">/</span>
              <span className="text-gray-500 font-bold text-sm">{quizData.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className={`w-full mx-auto flex gap-8 items-stretch transform scale-[0.8] origin-center ${currentQuestion.passage ? 'flex-row max-w-6xl' : 'flex-col max-w-2xl'
              }`}
          >
            {/* Left Panel: Exhibit Box (Conditional) */}
            {currentQuestion.passage && (
              <div className="flex-1 bg-white/95 backdrop-blur-lg border border-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-8 relative flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 mb-6 opacity-80">
                  <Terminal className="w-4 h-4 text-[#1a3a8a]" />
                  <span className="text-xs font-black tracking-widest text-[#1a3a8a] uppercase">EXHIBIT DATA</span>
                </div>
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                  {currentQuestion.passage.split('\n').map((line, idx) => {
                    const colonIndex = line.indexOf(':');
                    const speaker = colonIndex > -1 ? line.substring(0, colonIndex).trim() : null;
                    const text = colonIndex > -1 ? line.substring(colonIndex + 1).trim() : line;

                    // Alternate style per speaker (simple deterministic color assign by index or hardcode)
                    const isAlternate = idx % 2 !== 0;

                    return (
                      <div key={idx} className="flex flex-col gap-1.5">
                        {speaker && (
                          <div className={`text-[14px] font-black tracking-wide uppercase flex items-center gap-2 ${isAlternate ? 'text-[#1a3a8a]' : 'text-cyan-700'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${isAlternate ? 'bg-[#1a3a8a]' : 'bg-cyan-500'}`}></div>
                            {speaker}
                          </div>
                        )}
                        <div className={`p-4 rounded-2xl border shadow-sm text-[15px] font-bold leading-relaxed ${isAlternate
                          ? 'bg-white border-[#1a3a8a]/10 text-gray-800 rounded-tl-none'
                          : 'bg-cyan-50/50 border-cyan-200/50 text-cyan-900 rounded-tl-none'
                          }`}>
                          {text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Right Panel: Question Wrapper */}
            <div className={`${currentQuestion.passage ? 'flex-[1.1]' : 'w-full'} bg-white/95 backdrop-blur-lg border border-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-8 flex flex-col`}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#1a3a8a]/10 border border-[#1a3a8a]/20 rounded-full text-[#1a3a8a] text-[10px] font-black mb-3">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1a3a8a]"></span>
                  </span>
                  QUESTION 0{currentIndex + 1}
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* 3. Interactive Options */}
              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      className={`group text-left p-3.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3.5 relative overflow-hidden ${isSelected
                        ? 'border-[#1a3a8a] bg-[#1a3a8a]/5 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-white'
                        }`}
                    >
                      {/* Number Indicator */}
                      <div className={`w-8 h-8 flex-shrink-0 rounded-lg border-2 flex items-center justify-center font-black text-base transition-all ${isSelected
                        ? 'border-[#1a3a8a] bg-[#1a3a8a] text-white'
                        : 'bg-white border-gray-200 text-gray-400 group-hover:border-gray-300'
                        }`}>
                        {idx + 1}
                      </div>

                      {/* Option Label */}
                      <span className={`text-sm md:text-base font-bold transition-colors ${isSelected ? 'text-[#1a3a8a]' : 'text-gray-700'}`}>
                        {opt}
                      </span>

                      {/* Selected State Inner Glow */}
                      {isSelected && (
                        <motion.div
                          layoutId="glow"
                          className="absolute inset-0 border border-[#1a3a8a] rounded-xl pointer-events-none opacity-30"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto pt-8 flex justify-between items-center">
                {currentIndex > 0 ? (
                  <button
                    onClick={handlePrev}
                    className="px-6 py-3 rounded-xl font-bold text-base flex items-center gap-2 text-gray-500 hover:text-[#1a3a8a] hover:bg-gray-50 transition-all active:scale-95"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    이전 문항
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={handleNext}
                  disabled={userAnswers[currentIndex] === null}
                  className={`px-8 py-3.5 rounded-xl font-bold text-base flex items-center gap-2 transition-all duration-300 ${userAnswers[currentIndex] !== null
                    ? 'bg-[#1a3a8a] hover:bg-[#152c6b] text-white shadow-[0_4px_20px_rgba(26,58,138,0.3)] active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {currentIndex < quizData.length - 1 ? '다음 문항' : '최종 결과 확인'}
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UnitAssessment;
