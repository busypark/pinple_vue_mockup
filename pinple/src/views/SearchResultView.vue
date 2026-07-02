<template>
  <div class="search-result">

    <!-- ═══ 상단: 가짜 지도 (40%) ═══ -->
    <div class="map-area">
      <!-- 오버레이: 뒤로가기 + 검색바 -->
      <div class="map-topbar">
        <button class="tb-back" @click="goBack">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="tb-search" @click="router.push('/search')">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#999" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <span>{{ searchLabel }}</span>
        </div>
      </div>

      <!-- 가짜 지도 + 핀들 -->
      <div class="fake-map">
        <div
          v-for="(place, i) in resultPlaces"
          :key="place.id"
          class="map-pin"
          :class="{ selected: i === selectedIndex }"
          :style="{ left: pinPos(place).x + '%', top: pinPos(place).y + '%' }"
          @click.stop="selectPlace(i)"
        >
          <svg class="pin-svg" :viewBox="'0 0 20 28'"
            :width="i === selectedIndex ? 26 : 18"
            :height="i === selectedIndex ? 36 : 26"
          >
            <path d="M10 0C5.03 0 1 4.03 1 9c0 6.28 9 19 9 19S19 15.28 19 9c0-4.97-4.03-9-9-9z"
                  :fill="i === selectedIndex ? '#E8536A' : '#8899AA'"/>
            <circle cx="10" cy="9" r="3.5" fill="white"/>
          </svg>
          <div v-if="i === selectedIndex" class="pin-label">{{ place.name }}</div>
        </div>
      </div>
    </div>

    <!-- ═══ 하단: 상세 패널 (60%) ═══ -->
    <div class="detail-panel">

      <!-- 드래그 핸들 -->
      <div
        class="drag-handle"
        @pointerdown="onDragStart"
        @pointermove="onDragMove"
        @pointerup="onDragEnd"
        @pointercancel="onDragEnd"
      >
        <div class="drag-bar" />
      </div>

      <!-- 장소핀 요약 (좌/우 스와이프) -->
      <div
        class="place-summary"
        @pointerdown="onSwipeStart"
        @pointerup="onSwipeEnd"
      >
        <div class="summary-main">
          <div class="summary-left">
            <div class="summary-name-row">
              <span class="summary-name">{{ currentPlace.name }}</span>
              <span class="summary-cat">{{ currentPlace.category }}</span>
            </div>
            <div class="summary-row">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{{ currentPlace.address }}</span>
            </div>
            <div class="summary-row">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{{ currentPlace.hours }}</span>
            </div>
          </div>
          <div class="summary-right">
            <button class="nav-arr" :disabled="selectedIndex === 0" @click.stop="prevPlace">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span class="page-dot">{{ selectedIndex + 1 }}<span class="page-total">/{{ resultPlaces.length }}</span></span>
            <button class="nav-arr" :disabled="selectedIndex === resultPlaces.length - 1" @click.stop="nextPlace">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 미니 상세 지도 (드래그 시 펼쳐짐) -->
      <div class="mini-map-area" :style="{ height: dragOffset + 'px' }">
        <div class="mini-map-inner">
          <div class="mini-roads" />
          <div class="mini-pin-wrap">
            <svg viewBox="0 0 20 28" width="24" height="34">
              <path d="M10 0C5.03 0 1 4.03 1 9c0 6.28 9 19 9 19S19 15.28 19 9c0-4.97-4.03-9-9-9z" fill="#E8536A"/>
              <circle cx="10" cy="9" r="3.5" fill="white"/>
            </svg>
            <span class="mini-pin-name">{{ currentPlace.name }}</span>
          </div>
          <div class="mini-zoom-hint">상세 지도</div>
        </div>
      </div>

      <!-- 핀크루 발자국 -->
      <div class="review-section">
        <div class="review-header-bar">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          핀크루 발자국
          <span class="review-count-badge">{{ currentPlaceReviews.length }}</span>
        </div>
        <div class="review-list">
          <div v-if="currentPlaceReviews.length === 0" class="review-empty">
            아직 등록된 리뷰핀이 없습니다
          </div>
          <div
            v-for="pin in currentPlaceReviews"
            :key="pin.id"
            class="review-item"
            @click="router.push({ name: 'review-detail', params: { id: pin.id } })"
          >
            <img :src="pin.images[pin.representativeImageIndex]" class="review-thumb" />
            <div class="review-text-wrap">
              <p class="review-text">{{ pin.type === 'blog' ? pin.title : truncate(pin.body, 100) }}</p>
              <span class="review-date">{{ pin.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reviewPins, placePins } from '../data/dummy.js'

const route  = useRoute()
const router = useRouter()

const resultPlaces = computed(() => {
  if (route.query.region) {
    const filtered = placePins.filter(p => p.regions?.includes(route.query.region))
    return filtered.length > 0 ? filtered : placePins
  }
  return placePins
})

const initId = Number(route.query.placeId)
const selectedIndex = ref(
  initId ? Math.max(0, resultPlaces.value.findIndex(p => p.id === initId)) : 0
)

const currentPlace = computed(() => resultPlaces.value[selectedIndex.value] ?? null)
const currentPlaceReviews = computed(() =>
  currentPlace.value ? reviewPins.filter(r => r.placePinId === currentPlace.value.id) : []
)

const searchLabel = computed(() => {
  if (route.query.placeId) return currentPlace.value.name
  if (route.query.region)  return `${route.query.region} 검색 결과`
  return '검색 결과'
})

function goBack() {
  if (window.history.state?.back) router.back()
  else router.push('/')
}

function selectPlace(i) { selectedIndex.value = i }
function prevPlace()    { if (selectedIndex.value > 0) selectedIndex.value-- }
function nextPlace()    { if (selectedIndex.value < resultPlaces.value.length - 1) selectedIndex.value++ }

// 위경도 → 가짜 지도 % 좌표 (한국 범위: lat 33~38, lng 126~130)
function pinPos(place) {
  const x = 6 + ((place.lng - 126.0) / 4.0) * 86
  const y = 5 + ((38.0  - place.lat) / 5.0) * 88
  return { x: Math.max(5, Math.min(92, Math.round(x))), y: Math.max(5, Math.min(90, Math.round(y))) }
}

// ── 드래그 (미니 지도 펼치기) ──
const dragOffset = ref(0)
let _dy = 0
let _d0 = 0

function onDragStart(e) {
  _dy = e.clientY
  _d0 = dragOffset.value
  e.currentTarget.setPointerCapture(e.pointerId)
}
function onDragMove(e) {
  const delta = _dy - e.clientY
  dragOffset.value = Math.max(0, Math.min(160, _d0 + delta))
}
function onDragEnd() {
  if (dragOffset.value < 40) dragOffset.value = 0
}

// ── 스와이프 (장소 이동) ──
let _sx = 0, _sy = 0
function onSwipeStart(e) { _sx = e.clientX; _sy = e.clientY }
function onSwipeEnd(e) {
  const dx = e.clientX - _sx
  const dy = Math.abs(e.clientY - _sy)
  if (Math.abs(dx) > 40 && dy < 25) {
    dx < 0 ? nextPlace() : prevPlace()
  }
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '...' : str
}
</script>

<style scoped>
.search-result {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* ── 지도 영역 ── */
.map-area {
  flex: 0 0 40%;
  position: relative;
  overflow: hidden;
}

.map-topbar {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tb-back {
  width: 34px;
  height: 34px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
  color: var(--text-primary);
}

.tb-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 7px;
  background: white;
  border-radius: var(--radius-full);
  padding: 8px 14px;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 가짜 지도 */
.fake-map {
  position: absolute;
  inset: 0;
  background-color: #E4E8E0;
  background-image:
    linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 22px 22px;
  overflow: hidden;
}

/* 가짜 지형/수역 */
.fake-map::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 40% 60% at 8% 55%, rgba(180,215,255,0.55) 0%, transparent 100%),
    radial-gradient(ellipse 30% 40% at 95% 38%, rgba(180,215,255,0.5) 0%, transparent 100%),
    radial-gradient(ellipse 50% 30% at 50% 100%, rgba(180,215,255,0.55) 0%, transparent 100%),
    radial-gradient(ellipse 20% 20% at 30% 85%, rgba(160,200,255,0.35) 0%, transparent 100%);
  pointer-events: none;
}

/* 가짜 도로들 */
.fake-map::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(15deg, transparent 30%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.6) 31%, transparent 31%),
    linear-gradient(75deg, transparent 45%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.5) 46%, transparent 46%),
    linear-gradient(-20deg, transparent 55%, rgba(255,255,255,0.5) 55%, rgba(255,255,255,0.5) 56%, transparent 56%);
  pointer-events: none;
  z-index: 1;
}

