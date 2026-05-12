import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Star } from 'lucide-react';
import HelpModal from './HelpModal';

const GNB = () => {
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="w-full flex flex-col sticky top-0 z-50 select-none shadow-md">

      <div className="w-full bg-[#1c1d22] text-white h-11 flex items-center justify-center px-4 border-b border-black/30">
        <div className="max-w-[1280px] w-full flex items-center justify-center relative h-full">
          {/* Hamburger Menu - Left Aligned */}
          <div className="absolute left-0 flex items-center">
            <button className="p-1 hover:bg-white/10 rounded-md transition-colors">
              <Menu className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          {/* Title - Center Aligned */}
          <div className="text-md font-extrabold text-gray-200 select-none">
            특별학습 2관
          </div>

          {/* Close Button - Right Aligned */}
          <div className="absolute right-0 flex items-center">
            <button onClick={() => navigate('/space-detective')} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 🟦 LAYER 2: Middle Cyan-Blue Primary Tab Bar (Center-Aligned) */}
      <div className="w-full bg-[#00a2e8] text-white h-11 flex items-center justify-center px-4 border-b border-[#0091d2]">
        <div className="max-w-[1280px] w-full flex items-center justify-center relative py-1">
          {/* Grade Select Button - Left Aligned */}
          <div className="absolute left-0 flex items-center h-full">
            <button className="bg-[#008bd0] hover:bg-[#0079b8] text-white px-4 py-2 rounded-full font-bold text-sm border border-white/10 shadow-inner whitespace-nowrap">
              5학년 2학기
            </button>
          </div>

          {/* Active & Other Category Tabs - Centered */}
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
            {/* Active Capsule: AI/Coding */}
            <button className="bg-white text-[#0092d6] px-5 py-2 rounded-full font-extrabold text-sm shadow-md whitespace-nowrap">
              AI/코딩 체험
            </button>

            {/* Other Category Tabs */}
            <span className="text-white/80 hover:text-white font-extrabold text-sm cursor-pointer whitespace-nowrap px-5">스마트 과학 탐구</span>
            <span className="text-white/80 hover:text-white font-extrabold text-sm cursor-pointer whitespace-nowrap px-5">XR 특별관</span>
            <span className="text-white/80 hover:text-white font-extrabold text-sm cursor-pointer whitespace-nowrap px-5">AI 학습 톡톡</span>
            <span className="text-white/80 hover:text-white font-extrabold text-sm cursor-pointer whitespace-nowrap px-5">학습게임</span>
          </div>
        </div>
      </div>

      {/* ⬜ LAYER 3: Bottom Sub Navigation Bar (Center-Aligned) */}
      <div className="w-full bg-[#ffffff] border-b border-gray-200 h-11 flex items-center justify-center px-4">
        <div className="max-w-[1280px] w-full flex items-center justify-center h-full">
          <div className="flex items-center justify-center gap-8 overflow-x-auto scrollbar-none flex-1">
            {/* Sub category tabs */}
            <span className="text-gray-400 hover:text-gray-700 font-extrabold text-sm cursor-pointer whitespace-nowrap">엔트리 코딩 플레이</span>
            <span className="text-gray-400 hover:text-gray-700 font-extrabold text-sm cursor-pointer whitespace-nowrap">코드 탈출</span>
            <span className="text-gray-400 hover:text-gray-700 font-extrabold text-sm cursor-pointer whitespace-nowrap">AI 탐험대</span>
            <span className="text-gray-400 hover:text-gray-700 font-extrabold text-sm cursor-pointer whitespace-nowrap">AI 코디니</span>

            {/* Selected active Tab: AI 우주탐정단 */}
            <span className="text-[#0092d6] font-black text-sm border-b-4 border-[#0092d6] pb-3.5 pt-3.5 cursor-pointer whitespace-nowrap relative">
              AI 우주탐정단
            </span>
          </div>
        </div>
      </div>

      {/* Help Explanation Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

    </div>
  );
};

export default GNB;
