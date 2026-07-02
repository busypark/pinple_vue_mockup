# 핀플 (Pinple) — 웹 목업

관광데이터 공모전용 모바일 여행 리뷰 앱 **핀플**의 웹 인터랙티브 목업.  
PC 브라우저에서 실행되며, 중앙에 390×844px 스마트폰 프레임 안에 앱 UI가 표시된다.

---

## 실행 방법

```bash
npm install
npm run dev       # 개발 서버 (localhost:5173)
npm run build     # dist/ 빌드
npm run preview   # 빌드 결과 미리보기
```

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| Vite | 8.x |
| Vue 3 (Composition API, `<script setup>`) | 3.5.x |
| Vue Router 4 (`createWebHashHistory`) | 4.6.x |
| @vitejs/plugin-vue | 6.x |
| TypeScript | 미사용 (`.js` 기반) |

> `createWebHashHistory` 사용 이유: 로컬 파일(`file://`) 환경에서도 라우팅이 동작해야 하기 때문.

---

## 프로젝트 구조

```
src/
├── main.js               # 진입점
├── App.vue               # 폰 프레임 + NavBar + 리뷰핀 등록 타입 선택 오버레이
├── router/
│   └── index.js          # 전체 라우트 정의 + 인증 네비게이션 가드
├── store/
│   ├── auth.js           # isLoggedIn (앱 전역 로그인 상태)
│   ├── register.js       # 타입 선택 오버레이 표시 여부 + 피드/블로그 임시저장
│   └── scrap.js          # 스크랩 폴더 상태 (전역 공유)
├── data/
│   └── dummy.js          # 모든 더미 데이터 (users, placePins, reviewPins, badges, 알림 등)
├── components/
│   ├── NavBar.vue         # 하단 네비게이션 바 (홈·검색·+·스크랩·MY)
│   ├── FeedCard.vue       # 피드형/블로그형 핀 카드 (작성자 클릭 → 프로필 이동)
│   ├── TopPlaceItem.vue   # 홈 인기 장소 항목 (순위·오늘의 핀 수)
│   ├── AuthorRow.vue      # 리뷰핀 상세 내 작성자 행 (팔로우 버튼 포함)
│   └── MiniMap.vue        # 리뷰핀 상세 내 미니 지도
└── views/
    ├── LoginView.vue          # 로그인 (카카오·구글·이메일 — 앱 시작점)
    ├── EmailLoginView.vue     # 이메일 로그인
    ├── SignupView.vue         # 회원가입
    ├── HomeView.vue           # 홈 (인기·팔로잉·랜덤 탭)
    ├── SearchView.vue         # 검색 (지역·태그·최근 검색)
    ├── SearchResultView.vue   # 검색 결과 (가짜 지도 + 장소 목록 + 핀크루 발자국)
    ├── ReviewDetailView.vue   # 리뷰핀 상세 (피드형/블로그형, 댓글·스크랩 오버레이)
    ├── RegisterView.vue       # 리뷰핀 등록 (피드형/블로그형, 노지 흐름, 임시저장)
    ├── ScrapView.vue          # 스크랩 (폴더 아코디언 + 드래그 정렬)
    ├── RandomMapView.vue      # 랜덤 맵 (가짜 한국 지도 + 지역/카테고리 랜덤 + 바텀시트)
    ├── MyView.vue             # MY 페이지 (프로필·뱃지 가로스크롤·피드/블로그 탭)
    ├── UserProfileView.vue    # 타 유저 프로필 (/user/:id)
    ├── NotificationsView.vue  # 알림 (좋아요·댓글·대댓글·팔로우·뱃지 획득)
    ├── PincrewView.vue        # 핀크루 (팔로잉·팔로워 탭)
    ├── LikedView.vue          # 좋아요한 리뷰핀
    ├── SettingsView.vue       # 설정 (비밀번호 변경·푸시알림 토글·로그아웃·탈퇴)
    └── AccountView.vue        # 계정 관리 (닉네임·소개)
```

---

## 라우트 목록

| Path | Name | NavBar | 비고 |
|------|------|--------|------|
| `/login` | `login` | X | 앱 시작점 (미인증 시 리다이렉트) |
| `/login/email` | `login-email` | X | |
| `/signup` | `signup` | X | |
| `/` | `home` | O | |
| `/search` | `search` | X | |
| `/search-result` | `search-result` | O | |
| `/review/:id` | `review-detail` | X | |
| `/register/:type` | `register` | X | |
| `/scrap` | `scrap` | O | |
| `/random-map` | `random-map` | O | |
| `/my` | `my` | O | |
| `/user/:id` | `user-profile` | X | 타 유저 프로필 |
| `/notifications` | `notifications` | X | |
| `/pincrew` | `pincrew` | X | |
| `/liked` | `liked` | X | |
| `/settings` | `settings` | X | |
| `/account` | `account` | X | |

