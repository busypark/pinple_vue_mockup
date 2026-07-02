<template>
  <div class="random-map-view">

    <!-- ── 지도 전체 영역 ── -->
    <div class="map-area" @click="closeSheet">

      <!-- 지도 배경 (가짜 한국 지도) -->
      <div class="fake-korea-map">
        <div class="map-sea-layer" />
        <div class="map-land-layer" />
        <div class="map-grid-layer" />
        <div class="map-road-h map-road-h1" />
        <div class="map-road-h map-road-h2" />
        <div class="map-road-h map-road-h3" />
        <div class="map-road-v map-road-v1" />
        <div class="map-road-v map-road-v2" />
      </div>

      <!-- 장소 핀들 -->
      <div
        v-for="place in placePins"
        :key="place.id"
        class="map-pin"
        :class="{
          selected: selectedPlace?.id === place.id,
          [categoryClass(place.category)]: true
        }"
        :style="pinPos(place)"
        @click.stop="selectPlace(place)"
      >
        <svg viewBox="0 0 20 28" :width="selectedPlace?.id === place.id ? 26 : 20" :height="selectedPlace?.id === place.id ? 36 : 28">
          <path d="M10 0C5.03 0 1 4.03 1 9c0 6.28 9 19 9 19S19 15.28 19 9c0-4.97-4.03-9-9-9z" :fill="pinColor(place.category, selectedPlace?.id === place.id)"/>
          <circle cx="10" cy="9" r="3.5" fill="white"/>
        </svg>
      </div>

      <!-- 지도 상단 오버레이: 타이틀 + 랜덤 버튼 -->
      <div class="map-top-bar">
        <div class="map-title-block">
          <span class="map-title">랜덤 맵</span>
          <span class="map-sub">{{ placePins.length }}개 장소 핀</span>
        </div>
        <button class="random-btn" @click.stop="pickRandom">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
          랜덤 발견
        </button>
      </div>
    </div>

    <!-- ── 장소 바텀시트 ── -->
    <Transition name="sheet-slide">
      <div v-if="selectedPlace" class="place-sheet" @click.stop>
        <div class="sheet-handle" />

        <!-- 장소 정보 -->
        <div class="sheet-top">
          <div class="sheet-info">
            <span class="sheet-cat-badge">{{ selectedPlace.category }}</span>
            <h3 class="sheet-name">{{ selectedPlace.name }}</h3>
            <p class="sheet-addr">{{ selectedPlace.address }}</p>
            <p class="sheet-review-count">
              오늘 리뷰핀 <strong>{{ selectedPlace.todayReviewCount }}</strong>개
            </p>
          </div>
          <button class="sheet-close" @click="selectedPlace = null">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- 관련 리뷰핀 -->
        <div class="sheet-section-label">리뷰핀</div>
        <div v-if="placeReviews.length === 0" class="sheet-no-reviews">(없습니다)</div>
        <div v-else class="sheet-reviews-scroll">
          <div
            v-for="rp in placeReviews"
            :key="rp.id"
            class="review-card"
            @click="goReview(rp.id)"
          >
            <div class="review-card-img">
              <img :src="rp.images[rp.representativeImageIndex]" />
              <span class="review-card-type">{{ rp.type === 'feed' ? '피드' : '블로그' }}</span>
            </div>
            <div class="review-card-body">
              <p class="review-card-title">{{ rp.title || truncate(rp.body, 28) }}</p>
              <p class="review-card-author">{{ getAuthor(rp.authorId) }}</p>
              <div class="review-card-stats">
                <span>❤ {{ rp.likes }}</span>
                <span>💬 {{ rp.comments }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { placePins, reviewPins, users } from '../data/dummy.js'

const router = useRouter()

const selectedPlace = ref(null)

const placeReviews = computed(() => {
  if (!selectedPlace.value) return []
  return reviewPins.filter(rp => rp.placePinId === selectedPlace.value.id)
})

function selectPlace(place) {
  selectedPlace.value = selectedPlace.value?.id === place.id ? null : place
}

function closeSheet() {
  selectedPlace.value = null
}

function pickRandom() {
  const others = placePins.filter(p => p.id !== selectedPlace.value?.id)
  selectedPlace.value = others[Math.floor(Math.random() * others.length)]
}

function goReview(id) {
  router.push({ name: 'review-detail', params: { id } })
}

function getAuthor(authorId) {
  return users.find(u => u.id === authorId)?.nickname ?? ''
}

function truncate(str, len) {
  return str.length > len ? str.slice(0, len) + '…' : str
}

// ── 핀 좌표 (한국 위도경도 → % 위치) ──
// lat: 33~38, lng: 126~130
function pinPos(place) {
  const x = 6 + ((place.lng - 126.0) / 4.0) * 86
  const y = 5 + ((38.0 - place.lat) / 5.0) * 88
  return { left: `${x}%`, top: `${y}%` }
}

// ── 카테고리 색상 ──
const catColorMap = {
  '관광지': '#E8536A',
  '문화':   '#7B68EE',
  '자연':   '#3DAB6E',
  '카페':   '#E8A454',
  '맛집':   '#E85454',
  '숙소':   '#5486E8',
  '쇼핑':   '#E854C8',
  '축제':   '#D4A017',
  '기타':   '#888',
}

function pinColor(cat, selected) {
  if (selected) return '#E8536A'
  return catColorMap[cat] ?? '#888'
}

function categoryClass(cat) {
  const map = { '관광지': 'pin-sightseeing', '문화': 'pin-culture', '자연': 'pin-nature', '카페': 'pin-cafe', '맛집': 'pin-food' }
  return map[cat] ?? 'pin-other'
}
</script>

<style scoped>
.random-map-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* ── 지도 영역 ─────────────────────────── */
.map-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: default;
}

