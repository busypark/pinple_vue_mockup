export const users = [
  { id: 1, nickname: '여행러버', profileImg: 'https://i.pravatar.cc/40?img=11', bio: '전국 방방곡곡 탐험 중', following: 24, followers: 108, reviewPinCount: 37 },
  { id: 2, nickname: '맛집탐험가', profileImg: 'https://i.pravatar.cc/40?img=22', bio: '먹으러 여행합니다', following: 15, followers: 203, reviewPinCount: 52 },
  { id: 3, nickname: '감성사진가', profileImg: 'https://i.pravatar.cc/40?img=33', bio: '순간을 담습니다', following: 42, followers: 89, reviewPinCount: 21 },
  { id: 4, nickname: '주말여행러', profileImg: 'https://i.pravatar.cc/40?img=44', bio: '매 주말 새로운 곳으로', following: 8, followers: 45, reviewPinCount: 14 },
  { id: 5, nickname: '나(핀플러)', profileImg: 'https://i.pravatar.cc/40?img=55', bio: '핀플 애용자', following: 3, followers: 4, reviewPinCount: 2 },
]

export const currentUser = users[4]

export const categories = ['관광지', '카페', '맛집', '축제', '숙소', '쇼핑', '문화', '자연', '기타']

export const placePins = [
  { id: 1, name: '광안리 해수욕장', category: '관광지', address: '부산 수영구 광안해변로 219', hours: '24시간', lat: 35.153, lng: 129.118, todayReviewCount: 2, regions: ['부산시', '부산시 수영구'] },
  { id: 2, name: '전주 한옥마을', category: '문화', address: '전북 전주시 완산구 기린대로 99', hours: '상시 개방', lat: 35.815, lng: 127.152, todayReviewCount: 2, regions: ['전북 전주시'] },
  { id: 3, name: '카멜리아힐', category: '자연', address: '제주 서귀포시 안덕면 병악로 166', hours: '08:30 ~ 19:00', lat: 33.289, lng: 126.374, todayReviewCount: 1, regions: ['제주 서귀포시'] },
  { id: 4, name: '경복궁', category: '문화', address: '서울 종로구 사직로 161', hours: '09:00 ~ 18:00', lat: 37.579, lng: 126.977, todayReviewCount: 2, regions: ['서울시', '서울시 종로구'] },
  { id: 5, name: '해운대 해수욕장', category: '관광지', address: '부산 해운대구 해운대해변로 264', hours: '24시간', lat: 35.158, lng: 129.160, todayReviewCount: 1, regions: ['부산시', '부산시 해운대구'] },
  { id: 6, name: '성산일출봉', category: '자연', address: '제주 서귀포시 성산읍 일출로 284-12', hours: '07:00 ~ 20:00', lat: 33.459, lng: 126.942, todayReviewCount: 1, regions: ['제주 서귀포시'] },
]

export const topPlaces = [
  { ...placePins[3], rank: 1 },
  { ...placePins[0], rank: 2 },
  { ...placePins[1], rank: 3 },
]

