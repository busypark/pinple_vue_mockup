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

---

## 실서비스 전환 설계 결정 사항 (ERD/API 작성 기준)

이 목업을 기반으로 ERD·API 명세를 작성하기 위해 논의·확정한 내용을 정리한다. 목업 자체의 동작(위 섹션들)과는 별개로, **실제 백엔드를 만들 때의 설계 방향**을 다룬다. 목업의 단순화된 동작(더미 데이터, 로컬 상태 등)을 실서비스에서 어떻게 구현할지에 대한 결론이며, ERD·API 문서 작성 및 목업 보완 작업의 근거 자료로 사용한다.

### 인증 / 계정

| 항목 | 결정 |
|------|------|
| 로그인 수단 | 카카오·구글 OAuth + 이메일/비밀번호 (목업과 동일한 하이브리드 구조 유지) |
| 세션/인가 방식 | JWT (Access + Refresh) |
| Refresh Token | 서버 DB에 저장, 로그아웃/탈취 시 무효화(revoke) 가능하게 관리 |
| OAuth 계정 저장 | `User`와 분리된 `SocialAccount(userId, provider, providerUserId)` 테이블 |
| 이메일 인증 | 회원가입 시 이메일 인증 절차 추가. 인증 전 계정은 로그인 자체 차단 |
| 비밀번호 재설정 | 이메일 링크 기반 재설정 플로우 추가 (`EmailLoginView`의 "비밀번호를 잊으셨나요?" 연결) |
| OAuth-이메일 계정 병합 | 병합하지 않음. 같은 이메일로 이미 다른 방식 가입돼 있으면 "이미 다른 방식으로 가입된 이메일입니다" 통보 후 종료 |
| 카카오 이메일 스코프 | 필수로 강제 (이메일 미제공 카카오 가입 불허 — 위 병합 정책이 성립하려면 이메일이 항상 있어야 함) |
| 이메일 유일성 | `User.email`에 UNIQUE 제약 (가입 방식과 무관하게 테이블 전체에서 유일) |
| 로그인 실패 방어 | 이번 스코프에서는 미적용 (계정 잠금/캡차 등은 추후 확장 과제) |

**추가 테이블**
- `VerificationToken(id, userId, type[email_verify|password_reset], token, expiresAt, usedAt)` — 이메일 인증과 비밀번호 재설정 공용
- `TermsAgreement(id, userId, termType[service|privacy|marketing], version, agreedAt)` — 약관 동의 이력(버전 포함)을 처음부터 로그 테이블로 관리
- `User`에 `emailVerified`(boolean), `pushEnabled`(boolean), `likeAlertEnabled`(boolean) 컬럼 추가 — 설정 화면의 토글을 서버에 영속화

### Follow / Like

- `isLiked`(currentUser 한정 boolean), `FOLLOWING_IDS` 하드코딩 배열 대신 정식 조인 테이블 사용
  - `Like(userId, reviewPinId, createdAt)`
  - `Follow(followerId, followeeId, createdAt)`
- `likes`/`comments`/`scraps`/`views` 카운터는 목업과 동일하게 `ReviewPin`의 비정규화 캐시 컬럼으로 유지(매번 COUNT 쿼리하지 않음)

### 뱃지

- 획득 조건은 코드에 하드코딩(데이터화된 룰 엔진 만들지 않음), 8개 고정 유지
- 조건 체크 시점: 관련 액션 API(리뷰핀 작성, 팔로우 등) 성공 직후 동기적으로 체크 후 즉시 부여 (배치 스캔 아님)
- 뱃지 획득 이력은 `UserBadge(userId, badgeId, earnedAt)` 테이블로 관리

### 알림 (Notification)

| 항목 | 결정 |
|------|------|
| 생성 방식 | 관련 액션 API 내부에서 동기 생성 (이벤트 큐 없음) |
| 좋아요 알림 폭주 | 초기엔 개별 생성 유지, 배치 합산("OO님 외 N명")은 필요 시 나중에 추가 |
| 스키마 보강 | `targetCommentId`(nullable) 추가 — 대댓글/멘션 알림이 특정 댓글을 가리킬 수 있도록 |
| 읽음 처리 | `isRead`(boolean), `readAt`(timestamp) 컬럼 추가. 개별 클릭 시 해당 알림만 읽음 처리, "모두 읽음" 버튼은 전체 일괄 처리 (목업 동작 그대로 서버화) |
| 알림 설정 | `User.pushEnabled`, `User.likeAlertEnabled`로 영속화 (설정 화면 토글과 연결) |