### 네비게이션 가드

`router.beforeEach`로 인증 상태(`isLoggedIn`)를 검사한다.

- 미인증 + 비인증 라우트 → `/login` 리다이렉트
- 인증 완료 + 인증 라우트(`login`, `login-email`, `signup`) 진입 → `/` 리다이렉트

---

## 전역 상태 (store/)

### `store/auth.js`
- `isLoggedIn` — 앱 전역 로그인 여부 (`ref(false)`)
- 소셜·이메일 로그인 버튼 클릭 시 `true`, 로그아웃 시 `false`

### `store/register.js`
- `showTypeSelector` — 하단 + 버튼 클릭 시 리뷰핀 타입 선택 오버레이 표시 여부
- `feedDraft` / `blogDraft` — 작성 중 이탈 시 임시저장 데이터 (세션 내 유지)

### `store/scrap.js`
- `scrapFolders` — 스크랩 폴더 배열 (dummy.js의 `scraps`를 deepCopy하여 초기화)
- `isPinScrapped(reviewPinId)` — 핀이 스크랩 폴더에 존재하는지 확인
- `scrapToFolder(reviewPinId, placePinId, folderId)` — 특정 폴더에 스크랩 추가
- `unscrapPin(reviewPinId)` — 모든 폴더에서 스크랩 제거
- `addFolder(name)` — 새 폴더 생성
- `removeFolder(folderId)` — 폴더 삭제

---

## 더미 데이터 (data/dummy.js)

### 주요 구조

| export | 내용 |
|--------|------|
| `users` | 5명 (id 1–5, id 5가 currentUser) |
| `currentUser` | `users[4]` — 나(핀플러), id=5 |
| `placePins` | 6개 장소 (광안리·전주·카멜리아힐·경복궁·해운대·성산일출봉) |
| `topPlaces` | 인기 장소 top 3 (경복궁·광안리·전주, 각 todayReviewCount=2) |
| `reviewPins` | 9개 핀 (id 1–7은 타 유저, id 8–9는 currentUser) |
| `followingFeed` | authorId가 1·2·3인 핀 필터 |
| `scraps` | 3개 폴더 초기값 (스크랩 스토어 초기화용) |
| `dummyComments` | 10개 댓글 (`pinId` 필드로 핀별 분리) |
| `badges` | 8개 뱃지 정의 (id·name·desc·color·earned) |
| `notifications` | 6개 알림 (좋아요·댓글·대댓글·팔로우·뱃지 획득) |

### placePins 필드
```js
{
  id, name, category, address, hours,
  lat, lng,           // 위경도 (가짜 지도 핀 좌표 계산에 사용)
  todayReviewCount,   // 오늘 기준 리뷰핀 수 (실제 reviewPins 수와 일치)
  regions,            // 지역 검색 필터용 배열 (예: ['부산시', '부산시 수영구'])
}
```

### reviewPins 필드
```js
{
  id, type,           // 'feed' | 'blog'
  placePinId, authorId,
  title,              // 블로그형 + 피드형 노지인 경우 사용
  body, images, representativeImageIndex,
  tags,
  likes, comments,    // comments는 해당 핀의 dummyComments 수와 일치
  views,              // 조회수 (인기 정렬 공식에 사용)
  scraps,
  createdAt,
  isLiked,            // 현재 유저(id=5) 기준 초기 좋아요 여부
  isScrapped,         // scrap store 초기 상태와 일치
}
```

### badges 필드
```js
{
  id, name, desc,
  color,    // 아이콘 색상 (HEX)
  earned,   // currentUser 기준 획득 여부 (id=1만 true)
}
```

### notifications 알림 타입

| action | 설명 |
|--------|------|
| `like` | 좋아요 — actorId 있음, targetReviewPinId 있음 |
| `comment` | 댓글 — actorId 있음, targetReviewPinId 있음 |
| `reply` | 대댓글 — actorId 있음, targetReviewPinId 있음 |
| `follow` | 팔로우 — actorId 있음, targetReviewPinId 없음 |
| `badge` | 뱃지 획득 — actorId 없음 (system), targetReviewPinId 없음 |

---

## 주요 구현 특이사항

