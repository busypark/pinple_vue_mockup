<template>
  <div class="my-view">
    <div class="my-scroll">

      <!-- ── Hero ─────────────────────────────── -->
      <div class="profile-hero">
        <div class="hero-actions">
          <button class="hero-action-btn" @click="router.push('/notifications')">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span v-if="notifications.length > 0" class="notif-badge">{{ notifications.length }}</span>
          </button>
          <button class="hero-action-btn" @click="router.push('/settings')">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>
        <div class="profile-photo-wrap">
          <img :src="currentUser.profileImg" class="profile-photo" />
          <button class="photo-edit-btn" @click="router.push('/account')">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </button>
        </div>
      </div>

      <!-- ── Profile info ─────────────────────── -->
      <div class="profile-info-block">
        <h2 class="profile-nickname">{{ currentUser.nickname }}</h2>
        <p class="profile-bio">{{ currentUser.bio }}</p>
        <button class="edit-profile-btn" @click="router.push('/account')">프로필 수정</button>
      </div>

      <!-- ── Stats row ────────────────────────── -->
      <div class="stats-row">
        <button class="stat-item" @click="router.push('/pincrew?tab=following')">
          <span class="stat-num">{{ currentUser.following }}</span>
          <span class="stat-label">팔로잉</span>
        </button>
        <div class="stat-sep" />
        <button class="stat-item" @click="router.push('/pincrew?tab=followers')">
          <span class="stat-num">{{ currentUser.followers }}</span>
          <span class="stat-label">팔로워</span>
        </button>
        <div class="stat-sep" />
        <div class="stat-item">
          <span class="stat-num">{{ currentUser.reviewPinCount }}</span>
          <span class="stat-label">리뷰핀</span>
        </div>
      </div>

      <!-- ── 뱃지 ────────────────────────────── -->
      <div class="badge-section">
        <div class="badge-section-header">
          <span class="badge-section-title">뱃지</span>
          <span class="badge-earned-count">{{ earnedCount }} / {{ badges.length }}</span>
        </div>
        <div class="badge-scroll">
          <div v-for="badge in badges" :key="badge.id" class="badge-item" :class="{ locked: !badge.earned }">
            <div class="badge-icon" :style="badge.earned ? { background: badge.color + '22', border: '2px solid ' + badge.color } : {}">
              <component :is="badgeIcon(badge.id)" :color="badge.earned ? badge.color : 'var(--border-dark)'" />
            </div>
            <span class="badge-name">{{ badge.name }}</span>
          </div>
        </div>
      </div>

      <!-- ── Quick menu ───────────────────────── -->
      <div class="quick-menu">
        <button class="quick-item" @click="router.push('/liked')">
          <span class="quick-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </span>
          <span class="quick-label">좋아요한 핀</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text-hint)" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="quick-item" @click="router.push('/pincrew')">
          <span class="quick-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <span class="quick-label">핀크루</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text-hint)" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <!-- ── 내 리뷰핀 ─────────────────────────── -->
      <div class="my-pins-section">
        <div class="section-header">
          <span class="section-title">내 리뷰핀</span>
          <span class="section-badge">{{ myPins.length }}</span>
        </div>

        <div class="tab-bar">
          <button class="tab-btn" :class="{ active: activeTab === 'feed' }" @click="activeTab = 'feed'">
            피드형
            <span class="tab-count">{{ feedPins.length }}</span>
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'blog' }" @click="activeTab = 'blog'">
            블로그형
            <span class="tab-count">{{ blogPins.length }}</span>
          </button>
        </div>

        <div v-if="visiblePins.length === 0" class="pins-empty">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--border)" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <p>아직 작성한 리뷰핀이 없어요</p>
          <span>하단 + 버튼으로 첫 번째 핀을 남겨보세요</span>
        </div>

        <div v-else class="pins-grid">
          <div
            v-for="pin in visiblePins"
            :key="pin.id"
            class="pin-cell"
            @click="router.push({ name: 'review-detail', params: { id: pin.id } })"
          >
            <img :src="pin.images[pin.representativeImageIndex]" />
          </div>
        </div>
      </div>

      <div style="height: 16px" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser, reviewPins, notifications, badges } from '../data/dummy.js'

const router = useRouter()

const myPins  = computed(() => reviewPins.filter(rp => rp.authorId === currentUser.id))
const feedPins = computed(() => myPins.value.filter(p => p.type === 'feed'))
const blogPins = computed(() => myPins.value.filter(p => p.type === 'blog'))

const activeTab   = ref('feed')
const visiblePins = computed(() => activeTab.value === 'feed' ? feedPins.value : blogPins.value)

