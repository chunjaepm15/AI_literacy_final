/**
 * Interaction Handler for Space Detective Agency
 * Manages specific mission mechanics.
 */

class InteractionHandler {
    constructor() {
        this.container = document.getElementById('interaction-layer');
        this.magnifier = document.getElementById('magnifier');
        this.isComplete = false;
    }

    init(scene) {
        // [Safety] Re-fetch container if it was null during constructor (DOM not ready)
        if (!this.container) {
            this.container = document.getElementById('interaction-layer');
        }
        
        // If container is still missing, something is wrong with the DOM
        if (!this.container) {
            console.error('Interaction layer not found!');
            return;
        }

        this.currentScene = scene;
        this.isComplete = false;
        
        // Clear previous events
        document.onmousemove = null;
        this.container.onclick = null;
        this.container.innerHTML = '';
        this.container.classList.remove('magnifier-bg-dim'); // 초기화 시 배경 효과 제거

        switch (scene.type) {
            case 'interaction_choice':
                this.renderChoice(scene);
                break;
            case 'interaction_magnifier':
                this.renderMagnifier(scene);
                break;
            case 'interaction_point':
                this.renderPointMission(scene);
                break;
            case 'interaction_quiz':
                this.renderQuiz(scene);
                break;
            case 'interaction_final':
                this.renderFinalScene(scene);
                break;
            default:
                // For non-interaction scenes (narrative), just ensure everything is cleared
                break;
        }
    }

