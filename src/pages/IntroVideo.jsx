import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DiagnosticPopup from '../components/DiagnosticPopup';

const IntroVideo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasHistory, setHasHistory] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showStartChoice, setShowStartChoice] = useState(false);

  /* [DELETE_LATER_START] 이미지 덮어씌우기 코드 (추후 일괄 삭제 가능) */
  // const [showFinalImage, setShowFinalImage] = useState(false);
  /* [DELETE_LATER_END] */

  // Clear any plyr-related storage immediately to prevent the video from resuming from past timestamp
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('plyr') || key.includes('video') || key.includes('media') || key.includes('animstage'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('plyr') || key.includes('video') || key.includes('media') || key.includes('animstage'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  } catch (e) {
    console.warn('Failed to clear plyr storage:', e);
  }

  useEffect(() => {
    // Check if the user has completed the diagnostic test
    const completed = localStorage.getItem('diagnostic_completed') === 'true';
    setHasHistory(completed);

    // If redirected here from 'Restart diagnostic' confirm, automatically show the mode selection dialog.
    if (location.state?.openStartChoice) {
      setShowStartChoice(true);
      // Clear the location state state immediately so it doesn't auto-pop up on later refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleStartClick = () => {
    setShowStartChoice(true);
  };

  const handleStartLearning = () => {
    navigate('/space-detective/dashboard');
  };

  return (
    <div className="w-full h-full max-h-full flex flex-col items-center justify-center relative bg-[#05061a] overflow-hidden select-none px-4 py-4">

      {/* 🌌 High-Fidelity Vector Design precisely mirroring '우주탐정단 타이틀.html' */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-[1360px] aspect-[1280/720] max-h-[calc(100vh-100px)] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(35,83,255,0.25)] border border-blue-900/40"
      >
        <iframe
          src="/introvideo.html"
          title="우주탐정단 인트로"
          className="w-full h-full border-none select-none pointer-events-auto bg-[#05061a]"
          onLoad={(e) => {
            try {
              const iframeEl = e.target;
              if (!iframeEl) return;
              const iframeWin = iframeEl.contentWindow;
              const iframeDoc = iframeEl.contentDocument || iframeWin.document;

              // 1. Hide Plyr timeline, controls, and custom progress bar inside the iframe
              try {
                const style = iframeDoc.createElement('style');
                style.innerHTML = `
                  .plyr__controls, .plyr__control, .plyr__progress, .plyr__time, .plyr__menu, 
                  .plyr__play-large, .plyr__controls__item, .plyr__volume, .plyr__tooltip,
                  .plyr__control--overlaid, .plyr__video-wrapper ~ .plyr__controls,
                  div[style*="max-width: 680px"], div[style*="max-width:680px"], 
                  div[style*="rgba(20, 20, 20"], div[style*="rgba(20,"] {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                  }
                `;
                (iframeDoc.head || iframeDoc.body || iframeDoc.documentElement).appendChild(style);
              } catch (err) {
                console.warn('Failed to inject custom styles into iframe:', err);
              }

              // 2. 정확히 10초 뒤에 Universal Freeze를 가동하여 내부 애니메이션을 강제 정지시킵니다.
              const startTime = Date.now();
              const freezeTimeMs = 10000; // 10초 뒤 강제 정지

              const applyFreeze = () => {
                try {
                  // 1. requestAnimationFrame 무력화 (캔버스, Lottie, Framer 애니메이션 루프 차단)
                  iframeWin.requestAnimationFrame = () => 0;

                  // 2. CSS 애니메이션 및 트랜지션 강제 정지
                  const style = iframeDoc.createElement('style');
                  style.innerHTML = `* { animation-play-state: paused !important; transition: none !important; }`;
                  (iframeDoc.head || iframeDoc.documentElement).appendChild(style);

                  // 3. 내부 비디오 태그가 존재한다면 싹 다 정지 및 재생불가 처리
                  const findAndPauseVideos = (node) => {
                    if (!node) return;
                    const vids = node.querySelectorAll ? node.querySelectorAll('video') : [];
                    vids.forEach(v => {
                      v.pause();
                      v.removeAttribute('loop');
                      v.play = () => new Promise(r => r());
                    });
                    const iframes = node.querySelectorAll ? node.querySelectorAll('iframe') : [];
                    iframes.forEach(ifr => {
                      try { findAndPauseVideos(ifr.contentDocument || ifr.contentWindow.document); } catch (e) { }
                    });
                  };
                  findAndPauseVideos(iframeDoc);
                } catch (e) { }
              };

              const intervalId = setInterval(() => {
                if (Date.now() - startTime >= freezeTimeMs) {
                  applyFreeze();
                  /* [DELETE_LATER_START] 이미지 덮어씌우기 관련 상태값 변경도 주석 처리 */
                  // setShowFinalImage(true);
                  /* [DELETE_LATER_END] */
                  clearInterval(intervalId);
                }
              }, 50); // 오차를 줄이기 위해 50ms 간격으로 타이트하게 체크

              // 최후의 안전장치: 어떤 경우든 11.9초에는 무조건 프리즈 발동
              setTimeout(() => {
                applyFreeze();
                clearInterval(intervalId);
              }, freezeTimeMs + 300);

            } catch (error) {
              console.warn('Iframe load initialization error:', error);
            }
          }}
        />

        {/* [DELETE_LATER_START] 11.6초 뒤 덮어씌워지는 완벽한 마지막 정지 화면 (현재 사용 안 함) */}
        {/*
        <AnimatePresence>
          {showFinalImage && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.05 }}
              src="/images/intro_last_frame.png"
              alt="Final Screen"
              className="absolute inset-0 w-full h-full p-6 object-contain z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>
        */}
        {/* [DELETE_LATER_END] */}

        {/* Absolute HTML button directly overlaid on the exact START coordinates for 100% bulletproof clicks */}
        <button
          onClick={handleStartClick}
          className="absolute top-[64.17%] left-[42.97%] w-[12.5%] h-[7.78%] rounded-full cursor-pointer bg-transparent hover:bg-white/5 active:scale-95 transition-all z-20 focus:outline-none"
          title="START"
        ></button>
      </motion.div>

      {/* 🔘 SELECTION POPUP: Triggered upon clicking "START" */}
      <AnimatePresence>
        {showStartChoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0c0f2e] border-2 border-blue-500/30 rounded-3xl p-8 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(37,99,235,0.4)]"
            >
              <h2 className="text-2xl font-black text-white mb-2 tracking-wide">
                🧭 우주탐정단 임무 선택
              </h2>
              <p className="text-gray-400 text-xs mb-8">
                신입 우주 탐정님, 어떤 임무로 시작할까요?
              </p>

              {!hasHistory ? (
                <div className="flex flex-col gap-4">
                  {/* 1. Diagnostic Test Button (Active) */}
                  <button
                    onClick={() => {
                      setShowStartChoice(false);
                      setShowPopup(true);
                    }}
                    className="w-full bg-[#FFD700] hover:bg-[#ffed4a] text-[#4a3000] font-extrabold py-4 px-6 rounded-2xl text-lg transition-transform hover:scale-102 active:scale-98 shadow-[0_0_20px_rgba(255,215,0,0.2)] flex items-center justify-center gap-2"
                  >
                    <span>진단평가 시작하기</span>
                  </button>

                  {/* 2. Learning Button (Locked with warning) */}
                  <button
                    onClick={() => {
                      alert("진단평가를 먼저 진행하세요");
                    }}
                    className="w-full bg-blue-950/40 hover:bg-blue-900/50 text-blue-400/70 font-bold py-4 px-6 rounded-2xl text-lg flex items-center justify-center gap-2 border border-blue-900/50 transition-all hover:scale-101 active:scale-99 cursor-pointer"
                  >
                    <span>우주탐정 학습하기</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {/* 1. Learning Button (Active & Main) */}
                  <button
                    onClick={() => {
                      setShowStartChoice(false);
                      handleStartLearning();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-4 px-6 rounded-2xl text-lg transition-all hover:scale-102 active:scale-98 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 border border-blue-400/30"
                  >
                    <span>🚀</span>
                    <span>우주탐정 학습하기</span>
                  </button>

                  {/* Supporting secondary buttons at the bottom right */}
                  <div className="flex justify-end gap-2.5 mt-2">
                    <button
                      onClick={() => {
                        setShowStartChoice(false);
                        setShowPopup(true);
                      }}
                      className="text-xs bg-slate-900/80 hover:bg-slate-800 text-yellow-300 font-bold py-2 px-3 rounded-xl border border-yellow-500/20 transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>📝</span>
                      <span>진단평가 다시하기</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowStartChoice(false);
                        navigate('/space-detective/diagnostic-result');
                      }}
                      className="text-xs bg-slate-900/80 hover:bg-slate-800 text-blue-300 font-bold py-2 px-3 rounded-xl border border-blue-500/20 transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span>📊</span>
                      <span>진단 결과보기</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Close & Reset Buttons (Presentation Friendly) */}
              <div className="mt-8 flex items-center justify-between border-t border-blue-900/40 pt-4 text-xs">
                <button
                  onClick={() => {
                    // 시연 관련 모든 로컬스토리지 데이터 키 일괄 수집 (진단결과, 배지, 퀘스트, CUP 보상 포함)
                    const keysToRemove = [];
                    const gameKeyPrefixes = [
                      'diagnostic_', 'mission_', 'class', 'total_cups', 'cup_exchanged_', 
                      'unit_assessment_', 'detective_', 'badge_collection_', 'open_badge_', 'new_badge_'
                    ];

                    for (let i = 0; i < localStorage.length; i++) {
                      const key = localStorage.key(i);
                      if (key && gameKeyPrefixes.some(prefix => key.startsWith(prefix))) {
                        keysToRemove.push(key);
                      }
                    }
                    
                    // 한꺼번에 삭제 실행
                    keysToRemove.forEach(key => localStorage.removeItem(key));

                    setHasHistory(false);
                    alert('진단 평가 및 배지 획득 내역이 성공적으로 초기화되었습니다! (시연 준비 완료)');
                  }}
                  className="text-red-400 hover:text-red-300 font-bold opacity-50 hover:opacity-100 transition-all flex items-center gap-1 cursor-pointer"
                  title="진단 완료 이력을 초기화하고 비진단 상태로 되돌립니다."
                >
                  <span>🔄</span>
                  <span>시연용 데이터 초기화</span>
                </button>

                <button
                  onClick={() => setShowStartChoice(false)}
                  className="text-gray-500 hover:text-gray-300 font-bold underline transition-colors cursor-pointer"
                >
                  창 닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📝 Full Diagnostic Popup Modal */}
      {showPopup && (
        <DiagnosticPopup
          onClose={() => setShowPopup(false)}
          onComplete={(scores) => {
            // Save results and history flag
            localStorage.setItem('diagnostic_completed', 'true');
            localStorage.setItem('diagnostic_results', JSON.stringify(scores));
            setHasHistory(true);
            setShowPopup(false);
            // Navigate directly to result dashboard
            navigate('/space-detective/diagnostic-result');
          }}
          onSkip={() => {
            setShowPopup(false);
            navigate('/space-detective/dashboard');
          }}
        />
      )}
    </div>
  );
};

export default IntroVideo;
