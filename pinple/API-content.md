# 핀플 (Pinple) — API 명세 · 콘텐츠 도메인

공통 규칙(Base path, 인증 방식, 날짜 포맷, 페이지네이션, 에러 응답 포맷 등)은 [`API.md`](./API.md) 참고.

콘텐츠 도메인은 분량이 많아 아래 순서로 나눠서 작성한다.

1. 장소(PlacePin)
2. 검색(Search)
3. 홈 피드(인기/팔로잉/랜덤 탭) + 랜덤맵
4. 리뷰핀 CRUD + 이미지 업로드
5. 댓글/멘션

---

## 1. 장소 (PlacePin)

`PlacePin`을 사용자가 직접 생성하는 엔드포인트는 없다 — 노지 등록 시 리뷰핀 생성 API(4번 섹션)가 내부적으로 `PlacePin`을 만든다. 여기서는 조회만 다룬다.

### `GET /place-pins`
전체 장소 목록 (`RandomMapView`의 지도 마커 대응 — 모든 장소를 지도 위에 표시하므로 클라이언트가 전량을 받아 렌더링한다).

**인증**: 필요

**Query**: `?page=1&size=100` (지도 렌더링 목적상 기본 `size`를 크게 잡아 사실상 전량을 한 번에 받는 용도로 사용. 장소 수가 수천 단위로 늘어나면 지도 뷰포트 기준 필터링 파라미터를 추가해야 하나, 현재 스코프에선 불필요)

**Response 200**
```json
{
  "items": [
    {
      "id": 1,
      "name": "광안리 해수욕장",
      "category": "관광지",
      "address": "부산 수영구 광안해변로 219",
      "hours": "24시간",
      "lat": 35.153,
      "lng": 129.118,
      "regions": ["부산시", "부산시 수영구"]
    }
  ],
  "total": 6, "page": 1, "size": 100
}
```

---

### `GET /place-pins/{id}`
장소 상세 (`SearchResultView`의 장소 요약 패널, `RandomMapView`의 바텀시트 상단 정보 대응).

**인증**: 필요

**Response 200**
```json
{
  "id": 1,
  "name": "광안리 해수욕장",
  "category": "관광지",
  "address": "부산 수영구 광안해변로 219",
  "hours": "24시간",
  "lat": 35.153,
  "lng": 129.118,
  "regions": ["부산시", "부산시 수영구"],
  "todayReviewCount": 2
}
```

`todayReviewCount`는 저장된 값이 아니라 `ReviewPin`을 `placePinId` + `createdAt >= 오늘 00:00(KST)` 조건으로 실시간 COUNT한 값 (`ERD.md` 설계 노트 참고).

| 코드 | 상황 |
|---|---|
| 404 | `PLACE_PIN_NOT_FOUND` |

---

### `GET /place-pins/{id}/review-pins`
해당 장소의 리뷰핀 목록 — "핀크루 발자국"(`SearchResultView`) / 바텀시트 리뷰핀 리스트(`RandomMapView`) 공용.

**인증**: 필요

**Query**
| 파라미터 | 값 | 설명 |
|---|---|---|
| `sort` | `latest` \| `popular` | 기본값 `latest`. `popular`는 `likes + views * 0.5` 내림차순 |
| `page`, `size` | | 공통 페이지네이션 |

**Response 200**
```json
{
  "items": [
    {
      "id": 1, "type": "feed", "title": null,
      "body": "광안리 야경이 정말 너무 예뻤어요...",
      "representativeImage": "https://...",
      "likes": 142, "comments": 5, "views": 1247,
      "authorId": 2, "createdAt": "2026-06-28T00:00:00+09:00"
    }
  ],
  "total": 2, "page": 1, "size": 20
}
```

리스트 아이템은 요약 정보만 포함(전체 본문·이미지 배열 등은 상세 조회에서). 상세 스펙은 4번 섹션(리뷰핀)에서 정의.

---

### `GET /place-pins/top`
홈 화면 인기 탭의 "지금 뜨는 곳" (`HomeView`의 `TopPlaceItem` 목록 대응).

**인증**: 필요

**Query**: `?limit=3` (기본값 3)

**Response 200**
```json
[
  { "id": 4, "name": "경복궁", "category": "문화", "todayReviewCount": 2, "rank": 1 },
  { "id": 1, "name": "광안리 해수욕장", "category": "관광지", "todayReviewCount": 2, "rank": 2 },
  { "id": 2, "name": "전주 한옥마을", "category": "문화", "todayReviewCount": 2, "rank": 3 }
]
```

