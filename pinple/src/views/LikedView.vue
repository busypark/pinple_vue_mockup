<template>
  <div class="liked-view">
    <!-- Header -->
    <div class="liked-header">
      <button class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="liked-title">좋아요한 리뷰핀</span>
      <span class="liked-count">{{ likedPins.length }}</span>
    </div>

    <!-- Empty state -->
    <div v-if="likedPins.length === 0" class="liked-empty">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--border)" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      <p>좋아요한 리뷰핀이 없습니다</p>
      <span>마음에 드는 리뷰핀에 좋아요를 눌러보세요</span>
    </div>

    <!-- Pin grid -->
    <div v-else class="liked-scroll">
      <div class="pins-grid">
        <div
          v-for="pin in likedPins"
          :key="pin.id"
          class="pin-cell"
          @click="router.push({ name: 'review-detail', params: { id: pin.id } })"
        >
          <img :src="pin.images[pin.representativeImageIndex]" />
          <div class="pin-cell-overlay">
            <span class="pin-place">{{ getPlaceName(pin.placePinId) }}</span>
            <div class="pin-stats">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="#E8536A" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span>{{ pin.likes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { reviewPins, placePins } from '../data/dummy.js'

const router = useRouter()

const likedPins = computed(() => reviewPins.filter(rp => rp.isLiked))

function getPlaceName(placePinId) {
  return placePins.find(p => p.id === placePinId)?.name ?? ''
}
</script>

<style scoped>
.liked-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
}

/* ── Header ─────────────────────────────── */
.liked-header {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.back-btn {
  width: 34px;
  height: 34px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  border-radius: 50%;
}

.liked-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.liked-count {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-hint);
}

/* ── Empty ─────────────────────────────── */
.liked-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-hint);
}

.liked-empty p {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
}

.liked-empty span { font-size: 12px; }

/* ── Grid ─────────────────────────────── */
.liked-scroll {
  flex: 1;
  overflow-y: auto;
}

.pins-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.pin-cell {
  aspect-ratio: 1;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: var(--border);
}

.pin-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pin-cell-overlay {
  position: absolute;
  inset: auto 0 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.6));
  padding: 16px 6px 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pin-place {
  font-size: 9px;
  font-weight: 700;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pin-stats {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  color: rgba(255,255,255,0.85);
  font-weight: 600;
}
</style>
