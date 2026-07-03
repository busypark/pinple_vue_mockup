# 핀플 (Pinple) — API 명세 · 스크랩/신고 도메인

공통 규칙(Base path, 인증 방식, 날짜 포맷, 페이지네이션, 에러 응답 포맷 등)은 [`API.md`](./API.md) 참고.

## 스크랩

한 리뷰핀은 항상 최대 1개 폴더에만 속한다(스크랩 시 다른 폴더에 있었다면 자동으로 이동). 기본 폴더는 실제 row로 만들지 않으며, `folderId`가 `null`인 스크랩은 "폴더 미지정" 상태로 취급한다.

### `GET /scrap-folders`
내 스크랩 폴더 목록 (`ScrapView`의 아코디언 리스트 대응).

**인증**: 필요

**Response 200**
```json
[
  { "id": 1, "name": "제주도 여행", "position": 0, "itemCount": 2 },
  { "id": 3, "name": null, "position": 2, "itemCount": 1 }
]
```

`name`이 `null`이면 클라이언트에서 "기본 폴더"로 표시한다. `position` 오름차순 정렬.

---

### `POST /scrap-folders`
새 폴더 생성.

**인증**: 필요

**Request**: `{ "name": "부산 맛집" }`

**Response 201**: `{ "id": 4, "name": "부산 맛집", "position": 3, "itemCount": 0 }` (`position`은 기존 폴더 다음 순번으로 자동 부여)

| 코드 | 상황 |
|---|---|
| 400 | `NAME_REQUIRED` |

---

### `DELETE /scrap-folders/{id}`
폴더 삭제. 폴더 안에 있던 스크랩도 함께 삭제된다(스크랩 자체가 취소됨).

**인증**: 필요

**Response 204**

| 코드 | 상황 |
|---|---|
| 403 | `NOT_THE_OWNER` |
| 404 | `FOLDER_NOT_FOUND` |

---

### `PATCH /scrap-folders/reorder`
드래그 정렬 순서 변경.

**인증**: 필요

**Request**: `{ "folderIds": [3, 1, 2] }` (새 순서대로 나열한 폴더 id 배열 — 배열 인덱스가 곧 새 `position`)

**Response 200**: 재정렬된 폴더 목록 (`GET /scrap-folders`와 동일 형태)

| 코드 | 상황 |
|---|---|
| 400 | `INVALID_FOLDER_IDS` — 본인 소유가 아니거나 존재하지 않는 id 포함 |

---

### `GET /scrap-folders/{id}/items`
폴더 안의 스크랩 아이템 목록 (아코디언 펼쳤을 때).

**인증**: 필요

**Query**: `?page=1&size=20`

**Response 200**
```json
{
  "items": [
    { "reviewPinId": 3, "placePinName": "카멜리아힐", "representativeImage": "https://..." }
  ],
  "total": 2, "page": 1, "size": 20
}
```

| 코드 | 상황 |
|---|---|
| 403 | `NOT_THE_OWNER` |
| 404 | `FOLDER_NOT_FOUND` |

---

### `POST /review-pins/{id}/scrap`
스크랩(폴더 지정 필수). 이미 다른 폴더에 스크랩되어 있었다면 지정한 폴더로 이동한다.

**인증**: 필요

**Request**: `{ "folderId": 1 }` (`folderId`를 생략하거나 `null`로 보내면 "폴더 미지정" 상태로 스크랩)

**Response 200**: `{ "scrapped": true, "folderId": 1 }`

| 코드 | 상황 |
|---|---|
| 404 | `REVIEW_PIN_NOT_FOUND` / `FOLDER_NOT_FOUND` |

`ReviewPin.scrapsCount` 캐시 컬럼 +1 (기존에 스크랩되어 있지 않았을 때만 — 폴더 이동은 카운트에 영향 없음).

---

### `DELETE /review-pins/{id}/scrap`
스크랩 취소 (어느 폴더에 있든 제거).

**인증**: 필요

**Response 200**: `{ "scrapped": false }`

| 코드 | 상황 |
|---|---|
| 404 | `SCRAP_NOT_FOUND` — 스크랩한 적 없음 |

`ReviewPin.scrapsCount` 캐시 컬럼 -1.

---

## 신고

리뷰핀만 신고 가능(댓글 신고는 미지원). 신고는 접수(기록)까지만 처리하며, 자동 조치나 관리자 검토 기능은 이번 스코프에 없다. 차단(Block) 기능은 논의되지 않아 포함하지 않는다.

### `POST /review-pins/{id}/report`
신고 (`ReviewDetailView`의 좋아요/댓글/스크랩 액션바 오른쪽 끝 신고 버튼 대응).

**인증**: 필요

**Request**
```json
{ "reason": "spam", "detail": null }
```

`reason`은 `spam`(스팸/광고) / `abuse`(욕설·혐오 표현) / `adult`(음란물) / `misinformation`(허위 정보) / `copyright`(저작권 침해) / `other`(기타) 중 하나. `reason=other`일 때만 `detail`(직접 입력 사유) 필수.

**Response 201**: `{ "reportId": 12, "status": "pending" }`

| 코드 | 상황 |
|---|---|
| 400 | `DETAIL_REQUIRED` — `reason=other`인데 `detail` 없음 |
| 404 | `REVIEW_PIN_NOT_FOUND` |
| 409 | `ALREADY_REPORTED` — 동일 유저가 동일 리뷰핀을 이미 신고함 (`reporterId` + `reviewPinId` 유니크 제약) |
