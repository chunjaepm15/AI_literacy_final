import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LearningDetail = () => {
  const navigate = useNavigate();
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'LESSON_COMPLETE') {
        console.log('Lesson completion message received!');
        handleComplete();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleComplete = () => {
    localStorage.setItem('mission_completed_6', 'true');
    localStorage.setItem('mission_completed_date_6', new Date().toISOString().split('T')[0]);
    localStorage.setItem('new_badge_available', 'true');
    localStorage.setItem('class6_completed', 'true');

    setShowBadgeModal(true);
  };

  const handleStart = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { /* Safari */
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE11 */
        await element.msRequestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed or ignored:', err);
    }
    setIsStarted(true);
  };

  const handleExit = async () => {
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Error exiting fullscreen:', err);
    }
    navigate('/space-detective/dashboard', { state: { activeTab: 'thinking' } });
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] overflow-hidden w-screen h-screen font-['Pretendard']">

      {!isStarted ? (
        /* 🌟 진입 전 스타트 스크린 */
        <div
          className="w-full h-full flex flex-col items-center justify-center relative bg-cover bg-center"
          style={{ backgroundImage: 'url("/contents/lesson6_v2/assets/images/bg/opening.png")' }}
        >
          {/* 어두운 오버레이 배경 */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

          {/* 돌아가기 버튼 */}
          <button 
            onClick={() => navigate('/space-detective/dashboard', { state: { activeTab: 'thinking' } })} 
            className="absolute top-6 left-6 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full font-bold transition-all"
          >
            돌아가기
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <div className="bg-indigo-600/80 backdrop-blur-md px-4 py-2 rounded-full text-indigo-100 text-sm font-black tracking-widest mb-4 border border-indigo-400/30">
              SPACE DETECTIVE EPISODE 06
            </div>
            <h1 className="text-white text-5xl md:text-7xl font-black mb-16 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] tracking-tighter leading-tight">
              인공지능의<br />자신 있는 거짓말
            </h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="group relative flex items-center justify-center px-12 py-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full text-white font-black text-2xl shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-shadow hover:shadow-[0_0_60px_rgba(6,182,212,0.8)]"
            >
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <span className="mr-2">학습 시작하기</span>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </motion.button>
          </motion.div>
        </div>
      ) : (
        /* 🎮 전체화면 콘텐츠 뷰 */
        <>
          <button
            onClick={handleExit}
            className="fixed top-4 left-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-3 rounded-full transition-all shadow-lg group flex items-center gap-2 pr-4 overflow-hidden"
            title="나가기"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
            <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity w-0 group-hover:w-auto whitespace-nowrap">
              학습 종료
            </span>
          </button>

          <iframe
            src="/contents/lesson6_v2/index.html"
            title="우주탐정단 AI 리터러시 학습"
            className="w-full h-full border-none bg-black"
            allow="autoplay; fullscreen"
          />
        </>
      )}

      {/* 🏅 배지 획득 축하 모달 */}
      <AnimatePresence>
        {showBadgeModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative shadow-[0_0_60px_rgba(79,70,229,0.4)] border border-indigo-100 flex flex-col items-center"
            >
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-indigo-100/50 to-transparent"></div>
              </div>

              <div className="bg-emerald-100 p-3 rounded-full mb-6 relative z-10 shadow-inner border border-emerald-200">
                <Award className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>

              <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight relative z-10">
                미션 클리어!
              </h2>
              <p className="text-slate-500 text-sm mb-6 font-bold relative z-10">
                <span className="text-indigo-600">✨ 팩트체커 배지 ✨</span> 획득
              </p>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.2 }}
                className="w-32 h-32 mb-8 relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
              >
                <img
                  src="/images/badges/badge_06.png"
                  alt="팩트체커 배지"
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <button
                onClick={handleExit}
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30 relative z-10 active:scale-95"
              >
                확인하고 로비로 가기
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2, delay: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: "50vw", y: "50vh",
                    scale: 0
                  }}
                  animate={{
                    x: `${30 + Math.random() * 40}vw`,
                    y: `${20 + Math.random() * 60}vh`,
                    scale: Math.random() * 2 + 1,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute w-3 h-3 bg-yellow-400 rounded-sm shadow-sm"
                  style={{ backgroundColor: ['#facc15', '#60a5fa', '#34d399', '#f472b6', '#a855f7'][i % 5] }}
                />
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningDetail;
