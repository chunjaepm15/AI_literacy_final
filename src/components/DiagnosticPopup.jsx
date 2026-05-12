import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ChevronRight } from 'lucide-react';

const questions = [
  {
    id: 'K1',
    category: 'AI 개념',
    difficulty: '쉬움',
    weight: 1,
    question: '유튜브 추천, 얼굴 인식, 챗봇은 어떤 공통된 방식으로 작동하나요?',
    options: [
      '정해진 규칙대로만 움직인다',
      '배운 데이터를 바탕으로 판단한다',
      '버튼을 누르면 작동한다',
      '전기로 자동으로 움직인다'
    ],
    answerIndex: 1,
    target: 'AI가 데이터를 기반으로 스스로 판단한다는 핵심 개념을 아는지 확인'
  },
  {
    id: 'K2',
    category: 'AI 개념',
    difficulty: '쉬움',
    weight: 1,
    question: '인공지능이 스스로 데이터를 배워서 규칙을 찾아가는 과정을 무엇이라고 하나요?',
    options: [
      '검색',
      '저장',
      '번역',
      '기계학습(머신러닝)'
    ],
    answerIndex: 3,
    target: '기계학습(머신러닝)이라는 교과서 용어를 아는지 확인'
  },
  {
    id: 'K3',
    category: 'AI 개념',
    difficulty: '보통',
    weight: 2,
    question: '인공지능이 빨간 사과 사진만 보다가 초록 사과를 보여줬더니 "사과가 아니에요"라고 했어요. 왜 이런 일이 생겼을까요?',
    options: [
      '빨간 사과만 배워서 초록 사과를 몰랐다',
      '초록색을 싫어해서',
      '사과 사진이 너무 많아서 헷갈렸다',
      '인터넷에서 찾지 못해서'
    ],
    answerIndex: 0,
    target: '학습 데이터가 편향되면 결과도 편향된다는 인과관계를 이해하는지 확인'
  },
  {
    id: 'K4',
    category: 'AI 개념',
    difficulty: '보통',
    weight: 2,
    question: 'AI에게 "세종대왕이 아이패드로 훈민정음을 만들었어?"라고 물었더니 "네, 맞아요!"라고 답했어요. 이 대답의 문제점은 무엇인가요?',
    options: [
      'AI가 역사 공부를 안 했다',
      '인터넷 연결이 끊겼다',
      'AI가 그럴듯한 답을 만들어냈다',
      '세종대왕이 아이패드를 써서 그렇다'
    ],
    answerIndex: 2,
    target: 'AI가 사실 확인 없이 그럴듯한 답을 만들어내는 오류 원리를 이해하는지 확인'
  },
  {
    id: 'K5',
    category: 'AI 개념',
    difficulty: '어려움',
    weight: 3,
    question: '인공지능이 틀린 답을 했을 때 스스로 고치기 어려운 이유는 무엇인가요?',
    options: [
      '인터넷이 연결되지 않았다',
      '배운 내용을 맞다고 생각하고 그대로 쓴다',
      '업데이트가 안 됐다',
      '공부가 부족했다'
    ],
    answerIndex: 1,
    target: 'AI가 스스로 검토하는 주체가 아니라는 원리를 이해하는지 확인'
  },
  {
    id: 'A1',
    category: '비판적 사고',
    difficulty: '쉬움',
    weight: 1,
    question: '인공지능이 알려준 정보를 사용하기 전에 해야 할 행동으로 올바른 것은 무엇인가요?',
    options: [
      '글자 수가 충분하면 그냥 쓴다',
      '인공지능이 말했으니 무조건 맞다고 생각한다',
      '다른 믿을 수 있는 곳에서 맞는지 확인한다',
      '마음에 들면 바로 친구에게 퍼뜨린다'
    ],
    answerIndex: 2,
    target: '팩트체크라는 기본 행동 방향을 아는지 확인'
  },
  {
    id: 'A2',
    category: '비판적 사고',
    difficulty: '쉬움',
    weight: 1,
    question: '인공지능이 써준 글을 숙제로 내면 안 되는 가장 중요한 이유는 무엇인가요?',
    options: [
      '글씨체가 달라 보인다',
      '내가 직접 생각하고 배우는 과정이 사라진다',
      '친구가 알아채고 일러바친다',
      '안 될 거 없다'
    ],
    answerIndex: 1,
    target: 'AI 과잉 의존의 핵심 문제가 학습 기회 손실임을 아는지 확인'
  },
  {
    id: 'A3',
    category: '비판적 사고',
    difficulty: '보통',
    weight: 2,
    question: '인터넷에서 유명인이 이상한 행동을 하는 영상을 봤어요. 이때 올바른 행동은 무엇인가요?',
    options: [
      '재미있으니까 친구들에게 퍼뜨린다',
      '유명인이 나오니까 진짜라고 믿는다',
      '가짜 영상일 수 있으니 공식 채널에서 먼저 확인한다',
      '조회수가 높으니까 진짜라고 판단한다'
    ],
    answerIndex: 2,
    target: 'AI로 만든 가짜 영상이 존재한다는 것을 알고 확인하는 행동을 선택할 수 있는지 확인'
  },
  {
    id: 'A4',
    category: '비판적 사고',
    difficulty: '보통',
    weight: 2,
    question: '인공지능이 만든 그림을 미술 숙제로 낼 때 올바른 행동은 무엇인가요?',
    options: [
      '내가 직접 그린 척 낸다',
      '그림 일부만 바꿔서 내 것처럼 낸다',
      '인공지능의 도움을 받았다고 선생님께 밝히고 낸다',
      '친구 이름으로 낸다'
    ],
    answerIndex: 2,
    target: '저작권과 출처 표기라는 윤리 행동을 아는지 확인'
  },
  {
    id: 'A5',
    category: '비판적 사고',
    difficulty: '어려움',
    weight: 3,
    question: '학교 AI가 작년 운동회 기록만 보고 팀을 나눴더니 키 큰 아이들만 같은 팀이 됐어요. 이 상황에서 가장 올바른 판단은 무엇인가요?',
    options: [
      '인공지능이 나눈 결과니까 공정하다',
      '내가 키 큰 그룹이니 상관없다',
      '인공지능은 쓰면 안 된다',
      '작년 기록이니까 올해 기록을 다시 측정해야 한다'
    ],
    answerIndex: 3,
    target: '데이터 편향의 결과를 상황에서 파악하고 올바른 해결 방향을 선택할 수 있는지 확인'
  }
];

