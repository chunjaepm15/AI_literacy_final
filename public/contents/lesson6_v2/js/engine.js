/**
 * Scenario Engine for Space Detective Agency
 * Handles scene transitions, narration, and audio mapping.
 */

class StoryEngine {
    constructor() {
        this.data = null;
        this.currentSceneIndex = 0;
        this.isTyping = false;
        this.isTransitioning = false; // 중복 클릭 방지 플래그
        this.activeTriggers = [];
        this.activeEffects = []; // 재생 중인 효과음 추적용 배열 추가
        
        // DOM Elements
        this.nodes = {
            bg: document.getElementById('bg-layer'),
            char: document.getElementById('char-main'),
            speaker: document.getElementById('speaker-name'),
            text: document.getElementById('dialogue-text'),
            nextBtn: document.getElementById('next-btn'),
            dialogueContainer: document.getElementById('dialogue-container'),
            dialogueBox: document.querySelector('.dialogue-box'),
            progressBar: document.getElementById('progress-bar'),
            interactionLayer: document.getElementById('interaction-layer'),
            debug: document.getElementById('debug-info'),
            propLayer: document.getElementById('prop-layer'),
            propTitle: document.getElementById('prop-title'),
            propImg: document.getElementById('prop-img'),
            propVideo: document.getElementById('prop-video'),
            propSubLayer: document.getElementById('prop-sub-layer'),
            propSubImg: document.getElementById('prop-sub-img'),
            propSubVideo: document.getElementById('prop-sub-video'),
            propFgLayer: document.getElementById('prop-fg-layer'),
            propFgImg: document.getElementById('prop-fg-img'),
            propFgVideo: document.getElementById('prop-fg-video'),
            propExtraLayer: document.getElementById('prop-extra-layer'),
            propExtraImg: document.getElementById('prop-extra-img'),
            propExtraVideo: document.getElementById('prop-extra-video'),
            charSub: document.getElementById('char-sub'),
            siren: document.getElementById('siren-overlay'),
            ticker: document.getElementById('ticker-bar'),
            magnifier: document.getElementById('magnifier'),
            dimLayer: document.getElementById('dim-layer'),
            appRoot: document.getElementById('app-root')
        };

        this.init();
    }

    async init() {
        console.log('StoryEngine initializing...');
        const startOverlay = document.getElementById('start-overlay');
        const startBtn = document.getElementById('start-btn');

        if (!startBtn) {
            console.error('Start button not found in DOM');
            return;
        }

        startBtn.onclick = () => {
            console.log('Start button clicked - Event Triggered');
            if (!this.data) {
                alert('데이터를 로딩 중입니다. 잠시만 기다려 주세요.');
                return;
            }
            startOverlay.classList.add('hidden');
            this.renderScene();
        };

        try {
            const response = await fetch('data/stage_6.json');
            this.data = await response.json();
            
            this.nodes.nextBtn.onclick = () => {
                this.handleNextClick();
            };

            // URL 파라미터 또는 해시를 통해 특정 씬으로 바로 이동
            this.checkJump();

        } catch (error) {
            console.error('Failed to load scenario:', error);
        }
    }