export const reviewPins = [
  {
    id: 1, type: 'feed', placePinId: 1, authorId: 2,
    title: null,
    body: '광안리 야경이 정말 너무 예뻤어요. 저녁에 오면 광안대교 야경이 장관입니다! 꼭 해 지고 나서 가세요.',
    images: [
      'https://picsum.photos/seed/gwangan1/400/400',
      'https://picsum.photos/seed/gwangan2/400/400',
      'https://picsum.photos/seed/gwangan3/400/400',
    ],
    representativeImageIndex: 0,
    tags: ['#오션뷰', '#야경', '#부산여행', '#광안대교'],
    likes: 142, comments: 5, scraps: 18, views: 1247,
    createdAt: '2026-06-28', isLiked: false, isScrapped: true,
  },
  {
    id: 2, type: 'blog', placePinId: 2, authorId: 1,
    title: '전주 한옥마을 완벽 여행 가이드',
    body: '전주 한옥마을은 한국 전통의 아름다움을 고스란히 느낄 수 있는 곳입니다. 골목골목마다 숨겨진 맛집과 카페가 있어서 하루 종일 돌아다녀도 지루하지 않아요. 특히 비빔밥 본고장답게 맛집이 정말 많습니다.\n\n한복 대여도 꼭 해보세요! 한복 입고 한옥 배경으로 사진 찍으면 정말 예뻐요.',
    images: [
      'https://picsum.photos/seed/jeonju1/400/400',
      'https://picsum.photos/seed/jeonju2/400/400',
    ],
    representativeImageIndex: 0,
    tags: ['#한옥마을', '#전주여행', '#한복체험', '#비빔밥'],
    likes: 89, comments: 3, scraps: 31, views: 834,
    createdAt: '2026-06-27', isLiked: true, isScrapped: true,
  },
  {
    id: 3, type: 'feed', placePinId: 3, authorId: 3,
    title: null,
    body: '카멜리아힐의 동백꽃이 만개했어요. 제주의 봄은 여기서 시작되는 것 같아요. 입장료가 좀 있지만 충분히 가볼 만한 곳!',
    images: [
      'https://picsum.photos/seed/camellia1/400/400',
      'https://picsum.photos/seed/camellia2/400/400',
    ],
    representativeImageIndex: 0,
    tags: ['#제주여행', '#동백꽃', '#카멜리아힐', '#봄꽃'],
    likes: 203, comments: 2, scraps: 57, views: 2103,
    createdAt: '2026-06-28', isLiked: false, isScrapped: true,
  },
  {
    id: 4, type: 'blog', placePinId: 4, authorId: 4,
    title: '경복궁 야간개장 후기',
    body: '경복궁 야간개장은 사전 예약이 필수예요! 조명이 켜진 경복궁은 낮과는 완전히 다른 매력이 있습니다. 근정전 앞 마당에서 바라보는 야경이 특히 인상적이었어요.',
    images: [
      'https://picsum.photos/seed/gyeongbok1/400/400',
      'https://picsum.photos/seed/gyeongbok2/400/400',
    ],
    representativeImageIndex: 0,
    tags: ['#경복궁', '#야간개장', '#서울여행', '#궁궐'],
    likes: 76, comments: 0, scraps: 24, views: 612,
    createdAt: '2026-06-26', isLiked: false, isScrapped: false,
  },
  {
    id: 5, type: 'feed', placePinId: 5, authorId: 1,
    title: null,
    body: '해운대 일출이 이렇게 아름다운지 몰랐어요. 새벽 5시에 일어난 보람이 있었습니다.',
    images: [
      'https://picsum.photos/seed/haeundae1/400/400',
      'https://picsum.photos/seed/haeundae2/400/400',
    ],
    representativeImageIndex: 0,
    tags: ['#해운대', '#일출', '#부산', '#새벽'],
    likes: 118, comments: 0, scraps: 22, views: 958,
    createdAt: '2026-06-25', isLiked: false, isScrapped: true,
  },
  {
    id: 6, type: 'blog', placePinId: 6, authorId: 3,
    title: '성산일출봉 등반 완벽 정복기',
    body: '성산일출봉은 제주도 여행의 필수 코스죠. 정상까지 약 20분이면 올라갈 수 있어요. 올라가는 길이 조금 힘들지만 정상에서 보이는 바다 경치는 정말 장관입니다.',
    images: [
      'https://picsum.photos/seed/seongsan1/400/400',
      'https://picsum.photos/seed/seongsan2/400/400',
    ],
    representativeImageIndex: 0,
    tags: ['#성산일출봉', '#제주', '#등반', '#일출'],
    likes: 55, comments: 0, scraps: 13, views: 441,
    createdAt: '2026-06-24', isLiked: false, isScrapped: true,
  },
  {
    id: 7, type: 'feed', placePinId: 2, authorId: 3,
    title: null,
    body: '한옥마을 골목 카페에서 마신 쌍화차 한 잔. 고즈넉한 분위기가 너무 좋았어요.',
    images: [
      'https://picsum.photos/seed/jeonju_cafe/400/400',
    ],
    representativeImageIndex: 0,
    tags: ['#전주카페', '#한옥마을', '#쌍화차', '#분위기맛집'],
    likes: 67, comments: 0, scraps: 11, views: 523,
    createdAt: '2026-06-23', isLiked: false, isScrapped: false,
  },
  {
    id: 8, type: 'blog', placePinId: 4, authorId: 5,
    title: '경복궁 야간개장 처음 가봤어요!',
    body: '드디어 경복궁 야간개장 예약에 성공했어요. 사전 예약이 정말 빠르게 마감되더라고요.\n\n조명이 켜진 궁궐은 낮과는 완전히 다른 분위기였어요. 특히 연못에 비친 불빛이 정말 아름다웠어요.',
    images: [
      'https://picsum.photos/seed/gyeongbok_night1/400/400',
      'https://picsum.photos/seed/gyeongbok_night2/400/400',
    ],
    representativeImageIndex: 0,
    tags: ['#경복궁', '#야간개장', '#서울여행', '#첫방문'],
    likes: 12, comments: 0, scraps: 3, views: 87,
    createdAt: '2026-06-28', isLiked: false, isScrapped: false,
  },
  {
    id: 9, type: 'feed', placePinId: 1, authorId: 5,
    title: null,
    body: '광안리에서 먹은 조개구이 너무 맛있었어요. 야경 보면서 먹으니 더 특별한 느낌!',
    images: [
      'https://picsum.photos/seed/gwangan_food/400/400',
    ],
    representativeImageIndex: 0,
    tags: ['#광안리', '#조개구이', '#부산야경', '#맛집'],
    likes: 8, comments: 0, scraps: 2, views: 64,
    createdAt: '2026-06-27', isLiked: false, isScrapped: false,
  },
]

