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
│   └── index.js          # 전체 라우트 정의
├── store/
│   ├── register.js       # 타입 선택 오버레이 표시 여부 + 피드/블로그 임시저장
│   └── scrap.js          # 스크랩 폴더 상태 (전역 공유)
├── data/
│   └── dummy.js          # 모든 더미 데이터 (users, placePins, reviewPins, 댓글, 알림 등)
├── components/
│   ├── NavBar.vue         # 하단 네비게이션 바 (홈·검색·+·스크랩·MY)
│   ├── FeedCard.vue       # 피드형/블로그형 핀 카드
│   ├── TopPlaceItem.vue   # 홈 인기 장소 항목 (순위·오늘의 핀 수)
│   ├── AuthorRow.vue      # 리뷰핀 상세 내 작성자 행 (팔로우 버튼 포함)
│   └── MiniMap.vue        # 리뷰핀 상세 내 미니 지도
└── views/
    ├── HomeView.vue           # 홈 (인기·팔로잉·랜덤 탭)
    ├── SearchView.vue         # 검색 (지역·태그·최근 검색)
    ├── SearchResultView.vue   # 검색 결과 (가짜 지도 + 장소 목록 + 핀크루 발자국)
    ├── ReviewDetailView.vue   # 리뷰핀 상세 (피드형/블로그형, 댓글·스크랩 오버레이)
    ├── RegisterView.vue       # 리뷰핀 등록 (피드형/블로그형, 임시저장)
    ├── ScrapView.vue          # 스크랩 (폴더 아코디언 + 드래그 정렬)
    ├── RandomMapView.vue      # 랜덤 맵 (가짜 한국 지도 + 바텀시트)
    ├── MyView.vue             # MY 페이지 (프로필·통계·내 리뷰핀)
    ├── NotificationsView.vue  # 알림
    ├── PincrewView.vue        # 핀크루 (팔로잉·팔로워 탭)
    ├── LikedView.vue          # 좋아요한 리뷰핀
    ├── SettingsView.vue       # 설정 (푸시알림 토글, 로그아웃, 탈퇴)
    └── AccountView.vue        # 계정 관리 (닉네임·소개·비밀번호 변경)
```

---

## 라우트 목록

| Path | Name | NavBar |
|------|------|--------|
| `/` | `home` | O |
| `/search` | `search` | X |
| `/search-result` | `search-result` | O |
| `/review/:id` | `review-detail` | X |
| `/register/:type` | `register` | X |
| `/scrap` | `scrap` | O |
| `/random-map` | `random-map` | O |
| `/my` | `my` | O |
| `/notifications` | `notifications` | X |
| `/pincrew` | `pincrew` | X |
| `/liked` | `liked` | X |
| `/settings` | `settings` | X |
| `/account` | `account` | X |

---

## 전역 상태 (store/)

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
| `notifications` | 5개 알림 |

### placePins 필드
```js
{
  id, name, category, address, hours,
  lat, lng,           // 위경도 (가짜 지도 핀 좌표 계산에 사용)
  todayReviewCount,   // 실제 reviewPins 수와 일치
  regions,            // 지역 검색 필터용 배열 (예: ['부산시', '부산시 수영구'])
}
```

### reviewPins 필드
```js
{
  id, type,           // 'feed' | 'blog'
  placePinId, authorId,
  title,              // 블로그형만 사용
  body, images, representativeImageIndex,
  tags,
  likes, comments,    // comments는 해당 핀의 dummyComments 수와 일치
  scraps,
  createdAt,
  isLiked,            // 현재 유저(id=5) 기준 초기 좋아요 여부
  isScrapped,         // scrap store 초기 상태와 일치
}
```

---

## 주요 구현 특이사항

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