### 댓글 / 멘션

- 수정 미지원, 삭제만 지원(소프트 삭제)
- **대댓글(답글)**: `Comment.parentCommentId`(nullable) 추가해 지원하되, **1단계로 평탄화** — 답글에 또 답글을 다는 구조는 만들지 않고, 모든 답글은 원댓글 아래 나란히 표시. 원댓글 작성자에게는 답글이 달리면 무조건 알림.
- **멘션(@닉네임)**: 텍스트에서 `@닉네임` 패턴을 파싱하되, 닉네임이 아니라 **userId로 매핑해서 저장** (닉네임 변경/중복에 안전하도록). `CommentMention(commentId, mentionedUserId)` 조인 테이블로 구조화.
- 멘션된 텍스트 자체는 **작성 시점 닉네임을 그대로 저장**(박제) — 이후 상대가 닉네임을 바꿔도 과거 댓글엔 옛 닉네임이 남음. `CommentMention` 테이블은 알림 발송 대상 조회용으로만 참조.

### 리뷰핀 / 이미지 / 태그 / 지역

| 항목 | 결정 |
|------|------|
| 수정/삭제 | 수정 지원 + 소프트 삭제 지원 (목업엔 UI 자체가 없었음) |
| 이미지 저장 | 별도 `Image(id, reviewPinId, url, order, isRepresentative)` 테이블 (배열 컬럼 아님) |
| 이미지 업로드 흐름 | 서버 경유 업로드 (클라이언트 → 서버 → 서버가 스토리지에 저장) |
| 조회수(views) | 유저/세션당 1회만 증가 (무제한 중복 카운트 방지) |
| 태그 | 정규화. `Tag(id, name)` + `ReviewPinTag(reviewPinId, tagId)` 조인 테이블 (검색·인기태그 집계 위함) |
| 지역(regions) | 정규화하지 않음. 목업처럼 `PlacePin.regions`에 상위+하위 지역 문자열을 배열(JSON)로 그대로 저장 |

### 노지 (사용자 직접 등록 장소)

- 좌표 기준 자동 클러스터링/병합 로직 없이, 등록 즉시 신규 `PlacePin` 생성 (좌표 기반 자동 묶기는 추후 2단계 과제로 분리)
- **목업 보완 필요**: 현재 `RegisterView`의 노지 등록 UI엔 "장소 이름" 입력 필드가 없음(자동 카테고리 지정만 있음) → 신규 `PlacePin.name`을 받을 입력 필드 추가 필요

### 홈 랜덤 탭

- 정렬 기준: 좋아요+조회수 가중치 사용. 정확한 배합 수식은 근거 조사 후 별도 확정(보류) — ERD/API 구조엔 영향 없음(`likes`, `views`는 이미 존재하는 필드이며, 랜덤 탭은 조회 시점 계산 로직일 뿐)
- 랜덤 정렬은 **서버에서 계산**
- **시드(seed) 기반 재현성**: 클라이언트가 시드를 쿼리 파라미터로 들고 다니며 페이지네이션·탭 전환·스크롤 동안 재사용. 시드 재발급은 목업에 이미 구현된 "맨 위에서 당겨서 새로고침" 제스처를 했을 때만 발생 — 탭 전환/재방문으로는 재발급되지 않음 (`HomeView.vue`의 `handleWheel` 로직과 동일)

### 검색

