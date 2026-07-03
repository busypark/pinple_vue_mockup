# 핀플 (Pinple) — API 명세

`README.md`의 "실서비스 전환 설계 결정 사항"과 `ERD.md`를 근거로 작성한 API 명세. 이 문서는 모든 도메인에 공통으로 적용되는 규칙만 담고, 실제 엔드포인트는 도메인별 파일로 분리한다.

## 공통 규칙

- Base path: `/api/v1`
- 인증: `Authorization: Bearer <accessToken>` (JWT). 필요한 엔드포인트마다 별도 표기
- 날짜/시간: ISO 8601 (`2026-06-28T14:23:00+09:00`)
- 페이지네이션: `?page=1&size=20` 형태, 응답은 `{ items, total, page, size }`
- 에러 응답: `{ "error": { "code": "STRING_CODE", "message": "사람이 읽을 메시지" } }`
- 소프트 삭제된 리소스(탈퇴 유저, 삭제된 리뷰핀/댓글)는 일반 조회 API에서 제외되거나 "삭제된 콘텐츠입니다" 형태로 마스킹되어 내려간다.

## 도메인별 문서

`ERD.md`의 도메인 구분과 동일한 순서로 작성한다.

| 순서 | 도메인 | 파일 | 엔드포인트 수 | 상태 |
|---|---|---|---|---|
| 1 | 인증/계정 | [`API-auth.md`](./API-auth.md) | 14 | 작성 완료 |
| 2 | 소셜 (팔로우·좋아요·뱃지·알림) | [`API-social.md`](./API-social.md) | 12 | 작성 완료 |
| 3 | 콘텐츠 (장소·리뷰핀·이미지·댓글·검색·랜덤탭) | [`API-content.md`](./API-content.md) | 20 | 작성 완료 |
| 4 | 스크랩/신고 | [`API-scrap-report.md`](./API-scrap-report.md) | 8 | 작성 완료 |

**합계 54개 엔드포인트**

## 전체 API 목록 (시그니처 + 역할)

도메인 파일을 하나씩 열어보지 않고도 전체 엔드포인트를 한눈에 훑을 수 있도록, Method·Path·역할만 요약한 목록. 상세 스펙(Request/Response/에러)은 각 도메인 파일 참고.