### 인증 흐름
- 앱 최초 진입 시 `isLoggedIn = false` → 네비게이션 가드가 `/login`으로 리다이렉트
- 로그인 화면: 카카오(`#FEE500` 배경) / 구글(흰 배경+테두리) / 이메일 3가지 버튼
- 소셜 버튼 클릭 시 `isLoggedIn = true` → `/` 이동 (실제 OAuth 연동 없음)
- 이메일 버튼 → `/login/email` → 입력 후 로그인 → `/`
- 회원가입은 `/signup` 별도 뷰 (닉네임·이메일·비밀번호·약관 동의)

### 타 유저 프로필
- `FeedCard` 작성자 이미지/닉네임 클릭 → `goToAuthor()` 호출
- `AuthorRow` 작성자 클릭 → `goToAuthor()` 호출
- currentUser(id=5) 본인 핀이면 `/my`, 타인이면 `/user/:id` 이동
- `UserProfileView`: 팔로우/언팔로우 버튼, 피드형/블로그형 핀 탭

### 홈 인기 탭
- **지금 뜨는 곳**: `topPlaces` (오늘 기준 `todayReviewCount` 내림차순)
- **리뷰핀 목록**: `likes + views * 0.5` 점수 내림차순 정렬

### 랜덤 맵
- **랜덤 발견** 버튼: 현재 선택과 다른 장소 중 무작위 선택
- **지역 랜덤** 버튼: `regions` 배열에서 랜덤 지역 선택 → 해당 지역 장소 중 무작위
- **카테고리 랜덤** 버튼: 카테고리 중 무작위 선택 → 해당 카테고리 장소 중 무작위
- 결과 필터 칩으로 어떤 지역/카테고리가 선택됐는지 표시
- 바텀시트: 장소 정보 + 해당 장소의 리뷰핀 목록 (최신순/인기순 탭)
- 인기순 정렬 공식: `likes + views * 0.5` 내림차순

### 리뷰핀 등록 (RegisterView)
- 장소 선택 두 갈래: **기존 장소 선택** / **노지 직접 등록** 세그먼트 버튼
- 노지 선택 시:
  - 피드형에만 제목 필드 출현
  - 카테고리 자동 지정 ("사용자 등록")
  - 위치 선택 placeholder (추후 구현)
- 공개범위 UI 없음 (전체공개 통일)

### MY 페이지
- 프로필 영역 아래 뱃지 가로스크롤 (8개, 획득/미획득 시각 구분)
- 내 리뷰핀 탭: **피드형** / **블로그형** 분리 표시

### 설정 / 계정
- **SettingsView**: 계정 섹션에 "비밀번호 변경" 항목 추가 → 다이얼로그(현재PW·새PW·확인)
- **AccountView**: 비밀번호 변경 섹션 제거 (닉네임·소개만)

### 알림 (NotificationsView)
- 알림 타입: 좋아요·댓글·대댓글·팔로우·뱃지 획득 (핀포인트 제외)
- 유저 행동 알림: 아바타 + 우하단 이모지 배지 (좋아요 빨강 / 댓글·대댓글 파랑 / 팔로우 초록)
- 뱃지 획득 알림: 금색 테두리 원 아이콘

### 가짜 지도
- `SearchResultView`: CSS `background-image` 그라디언트로 지형·도로 표현
- `RandomMapView`: `clip-path: polygon(...)` + 그라디언트로 한국 반도 형태 근사
- 핀 좌표 공식: `x = 6 + ((lng - 126.0) / 4.0) * 86`, `y = 5 + ((38.0 - lat) / 5.0) * 88`

### 리뷰핀 등록 흐름
1. NavBar `+` 버튼 → `showTypeSelector = true` → App.vue 오버레이 표시
2. 타입 선택(피드형/블로그형) → `/register/:type` 이동
3. 이탈 시 내용이 있으면 `feedDraft`/`blogDraft`에 저장
4. 재진입 시 복원 여부 모달 표시
5. 제출 시 draft 초기화 후 홈(`/`)으로 이동

### 스크랩 상태 관리
- `isScrappedLocal`은 `isPinScrapped(pinId)`로 스토어에서 읽는 computed
- 스크랩 카운트(`scrapsDisplay`): `pin.scraps`를 기준으로 현재 스크랩 여부와 원본 `isScrapped` 비교해 ±1 반영
- ReviewDetailView에서 스크랩 시 폴더 선택 오버레이 표시 → 폴더 선택 또는 새 폴더 생성

### 댓글
- `dummyComments`는 `pinId` 필드로 핀별 구분, ReviewDetailView에서 필터링
- `localComments`로 세션 내 작성 댓글 추가 (새로고침 시 초기화)
- 댓글 수 표시: `commentsForPin.length + localComments.length`

