# 브리핑 에이전트 PWA

## 파일 구성
- index.html — 메인 앱
- manifest.json — PWA 설정
- sw.js — 서비스 워커 (오프라인 지원)
- icons/ — 앱 아이콘 폴더 (아이콘 추가 필요)

## 배포 방법 (GitHub Pages — 무료)

### 1단계: GitHub repository에 파일 올리기
1. github.com/WooAraBin/Crypto-briefing 접속
2. 이 파일들 업로드 (index.html, manifest.json, sw.js)

### 2단계: GitHub Pages 활성화
1. repository → Settings 탭
2. 왼쪽 메뉴 → Pages
3. Source: "Deploy from a branch"
4. Branch: main → / (root) 선택
5. Save 클릭
6. 약 1~2분 후 URL 생성됨
   예: https://wooarabin.github.io/Crypto-briefing/

### 3단계: 핸드폰 홈화면에 추가
**아이폰:**
1. Safari로 위 URL 접속
2. 하단 공유 버튼 탭
3. "홈 화면에 추가" 선택

**안드로이드:**
1. Chrome으로 위 URL 접속
2. 브라우저 메뉴 (점 3개) 탭
3. "홈 화면에 추가" 선택

## 아이콘 만들기 (선택사항)
icons 폴더에 아이콘이 없으면 기본 아이콘으로 표시됩니다.
canva.com 등에서 192x192, 512x512 PNG 이미지 만들어서
icons/icon-192.png, icons/icon-512.png 로 저장하면 됩니다.
