# 🚀 AI 리터러시 파이널 - 스페이스 디텍티브 (Space Detective)

본 프로젝트는 밀크T 적응형 학습 경로 서비스 기획의 일환으로 개발된 **AI 리터러시 학습 플랫폼**입니다. 사용자는 '스페이스 디텍티브'가 되어 다양한 미션을 해결하며 AI 리터러시 역량을 키울 수 있습니다.

---

## 💻 환경 설정 및 실행 방법 (Node.js 미설치자 포함)

본 프로젝트는 최신 웹 기술(React + Vite)로 제작되었습니다. 원활한 실행을 위해 아래 단계를 따라주세요.

### 1. Node.js가 설치되지 않은 경우 (처음 사용자)
이 프로젝트를 실행하려면 **Node.js**라는 프로그램이 필요합니다. 아래 순서대로 진행해 주세요.

1.  **Node.js 다운로드:** [Node.js 공식 홈페이지(https://nodejs.org/)](https://nodejs.org/)에 접속합니다.
2.  **설치:** 'LTS' 버전(안정적인 버전)을 다운로드하여 설치 프로그램을 실행합니다. (모든 설정을 기본값으로 하여 설치를 완료해 주세요.)
3.  **설치 확인:** 윈도우 검색창에 `cmd`를 입력하여 '명령 프롬프트'를 열고, `node -v`를 입력했을 때 버전 숫자(예: v20.x.x)가 나오면 성공입니다.

### 2. 명령 프롬프트(CMD)에서 실행하기
Node.js 설치가 완료되었다면, 가장 기본적인 방법으로 실행할 수 있습니다.

1.  본 프로젝트 폴더(`AI_literacy_final`)를 엽니다.
2.  폴더 상단 주소창에 `cmd`를 입력하고 엔터를 칩니다.
3.  아래 명령어들을 순서대로 입력합니다:
    ```bash
    # 필요한 라이브러리 설치 (최초 1회만 수행)
    npm install

    # 개발 서버 실행
    npm run dev
    ```
4.  터미널에 나타나는 주소(예: `http://localhost:5173`)를 브라우저에 입력하여 접속합니다.

### 3. VS Code (VSD)에서 실행하기
에디터를 사용하여 더 편리하게 실행하고 코드를 수정할 수 있습니다.

1.  **VS Code**를 실행하고 `폴더 열기`를 통해 프로젝트 폴더를 선택합니다.
2.  상단 메뉴에서 `터미널(Terminal)` -> `새 터미널(New Terminal)`을 클릭합니다 (단축키: `Ctrl + ` `).
3.  터미널 창에 `npm run dev`를 입력하고 엔터를 칩니다.

### 4. 안티그래비티(Antigravity)에게 요청하기
안티그래비티 AI 어시스턴트에게 직접 실행을 부탁할 수도 있습니다.

1.  채팅창에 **"서버 실행해줘"** 또는 **"npm run dev 실행해줘"**라고 입력합니다.
2.  안티그래비티가 자동으로 명령어를 실행하고 접속 주소를 안내해 드립니다.

---

## 📂 전체 파일 구조 (Project Structure)

프로젝트의 주요 구성 요소와 역할은 다음과 같습니다.

```text
AI_literacy_final/
├── public/                 # 정적 자원 (이미지, 비디오 등)
│   ├── contents/           # 학습 콘텐츠 데이터 (JSON, 이미지 등)
│   ├── images/             # UI 요소 및 캐릭터 이미지
│   ├── favicon.svg         # 브라우저 탭 아이콘
│   └── introvideo.html     # 인트로 영상 페이지
├── src/                    # 핵심 소스 코드
│   ├── assets/             # 컴포넌트 내부 사용 자원
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── BadgeCollection.jsx  # 뱃지 모음 컴포넌트
│   │   ├── DiagnosticPopup.jsx  # 진단 결과 팝업
│   │   ├── GNB.jsx             # 상단 네비게이션 바
│   │   └── HelpModal.jsx       # 도움말 모달
│   ├── pages/              # 메인 화면들
│   │   ├── Login.jsx            # 로그인 화면
│   │   ├── MainLobby.jsx        # 메인 로비 화면
│   │   ├── IntroVideo.jsx       # 영상 인트로 화면
│   │   ├── SpaceDetective.jsx   # 스페이스 디텍티브 메인 게임
│   │   ├── DiagnosticResult.jsx # AI 역량 진단 결과
│   │   ├── LearningDetail.jsx   # 학습 상세 화면
│   │   └── UnitAssessment.jsx   # 단원 평가 화면
│   ├── App.jsx             # 라우팅 및 메인 앱 설정
│   ├── App.css             # 전역 스타일 설정
│   ├── index.css           # 기본 디자인 토큰 및 리셋 스타일
│   └── main.jsx            # React 엔트리 포인트
├── md/                     # 프로젝트 관련 문서 및 데이터
├── vite.config.js          # Vite 빌드 설정
├── package.json            # 프로젝트 정보 및 의존성 관리
└── README.md               # 프로젝트 매뉴얼 (현재 파일)
```

---

## ✨ 주요 기능
- **AI 역량 진단:** 개인별 AI 리터러시 수준을 측정하고 맞춤형 결과 제공
- **스페이스 디텍티브:** 스토리텔링 기반의 인터랙티브 미션 수행
- **맞춤형 학습 경로:** 진단 결과에 따른 최적의 학습 시퀀스 추천
- **학습 결과 관리:** 뱃지 수집 및 성취도 시각화

---

## 🛠 기술 스택
- **Framework:** React
- **Build Tool:** Vite
- **Styling:** Vanilla CSS (Custom UI Framework)
- **State Management:** React Hooks (useState, useEffect)

---

ⓒ 2026 천재교육 에듀테크 상품서비스 기획팀