// 팔로잉 피드: 내(userId=5)가 팔로우한 userId 1, 2, 3의 게시물
export const followingFeed = reviewPins.filter(rp => [1, 2, 3].includes(rp.authorId))

export const regions = [
  '서울시', '서울시 종로구', '서울시 강남구', '서울시 마포구', '서울시 서대문구',
  '부산시', '부산시 해운대구', '부산시 수영구', '부산시 중구',
  '제주시', '제주 서귀포시',
  '전북 전주시', '전남 여수시',
  '경기도 수원시', '경기도 가평군',
  '강원도 강릉시', '강원도 속초시',
  '경상남도 통영시', '경상북도 경주시',
  '충남 공주시',
]

export const popularTags = {
  '서울시': ['#경복궁', '#한복체험', '#야간개장', '#서울여행', '#궁궐'],
  '부산시': ['#오션뷰', '#야경', '#광안대교', '#해운대', '#부산여행'],
  '제주시': ['#제주여행', '#동백꽃', '#일출', '#올레길', '#감귤'],
  '제주 서귀포시': ['#성산일출봉', '#카멜리아힐', '#제주', '#일출', '#자연'],
  '전북 전주시': ['#한옥마을', '#비빔밥', '#한복체험', '#전주여행', '#막걸리'],
  '강원도 강릉시': ['#바다뷰', '#커피거리', '#정동진', '#강릉여행', '#카페'],
}

export const scraps = [
  {
    id: 1,
    folderName: '제주도 여행',
    pins: [
      { reviewPinId: 3, placePinId: 3 },
      { reviewPinId: 6, placePinId: 6 },
    ]
  },
  {
    id: 2,
    folderName: '부산 맛집',
    pins: [
      { reviewPinId: 1, placePinId: 1 },
      { reviewPinId: 5, placePinId: 5 },
    ]
  },
  {
    id: 3,
    folderName: null,
    pins: [
      { reviewPinId: 2, placePinId: 2 },
    ]
  },
]