| Method | Path | 도메인 | 역할 |
|---|---|---|---|
| POST | `/auth/signup` | 인증/계정 | 이메일 회원가입, 인증 메일 발송 |
| POST | `/auth/verify-email` | 인증/계정 | 이메일 인증 확인 |
| POST | `/auth/resend-verification` | 인증/계정 | 인증 메일 재전송 |
| POST | `/auth/login` | 인증/계정 | 이메일/비밀번호 로그인 |
| POST | `/auth/login/social` | 인증/계정 | 카카오·구글 OAuth 로그인/가입 |
| POST | `/auth/refresh` | 인증/계정 | Access Token 재발급 |
| POST | `/auth/logout` | 인증/계정 | 로그아웃 (Refresh Token 무효화) |
| POST | `/auth/password-reset/request` | 인증/계정 | 비밀번호 재설정 메일 요청 |
| POST | `/auth/password-reset/confirm` | 인증/계정 | 비밀번호 재설정 확정 |
| GET | `/users/me` | 인증/계정 | 내 계정 정보 조회 |
| PATCH | `/users/me` | 인증/계정 | 닉네임·소개·프로필사진 수정 |
| PATCH | `/users/me/password` | 인증/계정 | 비밀번호 변경 (로그인 상태) |
| PATCH | `/users/me/settings` | 인증/계정 | 알림 설정 토글 |
| DELETE | `/users/me` | 인증/계정 | 회원 탈퇴 (소프트 삭제 + 익명화) |
| GET | `/users/{id}` | 소셜 | 타 유저 프로필 조회 |
| POST | `/users/{id}/follow` | 소셜 | 팔로우 |
| DELETE | `/users/{id}/follow` | 소셜 | 언팔로우 |
| GET | `/users/{id}/following` | 소셜 | 팔로잉 목록 |
| GET | `/users/{id}/followers` | 소셜 | 팔로워 목록 |
| POST | `/review-pins/{id}/like` | 소셜 | 좋아요 |
| DELETE | `/review-pins/{id}/like` | 소셜 | 좋아요 취소 |
| GET | `/users/{id}/badges` | 소셜 | 뱃지 목록/획득 여부 |
| GET | `/notifications` | 소셜 | 내 알림 목록 |
| GET | `/notifications/unread-count` | 소셜 | 안 읽은 알림 수 |
| PATCH | `/notifications/{id}/read` | 소셜 | 알림 개별 읽음 처리 |
| POST | `/notifications/read-all` | 소셜 | 알림 전체 읽음 처리 |
| GET | `/place-pins` | 콘텐츠 | 전체 장소 목록 (지도용) |
| GET | `/place-pins/{id}` | 콘텐츠 | 장소 상세 |
| GET | `/place-pins/{id}/review-pins` | 콘텐츠 | 장소별 리뷰핀 목록 (핀크루 발자국) |
| GET | `/place-pins/top` | 콘텐츠 | 홈 "지금 뜨는 곳" |
| GET | `/search/places` | 콘텐츠 | 검색 결과 장소 목록 |
| GET | `/regions/{region}/popular-tags` | 콘텐츠 | 지역별 인기 태그 |
| GET | `/feed/popular` | 콘텐츠 | 홈 인기 탭 피드 |
| GET | `/feed/following` | 콘텐츠 | 홈 팔로잉 탭 피드 |
| GET | `/feed/random` | 콘텐츠 | 홈 랜덤 탭 피드 (시드 기반 재현) |
| POST | `/images` | 콘텐츠 | 이미지 업로드 |
| POST | `/review-pins` | 콘텐츠 | 리뷰핀 등록 (피드/블로그, 기존장소/노지) |
| GET | `/review-pins/{id}` | 콘텐츠 | 리뷰핀 상세 |
| POST | `/review-pins/{id}/view` | 콘텐츠 | 조회수 증가 |
| PATCH | `/review-pins/{id}` | 콘텐츠 | 리뷰핀 수정 |
| DELETE | `/review-pins/{id}` | 콘텐츠 | 리뷰핀 삭제 (소프트 삭제) |
| GET | `/users/{id}/review-pins` | 콘텐츠 | 유저별 리뷰핀 목록 (피드/블로그 탭) |
| GET | `/users/me/liked-review-pins` | 콘텐츠 | 내가 좋아요한 리뷰핀 목록 |
| GET | `/review-pins/{id}/comments` | 콘텐츠 | 댓글 목록 (답글 포함) |
| POST | `/review-pins/{id}/comments` | 콘텐츠 | 댓글/답글 작성 (멘션 파싱) |
| DELETE | `/comments/{id}` | 콘텐츠 | 댓글 삭제 (소프트 삭제) |
| GET | `/scrap-folders` | 스크랩/신고 | 내 스크랩 폴더 목록 |
| POST | `/scrap-folders` | 스크랩/신고 | 새 폴더 생성 |
| DELETE | `/scrap-folders/{id}` | 스크랩/신고 | 폴더 삭제 |
| PATCH | `/scrap-folders/reorder` | 스크랩/신고 | 폴더 드래그 정렬 |
| GET | `/scrap-folders/{id}/items` | 스크랩/신고 | 폴더 내 스크랩 아이템 목록 |
| POST | `/review-pins/{id}/scrap` | 스크랩/신고 | 스크랩 (폴더 지정) |
| DELETE | `/review-pins/{id}/scrap` | 스크랩/신고 | 스크랩 취소 |
| POST | `/review-pins/{id}/report` | 스크랩/신고 | 리뷰핀 신고 접수 |