### 팔로우 상태
- currentUser(id=5)의 팔로잉: id 1·2·3 (`FOLLOWING_IDS = [1, 2, 3]`)
- ReviewDetailView의 AuthorRow: 핀 진입 시 `FOLLOWING_IDS.includes(authorId)`로 초기 상태 결정

### 지역 검색 필터
- `SearchView`에서 지역 탭 선택 → `route.query.region`으로 SearchResultView 진입
- SearchResultView에서 `placePins.filter(p => p.regions?.includes(region))`으로 필터링
- 매칭되는 장소가 없으면 전체 표시로 폴백

---

## CSS 커스텀 프로퍼티 (App.vue)

```css
--primary: #E8536A
--primary-light: #FDEEF1
--bg: #F5F5F7
--bg-white: #FFFFFF
--border: #EBEBEE
--border-dark: #D8D8DC
--text-primary: #1A1A1E
--text-secondary: #555560
--text-hint: #AAAAAF
--nav-height: 60px
--status-height: 28px
```

---

## 목업 한계 (의도적 미구현)

- 좋아요·팔로우 상태 변경이 피드카드·팔로잉탭에 실시간 반영되지 않음 (전역 스토어 없음)
- LikedView는 `dummy.js`의 `isLiked` 기준이므로 세션 중 좋아요 변경이 반영되지 않음
- 리뷰핀 등록 후 실제 새 핀이 생성되지 않음 (백엔드 없음)
- "이 날에 함께 꽂은 핀" 섹션: 데이터상 동일 날짜·작성자 핀이 없어 항상 비어 있음

---

## 회의록 반영 현황

### 미반영 항목

목업 특성 또는 범위 결정으로 인해 구현하지 않은 항목들.

#### 검색 로직 (AND/OR)
- 회의록: "홈-검색-각각은 or, 서로는 and"
- 현황: SearchView·SearchResultView는 UI만 존재. 실제 필터링 로직 없음.

#### 검색 위치 UI
- 회의록: "홈-검색-(UI) 위치 검색시"
- 현황: 스킵 결정. 구현 방향 미확정.

#### 홈 랜덤 탭 알고리즘
- 회의록: "홈-랜덤-알고리즘 적용 (수식 적용)"
- 현황: UI 변경 없음으로 패스. 현재 `Array.sort(() => Math.random() - 0.5)` 단순 셔플만 적용.
- 참고: 인기순 수식(`likes + views * 0.5`)은 홈 인기 탭·랜덤 맵 바텀시트 인기순에는 적용됨.

#### 조회수(views) 실시간 증가
- 회의록: "조회수(클릭해야만 증가)"
- 현황: `views` 필드는 더미 데이터에 정의되어 정렬 공식에 사용되나, 리뷰핀 진입 시 실제 카운트 증가 로직 없음.

#### 댓글·대댓글·언급 알림 실시간 생성
- 회의록: "원댓글자에겐 대댓글 달리면 무조건 알림, 언급된 사람도 무조건 알림, 게시글 주인에게는 모든 댓글+대댓글 알림"
- 현황: 더미 데이터에 댓글·대댓글 알림 샘플 포함. 실시간 알림 생성 로직(세션 내 댓글 작성 → 알림 추가) 없음.

#### 언급 알림 더미 데이터
- 회의록: "댓글/대댓글/언급" 세 타입
- 현황: 더미 알림에 `reply`(대댓글) 타입은 있으나 `mention`(언급) 타입 샘플 없음.

#### 노지 좌표 기반 장소 자동 묶기
- 회의록: "노지 장소등록은 좌표 기준으로 알아서 묶어준 장소핀 밑으로 들어가게"
- 현황: 등록 UI에 위치 선택 placeholder와 "핀크루 발견 장소" 안내 표시. 실제 좌표 계산·장소 매핑 로직 없음.

#### OAuth 실제 연동
- 회의록: "OAuth(구글, 카카오) 방식 + 이메일 가입방식"
- 현황: 로그인 화면에 구글/카카오/이메일 버튼 UI 구현. 버튼 클릭 시 `isLoggedIn = true` 처리만. 실제 OAuth 플로우·이메일 인증 없음.

#### 핀포인트
- 회의록: "(안 함. 진짜 이후 확장 → 발표용 목업에만 포함)"
- 현황: 알림 목록에서 완전 제외. 추후 별도 확장 예정.

#### 뱃지 동적 추가
- 회의록: "동적 추가 가능성은 이후 확장가능성으로 남겨두기"
- 현황: `badges` 배열 정적 정의 (8개 고정). 관리자 추가·조건 기반 자동 부여 로직 없음.
