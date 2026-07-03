# 핀플 (Pinple) — API 명세 · 소셜 도메인

공통 규칙(Base path, 인증 방식, 날짜 포맷, 페이지네이션, 에러 응답 포맷 등)은 [`API.md`](./API.md) 참고.

## 팔로우

### `GET /users/{id}`
특정 유저의 프로필 조회 (`UserProfileView` 대응). 본인 조회 시엔 `GET /users/me`([`API-auth.md`](./API-auth.md))를 대신 사용한다.

**인증**: 필요

**Response 200**
```json
{
  "id": 3,
  "nickname": "감성사진가",
  "profileImg": "https://...",
  "bio": "순간을 담습니다",
  "following": 42,
  "followers": 89,
  "reviewPinCount": 21,
  "isFollowing": true
}
```

`isFollowing`은 요청한 본인(토큰 소유자) 기준으로 이 유저를 팔로우하고 있는지 여부.

| 코드 | 상황 |
|---|---|
| 404 | `USER_NOT_FOUND` — 존재하지 않거나 탈퇴한 유저 |

---

### `POST /users/{id}/follow`
팔로우.

**인증**: 필요

**Response 204**

| 코드 | 상황 |
|---|---|
| 400 | `CANNOT_FOLLOW_SELF` — 자기 자신은 팔로우 불가 |
| 404 | `USER_NOT_FOUND` |
| 409 | `ALREADY_FOLLOWING` — 이미 팔로우 중 |

뱃지 조건("핀크루장" — 팔로워 50명 등) 충족 여부를 이 액션 직후 동기적으로 체크해 필요 시 `UserBadge`를 생성한다.

---

### `DELETE /users/{id}/follow`
언팔로우.

**인증**: 필요

**Response 204**

| 코드 | 상황 |
|---|---|
| 404 | `FOLLOW_NOT_FOUND` — 팔로우 관계가 없음 |

---

### `GET /users/{id}/following`
해당 유저가 팔로우하는 사람 목록 (`PincrewView`의 "팔로잉" 탭 대응 — 본인 조회 시 `id`에 본인 id 사용).

**인증**: 필요

**Query**: `?page=1&size=20`

**Response 200**
```json
{
  "items": [
    { "id": 1, "nickname": "여행러버", "profileImg": "...", "bio": "...", "reviewPinCount": 37, "followers": 108, "isFollowing": true }
  ],
  "total": 24, "page": 1, "size": 20
}
```

---

### `GET /users/{id}/followers`
해당 유저를 팔로우하는 사람 목록 (`PincrewView`의 "팔로워" 탭 대응). 응답 형태는 `/following`과 동일.

**인증**: 필요

**Query**: `?page=1&size=20`

---

## 좋아요

### `POST /review-pins/{id}/like`
좋아요.

**인증**: 필요

**Response 200**: `{ "likes": 143 }` (갱신된 좋아요 수)

| 코드 | 상황 |
|---|---|
| 404 | `REVIEW_PIN_NOT_FOUND` |
| 409 | `ALREADY_LIKED` |

좋아요 알림(`like`)을 대상 리뷰핀 작성자에게 생성(단, 작성자 본인이 자신의 핀에 좋아요를 누르는 경우는 생성하지 않음). 뱃지 조건("인기스타" — 좋아요 100개 등) 동기 체크.

---

### `DELETE /review-pins/{id}/like`
좋아요 취소.

**인증**: 필요

**Response 200**: `{ "likes": 142 }`

| 코드 | 상황 |
|---|---|
| 404 | `LIKE_NOT_FOUND` — 좋아요를 누른 적 없음 |

---

## 뱃지

### `GET /users/{id}/badges`
뱃지 목록과 획득 여부 조회 (`MyView`의 뱃지 가로스크롤 대응).

**인증**: 필요

**Response 200**
```json
[
  { "id": 1, "name": "첫 발걸음", "desc": "첫 번째 리뷰핀 작성", "color": "#E8536A", "earned": true, "earnedAt": "2026-06-24T10:00:00+09:00" },
  { "id": 2, "name": "핀 수집가", "desc": "리뷰핀 10개 작성", "color": "#F4A442", "earned": false, "earnedAt": null }
]
```

8개 고정 목록이며, 획득 조건은 서버 코드에 하드코딩되어 있고 관련 액션 API(리뷰핀 작성·팔로우 등) 성공 직후 동기적으로 체크되어 `UserBadge`에 반영된다. 이 엔드포인트는 조회 전용.

---

## 알림

### `GET /notifications`
내 알림 목록 (`NotificationsView` 대응). 날짜별 그룹핑은 클라이언트에서 `createdAt` 기준으로 처리한다.

**인증**: 필요

**Query**: `?page=1&size=20`

**Response 200**
```json
{
  "items": [
    {
      "id": 8,
      "type": "user",
      "actor": { "id": 2, "nickname": "맛집탐험가", "profileImg": "..." },
      "action": "like",
      "targetReviewPinId": 8,
      "targetCommentId": null,
      "text": "맛집탐험가님이 회원님의 리뷰핀에 좋아요를 눌렀습니다.",
      "isRead": false,
      "createdAt": "2026-07-03T09:12:00+09:00"
    }
  ],
  "total": 6, "page": 1, "size": 20
}
```

`action`은 `like` / `comment` / `reply` / `follow` / `badge` / `mention` 중 하나. `type=badge`(시스템 알림)인 경우 `actor`는 `null`.

---

### `GET /notifications/unread-count`
안 읽은 알림 개수 (`MyView` 히어로의 알림 뱃지 대응).

**인증**: 필요

**Response 200**: `{ "count": 3 }`

---

### `PATCH /notifications/{id}/read`
개별 알림 읽음 처리 (알림 클릭 시).

**인증**: 필요

**Response 200**: `{ "isRead": true }`

| 코드 | 상황 |
|---|---|
| 404 | `NOTIFICATION_NOT_FOUND` |

---

### `POST /notifications/read-all`
전체 알림 일괄 읽음 처리 ("모두 읽음" 버튼 대응).

**인증**: 필요

**Response 200**: `{ "updated": 6 }` (읽음 처리된 개수)