    /**
     * URL의 'scene' 파라미터나 해시값을 확인하여 해당 씬으로 점프합니다.
     */
    checkJump() {
        console.log('StoryEngine: Checking for jump parameter...');
        const urlParams = new URLSearchParams(window.location.search);
        let sceneId = urlParams.get('scene') || window.location.hash.replace('#', '');
        
        if (!sceneId) {
            console.log('StoryEngine: No scene parameter found in URL.');
            return false;
        }

        if (!this.data || !this.data.scenes) {
            console.warn('StoryEngine: Data not loaded yet.');
            return false;
        }

        sceneId = sceneId.trim().toLowerCase();
        console.log('StoryEngine: Searching for scene:', sceneId);

        const targetIndex = this.data.scenes.findIndex(s => {
            const sid = s.id.toLowerCase();
            return sid === sceneId || 
                   sid === `scene_${sceneId}` ||
                   sid.replace('scene_', '') === sceneId;
        });

        if (targetIndex !== -1) {
            const matchedScene = this.data.scenes[targetIndex];
            console.log(`StoryEngine: Jumping to scene [${matchedScene.id}] at index ${targetIndex}`);
            
            this.currentSceneIndex = targetIndex;
            const startOverlay = document.getElementById('start-overlay');
            if (startOverlay) {
                startOverlay.classList.add('hidden');
                console.log('StoryEngine: Start overlay hidden.');
            }
            
            // InteractionHandler가 아직 정의되지 않았을 수 있으므로 약간의 지연 후 실행
            if (!window.InteractionHandler) {
                console.log('StoryEngine: Waiting for InteractionHandler...');
                setTimeout(() => this.renderScene(), 100);
            } else {
                this.renderScene();
            }
            return true;
        } else {
            console.warn('StoryEngine: Scene ID not found in scenario data:', sceneId);
        }
        return false;
    }

    handleNextClick() {
        if (this.isTyping) {
            // Skip typing
            this.skipTyping = true;
            return;
        }

        const scene = this.data.scenes[this.currentSceneIndex];
        if (scene.type.startsWith('interaction_')) {
            // Check if mission is complete (handled by interaction handler)
            if (!window.InteractionHandler.isComplete) {
                this.typeText("미션을 완료해야 다음으로 넘어갈 수 있어!");
                return;
            }
        }

        this.next();
    }