export const dummyComments = [
  { id: 1, pinId: 1, authorId: 1, parentId: null, text: '저도 꼭 가보고 싶어요! 언제가 제일 예쁜가요?', createdAt: '2026-06-28 14:23', likes: 4 },
  { id: 2, pinId: 1, authorId: 3, parentId: null, text: '야경이 정말 대박이죠 ㅎㅎ 저는 10시쯤에 갔어요~', createdAt: '2026-06-28 15:41', likes: 7 },
  { id: 3, pinId: 1, authorId: 4, parentId: null, text: '광안대교 배경으로 사진 찍으면 너무 예뻐요!', createdAt: '2026-06-28 17:05', likes: 2 },
  { id: 4, pinId: 1, authorId: 2, parentId: null, text: '이번 주말에 갈 계획인데 꼭 참고할게요 감사합니다 :)', createdAt: '2026-06-28 18:30', likes: 1 },
  { id: 5, pinId: 1, authorId: 3, parentId: null, text: '주차는 어디에 했어요? 자차로 가려고요', createdAt: '2026-06-28 21:12', likes: 0 },
  { id: 11, pinId: 1, authorId: 2, parentId: 1, text: '@여행러버 저녁 8~9시쯤이 제일 예뻐요! 노을 질 때부터 야경 켜질 때까지가 진짜 예술이에요', createdAt: '2026-06-28 16:02', likes: 3 },
  { id: 12, pinId: 1, authorId: 1, parentId: 1, text: '오 감사합니다! 저녁에 맞춰서 가봐야겠네요', createdAt: '2026-06-28 16:20', likes: 1 },
  { id: 6, pinId: 2, authorId: 2, parentId: null, text: '한복 대여 어디서 하셨어요? 저도 입어보고 싶어요!', createdAt: '2026-06-28 09:10', likes: 5 },
  { id: 13, pinId: 2, authorId: 1, parentId: 6, text: '@맛집탐험가 한옥마을 안쪽 대여점에서 했어요, 가격도 저렴해요', createdAt: '2026-06-28 11:00', likes: 2 },
  { id: 7, pinId: 2, authorId: 3, parentId: null, text: '전주 비빔밥 진짜 맛있죠 저도 다녀왔는데 또 가고 싶어요', createdAt: '2026-06-28 10:30', likes: 3 },
  { id: 8, pinId: 2, authorId: 4, parentId: null, text: '한옥마을 골목 안쪽까지 들어가보세요 숨겨진 맛집 많아요', createdAt: '2026-06-27 20:15', likes: 8 },
  { id: 9, pinId: 3, authorId: 1, parentId: null, text: '저도 작년에 갔는데 완전 힐링이었어요 ㅠㅠ', createdAt: '2026-06-28 13:20', likes: 4 },
  { id: 10, pinId: 3, authorId: 4, parentId: null, text: '입장료 가격이 얼마예요? 가족이랑 가려고 하는데', createdAt: '2026-06-28 14:55', likes: 1 },
]

export const badges = [
  { id: 1, name: '첫 발걸음', desc: '첫 번째 리뷰핀 작성', color: '#E8536A', earned: true },
  { id: 2, name: '핀 수집가', desc: '리뷰핀 10개 작성', color: '#F4A442', earned: false },
  { id: 3, name: '탐험가', desc: '5개 이상 지역 방문', color: '#4CAF7D', earned: false },
  { id: 4, name: '소통러', desc: '댓글 20개 작성', color: '#5B8DEF', earned: false },
  { id: 5, name: '인기스타', desc: '좋아요 100개 받기', color: '#F4A442', earned: false },
  { id: 6, name: '핀크루장', desc: '팔로워 50명 달성', color: '#A259E6', earned: false },
  { id: 7, name: '여행왕', desc: '10개 이상 지역 방문', color: '#4CAF7D', earned: false },
  { id: 8, name: '핀플리스트', desc: '리뷰핀 50개 작성', color: '#E8536A', earned: false },
]

export const notifications = [
  { id: 1, type: 'user',  date: '오늘',     actorId: 2,    action: 'like',    targetReviewPinId: 8,    text: '맛집탐험가님이 회원님의 리뷰핀에 좋아요를 눌렀습니다.' },
  { id: 2, type: 'user',  date: '오늘',     actorId: 3,    action: 'comment', targetReviewPinId: 8,    text: '감성사진가님이 댓글을 남겼습니다: "멋진 야경이에요!"' },
  { id: 3, type: 'user',  date: '오늘',     actorId: 1,    action: 'reply',   targetReviewPinId: 5,    text: '여행러버님이 회원님의 댓글에 대댓글을 달았습니다.' },
  { id: 4, type: 'user',  date: '어제',     actorId: 4,    action: 'follow',  targetReviewPinId: null, text: '제주한달살기님이 회원님을 팔로우하기 시작했습니다.' },
  { id: 5, type: 'badge', date: '어제',     actorId: null, action: 'badge',   targetReviewPinId: null, text: '새 뱃지를 획득했어요! 🎖 "첫 발걸음" — 첫 번째 리뷰핀을 작성했습니다.' },
  { id: 6, type: 'user',  date: '6월 28일', actorId: 2,    action: 'like',    targetReviewPinId: 3,    text: '맛집탐험가님이 회원님의 리뷰핀에 좋아요를 눌렀습니다.' },
]
