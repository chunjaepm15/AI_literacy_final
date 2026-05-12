import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GNB from '../components/GNB';
import IntroVideo from './IntroVideo';
import MainLobby from './MainLobby';
import DiagnosticResult from './DiagnosticResult';
import LearningDetail from './LearningDetail';
import UnitAssessment from './UnitAssessment';

const SpaceDetective = () => {
  return (
    <div className="h-screen max-h-screen bg-[var(--color-main-bg)] flex flex-col overflow-hidden">
      {/* 밀크T GNB & 탭 */}
      <GNB />
      
      {/* 서브 라우팅 영역 */}
      <div className="flex-1 relative overflow-hidden h-[calc(100vh-144px)] max-h-[calc(100vh-144px)]">
        <Routes>
          <Route path="/" element={<IntroVideo />} />
          <Route path="/dashboard" element={<MainLobby />} />
          <Route path="/diagnostic-result" element={<DiagnosticResult />} />
          <Route path="/learning" element={<LearningDetail />} />
          <Route path="/assessment" element={<UnitAssessment />} />
        </Routes>
      </div>
    </div>
  );
};

export default SpaceDetective;
