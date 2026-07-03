# 핀플 (Pinple) — API 명세 · 인증/계정 도메인

공통 규칙(Base path, 인증 방식, 날짜 포맷, 페이지네이션, 에러 응답 포맷 등)은 [`API.md`](./API.md) 참고.

## 인증 / 계정

### `POST /auth/signup`
이메일 회원가입. 가입 즉시 인증 메일을 발송하고, 이메일 인증 전까지 로그인은 차단된다.

**인증**: 불필요

**Request**
```json
{
  "email": "user@example.com",
  "nickname": "여행러버",
  "password": "8자 이상",
  "agreeService": true,
  "agreePrivacy": true,
  "agreeMarketing": false
}
```

**Response 201**
```json
{ "userId": 42 }
```

| 코드 | 상황 |
|---|---|
| 400 | 필드 유효성 실패 (닉네임 길이, 비밀번호 길이 등) |
| 409 | `EMAIL_ALREADY_REGISTERED` — 이미 가입된 이메일 (OAuth로 가입된 경우 포함, 병합하지 않음) |

가입 성공 시 서버 내부에서: `User` row 생성(`emailVerified=false`) → `TermsAgreement` 3건(service/privacy/marketing) insert → `VerificationToken(type=email_verify)` 발급 후 인증 메일 발송.

---

### `POST /auth/verify-email`
이메일 인증 링크 클릭 시 호출.

**인증**: 불필요

**Request**
```json
{ "token": "abc123..." }
```

**Response 200**: `{ "verified": true }`

| 코드 | 상황 |
|---|---|
| 400 | `INVALID_TOKEN` — 만료되었거나 이미 사용된 토큰 |

---

### `POST /auth/resend-verification`
인증 메일 재전송.

**인증**: 불필요

**Request**: `{ "email": "user@example.com" }`

**Response 200**: `{ "sent": true }` (이메일 존재 여부와 무관하게 항상 200 — 이메일 존재 여부 노출 방지)

---

### `POST /auth/login`
이메일/비밀번호 로그인.

**인증**: 불필요

**Request**
```json
{ "email": "user@example.com", "password": "..." }
```

**Response 200**
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": 42, "nickname": "여행러버", "profileImg": "..." }
}
```

| 코드 | 상황 |
|---|---|
| 401 | `INVALID_CREDENTIALS` — 이메일/비밀번호 불일치 |
| 403 | `EMAIL_NOT_VERIFIED` — 이메일 인증 전 로그인 시도 |

---

### `POST /auth/login/social`
카카오/구글 OAuth 콜백 처리. 최초 로그인이면 신규 `User` + `SocialAccount` 생성, 기존 유저면 로그인 처리.

**인증**: 불필요

**Request**
```json
{ "provider": "kakao", "providerAccessToken": "..." }
```

**Response 200**: `POST /auth/login`과 동일한 형태

| 코드 | 상황 |
|---|---|
| 409 | `EMAIL_ALREADY_REGISTERED_OTHER_METHOD` — 소셜 계정의 이메일이 이미 다른 방식(이메일 가입 또는 다른 소셜)으로 가입되어 있음. 병합하지 않고 이 에러로 종료 |
| 422 | `EMAIL_SCOPE_REQUIRED` — 카카오 로그인 시 이메일 동의 항목을 거부한 경우 (이메일 필수 스코프) |

---

### `POST /auth/refresh`
Access Token 재발급.

**인증**: 불필요 (refreshToken 자체가 인증 수단)

**Request**: `{ "refreshToken": "..." }`

**Response 200**: `{ "accessToken": "...", "refreshToken": "..." }` (Refresh Token Rotation — 재발급 시 기존 refreshToken은 무효화)

| 코드 | 상황 |
|---|---|
| 401 | `INVALID_OR_REVOKED_TOKEN` |

---

### `POST /auth/logout`
현재 세션의 Refresh Token을 무효화.

**인증**: 필요

**Request**: `{ "refreshToken": "..." }`

**Response 204**

---

### `POST /auth/password-reset/request`
비밀번호 재설정 메일 발송 요청.

**인증**: 불필요

**Request**: `{ "email": "user@example.com" }`

**Response 200**: `{ "sent": true }` (이메일 존재 여부와 무관하게 항상 200)

---

### `POST /auth/password-reset/confirm`
재설정 링크의 토큰과 새 비밀번호로 실제 변경.

**인증**: 불필요

**Request**
```json
{ "token": "abc123...", "newPassword": "8자 이상" }
```

**Response 200**: `{ "reset": true }`

| 코드 | 상황 |
|---|---|
| 400 | `INVALID_TOKEN` — 만료되었거나 이미 사용된 토큰 |

---

### `GET /users/me`
내 계정 정보 조회.

**인증**: 필요

**Response 200**
```json
{
  "id": 42,
  "nickname": "여행러버",
  "profileImg": "https://...",
  "bio": "전국 방방곡곡 탐험 중",
  "email": "user@example.com",
  "following": 24,
  "followers": 108,
  "reviewPinCount": 37,
  "pushEnabled": true,
  "likeAlertEnabled": true
}
```

---

### `PATCH /users/me`
닉네임·소개·프로필 사진 수정 (`AccountView` 대응).

**인증**: 필요

**Request**
```json
{ "nickname": "새 닉네임", "bio": "새 소개", "profileImg": "https://..." }
```
(부분 수정 가능 — 보낸 필드만 갱신)

**Response 200**: 수정된 User 객체

| 코드 | 상황 |
|---|---|
| 400 | 닉네임 20자/소개 80자 초과 |

---

### `PATCH /users/me/password`
로그인 상태에서 비밀번호 변경 (`SettingsView` 다이얼로그 대응).

**인증**: 필요

**Request**
```json
{ "currentPassword": "...", "newPassword": "8자 이상" }
```

**Response 200**: `{ "changed": true }`

| 코드 | 상황 |
|---|---|
| 401 | `INVALID_CURRENT_PASSWORD` |

---

### `PATCH /users/me/settings`
알림 설정 토글 (`SettingsView`의 푸시 알림/좋아요 알림 토글 대응).

**인증**: 필요

**Request**: `{ "pushEnabled": true, "likeAlertEnabled": false }`

**Response 200**: 갱신된 설정 값

---

### `DELETE /users/me`
회원 탈퇴. 소프트 삭제 + 익명화 처리, `Follow` 관계는 실제 삭제, 작성한 콘텐츠는 작성자 표시만 대체.

**인증**: 필요

**Response 204**