- 필터 그룹: **지역**(필수, 단일 선택) + **키워드**(자유 텍스트, 여러 개 입력 가능) + **태그**(다중 선택) + **카테고리**(다중 선택)
- 키워드 여러 개 입력 시 **AND** 결합, 태그·카테고리는 각 그룹 내부에서 **OR**
- 키워드 검색 대상: 장소명 + 리뷰핀 제목 + 본문 (목업 안내 문구에 이미 명시된 범위)
- 검색 인프라: **MySQL FULLTEXT INDEX + ngram 파서**로 충분 (형태소 분석 없는 단순 문자열 기반 매칭이 목표이므로 Elasticsearch 등 추가 인프라 불필요)
- 위치 기반(GPS) 검색은 제외 — 사용자 현재 위치를 서버로 보내지 않고, 텍스트 기반 지역 검색만 지원
- 검색 결과 화면의 **장소 목록** 정렬: `PlacePin.todayReviewCount` 내림차순 (홈 화면 "지금 뜨는 곳"과 동일 기준 재사용)
- 검색 결과 화면의 **핀크루 발자국(리뷰핀 리스트)** 정렬: 기존 인기순 공식(`likes + views * 0.5`) 재사용
- `todayReviewCount` 집계: KST 자정 기준 실시간 COUNT 쿼리 (배치 스냅샷 아님)

### 스크랩

- 기본 폴더는 실제 row로 만들지 않음. `ScrapItem.folderId`를 nullable로 두어 "폴더 없음" 상태로 표현
- `ScrapFolder`에 `position`(정수) 컬럼 추가 — 드래그 정렬 지원

### 리뷰핀 등록 임시저장(draft)

- 서버에 저장하지 않고 클라이언트 로컬(localStorage 등)에만 저장 (기기 변경 시 이어쓰기는 스코프 아웃)

### 페이지네이션

- offset/limit 방식 사용 (cursor 방식 아님)

### 탈퇴

- 소프트 삭제 + 익명화: 유저 정보는 익명화 처리
- 작성한 콘텐츠(댓글·리뷰핀)는 삭제하지 않고 유지하되 작성자 표시만 "탈퇴한 사용자입니다"로 대체 (다른 유저 게시물의 맥락이 깨지지 않도록)
- Follow 관계(팔로잉/팔로워)는 삭제

### 신고

- `Report(id, reporterId, reviewPinId, reason, detail, status, createdAt)` 테이블
- 신고 대상은 **리뷰핀만** (댓글 신고는 미지원)
- 신고 사유 6개 고정 카테고리: 스팸/광고, 욕설·혐오 표현, 음란물, 허위 정보, 저작권 침해, 기타(직접 입력)
- 처리 방식: 자동 조치·관리자 UI 없이 **접수(기록)까지만** 구현. 관리자 페이지는 "일단 사용자 기준으로 다 만들고 나서 논의" 방향으로 이후 별도 논의
- 중복 신고 방지: `reporterId + reviewPinId`에 UNIQUE 제약 (유저당 대상 1회만)
- **목업 보완 필요**: `ReviewDetailView`의 좋아요/댓글/스크랩 액션바와 같은 행, 오른쪽 끝에 신고 버튼 추가
- **차단(Block) 기능은 이번 스코프에서 논의하지 않음** (제외)

### API 공통 컨벤션

- 날짜/시간: ISO 8601 (DB는 `DATETIME`/`TIMESTAMP`, API 응답은 ISO 문자열로 직렬화)
- 에러 응답: `{ error: { code, message } }` 형태로 통일
- 리스트 응답: `{ items, total, page, size }` 형태로 통일

### 목업 보완이 필요한 항목 정리

위 결정들을 실제로 구현/시연하려면 아래 화면·로직이 목업에 추가로 필요하다 (결정은 완료됐으나 아직 목업엔 반영되지 않음).

| 항목 | 내용 |
|------|------|
| 이메일 인증 대기 화면 | 회원가입 후 "인증 메일을 보냈어요" 안내 화면 |
| 비밀번호 재설정 화면 2개 | 재설정 이메일 요청 화면 + 새 비밀번호 입력 화면 |
| OAuth-이메일 충돌 안내 | 중복 이메일 감지 시 에러 안내 UI |
| 신고 UI | 액션바 우측 신고 버튼 + 사유 선택 모달(6개 카테고리 + 기타) |
| 탈퇴 확정 버튼 수정 | 현재 취소/탈퇴 버튼이 동일 동작(no-op)임 — 로그아웃과 같은 방식으로 `isLoggedIn=false` + `/login` 이동 처리 필요 |
| 노지 등록 "장소 이름" 필드 | `RegisterView`의 노지 등록 영역에 이름 입력 필드 추가 |
| 대댓글(답글) UI | 댓글 목록에 답글 버튼 + 1단계 들여쓰기 표시 추가 (현재는 완전 플랫 리스트) |