`todayReviewCount` 내림차순 정렬. 동률일 경우 처리 순서는 `id` 오름차순(안정적 정렬 보장).

---

## 2. 검색 (Search)

지역 자동완성 목록(목업의 `regions` 배열)은 `categories`와 마찬가지로 별도 API 없이 **프론트엔드 상수**로 관리한다 — 20개 안팎의 고정된 행정구역 목록이라 DB 조회가 불필요하다.

### `GET /search/places`
검색 결과 화면의 장소 목록 (`SearchResultView`의 지도 마커·장소 캐러셀 대응). 특정 장소를 고른 뒤의 "핀크루 발자국" 리스트는 1번 섹션의 `GET /place-pins/{id}/review-pins`를 그대로 재사용한다.

**인증**: 필요

**Query**
| 파라미터 | 필수 | 값 | 설명 |
|---|---|---|---|
| `region` | O | 문자열 (예: `"부산시"`) | `PlacePin.regions`에 포함된 장소만. 단일 선택만 가능 |
| `category` | X | 콤마 구분 다중값 | `PlacePin.category`가 하나라도 일치하면 포함 (그룹 내부 OR) |
| `tags` | X | 콤마 구분 다중값 | 해당 장소에 이 태그 중 하나라도 달린 리뷰핀이 있으면 포함 (그룹 내부 OR) |
| `keywords` | X | 콤마 구분 다중값 | 아래 "키워드 매칭 규칙" 참고 |
| `page`, `size` | | | 공통 페이지네이션 |

**키워드 매칭 규칙**
- 여러 키워드를 입력하면 **AND** — 입력한 모든 키워드를 만족하는 장소만 결과에 남는다.
- 키워드 하나당 매칭 대상은 `PlacePin.name` **OR** 해당 장소에 달린 어떤 `ReviewPin`의 `title` **OR** `body` (이 중 하나라도 걸리면 그 키워드는 충족).
- MySQL `FULLTEXT INDEX ... WITH PARSER ngram` 기반 매칭 (형태소 분석 없는 단순 문자열 매칭 — 근거는 `README.md` 참고).

**Response 200**
```json
{
  "items": [
    {
      "id": 4, "name": "경복궁", "category": "문화",
      "address": "서울 종로구 사직로 161",
      "lat": 37.579, "lng": 126.977,
      "todayReviewCount": 2
    }
  ],
  "total": 1, "page": 1, "size": 20
}
```

정렬: `todayReviewCount` 내림차순 고정 (홈 화면 "지금 뜨는 곳"과 동일 기준).

| 코드 | 상황 |
|---|---|
| 400 | `REGION_REQUIRED` — `region` 파라미터 누락 (검색 시 지역 선택은 필수) |

---

### `GET /regions/{region}/popular-tags`
지역 선택 시 노출되는 인기 태그 칩 목록 (`SearchView`의 "인기 태그" 섹션 대응).

**인증**: 필요

**Response 200**: `["#경복궁", "#한복체험", "#야간개장", "#서울여행", "#궁궐"]`

인기 태그가 정의되지 않은 지역은 빈 배열 `[]`을 반환한다.

---

## 3. 홈 피드 (인기/팔로잉/랜덤 탭) + 랜덤맵

### `GET /feed/popular`
홈 화면 인기 탭의 리뷰핀 리스트 (`HomeView`).

**인증**: 필요

**Query**: `?page=1&size=20`

**Response 200**: 1번 섹션과 동일한 리뷰핀 요약 아이템 배열 (`{ items, total, page, size }`)

정렬: `likes + views * 0.5` 내림차순.

---

### `GET /feed/following`
홈 화면 팔로잉 탭의 리뷰핀 리스트.

**인증**: 필요

**Query**: `?page=1&size=20`

**Response 200**: 리뷰핀 요약 아이템 배열. 정렬은 `createdAt` 내림차순(최신순).

팔로잉한 유저가 없으면 에러가 아니라 `items: []`을 반환한다 (`HomeView`의 "팔로잉한 유저가 없습니다" 빈 상태 대응).

---

### `GET /feed/random`
홈 화면 랜덤 탭의 리뷰핀 리스트.

**인증**: 필요

**Query**
| 파라미터 | 필수 | 설명 |
|---|---|---|
| `seed` | X | 이전 요청에서 받은 시드 값. 없으면 서버가 새로 발급 |
| `refresh` | X (boolean) | `true`면 시드를 새로 발급 — "맨 위에서 당겨서 새로고침" 제스처에서만 호출 |
| `page`, `size` | | 공통 페이지네이션 |