/* ── 가짜 한국 지도 배경 ──────────────── */
.fake-korea-map {
  position: absolute;
  inset: 0;
}

.map-sea-layer {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, #A8C8E8 0%, #B8D8F0 40%, #9BBEDD 100%);
}

.map-land-layer {
  position: absolute;
  /* Korea peninsula simplified shape */
  top: 8%;
  left: 12%;
  width: 72%;
  height: 76%;
  background: linear-gradient(155deg, #C8D8A8 0%, #B8CC94 35%, #D4E0A8 60%, #B0C88A 100%);
  border-radius: 18% 22% 35% 28% / 14% 18% 40% 32%;
  clip-path: polygon(
    20% 0%, 55% 2%, 80% 8%, 95% 20%,
    100% 35%, 92% 50%, 98% 65%,
    88% 80%, 70% 92%, 55% 100%,
    35% 96%, 18% 88%, 5% 72%,
    0% 52%, 6% 32%, 12% 14%
  );
}

.map-grid-layer {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px);
  background-size: 28px 28px;
}

/* 도로선 */
.map-road-h, .map-road-v {
  position: absolute;
  background: rgba(255,255,255,0.55);
}

.map-road-h { height: 2px; left: 0; right: 0; }
.map-road-v { width: 2px; top: 0; bottom: 0; }

.map-road-h1 { top: 25%; }
.map-road-h2 { top: 50%; }
.map-road-h3 { top: 75%; }
.map-road-v1 { left: 30%; }
.map-road-v2 { left: 65%; }

/* ── 핀 ─────────────────────────────────── */
.map-pin {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
  transition: transform 0.15s;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  z-index: 5;
}

.map-pin.selected {
  z-index: 10;
  filter: drop-shadow(0 3px 8px rgba(232,83,106,0.5));
}

.map-pin:active { transform: translate(-50%, -100%) scale(0.9); }

/* ── 지도 상단 오버레이 ───────────────── */
.map-top-bar {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  z-index: 20;
}

.map-title-block {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.map-title {
  display: block;
  font-size: 14px;
  font-weight: 800;
  color: var(--text-primary);
}

.map-sub {
  font-size: 11px;
  color: var(--text-hint);
}

.random-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(232,83,106,0.4);
  transition: opacity 0.15s;
}

.random-btn:active { opacity: 0.8; }

/* ── 바텀시트 ───────────────────────────── */
.place-sheet {
  flex-shrink: 0;
  background: var(--bg-white);
  border-radius: 18px 18px 0 0;
  border-top: 1px solid var(--border);
  padding: 0 0 8px;
  max-height: 52%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
}

.sheet-handle {
  width: 36px;
  height: 4px;
  background: #D0D0D5;
  border-radius: 2px;
  margin: 10px auto 6px;
  flex-shrink: 0;
}

.sheet-top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 16px 10px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border);
}

.sheet-info { flex: 1; }

.sheet-cat-badge {
  display: inline-block;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  margin-bottom: 4px;
}

.sheet-name {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 3px;
}

.sheet-addr {
  font-size: 11px;
  color: var(--text-hint);
  margin: 0 0 3px;
  line-height: 1.4;
}

.sheet-review-count {
  font-size: 11px;
  color: var(--text-secondary);
  margin: 0;
}

.sheet-review-count strong {
  color: var(--primary);
  font-weight: 700;
}

.sheet-close {
  width: 30px;
  height: 30px;
  background: var(--bg);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  color: var(--text-secondary);
  margin-top: 2px;
}

.sheet-section-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-hint);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 16px 6px;
  flex-shrink: 0;
}

.sheet-no-reviews {
  font-size: 13px;
  color: var(--text-hint);
  text-align: center;
  padding: 12px 0;
}

/* ── 리뷰 카드 ──────────────────────────── */
.sheet-reviews-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.review-card {
  display: flex;
  gap: 10px;
  padding: 8px;
  border-radius: 10px;
  background: var(--bg);
  cursor: pointer;
  transition: background 0.1s;
}

.review-card:active { background: #EBEBEE; }

.review-card-img {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: var(--border);
}

.review-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.review-card-type {
  position: absolute;
  bottom: 3px;
  left: 3px;
  background: rgba(0,0,0,0.55);
  color: white;
  font-size: 8px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
}

.review-card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.review-card-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}

.review-card-author {
  font-size: 11px;
  color: var(--text-hint);
  margin: 0;
}

.review-card-stats {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: var(--text-hint);
  margin-top: auto;
}

/* ── 트랜지션 ────────────────────────────── */
.sheet-slide-enter-active,
.sheet-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