const DiagnosticPopup = ({ onClose, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({}); // Stores { K1: true/false, ... }
  const [showResult, setShowResult] = useState(false);

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    const isCorrect = selectedOption === currentQ.answerIndex;
    const updatedAnswers = { ...answers, [currentQ.id]: isCorrect };
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      // Perform the final calculation and pass it to onComplete
      const scores = calculateScores(updatedAnswers);
      setShowResult(true);
      // Wait a tiny bit then complete
      setTimeout(() => {
        onComplete(scores);
      }, 2000);
    }
  };

  const calculateScores = (finalAnswers) => {
    let conceptScore = 0;
    let criticalScore = 0;

    questions.forEach((q) => {
      const isCorrect = finalAnswers[q.id] === true;
      if (isCorrect) {
        if (q.id.startsWith('K')) conceptScore += q.weight;
        if (q.id.startsWith('A')) criticalScore += q.weight;
      }
    });

    // Consistency Index (CI) Check - Guessing prevention override
    const hasConceptWeakness = !finalAnswers.K1 || !finalAnswers.K2;
    const hasCriticalWeakness = !finalAnswers.A1 || !finalAnswers.A2;

    const isConceptHigh = (conceptScore >= 6) && !hasConceptWeakness;
    const isCriticalHigh = (criticalScore >= 6) && !hasCriticalWeakness;

    let detectiveType = "";
    let recommendedLevel = 1;
    let recommendedPath = "이해의 별";

    if (isConceptHigh && isCriticalHigh) {
      detectiveType = "AI 마스터 탐정 👑";
      recommendedLevel = 3;
      recommendedPath = "윤리의 별";
    } else if (isConceptHigh && !isCriticalHigh) {
      detectiveType = "이론파 돋보기 탐정 🧐";
      recommendedLevel = 2;
      recommendedPath = "비판력 별";
    } else if (!isConceptHigh && isCriticalHigh) {
      detectiveType = "신중한 직관파 탐정 🔍";
      recommendedLevel = 1;
      recommendedPath = "이해의 별";
    } else {
      detectiveType = "새내기 견습 탐정 🕵️‍♂️";
      recommendedLevel = 1;
      recommendedPath = "이해의 별";
    }

    return {
      conceptScore,
      criticalScore,
      isConceptHigh,
      isCriticalHigh,
      detectiveType,
      recommendedLevel,
      recommendedPath,
      hasConceptWeakness,
      hasCriticalWeakness,
      answersList: finalAnswers,
      questions
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col text-gray-800 relative border border-gray-100"
          >
            {/* Header */}
            <div className="bg-[#1a3a8a] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold tracking-widest">
                  사전 진단평가
                </div>
                <span className="opacity-80 text-sm font-semibold">{currentQ.category}</span>
                <span className="bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-xs px-2.5 py-0.5 rounded-md">
                  난이도: {currentQ.difficulty} ({currentQ.weight}점)
                </span>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-gray-100">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto max-h-[65vh]">
              <div className="flex items-start gap-3 mb-5">
                <span className="text-[#1a3a8a] font-extrabold text-2xl">Q{currentIndex + 1}.</span>
                <h2 className="text-lg md:text-xl font-bold leading-relaxed pt-1">
                  {currentQ.question}
                </h2>
              </div>

              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 group ${selectedOption === idx
                      ? 'border-[#1a3a8a] bg-[#1a3a8a]/5 text-[#1a3a8a]'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors ${selectedOption === idx
                      ? 'border-[#1a3a8a] bg-[#1a3a8a] text-white'
                      : 'border-gray-300 text-gray-400 group-hover:border-gray-400'
                      }`}>
                      {idx + 1}
                    </div>
                    <span className="font-medium text-base flex-1 leading-snug">{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="text-gray-500 font-medium">
                {currentIndex + 1} / {questions.length} 문항
              </span>
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className="bg-[#1a3a8a] disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all hover:bg-[#152c6b] disabled:cursor-not-allowed"
              >
                {currentIndex === questions.length - 1 ? '결과 보기' : '다음 문항'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-md p-10 flex flex-col items-center text-center shadow-2xl border border-gray-100"
          >
            <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-2 animate-pulse">채점 진행 중...</h2>
            <p className="text-gray-600 leading-relaxed">
              수고하셨습니다! <br />
              사전 진단 알고리즘을 통해 탐정님의 성향과 <br />
              맞춤 학습 경로를 분석하고 있습니다.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiagnosticPopup;