**Response 200**
```json
{
  "items": [ /* 리뷰핀 요약 아이템 */ ],
  "seed": "a1b2c3",
  "total": 9, "page": 1, "size": 20
}
```

정렬은 좋아요·조회수 가중치를 반영한 랜덤(`ORDER BY MD5(reviewPinId || seed)` 방식의 결정적 셔플에 가중치를 적용하는 방식 등 검토 중 — 정확한 배합 수식은 근거 조사 후 별도 확정, 보류 상태). 클라이언트는 응답으로 받은 `seed`를 그 이후의 페이지네이션·탭 재방문 요청에 계속 실어 보내 같은 순서를 유지하고, `refresh=true` 요청 때만 새 `seed`로 교체한다 (`HomeView.vue`의 `handleWheel` 제스처 로직과 동일).

---

### 랜덤맵 (`RandomMapView`)

랜덤맵 화면은 별도 엔드포인트가 필요 없다.

- 지도에 뿌리는 전체 장소 마커: 1번 섹션의 `GET /place-pins`를 그대로 사용 (화면 진입 시 전량 로드 후, "랜덤 발견"/"지역 랜덤"/"카테고리 랜덤" 버튼은 **이미 로드된 목록에서 클라이언트가 직접 무작위로 선택** — 서버 왕복 없음, 목업의 `pickRandom()`/`pickRandomByRegion()`/`pickRandomByCategory()`와 동일한 방식)
- 바텀시트의 장소 상세 + 리뷰핀 리스트(최신순/인기순 탭): 1번 섹션의 `GET /place-pins/{id}` + `GET /place-pins/{id}/review-pins?sort=latest|popular` 재사용

---

## 4. 리뷰핀 CRUD + 이미지 업로드

### `POST /images`
이미지 업로드 (`RegisterView`의 이미지 추가 버튼 대응). 서버 경유 업로드 — 클라이언트가 파일을 서버로 보내면 서버가 스토리지에 저장 후 URL을 반환한다. 리뷰핀 등록/수정 API는 이 URL을 받아서 사용한다(별도 첨부 파일 업로드가 아님).

**인증**: 필요

**Request**: `multipart/form-data`, 필드명 `file`

**Response 201**: `{ "url": "https://cdn.pinple.app/images/abc123.jpg" }`

| 코드 | 상황 |
|---|---|
| 400 | `INVALID_FILE_TYPE` — 이미지 파일이 아님 |
| 413 | `FILE_TOO_LARGE` |

---

### `POST /review-pins`
리뷰핀 등록 (`RegisterView` 대응). 피드형/블로그형, 기존 장소/노지 여부에 따라 필드 요구사항이 다르다.

**인증**: 필요

**Request**
```json
{
  "type": "feed",
  "placeMode": "existing",
  "placePinId": 1,
  "category": "관광지",
  "title": null,
  "body": "광안리 야경이 정말 너무 예뻤어요...",
  "images": [
    { "url": "https://cdn.../a.jpg", "order": 0, "isRepresentative": true },
    { "url": "https://cdn.../b.jpg", "order": 1, "isRepresentative": false }
  ],
  "tags": ["오션뷰", "야경", "부산여행"]
}
```

**필드 규칙**
| 필드 | 규칙 |
|---|---|
| `type` | `feed` \| `blog` |
| `placeMode` | `existing`(기존 장소 선택) \| `nooji`(직접 등록) |
| `placePinId` | `placeMode=existing`일 때 필수 |
| `nooji` | `placeMode=nooji`일 때 필수. `{ "name": "장소 이름", "lat": 35.1, "lng": 129.1 }` 형태(장소 이름 입력 필드는 목업에 추가 필요 — `README.md` "목업 보완이 필요한 항목" 참고) |
| `category` | `placeMode=existing`일 때만 사용. `placeMode=nooji`면 서버가 자동으로 `"사용자 등록"`으로 지정하므로 요청에 보내도 무시됨 |
| `title` | 블로그형은 항상 필수. 피드형은 `placeMode=nooji`일 때만 필수, 그 외엔 `null` |
| `images` | 1장 이상, 배열 순서 그대로 `order`에 반영. `isRepresentative=true`는 정확히 1개 |
| `tags` | 0~10개 |

**Response 201**: 생성된 리뷰핀 상세 (아래 `GET /review-pins/{id}` 응답과 동일 형태)