.map-pin {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s;
}
.map-pin:active { transform: translate(-50%, -100%) scale(0.9); }
.map-pin.selected { z-index: 8; }

.pin-svg { display: block; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25)); }

.pin-label {
  background: var(--primary);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  margin-top: 2px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(232,83,106,0.4);
}

/* ── 하단 상세 패널 ── */
.detail-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
  border-top: 1px solid var(--border);
  overflow: hidden;
}

.drag-handle {
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: row-resize;
  flex-shrink: 0;
  user-select: none;
  touch-action: none;
}
.drag-bar {
  width: 36px;
  height: 4px;
  background: var(--border-dark);
  border-radius: 2px;
}

/* 장소 요약 */
.place-summary {
  padding: 4px 14px 12px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  user-select: none;
  cursor: grab;
}

.summary-main {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.summary-left { flex: 1; min-width: 0; }

.summary-name-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 5px;
  flex-wrap: wrap;
}
.summary-name {
  font-weight: 800;
  font-size: 15px;
  color: var(--text-primary);
}
.summary-cat {
  font-size: 11px;
  color: var(--primary);
  background: var(--primary-light);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.summary-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 3px;
}

.summary-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
}

.nav-arr {
  width: 26px;
  height: 26px;
  border: 1px solid var(--border-dark);
  border-radius: 50%;
  background: var(--bg-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  transition: background 0.15s;
}
.nav-arr:disabled { opacity: 0.3; cursor: default; }
.nav-arr:not(:disabled):hover { background: var(--bg); }

.page-dot {
  font-weight: 800;
  font-size: 13px;
  color: var(--primary);
}
.page-total {
  font-weight: 500;
  font-size: 11px;
  color: var(--text-hint);
}

/* 미니 상세 지도 */
.mini-map-area {
  flex-shrink: 0;
  overflow: hidden;
  background: #D8E4D0;
  border-bottom: 1px solid var(--border);
  position: relative;
  transition: height 0.1s;
}

.mini-map-inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-roads {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.75) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255,255,255,0.75) 2px, transparent 2px),
    linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px);
  background-size: 48px 48px, 48px 48px, 16px 16px, 16px 16px;
  background-position: 20px 14px;
}

.mini-pin-wrap {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.mini-pin-name {
  background: var(--primary);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(232,83,106,0.4);
}

.mini-zoom-hint {
  position: absolute;
  bottom: 6px;
  right: 10px;
  background: rgba(0,0,0,0.45);
  color: white;
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 4px;
  z-index: 3;
}

/* 핀크루 발자국 */
.review-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.review-header-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 800;
  padding: 9px 14px 7px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.review-count-badge {
  background: var(--primary-light);
  color: var(--primary);
  font-size: 11px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: var(--radius-full);
  margin-left: 2px;
}

.review-list {
  flex: 1;
  overflow-y: auto;
}

.review-empty {
  text-align: center;
  color: var(--text-hint);
  font-size: 13px;
  padding: 24px 0;
}

.review-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.1s;
}
.review-item:active { background: var(--bg); }

.review-thumb {
  width: 58px;
  height: 58px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
  background: var(--border);
}

.review-text-wrap { flex: 1; min-width: 0; }

.review-text {
  font-size: 12px;
  color: var(--text-primary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-date {
  display: block;
  font-size: 11px;
  color: var(--text-hint);
  margin-top: 4px;
}
</style>