    renderScene() {
        const scene = this.data.scenes[this.currentSceneIndex];
        if (!scene) return;

        // URL 파라미터 업데이트 (디버깅용)
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('scene', scene.id);
        window.history.replaceState(null, '', newUrl);

        // Clear previous triggers
        this.activeTriggers.forEach(t => clearTimeout(t));
        this.activeTriggers = [];

        // [추가] 재생 중인 모든 효과음 정지 (잔향 제거)
        this.activeEffects.forEach(effect => {
            effect.pause();
            effect.currentTime = 0;
        });
        this.activeEffects = [];

        // 1. Update Progress & Debug
        const progress = ((this.currentSceneIndex + 1) / this.data.scenes.length) * 100;
        this.nodes.progressBar.style.width = `${progress}%`;
        this.nodes.debug.textContent = `[v2.6] Scene: ${scene.id} | Audio: ${scene.audio || 'none'}`;

        // 2. Update Background
        if (scene.bg) {
            const newBg = `url('assets/images/bg/${scene.bg}.png')`;
            if (this.nodes.bg.style.backgroundImage !== newBg) {
                this.nodes.bg.style.backgroundImage = newBg;
            }
        }

        // 3. Update Effects
        if (scene.siren) this.nodes.siren.classList.add('siren-active');
        else this.nodes.siren.classList.remove('siren-active');

        if (scene.ticker) this.nodes.ticker.classList.remove('hidden');
        else this.nodes.ticker.classList.add('hidden');

        // [추가] 모든 Prop 레이어 초기화 (중첩 방지)
        const clearLayer = (layer, img, video) => {
            layer.classList.add('hidden');
            layer.className = layer.id === 'prop-layer' ? 'prop-container' : 
                             (layer.id === 'prop-sub-layer' ? 'prop-container sub' : 'prop-container fg');
            layer.classList.add('hidden');
            
            if (img) {
                img.src = '';
                img.classList.add('hidden');
                img.className = 'prop-image';
            }
            if (video) {
                video.pause();
                video.src = '';
                video.load();
                video.classList.add('hidden');
            }
        };

        clearLayer(this.nodes.propLayer, this.nodes.propImg, this.nodes.propVideo);
        clearLayer(this.nodes.propSubLayer, this.nodes.propSubImg, this.nodes.propSubVideo);
        clearLayer(this.nodes.propFgLayer, this.nodes.propFgImg, this.nodes.propFgVideo);

        // 4. Update Characters and Dimming
        this.updateCharacters(scene);

        // 5. Update Prop Image
        if (scene.prop) {
            const isVideo = scene.prop.toLowerCase().endsWith('.mp4');
            const img = this.nodes.propImg;
            const video = this.nodes.propVideo;

            if (isVideo) {
                img.classList.add('hidden');
                img.src = '';
                video.src = `assets/videos/${scene.prop}`;
                video.oncanplay = () => {
                    video.classList.remove('hidden');
                    this.nodes.propLayer.classList.remove('hidden'); // 준비 완료 시 노출
                    video.play();
                };
            } else {
                if (video) {
                    video.pause();
                    video.classList.add('hidden');
                }
                img.src = `assets/images/props/${scene.prop}`;
                img.onload = () => {
                    img.classList.remove('hidden');
                    this.nodes.propLayer.classList.remove('hidden'); // 로딩 완료 시 노출
                };
            }

            // Reset classes (hidden 상태 보존)
            const wasHidden = this.nodes.propLayer.classList.contains('hidden');
            img.className = 'prop-image';
            this.nodes.propLayer.className = 'prop-container' + (wasHidden ? ' hidden' : '');
            this.nodes.interactionLayer.className = ''; 

            if (scene.className) {
                const classes = scene.className.split(' ');
                classes.forEach(cls => {
                    if (cls) {
                        this.nodes.propLayer.classList.add(cls);
                        if (cls.includes('scale') || cls.includes('pos') || cls.includes('scene-')) {
                            this.nodes.interactionLayer.classList.add(cls);
                        }
                    }
                });
            }
            
            const targetEl = isVideo ? video : img;
            if (scene.animation) {
                void targetEl.offsetWidth;
                targetEl.classList.add(scene.animation);
            }
        }

        // [추가] 타이틀 표시 로직
        if (scene.propTitle) {
            this.nodes.propTitle.textContent = scene.propTitle;
            this.nodes.propTitle.classList.remove('hidden');
        } else {
            this.nodes.propTitle.classList.add('hidden');
        }

        // 6. Update Dialogue
        if (scene.hideDialogue) {
            this.nodes.dialogueContainer.classList.add('hidden');
            this.nodes.text.textContent = ''; // 이전 텍스트 확실히 제거
        } else {
            this.nodes.dialogueContainer.classList.remove('hidden');
            this.nodes.speaker.textContent = scene.speaker || '';
            this.typeText(scene.text);
        }

        // 7. Play Audio
        if (scene.audio) {
            this.playAudio(scene.audio, scene.audioLoop);
        }

        // 8. Handle Interaction & Cleanup
        // [Safety Fix] Clear all lingering interaction UI elements
        const lingeredSelectors = [
            '.result-popup', 
            '.quiz-popup', 
            '.interaction-centered-wrapper', 
            '.custom-overlay-layer',
            '.fake-stamp',
            '.mission-text-item'
        ];
        lingeredSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });

        this.nodes.interactionLayer.innerHTML = '';
        if (this.nodes.magnifier) this.nodes.magnifier.style.display = 'none';
        this.nodes.interactionLayer.style.cursor = 'auto';
        this.nodes.interactionLayer.style.pointerEvents = 'none'; // Default
        this.nodes.dimLayer.classList.add('hidden'); // Default hide
        
        // Remove previous custom classes from app root
        this.nodes.appRoot.className = ''; 
        if (scene.customClass) {
            scene.customClass.split(' ').forEach(cls => {
                if (cls) this.nodes.appRoot.classList.add(cls);
            });
        }

        // [강제 노출] 07_01 씬은 무조건 대사창을 보여줌
        if (scene.id === 'scene_07_01') {
            this.nodes.dialogueContainer.classList.remove('hidden');
            this.nodes.dialogueContainer.style.setProperty('display', 'block', 'important');
        }

        // Always init handler to clear internal state and container
        if (window.InteractionHandler) {
            window.InteractionHandler.init(scene);
        } else {
            console.error('InteractionHandler not found! Make sure interaction.js is loaded.');
        }

        // Reset mission complete status
        window.InteractionHandler.isComplete = false;

        // Re-enable interaction layer if type is interaction
        if (scene.type.startsWith('interaction_') || scene.type === 'interaction_final') {
            this.nodes.interactionLayer.style.pointerEvents = 'auto';
            
            // Don't show dimLayer immediately if there's a trigger to start mission later
            const hasStartTrigger = scene.triggers && scene.triggers.some(t => t.action === 'startMission');
            if (!hasStartTrigger) {
                this.nodes.dimLayer.classList.remove('hidden');
            }
        }

        // 9. Setup Triggers
        if (scene.triggers) {
            scene.triggers.forEach(trigger => {
                const timer = setTimeout(() => {
                    this.executeTrigger(trigger);
                }, trigger.time);
                this.activeTriggers.push(timer);
            });
        }

        // 10. Auto Next Logic
        if (scene.autoNext && scene.audioDuration) {
            const timer = setTimeout(() => {
                this.next();
            }, scene.audioDuration);
            this.activeTriggers.push(timer);
        }

        // Ensure next button is always visible
        this.nodes.nextBtn.classList.remove('hidden');
        
        // 씬 전환 완료 후 플래그 해제 (짧은 지연시간 부여)
        setTimeout(() => { this.isTransitioning = false; }, 300);
    }

    updateCharacters(scene) {
        const chars = scene.characters || (scene.character ? [scene.character] : []);
        const speaker = scene.speaker;

        // Reset elements & Custom styles
        this.nodes.char.className = 'character hidden';
        this.nodes.charSub.className = 'character hidden';
        this.nodes.char.style.left = '';
        this.nodes.char.style.right = '';
        this.nodes.char.style.bottom = '';
        this.nodes.char.style.transform = '';
        this.nodes.charSub.style.left = '';
        this.nodes.charSub.style.right = '';
        this.nodes.charSub.style.bottom = '';
        this.nodes.charSub.style.transform = '';

        const getCharClass = (filename) => {
            if (filename.toLowerCase().includes('sky')) return 'sky';
            if (filename.toLowerCase().includes('yellow')) return 'yellow';
            return '';
        };

        if (chars.length === 1) {
            // Single character
            this.nodes.char.src = `assets/images/char/${chars[0]}.png`;
            this.nodes.char.classList.remove('hidden');
            this.nodes.char.classList.add('single');
            const extraClass = getCharClass(chars[0]);
            if (extraClass) this.nodes.char.classList.add(extraClass);

            // [JSON 직접 좌표 설정]
            if (scene.charX) {
                this.nodes.char.style.left = scene.charX;
                this.nodes.char.style.right = 'auto';
                this.nodes.char.style.transform = 'none';
            }
            if (scene.charRight) {
                this.nodes.char.style.right = scene.charRight;
                this.nodes.char.style.left = 'auto';
                this.nodes.char.style.transform = 'none';
            }
            if (scene.charY) this.nodes.char.style.bottom = scene.charY;

            // [추가] 페이드인 애니메이션 트리거
            this.nodes.char.classList.remove('char-fade-in');
            void this.nodes.char.offsetWidth;
            this.nodes.char.classList.add('char-fade-in');
        } else if (chars.length > 1) {
            // Dual characters - main on right, sub on left
            this.nodes.char.src = `assets/images/char/${chars[0]}.png`;
            this.nodes.char.classList.remove('hidden');
            this.nodes.char.classList.add('main');
            const extraClass0 = getCharClass(chars[0]);
            if (extraClass0) this.nodes.char.classList.add(extraClass0);

            // [JSON 직접 좌표 설정 - Main]
            if (scene.charX) {
                this.nodes.char.style.left = scene.charX;
                this.nodes.char.style.right = 'auto';
                this.nodes.char.style.transform = 'none';
            }
            if (scene.charRight) {
                this.nodes.char.style.right = scene.charRight;
                this.nodes.char.style.left = 'auto';
                this.nodes.char.style.transform = 'none';
            }
            if (scene.charY) this.nodes.char.style.bottom = scene.charY;

            // [추가] 메인 캐릭터 페이드인
            this.nodes.char.classList.remove('char-fade-in');
            void this.nodes.char.offsetWidth;
            this.nodes.char.classList.add('char-fade-in');

            this.nodes.charSub.src = `assets/images/char/${chars[1]}.png`;
            this.nodes.charSub.classList.remove('hidden');
            this.nodes.charSub.classList.add('sub');
            const extraClass1 = getCharClass(chars[1]);
            if (extraClass1) this.nodes.charSub.classList.add(extraClass1);

            // [JSON 직접 좌표 설정 - Sub]
            if (scene.charSubX) {
                this.nodes.charSub.style.left = scene.charSubX;
                this.nodes.charSub.style.right = 'auto';
                this.nodes.charSub.style.transform = 'none';
            }
            if (scene.charSubY) this.nodes.charSub.style.bottom = scene.charSubY;

            // [추가] 서브 캐릭터 페이드인
            this.nodes.charSub.classList.remove('char-fade-in');
            void this.nodes.charSub.offsetWidth;
            this.nodes.charSub.classList.add('char-fade-in');

            // Handle dimming
            if (speaker && !scene.noDimming) {
                if (!this.isSpeakerMatch(speaker, chars[0])) this.nodes.char.classList.add('dim');
                if (!this.isSpeakerMatch(speaker, chars[1])) this.nodes.charSub.classList.add('dim');
            }
        }
    }

    isSpeakerMatch(speaker, charFilename) {
        if (speaker === '듬이' && charFilename.toLowerCase().includes('sky')) return true;
        if ((speaker === '버리' || speaker === '벼리') && charFilename.toLowerCase().includes('yellow')) return true;
        if (speaker === '시스템' || speaker === '나레이션') return true; 
        return false;
    }

    executeTrigger(trigger) {
        console.log('Executing trigger:', trigger.action);
        switch (trigger.action) {
            case 'autoNext':
                this.next();
                break;
            case 'showProp':
                let layer, img, video;
                if (trigger.slot === 'sub') {
                    layer = this.nodes.propSubLayer;
                    img = this.nodes.propSubImg;
                    video = this.nodes.propSubVideo;
                } else if (trigger.slot === 'fg') {
                    layer = this.nodes.propFgLayer;
                    img = this.nodes.propFgImg;
                    video = this.nodes.propFgVideo;
                } else if (trigger.slot === 'extra') {
                    layer = this.nodes.propExtraLayer;
                    img = this.nodes.propExtraImg;
                    video = this.nodes.propExtraVideo;
                } else {
                    layer = this.nodes.propLayer;
                    img = this.nodes.propImg;
                    video = this.nodes.propVideo;
                }
                
                // [수정] 기존 커스텀 클래스 초기화 시 기본 구조 클래스는 유지
                if (layer.id === 'prop-layer') {
                    layer.classList.remove('white-frame', 'blue-frame', 'no-frame');
                }
                layer.classList.add('hidden');

                const isVideo = trigger.prop && trigger.prop.toLowerCase().endsWith('.mp4');
                const isNone = trigger.prop === 'none';
                
                if (isNone) {
                    img.classList.add('hidden');
                    if (video) video.classList.add('hidden');
                    layer.classList.remove('hidden'); // [추가] 박스 자체는 보여줘야 화살표가 보임
                } else if (isVideo) {
                    img.classList.add('hidden');
                    img.src = ''; 
                    video.src = `assets/videos/${trigger.prop}`;
                    video.oncanplay = () => {
                        video.classList.remove('hidden');
                        layer.classList.remove('hidden'); 
                        video.play();
                    };
                } else {
                    if (video) {
                        video.pause();
                        video.classList.add('hidden');
                    }
                    const newSrc = `assets/images/props/${trigger.prop}`;
                    if (img.src.indexOf(newSrc) === -1 || img.classList.contains('hidden')) {
                        img.src = newSrc;
                        img.onload = () => {
                            img.classList.remove('hidden');
                            layer.classList.remove('hidden'); 
                        };
                    } else {
                        layer.classList.remove('hidden');
                    }
                }
                
                if (trigger.customClass || trigger.className) {
                    const classes = (trigger.customClass || trigger.className).split(' ');
                    classes.forEach(cls => {
                        if (cls) layer.classList.add(cls);
                    });
                }

                // [강제 적용] JSON의 좌표 수치가 무조건 우선하도록 인라인 스타일 주입
                if (trigger.x !== undefined) layer.style.left = trigger.x;
                if (trigger.y !== undefined) layer.style.top = trigger.y;

                // [추가] 트리거 시점에 타이틀 변경 지원
                if (trigger.propTitle) {
                    this.nodes.propTitle.textContent = trigger.propTitle;
                    this.nodes.propTitle.classList.remove('hidden');
                }
                if (trigger.animation) {
                    img.className = 'prop-image';
                    void img.offsetWidth;
                    img.classList.add(trigger.animation);
                }

                // [추가] x, y 좌표 직접 제어 지원
                if (trigger.x !== undefined) {
                    layer.style.left = typeof trigger.x === 'number' ? `${trigger.x}px` : trigger.x;
                }
                if (trigger.y !== undefined) {
                    layer.style.top = typeof trigger.y === 'number' ? `${trigger.y}px` : trigger.y;
                }
                if (trigger.width !== undefined) {
                    const w = typeof trigger.width === 'number' ? `${trigger.width}px` : trigger.width;
                    layer.style.width = w;
                    layer.style.maxWidth = 'none';
                    if (img) img.style.width = w;
                    if (video) video.style.width = w;
                }
                if (trigger.height !== undefined) {
                    const h = typeof trigger.height === 'number' ? `${trigger.height}px` : trigger.height;
                    layer.style.height = h;
                    layer.style.maxHeight = 'none';
                    if (img) img.style.height = h;
                    if (video) video.style.height = h;
                }
                // 비율 유지를 위해 object-fit 보강
                if (img) img.style.objectFit = 'contain';
                if (video) video.style.objectFit = 'contain';
                break;
            case 'playAudio':
                this.playEffect(trigger.audio);
                break;
            case 'startMission':
                this.nodes.dimLayer.classList.remove('hidden');
                break;
            case 'startFanfare':
                this.playEffect('efffect/뾰로롱.wav'); // fanfare.wav가 없으므로 기존 효과음 사용
                this.nodes.appRoot.classList.add('camera-shake-active');
                
                // 대사창 강제 노출 보장
                this.nodes.dialogueContainer.classList.remove('hidden');
                this.nodes.dialogueContainer.style.setProperty('display', 'block', 'important');
                this.nodes.dialogueContainer.style.setProperty('z-index', '10000', 'important');

                // 뱃지 연출 추가
                if (!document.getElementById('reward-badge')) {
                    const badge = document.createElement('img');
                    badge.id = 'reward-badge';
                    badge.src = 'assets/images/props/UI_Badge_Gold.png';
                    badge.className = 'badge-reward-v3 badge-arc-fly';
                    badge.style.position = 'absolute';
                    badge.style.top = '50%';
                    badge.style.left = '50%';
                    badge.style.zIndex = '1001';
                    this.nodes.interactionLayer.appendChild(badge);
                    
                    setTimeout(() => {
                        badge.classList.remove('badge-arc-fly');
                        badge.classList.add('move-to-corner');
                        setTimeout(() => {
                            const collectionContainer = document.getElementById('badge-collection-container');
                            if (collectionContainer) {
                                collectionContainer.classList.remove('hidden');
                                // 뱃지 획득 툴팁 반짝임 효과 (버튼 위치 고정을 위해 절대 좌표 설정)
                                const tooltip = document.getElementById('badge-tooltip');
                                if (tooltip) {
                                    tooltip.style.position = 'absolute';
                                    tooltip.style.top = '95px'; /* 버튼 하단에 배치 */
                                    tooltip.style.bottom = 'auto';
                                    tooltip.style.right = '0';
                                    tooltip.style.whiteSpace = 'nowrap';
                                    tooltip.style.display = 'block';
                                    setTimeout(() => tooltip.style.display = 'none', 3000);
                                }
                            }
                            badge.remove();
                        }, 1400);
                    }, 3000);
                }

                // [추가] 탐정 수료증 받기 버튼 노출 (4.5초 뒤)
                setTimeout(() => {
                    const finishBtn = document.getElementById('btn-reward-finish');
                    if (finishBtn) {
                        finishBtn.classList.remove('hidden');
                        finishBtn.classList.add('animate-pulse');
                        finishBtn.onclick = () => {
                            window.parent.postMessage({ type: 'LESSON_COMPLETE', stageId: 'stage_6' }, '*');
                            alert('축하합니다! 모든 미션을 완료하여 진실 탐정이 되었습니다.');
                        };
                    }
                }, 4500);

                for (let i = 0; i < 50; i++) {
                    this.createConfetti();
                }
                setTimeout(() => {
                    this.nodes.appRoot.classList.remove('camera-shake-active');
                }, 1000);
                break;
            case 'customClass':
                if (trigger.className) {
                    this.nodes.appRoot.classList.add(trigger.className);
                }
                break;
            case 'addClass':
                if (trigger.className && trigger.targetId) {
                    const el = document.getElementById(trigger.targetId);
                    if (el) el.classList.add(trigger.className);
                }
                break;
            case 'showSystemText':
                this.nodes.speaker.textContent = '시스템';
                this.typeText(trigger.text);
                break;
            case 'nextStep':
                const scene = this.data.scenes[this.currentSceneIndex];
                const next = scene.nextStep;
                if (next) {
                    this.nodes.speaker.textContent = next.speaker;
                    this.playAudio(next.audio);
                    
                    const nextChars = next.characters || (next.character ? [scene.character, next.character] : null);
                    if (nextChars) {
                        this.updateCharacters({
                            characters: nextChars,
                            speaker: next.speaker
                        });
                    }

                    if (next.text) {
                        this.typeText(next.text);
                    }
                    
                    if (next.prop) {
                        this.nodes.propImg.src = `assets/images/props/${next.prop}`;
                    }

                    if (next.triggers) {
                        next.triggers.forEach(trigger => {
                            const timer = setTimeout(() => {
                                this.executeTrigger(trigger);
                            }, trigger.time);
                            this.activeTriggers.push(timer);
                        });
                    }

                    if (next.audioDuration) {
                        const timer = setTimeout(() => this.next(), next.audioDuration);
                        this.activeTriggers.push(timer);
                    }
                }
                break;
            case 'showGlow':
                const glow = document.createElement('div');
                glow.className = 'neon-circle';
                glow.id = 'temp-glow';
                const rect = this.nodes.interactionLayer.getBoundingClientRect();
                const scale = rect.width / 960;
                glow.style.left = `${(trigger.x || 800) * scale}px`;
                glow.style.top = `${(trigger.y || 180) * scale}px`;
                glow.style.width = `${(trigger.size || 100) * scale}px`;
                glow.style.height = `${(trigger.size || 100) * scale}px`;
                this.nodes.interactionLayer.appendChild(glow);
                break;
            case 'hideGlow':
                const oldGlow = document.getElementById('temp-glow');
                if (oldGlow) oldGlow.remove();
                break;
        }
    }

    createConfetti() {
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
        const div = document.createElement('div');
        div.className = 'confetti';
        div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        div.style.left = Math.random() * 100 + 'vw';
        div.style.animationDuration = (Math.random() * 2 + 2) + 's';
        div.style.opacity = Math.random();
        this.nodes.interactionLayer.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }

    createSparkle() {
        const div = document.createElement('div');
        div.className = 'sparkle';
        div.style.left = Math.random() * 100 + '%';
        div.style.top = Math.random() * 100 + '%';
        div.style.animationDelay = Math.random() * 2 + 's';
        this.nodes.interactionLayer.appendChild(div);
        setTimeout(() => div.remove(), 2000);
    }

    typeText(text) {
        if (!text) return;
        if (this.typingInterval) clearInterval(this.typingInterval);
        this.isTyping = true;
        this.skipTyping = false;
        let i = 0;
        this.nodes.text.innerHTML = ''; // textContent 대신 innerHTML 사용

        this.typingInterval = setInterval(() => {
            if (this.skipTyping) {
                this.nodes.text.innerHTML = text;
                clearInterval(this.typingInterval);
                this.isTyping = false;
                this.checkDialogueHeight();
                return;
            }

            // HTML 태그 처리
            if (text[i] === '<') {
                const tagEnd = text.indexOf('>', i);
                if (tagEnd !== -1) {
                    i = tagEnd + 1;
                }
            } else {
                i++;
            }

            this.nodes.text.innerHTML = text.substring(0, i);
            
            if (i >= text.length) {
                clearInterval(this.typingInterval);
                this.isTyping = false;
                this.checkDialogueHeight();
            }
        }, 30);
    }

    checkDialogueHeight() {
        // 고정 높이 사용으로 인해 동적 높이 조절 비활성화
    }

    playAudio(filename, loop = false) {
        if (!filename) return;
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        const audioPath = `assets/audio/${filename}`;
        console.log('Playing narration:', audioPath);
        this.currentAudio = new Audio(audioPath);
        this.currentAudio.loop = loop;
        
        if (filename.includes('alarm.wav')) {
            this.currentAudio.volume = 0.3;
        }

        if (this.nodes.debug) {
            const scene = this.data.scenes[this.currentSceneIndex];
            this.nodes.debug.textContent = `Scene: ${scene.id} | Audio: ${filename}`;
        }

        this.currentAudio.play().catch(e => console.error('Audio error:', e));
    }

    /**
     * 내레이션을 중단하지 않고 효과음을 재생합니다.
     */
    playEffect(filename) {
        if (!filename) return;
        const audioPath = `assets/audio/${filename}`;
        console.log('Playing effect:', audioPath);
        const effect = new Audio(audioPath);
        
        // 효과음 추적 배열에 추가
        this.activeEffects.push(effect);
        
        // 재생 종료 시 배열에서 제거
        effect.onended = () => {
            this.activeEffects = this.activeEffects.filter(e => e !== effect);
        };

        effect.play().catch(e => console.error('Effect audio error:', e));
    }

    next() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        if (this.currentSceneIndex < this.data.scenes.length - 1) {
            this.currentSceneIndex++;
            this.renderScene();
        } else {
            // Lesson Complete - No more intrusive alerts
            window.parent.postMessage({ type: 'LESSON_COMPLETE', stageId: this.data.stageId }, '*');
            console.log('Lesson Complete Message Sent');
            this.isTransitioning = false; // 끝난 경우 플래그 해제
        }
    }

    /**
     * 외부(interaction.js 등)에서 타이머를 등록할 때 사용
     */
    registerTrigger(timerId) {
        this.activeTriggers.push(timerId);
    }
}

window.StoryEngine = new StoryEngine();