| 코드 | 상황 |
|---|---|
| 400 | `PLACE_NOT_SELECTED` / `TITLE_REQUIRED` / `REPRESENTATIVE_IMAGE_REQUIRED` 등 필드 규칙 위반 |
| 404 | `PLACE_PIN_NOT_FOUND` — `placeMode=existing`인데 `placePinId`가 존재하지 않음 |

`placeMode=nooji`인 경우 서버 내부에서 `PlacePin`을 먼저 생성(좌표 기반 자동 클러스터링·병합 없이 항상 신규 생성)한 뒤 그 id로 리뷰핀을 연결한다. 등록 성공 시 뱃지 조건("첫 발걸음", "핀 수집가" 등) 동기 체크.

---

### `GET /review-pins/{id}`
리뷰핀 상세 (`ReviewDetailView` 대응).

**인증**: 필요

**Response 200**
```json
{
  "id": 1,
  "type": "feed",
  "place": { "id": 1, "name": "광안리 해수욕장", "category": "관광지", "address": "...", "lat": 35.153, "lng": 129.118 },
  "author": { "id": 2, "nickname": "맛집탐험가", "profileImg": "..." },
  "title": null,
  "body": "광안리 야경이 정말 너무 예뻤어요...",
  "images": [
    { "url": "https://cdn.../a.jpg", "order": 0, "isRepresentative": true }
  ],
  "tags": ["오션뷰", "야경", "부산여행"],
  "likes": 142, "commentsCount": 5, "scrapsCount": 18, "views": 1247,
  "createdAt": "2026-06-28T00:00:00+09:00",
  "isLiked": false, "isScrapped": true, "isFollowingAuthor": true,
  "sameDayPins": [
    { "id": 12, "representativeImage": "https://...", "placeName": "전주 한옥마을" }
  ]
}
```

`isLiked`/`isScrapped`/`isFollowingAuthor`는 요청한 본인(토큰 소유자) 기준. `sameDayPins`는 같은 작성자가 같은 날짜(`createdAt`의 날짜 부분)에 작성한 다른 리뷰핀 목록 (`ReviewDetailView`의 "이 날에 함께 꽂은 핀" 대응).

| 코드 | 상황 |
|---|---|
| 404 | `REVIEW_PIN_NOT_FOUND` — 존재하지 않거나 삭제된 리뷰핀 |

---

### `POST /review-pins/{id}/view`
조회수 증가. 리뷰핀 상세 화면 진입 시 클라이언트가 명시적으로 호출한다 (회의록: "조회수는 클릭해야만 증가" — `GET` 상세조회와 분리해 중복 호출/새로고침으로 인한 의도치 않은 증가를 방지).

**인증**: 필요

**Response 200**: `{ "views": 1248 }`

유저(로그인 상태이므로 `userId` 기준)당 해당 리뷰핀에 대해 하루 1회만 증가. 이미 오늘 조회했다면 증가 없이 현재 값만 반환.

---

### `PATCH /review-pins/{id}`
리뷰핀 수정. 본인 작성 글만 가능. 필드 규칙은 `POST /review-pins`와 동일하되 부분 수정 가능(보낸 필드만 갱신, `images`/`tags`는 배열 전체를 교체하는 방식).

**인증**: 필요

**Response 200**: 수정된 리뷰핀 상세

| 코드 | 상황 |
|---|---|
| 403 | `NOT_THE_AUTHOR` |
| 404 | `REVIEW_PIN_NOT_FOUND` |

---

### `DELETE /review-pins/{id}`
리뷰핀 삭제 (소프트 삭제 — `deletedAt` 설정, 실제 row는 유지).

**인증**: 필요

**Response 204**

| 코드 | 상황 |
|---|---|
| 403 | `NOT_THE_AUTHOR` |
| 404 | `REVIEW_PIN_NOT_FOUND` |

---

### `GET /users/{id}/review-pins`
특정 유저가 작성한 리뷰핀 목록, 피드형/블로그형 탭 (`MyView`/`UserProfileView` 대응).

**인증**: 필요

**Query**
| 파라미터 | 필수 | 값 | 설명 |
|---|---|---|---|
| `type` | O | `feed` \| `blog` | |
| `page`, `size` | | | 공통 페이지네이션 |

**Response 200**: 리뷰핀 요약 아이템 배열 (`createdAt` 내림차순)

---

### `GET /users/me/liked-review-pins`
내가 좋아요 누른 리뷰핀 목록 (`LikedView` 대응).

**인증**: 필요

