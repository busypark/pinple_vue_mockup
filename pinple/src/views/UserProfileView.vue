<template>
  <div class="user-profile-view">
    <div class="profile-scroll">

      <!-- ── Hero ─────────────────────────────── -->
      <div class="profile-hero">
        <button class="back-btn" @click="router.back()">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div class="profile-photo-wrap">
          <img :src="user.profileImg" class="profile-photo" />
        </div>
      </div>

      <!-- ── Profile info ─────────────────────── -->
      <div class="profile-info-block">
        <h2 class="profile-nickname">{{ user.nickname }}</h2>
        <p class="profile-bio">{{ user.bio }}</p>
        <button
          class="follow-btn"
          :class="{ following: isFollowing }"
          @click="toggleFollow"
        >
          {{ isFollowing ? '팔로잉' : '팔로우' }}
        </button>
      </div>

      <!-- ── Stats row ────────────────────────── -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-num">{{ user.following }}</span>
          <span class="stat-label">팔로잉</span>
        </div>
        <div class="stat-sep" />
        <div class="stat-item">
          <span class="stat-num">{{ user.followers }}</span>
          <span class="stat-label">팔로워</span>
        </div>
        <div class="stat-sep" />
        <div class="stat-item">
          <span class="stat-num">{{ userPins.length }}</span>
          <span class="stat-label">리뷰핀</span>
        </div>
      </div>

      <!-- ── 리뷰핀 탭 ─────────────────────────── -->
      <div class="pins-section">
        <div class="tab-bar">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'feed' }"
            @click="activeTab = 'feed'"
          >
            피드형
            <span class="tab-count">{{ feedPins.length }}</span>
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'blog' }"
            @click="activeTab = 'blog'"
          >
            블로그형
            <span class="tab-count">{{ blogPins.length }}</span>
          </button>
        </div>

        <div v-if="visiblePins.length === 0" class="pins-empty">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--border)" stroke-width="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <p>작성한 리뷰핀이 없어요</p>
        </div>

        <div v-else class="pins-grid">
          <div
            v-for="pin in visiblePins"
            :key="pin.id"
            class="pin-cell"
            @click="router.push({ name: 'review-detail', params: { id: pin.id } })"
          >
            <img :src="pin.images[pin.representativeImageIndex]" />
            <span v-if="activeTab === 'feed' && pin.title" class="pin-cell-label">{{ pin.title }}</span>
          </div>
        </div>
      </div>

      <div style="height: 16px" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { users, reviewPins } from '../data/dummy.js'

const FOLLOWING_IDS = [1, 2, 3]

const route = useRoute()
const router = useRouter()

const userId = computed(() => Number(route.params.id))
const user = computed(() => users.find(u => u.id === userId.value) ?? users[0])

const isFollowing = ref(FOLLOWING_IDS.includes(userId.value))

function toggleFollow() {
  isFollowing.value = !isFollowing.value
}

const userPins = computed(() => reviewPins.filter(p => p.authorId === userId.value))
const feedPins = computed(() => userPins.value.filter(p => p.type === 'feed'))
const blogPins = computed(() => userPins.value.filter(p => p.type === 'blog'))

const activeTab = ref('feed')
const visiblePins = computed(() => activeTab.value === 'feed' ? feedPins.value : blogPins.value)
</script>

<style scoped>
.user-profile-view {
  height: 100%;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

.profile-scroll {
  flex: 1;
  overflow-y: auto;
}

/* ── Hero ─────────────────────────────── */
.profile-hero {
  height: 120px;
  background: linear-gradient(135deg, #FDEEF1 0%, #F5C4CD 50%, #EBA8B5 100%);
  position: relative;
  display: flex;
  align-items: flex-start;
  padding-top: 10px;
}

.back-btn {
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
  margin-left: 12px;
  flex-shrink: 0;
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

.follow-btn {
  display: inline-block;
  padding: 7px 28px;
  border: 1.5px solid var(--primary);
  border-radius: var(--radius-full);
  background: var(--bg-white);
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.follow-btn.following {
  background: var(--primary);
  color: white;
}

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

/* ── Pins section ─────────────────────── */
.pins-section {
  background: var(--bg-white);
  margin-top: 8px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.tab-bar {
  display: flex;
  border-bottom: 1px solid var(--border);
}

.tab-btn {
  flex: 1;
  height: 42px;
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

.pin-cell-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.55));
  color: white;
  font-size: 9px;
  font-weight: 600;
  padding: 12px 5px 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
