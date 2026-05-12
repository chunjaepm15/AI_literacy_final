import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Star, Award, BookOpen, Layers } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('우주탐정단');

  if (!isOpen) return null;

  const tabs = [
    { id: '코딩 탐험대', title: '코딩 탐험대' },
    { id: '엔트리 코딩 플레이', title: '엔트리 코딩 플레이' },
    { id: '코드 탈출', title: '코드 탈출' },
    { id: 'AI 탐험대', title: 'AI 탐험대' },
    { id: 'AI 코디니', title: 'AI 코디니' },
    { id: '우주탐정단', title: '우주탐정단' }
  ];

  const tabContents = {
    '코딩 탐험대': {
      sub: '스토리와 함께 블록 코딩의 첫걸음, 코딩 탐험대',
      bullets: [
        '흥미진진한 스토리를 헤쳐나가며 블록 코딩의 기초 개념을 습득해요.',
        '직관적인 퍼즐 매칭 방식을 통해 프로그래밍의 핵심 순차, 반복 논리를 깨우쳐요.',
        '각 스테이지 완료 보상으로 귀여운 캐릭터 파츠를 가득 선물 받아요.'
      ],
      cards: [
        { tag: '스토리 모드', title: '인트로 오프닝', desc: '만화 스토리 진행' },
        { tag: '코딩 플레이', title: '블록 순서 정렬', desc: '기초 시퀀싱 퍼즐' },
        { tag: '반복 훈련', title: '루프 블록 제어', desc: '코드 줄이기 챌린지' },
        { tag: '성취 보상', title: '피규어 조립기', desc: '수집 도감 업데이트' }
      ]
    },
    '엔트리 코딩 플레이': {
      sub: '엔트리 블록으로 나만의 인터랙티브 우주 게임 만들기',
      bullets: [
        '공식 엔트리 블록 코딩 엔진을 활용해 자유자재로 이벤트를 구성해요.',
        '나만의 스프라이트와 배경 이미지를 조립하고 커스텀 사운드를 등록해요.',
        '내가 코딩해서 배포한 완성도 높은 작품을 친구들과 자랑하고 피드백을 나누어요.'
      ],
      cards: [
        { tag: '워크스페이스', title: '블록 조립하기', desc: '이벤트 및 동작 블록' },
        { tag: '스프라이트', title: '캐릭터 커스텀', desc: '나만의 디자인 그리기' },
        { tag: '테스트 베드', title: '실시간 게임 플레이', desc: '오류 버그 디버깅' },
        { tag: '공유 갤러리', title: '친구 작품 추천', desc: '전국 밀크T 친구 공유' }
      ]
    },
    '코드 탈출': {
      sub: '알고리즘 미로를 격파하고 숨겨진 출구를 찾아라!',
      bullets: [
        '점점 난이도가 상승하는 특수 기믹 미로 스테이지들을 논리력으로 통과해요.',
        '조건문 블록을 완벽 조작하여 장애물 유무에 따른 동적 판단 경로를 프로그래밍해요.',
        '가장 짧고 효율적인 코드를 작성하여 탈출 골드 메달 기록을 갱신해 보세요.'
      ],
      cards: [
        { tag: '미로 맵', title: '랜덤 경로 탐험', desc: '기믹 함정 가득한 미로' },
        { tag: '조건 분기', title: 'IF-Else 제어', desc: '센서 판단 조건 코딩' },
        { tag: '최적화 평가', title: '코드 다이어트', desc: '블록 개수 최소화 도전' },
        { tag: '랭킹 경쟁', title: '명예의 전당', desc: '최고 속도 탈출 탐정' }
      ]
    },
    'AI 탐험대': {
      sub: '인공지능 머신러닝 모델을 직접 가르치고 학습시키기',
      bullets: [
        '웹캠이나 마이크를 활용하여 텍스트, 소리, 사물 이미지 데이터를 실시간 수집해요.',
        '인공지능 모델에 지도 학습 가중치를 배정하여 인공지능 인식 기능을 직접 구현해봐요.',
        '내가 만든 머신러닝 필터 모델을 게임 캐릭터에 이식해 작동 감도를 직접 비교해요.'
      ],
      cards: [
        { tag: '데이터 분류', title: '학습 데이터 수집', desc: '카메라, 마이크 훈련' },
        { tag: '인공지능 교육', title: '머신러닝 트레이닝', desc: '정확도 가중치 분석' },
        { tag: '사물 분류', title: '스마트 필터링', desc: '음성 및 사물인식 테스트' },
        { tag: '어플리케이션', title: '실전 인공지능 앱', desc: '나만의 AI 비서 제작' }
      ]
    },
    'AI 코디니': {
      sub: '블록 코딩과 AI 실습을 한번에, 똑똑한 AI 코디니 💻',
      bullets: [
        '다양한 인공지능 센서 및 외부 확장 API 기능을 블록으로 간편하게 제어해요.',
        '음성 인식 번역 기능과 자율주행 알고리즘 가상 실습을 안전하게 탐정 본부에서 이수해요.',
        '파이썬 텍스트 코딩과 블록 코딩 간 실시간 상호 변환 뷰어로 심화 실력을 길러요.'
      ],
      cards: [
        { tag: 'AI 기능 연동', title: '다국어 자동 번역', desc: '실시간 다국어 번역' },
        { tag: '자율주행 실습', title: '라인 트레이서 제어', desc: '가상 도로 장애물 극복' },
        { tag: '듀얼 에디터', title: '파이썬 코드 변환', desc: '텍스트 코딩 자동 보기' },
        { tag: '종합 프로젝트', title: '스마트 시티 코딩', desc: '가상 환경 사물제어' }
      ]
    },
    '우주탐정단': {
      sub: '생각하는 힘을 쑥쑥 키우는, AI 우주탐정단! 🕵️‍♂️',
      bullets: [
        '재미있는 사전 퀴즈를 풀고 나의 인공지능 실력을 똑똑하게 진단받아요.',
        '내 진단 결과에 딱 맞는 추천 별자리를 따라 나만의 맞춤형 학습 모험을 떠나요.',
        '밤하늘의 반짝이는 별자리들을 하나씩 완성하고, 멋진 탐정 배지들을 수집함에 가득 모아봐요!'
      ],
      cards: [
        { tag: '실력 진단', title: '재미있는 AI 퀴즈', desc: '알쏭달쏭 퀴즈로 내 진짜 실력 확인!', img: '/images/help/help_quiz.png' },
        { tag: '성향 지도', title: '탐정 성향 분석', desc: '내가 어떤 유형의 멋진 탐정인지 알려줘요.', img: '/images/help/help_personality.png' },
        { tag: '맞춤 학습', title: '추천 별자리 오픈', desc: '나에게 꼭 맞는 난이도의 학습 코스 추천!', img: '/images/help/help_map.png' },
        { tag: '빛나는 영광', title: '탐정 배지 도감', desc: '공부를 열심히 완료하고 멋진 배지 모으기', img: '/images/help/help_badge.png' }
      ]
    }
  };

  const currentContent = tabContents[activeTab];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#2a2a2a] text-white rounded-2xl w-full max-w-[840px] overflow-hidden border border-white/10 shadow-2xl flex flex-col relative font-sans"
        >
          {/* Header of the modal (Dark background, white text) */}
          <div className="bg-[#1c1d22] py-4 px-6 flex items-center justify-between border-b border-black/20">
            <span className="text-base font-extrabold tracking-wider text-gray-200">AI/코딩 체험 안내</span>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Modal sub-tab bar inside modal (Gray tabs, active beige) */}
          <div className="bg-[#e4e6ea] h-12 flex border-b border-gray-300">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 h-full font-black text-xs transition-all whitespace-nowrap px-1 ${isActive
                      ? 'bg-[#fbf8f0] text-[#e26212] border-b-2 border-[#e26212] shadow-inner font-extrabold'
                      : 'bg-[#d0d3da] text-gray-600 hover:bg-[#cbd0d8] hover:text-gray-800'
                    }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>

          {/* Modal Main Content Body (Warm soft cream background #fbf8f0) */}
          <div className="bg-[#fbf8f0] text-gray-800 p-8 flex flex-col gap-6 min-h-[440px] max-h-[70vh] overflow-y-auto">

            {/* Big orange sub-headline */}
            <div className="border-b border-orange-500/10 pb-4">
              <h3 className="text-xl font-extrabold text-[#e26212] flex items-center gap-2 relative">
                <span className="inline-block w-1.5 h-6 bg-[#e26212] rounded-full"></span>
                {currentContent.sub}
                <span className="absolute bottom-[-4px] left-0 w-36 h-[2px] bg-gradient-to-r from-[#e26212] to-transparent"></span>
              </h3>
            </div>

            {/* Description Bullet Points with orange bullet icons */}
            <div className="flex flex-col gap-3.5 pl-1">
              {currentContent.bullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="text-[#e26212] font-black text-sm mt-[3px] flex-shrink-0">🔸</span>
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                    {/* Apply dynamic design system to **내용** formatted text to be colored orange */}
                    {bullet.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <span key={i} className="text-[#e26212] font-extrabold tracking-wide mx-0.5">
                            {part.slice(2, -2)}
                          </span>
                        );
                      }
                      return part;
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom 4 Row Cards */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {currentContent.cards.map((card, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-2.5 shadow-sm hover:shadow-md transition-all group hover:border-orange-200">
                  {/* Tag on top */}
                  <span className="bg-[#8b5a2b]/10 text-[#8b5a2b] px-2 py-0.5 rounded-md font-extrabold text-[10px] w-max select-none">
                    {card.tag}
                  </span>
                  {/* Inner preview card illustration */}
                  <div className="bg-[#f4f6f9] h-20 rounded-lg flex flex-col justify-center items-center relative overflow-hidden border border-gray-100 group-hover:bg-orange-50/20 transition-colors">
                    {card.img ? (
                      <img 
                        src={card.img} 
                        alt={card.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback Placeholder (Visible if no img or img errors) */}
                    <div className={`flex-col items-center justify-center p-2 ${card.img ? 'hidden absolute inset-0 bg-[#f4f6f9]' : 'flex'}`}>
                      <div className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full bg-[#e26212]/30"></div>
                      <Layers className="w-5 h-5 text-gray-400 group-hover:text-[#e26212] transition-colors mb-1" />
                      <span className="text-[10px] font-black text-gray-500 text-center break-all">
                        {card.title}
                      </span>
                    </div>
                  </div>
                  {/* Bottom details description */}
                  <span className="text-[10px] font-bold text-gray-400 leading-tight">
                    {card.desc}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Footer Area */}
          <div className="bg-[#1c1d22] py-4 px-6 flex justify-end border-t border-black/20">
            <button
              onClick={onClose}
              className="bg-[#e26212] hover:bg-[#c9530a] text-white font-extrabold py-2 px-6 rounded-lg transition-all active:scale-95 text-xs shadow-md"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HelpModal;