**Query**: `?page=1&size=20`

**Response 200**: 리뷰핀 요약 아이템 배열 (좋아요 누른 시각 기준 최신순)

---

## 5. 댓글 / 멘션

댓글은 수정 미지원, 삭제만 지원(소프트 삭제). 답글은 **1단계로만 평탄화**되어 저장된다 — 답글에 또 답글을 달아도 항상 최상위 원댓글 바로 아래에 나란히 붙는다.

### `GET /review-pins/{id}/comments`
댓글 목록 (`ReviewDetailView`의 댓글 오버레이 대응). 최상위 댓글 기준으로 페이지네이션하고, 각 댓글의 답글은 배열에 통째로 포함한다(답글 자체는 별도 페이지네이션 없음).

**인증**: 필요

**Query**: `?page=1&size=20`

**Response 200**
```json
{
  "items": [
    {
      "id": 1,
      "author": { "id": 1, "nickname": "여행러버", "profileImg": "..." },
      "text": "저도 꼭 가보고 싶어요! 언제가 제일 예쁜가요?",
      "likes": 4,
      "mentions": [],
      "createdAt": "2026-06-28T14:23:00+09:00",
      "replies": [
        {
          "id": 11,
          "author": { "id": 2, "nickname": "맛집탐험가", "profileImg": "..." },
          "text": "@여행러버 저녁 8시쯤이 제일 예뻐요!",
          "likes": 0,
          "mentions": [{ "userId": 1, "nickname": "여행러버" }],
          "createdAt": "2026-06-28T15:00:00+09:00"
        }
      ]
    }
  ],
  "total": 5, "page": 1, "size": 20
}
```

`mentions`는 `CommentMention` 테이블 기준으로 서버가 채워주는 필드(알림 발송 대상 확인용이며, `text` 자체엔 작성 시점 닉네임이 이미 그대로 포함되어 있으므로 클라이언트가 별도 치환할 필요는 없다).

---

### `POST /review-pins/{id}/comments`
댓글 또는 답글 작성.

**인증**: 필요

**Request**
```json
{ "text": "저도 꼭 가보고 싶어요! @여행러버", "parentCommentId": null }
```

`parentCommentId`가 가리키는 댓글이 이미 답글(그 댓글도 `parentCommentId`를 가짐)인 경우, 서버가 자동으로 그 조상의 최상위 댓글 id로 대체해서 저장한다 — 클라이언트는 "이 댓글에 답글 달기"만 누르면 되고 중첩 깊이를 신경 쓸 필요가 없다(1단계 평탄화 강제).

**Response 201**: 생성된 댓글 객체 (`GET` 응답의 댓글 아이템과 동일 형태, `replies` 필드는 없음)

| 코드 | 상황 |
|---|---|
| 400 | `TEXT_REQUIRED` — 빈 텍스트 |
| 404 | `REVIEW_PIN_NOT_FOUND` / `PARENT_COMMENT_NOT_FOUND` |

**서버 내부 처리**
1. `text`에서 `@닉네임` 패턴을 파싱해 유저 매칭 시도. 매칭되면 `CommentMention` insert + 해당 유저에게 `mention` 알림. 매칭 실패 시 조용히 무시(에러 아님).
2. `parentCommentId`가 있으면(답글) 원댓글 작성자에게 `reply` 알림 — 회의록 규칙("원댓글자에겐 대댓글 달리면 무조건 알림")에 따라 본인이 자기 댓글에 답글을 달아도 알림은 생략(자기 자신에게는 알림 생성 안 함), 그 외엔 무조건 생성.
3. 리뷰핀 작성자에게 `comment` 알림 (댓글 작성자 본인이 리뷰핀 작성자와 같으면 생략).
4. `ReviewPin.commentsCount` 캐시 컬럼 +1.
5. 뱃지 조건("소통러" — 댓글 20개 작성) 동기 체크.

---

### `DELETE /comments/{id}`
댓글(또는 답글) 삭제. 소프트 삭제 — 본인 작성만 가능. 답글이 달린 원댓글을 삭제해도 답글 자체는 유지되며, 삭제된 원댓글은 "삭제된 댓글입니다"로 마스킹되어 내려간다(공통 규칙 참고).

**인증**: 필요

**Response 204**

| 코드 | 상황 |
|---|---|
| 403 | `NOT_THE_AUTHOR` |
| 404 | `COMMENT_NOT_FOUND` |

삭제 시 `ReviewPin.commentsCount` 캐시 컬럼 -1.