    // 1. Simple Choice Interaction
    renderChoice(scene) {
        this.container.style.pointerEvents = 'auto';
        const wrapper = document.createElement('div');
        wrapper.className = 'interaction-centered-wrapper choice-mode';
        
        scene.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = opt.text;
            btn.style.margin = 'var(--choice-btn-margin, 0 20px)';
            btn.onclick = () => {
                if (opt.isCorrect) {
                    this.showResultPopup(opt.feedback, true, () => {
                        this.isComplete = true;
                        window.StoryEngine.next();
                    });
                } else {
                    btn.classList.add('wrong');
                    this.showResultPopup(opt.feedback, false, () => {
                        btn.classList.remove('wrong');
                    });
                }
            };
            wrapper.appendChild(btn);
        });
        this.container.appendChild(wrapper);
    }

    // 2. Magnifier Interaction
    renderMagnifier(scene) {
        this.magnifier.style.display = 'block';
        this.container.style.pointerEvents = 'auto';
        this.container.classList.add('magnifier-bg-dim'); // 반투명 배경 추가
        
        const missions = scene.mission;
        const sentences = [];
        const appRoot = document.getElementById('app-root');
        
        // Create sentences on screen
        missions.forEach((m, idx) => {
            const el = document.createElement('div');
            el.className = 'mission-text-item';
            el.textContent = m.targetText;
            const startTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mission-text-start-top')) || 20;
            const gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mission-text-gap')) || 20;
            el.style.top = (startTop + idx * gap) + '%';
            el.style.left = '50%';
            el.style.transform = 'translateX(-50%)';
            
            // Hint Bubble 추가
            if (m.description) {
                const hint = document.createElement('div');
                hint.className = 'magnifier-hint';
                hint.textContent = `💡 힌트: ${m.description}`;
                el.appendChild(hint);
            }

            el.onclick = (e) => {
                this.applyStamp(e, m, el);
                
                // Check if all fake ones are found
                const totalFakes = missions.filter(ms => ms.isFake).length;
                const foundFakes = this.container.querySelectorAll('.found').length;
                if (totalFakes === foundFakes) {
                    this.isComplete = true;
                    this.container.classList.remove('magnifier-bg-dim'); // 완료 시 배경 제거
                    const timer = setTimeout(() => window.StoryEngine.next(), 3000);
                    window.StoryEngine.registerTrigger(timer);
                }
            };

            this.container.appendChild(el);
            sentences.push({ el, m });
        });

        let activeSentence = null;

        document.onmousemove = (e) => {
            const rootRect = appRoot.getBoundingClientRect();
            const mouseX = e.clientX - rootRect.left;
            const mouseY = e.clientY - rootRect.top;
            
            const halfSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--magnifier-size')) / 2 || 75;
            
            // 돋보기 위치 업데이트 (상대 좌표 사용)
            this.magnifier.style.left = (mouseX - halfSize) + 'px';
            this.magnifier.style.top = (mouseY - halfSize) + 'px';

            let detected = null;
            sentences.forEach(s => {
                const sRect = s.el.getBoundingClientRect();
                if (e.clientX > sRect.left && e.clientX < sRect.right && 
                    e.clientY > sRect.top && e.clientY < sRect.bottom) {
                    detected = s.el;
                }
            });

            if (detected !== activeSentence) {
                if (activeSentence) activeSentence.classList.remove('highlight');
                activeSentence = detected;
                if (activeSentence) activeSentence.classList.add('highlight');
            }
        };
    }

    applyStamp(e, mission, parentEl) {
        if (parentEl.classList.contains('stamped')) return;
        parentEl.classList.add('stamped');

        // 효과음 재생 (탁!)
        window.StoryEngine.playEffect('efffect/탁.wav');

        const stamp = document.createElement('div');
        stamp.className = 'fake-stamp stamped';
        
        if (mission.isFake) {
            stamp.style.backgroundImage = "url('assets/images/props/UI_Stamp_Fake.png')";
            parentEl.classList.add('found');
        } else {
            stamp.style.backgroundImage = "none";
            stamp.textContent = "VERIFIED";
            stamp.style.border = "4px solid #00ff00";
            stamp.style.color = "#00ff00";
            stamp.style.background = "rgba(0, 255, 0, 0.1)";
            stamp.style.borderRadius = "12px";
            stamp.style.fontSize = "1.5rem";
            stamp.style.fontWeight = "bold";
            stamp.style.display = "flex";
            stamp.style.justifyContent = "center";
            stamp.style.alignItems = "center";
        }
        
        // 도장 위치 보정 (부모 컨테이너 기준 상대 좌표)
        const rect = this.container.getBoundingClientRect();
        const stampX = e.clientX - rect.left;
        const stampY = e.clientY - rect.top;
        
        stamp.style.left = stampX + 'px';
        stamp.style.top = stampY + 'px';
        this.container.appendChild(stamp);

        window.StoryEngine.typeText(mission.feedback);
    }

    // 3. Point Interaction
    renderPointMission(scene) {
        const mission = scene.mission[0];
        this.container.style.cursor = "url('assets/images/props/laser_scan.png') 40 40, auto";
        this.magnifier.style.display = 'none';
        this.container.style.pointerEvents = 'auto';
        
        const glow = document.createElement('div');
        glow.className = 'neon-circle hidden';
        this.container.appendChild(glow);

        if (mission.showImmediately) {
            glow.classList.remove('hidden');
            const rect = this.container.getBoundingClientRect();
            const scale = rect.width / 960;
            glow.style.left = `${mission.x * scale}px`;
            glow.style.top = `${mission.y * scale}px`;
            glow.style.width = `${100 * scale}px`;
            glow.style.height = `${100 * scale}px`;
        }

        // [수정] 마우스 이동 시 힌트를 미리 보여주는 로직 제거 (요청 사항)
        document.onmousemove = null;

        this.container.onclick = (e) => {
            const rect = this.container.getBoundingClientRect();
            const scale = rect.width / 960;
            const clickX = Math.round((e.clientX - rect.left) / scale);
            const clickY = Math.round((e.clientY - rect.top) / scale);

            // [Debug] 좌표 로그 출력
            console.log(`%c[Coord Helper] Clicked at x: ${clickX}, y: ${clickY}`, "color: #ff0055; font-weight: bold;");

            const targetX = mission.x;
            const targetY = mission.y;
            const dist = Math.sqrt(Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2));

            if (dist < 100) {
                // [정답]
                this.isComplete = true;
                
                // 효과음 재생 (뾰로롱)
                window.StoryEngine.playEffect('efffect/뾰로롱.wav');
                
                // 정답 위치에 네온 써클 표시
                glow.classList.remove('hidden');
                glow.style.left = `${targetX * scale}px`;
                glow.style.top = `${targetY * scale}px`;
                glow.style.width = `${120 * scale}px`; // 조금 더 크게 강조
                glow.style.height = `${120 * scale}px`;
                
                // 기존 힌트 툴팁 제거
                const oldTooltip = document.querySelector('.point-hint-tooltip');
                if (oldTooltip) oldTooltip.remove();

                if (mission.action === 'slide_down') {
                    const partImg = document.createElement('img');
                    partImg.src = `assets/images/props/${mission.targetProp}`;
                    partImg.className = 'fixed-part-prop slideDown';
                    
                    const px = mission.partX !== undefined ? mission.partX : targetX;
                    const py = mission.partY !== undefined ? mission.partY : targetY;
                    
                    partImg.style.left = `${px * scale}px`;
                    partImg.style.top = `${py * scale}px`;
                    if (mission.width) {
                        partImg.style.width = `${mission.width * scale}px`;
                    }
                    this.container.appendChild(partImg);
                } else {
                    window.StoryEngine.nodes.propImg.src = `assets/images/props/${mission.targetProp}`;
                }
                
                window.StoryEngine.typeText(mission.feedback);
                
                const timer = setTimeout(() => {
                    window.StoryEngine.next();
                }, 2000);
                window.StoryEngine.registerTrigger(timer);
                
                this.container.onclick = null;
                this.container.style.cursor = 'auto';
            } else {
                // [오답] 다른 곳을 클릭했을 때만 힌트(네온 써클 + 툴팁) 노출
                glow.classList.remove('hidden');
                glow.style.left = `${targetX * scale}px`;
                glow.style.top = `${targetY * scale}px`;
                glow.style.width = `${100 * scale}px`;
                glow.style.height = `${100 * scale}px`;

                let tooltip = document.querySelector('.point-hint-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.className = 'point-hint-tooltip';
                    tooltip.textContent = '여기를 자세히 보세요!';
                    this.container.appendChild(tooltip);
                }
                tooltip.style.left = `${targetX * scale}px`;
                tooltip.style.top = `${(targetY + 80) * scale}px`;
                tooltip.style.transform = 'translateX(-50%)';
            }
        };
    }

    // 4. Quiz
    renderQuiz(scene) {
        const q = scene;
        this.container.style.pointerEvents = 'auto';

        const wrapper = document.createElement('div');
        wrapper.className = 'interaction-centered-wrapper';
        
        const popup = document.createElement('div');
        popup.className = 'quiz-popup';
        
        const title = document.createElement('h3');
        title.textContent = q.question;
        popup.appendChild(title);
        
        const choiceWrap = document.createElement('div');
        choiceWrap.className = 'quiz-choice-wrap';
        
        q.options.forEach((opt) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = opt.text;
            btn.onclick = () => {
                if (opt.isCorrect) {
                    window.StoryEngine.playEffect('efffect/뾰로롱.wav');
                    wrapper.remove(); // 정답 시 퀴즈 창 즉시 제거
                    this.showResultPopup(opt.feedback || "정답이야~!", true, () => {
                        // Ensure complete is marked before moving to next scene
                        this.isComplete = true; 
                        window.StoryEngine.next();
                    });
                } else {
                    window.StoryEngine.playEffect('efffect/오답.wav');
                    popup.classList.add('shake-anim');
                    setTimeout(() => popup.classList.remove('shake-anim'), 500);
                    this.showResultPopup(opt.feedback || "오답이야! 다시 한번 생각해봐!", false);
                }
            };
            choiceWrap.appendChild(btn);
        });
        
        popup.appendChild(choiceWrap);
        wrapper.appendChild(popup);
        this.container.appendChild(wrapper);
    }

    showResultPopup(text, isCorrect, callback) {
        const result = document.createElement('div');
        result.className = 'result-popup' + (isCorrect ? ' correct' : ' wrong');
        result.innerHTML = `
            <div class="result-content">
                <div class="result-icon">${isCorrect ? '✅' : '❌'}</div>
                <div class="result-text">${text}</div>
                <button class="result-close-btn">확인</button>
            </div>
        `;
        
        document.body.appendChild(result); // document.body에 직접 추가하여 전체 화면 덮기 보장
        
        result.querySelector('.result-close-btn').onclick = () => {
            result.remove();
            if (isCorrect && callback) callback();
        };
    }

    // 5. Final Reward Scene (Ceremony)
    renderFinalScene(scene) {
        this.isComplete = true; 
        this.container.style.pointerEvents = 'auto';

        // 0. Character Size (50% width) 및 대사창 보장
        if (window.StoryEngine) {
            const charMain = window.StoryEngine.nodes.char;
            if (charMain) charMain.classList.add('final-char-scale');
            
            // 대사창 강제 노출 보장 (지연 방지)
            const diag = window.StoryEngine.nodes.dialogueContainer;
            diag.classList.remove('hidden');
            diag.style.setProperty('display', 'block', 'important'); 
            diag.style.setProperty('z-index', '10000', 'important'); 
        }
        
        // 연출용 파티클 (Sparkle)
        const startSparkles = setInterval(() => {
            if (window.StoryEngine) window.StoryEngine.createSparkle();
        }, 150);
        setTimeout(() => clearInterval(startSparkles), 10000); 

        // 6,000ms → showSystemText (뱃지 연출 완료 후)
        setTimeout(() => {
            if (window.StoryEngine) {
                window.StoryEngine.nodes.speaker.textContent = '시스템';
                window.StoryEngine.typeText("축하합니다! 우주 탐정단 과정을 완료하셨습니다.");
            }
        }, 6000);

        // 학습 종료 버튼 생성 (7.5초 뒤)
        setTimeout(() => {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'btn-final-close';
            closeBtn.innerHTML = '화면을 클릭하여<br>종료';
            closeBtn.onclick = () => {
                window.parent.postMessage({ type: 'LESSON_COMPLETE', stageId: 'stage_6' }, '*');
                alert('수고하셨습니다! 모든 수사를 마쳤습니다.');
            };
            this.container.appendChild(closeBtn);
        }, 7500);
    }
}

window.InteractionHandler = new InteractionHandler();