const earnedCount = computed(() => badges.filter(b => b.earned).length)

const BADGE_PATHS = {
  1: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
  2: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
  3: 'M12 2L12 22 M2 12L22 12 M12 2a10 10 0 0 1 0 20A10 10 0 0 1 12 2z M12 7v1 M12 16v1 M7 12h1 M16 12h1',
  4: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  5: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  6: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  7: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
  8: 'M8 6h8M6 10h12M8 14h8M6 18h12 M4 4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4z',
}

function badgeIcon(id) {
  return {
    render() {
      return h('svg', { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: this.$attrs.color, 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
        BADGE_PATHS[id].split(' M').map((seg, i) =>
          h('path', { d: (i === 0 ? seg : 'M' + seg).trim() })
        )
      )
    }
  }
}
</script>

<style scoped>
.my-view {
  height: 100%;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

.my-scroll {
  flex: 1;
  overflow-y: auto;
}

/* ── Hero ─────────────────────────────── */
.profile-hero {
  height: 120px;
  background: linear-gradient(135deg, #FDEEF1 0%, #F5C4CD 50%, #EBA8B5 100%);
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.hero-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
}

.hero-action-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(4px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  position: relative;
}

.notif-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: var(--primary);
  color: white;
  font-size: 9px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}

.profile-photo-wrap {
  position: absolute;
  bottom: -34px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
}

.profile-photo {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  border: 3px solid white;
  object-fit: cover;
  display: block;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.photo-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 22px;
  height: 22px;
  background: var(--primary);
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
}

/* ── Profile info ─────────────────────── */
.profile-info-block {
  margin-top: 42px;
  padding: 0 16px 14px;
  background: var(--bg-white);
  text-align: center;
  border-bottom: 1px solid var(--border);
}

.profile-nickname {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 4px;
}

.profile-bio {
  font-size: 12px;
  color: var(--text-hint);
  margin: 0 0 12px;
}

.edit-profile-btn {
  display: inline-block;
  padding: 7px 20px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-full);
  background: var(--bg-white);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, color 0.15s;
}

.edit-profile-btn:hover { border-color: var(--primary); color: var(--primary); }

/* ── Stats row ─────────────────────────── */
.stats-row {
  display: flex;
  align-items: center;
  background: var(--bg-white);
  border-bottom: 1px solid var(--border);
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.stat-num {
  font-size: 17px;
  font-weight: 800;
  color: var(--text-primary);
}

.stat-label {
  font-size: 11px;
  color: var(--text-hint);
  font-weight: 500;
}

.stat-sep {
  width: 1px;
  height: 32px;
  background: var(--border);
}

/* ── 뱃지 ─────────────────────────────── */
.badge-section {
  background: var(--bg-white);
  margin-top: 8px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding-bottom: 14px;
}

.badge-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
}

.badge-section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.badge-earned-count {
  font-size: 12px;
  color: var(--text-hint);
  font-weight: 500;
}

.badge-scroll {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 0 16px;
  -webkit-overflow-scrolling: touch;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  width: 62px;
}

.badge-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s;
}

.badge-item.locked .badge-icon {
  opacity: 0.45;
}

.badge-name {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.3;
  word-break: keep-all;
}

.badge-item.locked .badge-name {
  color: var(--text-hint);
}

/* ── Quick menu ───────────────────────── */
.quick-menu {
  background: var(--bg-white);
  margin-top: 8px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.quick-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}

.quick-item:last-child { border-bottom: none; }
.quick-item:active { background: var(--bg); }

.quick-icon {
  width: 34px;
  height: 34px;
  background: var(--primary-light);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-label {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
}

/* ── My pins section ──────────────────── */
.my-pins-section {
  background: var(--bg-white);
  margin-top: 8px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 16px 0;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.section-badge {
  background: var(--bg);
  color: var(--text-hint);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

/* ── Tabs ─────────────────────────────── */
.tab-bar {
  display: flex;
  border-bottom: 1px solid var(--border);
  margin-top: 10px;
}

.tab-btn {
  flex: 1;
  height: 40px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-hint);
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}

.tab-btn.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-count {
  font-size: 11px;
  background: var(--bg);
  color: var(--text-hint);
  padding: 1px 7px;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.tab-btn.active .tab-count {
  background: var(--primary-light);
  color: var(--primary);
}

/* ── Pins grid ─────────────────────────── */
.pins-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px 40px;
  color: var(--text-hint);
}

.pins-empty p {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0;
}

.pins-empty span {
  font-size: 12px;
}

.pins-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.pin-cell {
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  background: var(--border);
}

.pin-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
