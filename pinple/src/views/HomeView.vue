<template>
  <div class="home-view">
    <!-- 상단 검색바 -->
    <div class="home-header">
      <div class="search-bar" @click="router.push('/search')">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#AAAAAA" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span class="search-placeholder">장소, 리뷰핀 검색...</span>
      </div>
    </div>

    <!-- 탭 바 -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >{{ tab.label }}</button>
    </div>

    <!-- 탭 콘텐츠 -->
    <div class="tab-content">

      <!-- 인기 탭 -->
      <div v-show="activeTab === 'popular'" class="tab-pane">
        <div class="section-label">지금 뜨는 곳 🔥</div>
        <div class="top-places">
          <TopPlaceItem
            v-for="place in topPlaces"
            :key="place.id"
            :place="place"
            @click="router.push({ name: 'search-result', query: { placeId: place.id } })"
          />
        </div>
        <div class="section-divider" />
        <FeedCard
          v-for="pin in popularFeed"
          :key="pin.id"
          :pin="pin"
          @click="router.push({ name: 'review-detail', params: { id: pin.id } })"
        />
      </div>

      <!-- 팔로잉 탭 -->
      <div v-show="activeTab === 'following'" class="tab-pane">
        <div v-if="followingFeed.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#DDDDDD" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <p>팔로잉한 유저가 없습니다</p>
          <span>다른 핀크루를 팔로우해 보세요!</span>
        </div>
        <FeedCard
          v-else
          v-for="pin in followingFeed"
          :key="pin.id"
          :pin="pin"
          @click="router.push({ name: 'review-detail', params: { id: pin.id } })"
        />
      </div>

      <!-- 랜덤 탭 -->
      <div
        v-show="activeTab === 'random'"
        class="tab-pane"
        ref="randomPane"
        @wheel="handleWheel"
      >
        <div class="refresh-hint" :class="{ visible: refreshHint }">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          새로고침 완료
        </div>
        <FeedCard
          v-for="pin in randomFeed"
          :key="pin.id"
          :pin="pin"
          @click="router.push({ name: 'review-detail', params: { id: pin.id } })"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FeedCard from '../components/FeedCard.vue'
import TopPlaceItem from '../components/TopPlaceItem.vue'
import { reviewPins, topPlaces, followingFeed as followingData } from '../data/dummy.js'

const router = useRouter()

const tabs = [
  { id: 'popular',   label: '인기' },
  { id: 'following', label: '팔로잉' },
  { id: 'random',    label: '랜덤' },
]
const activeTab = ref('popular')

const popularFeed = [...reviewPins].sort((a, b) =>
  (b.likes + b.views * 0.5) - (a.likes + a.views * 0.5)
)
const followingFeed = followingData

const randomFeed  = ref(shuffle([...reviewPins]))
const refreshHint = ref(false)
const randomPane  = ref(null)

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5)
}

function handleWheel(e) {
  const el = randomPane.value
  if (!el || el.scrollTop > 0) return
  if (e.deltaY < 0) {
    randomFeed.value = shuffle([...reviewPins])
    refreshHint.value = true
    setTimeout(() => { refreshHint.value = false }, 1800)
  }
}
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg);
  overflow: hidden;
}

.home-header {
  background: var(--bg-white);
  padding: 10px 14px 8px;
  flex-shrink: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg);
  border-radius: var(--radius-full);
  padding: 10px 16px;
  cursor: pointer;
  border: 1px solid var(--border-dark);
  transition: border-color 0.15s;
}
.search-bar:hover { border-color: #CCCCCC; }

.search-placeholder {
  color: var(--text-hint);
  font-size: 13px;
}

.tab-bar {
  display: flex;
  background: var(--bg-white);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.tab-btn {
  flex: 1;
  padding: 11px 0;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-hint);
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}
.tab-btn.active {
  color: var(--primary);
  font-weight: 700;
}
.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  width: 60%;
  height: 2px;
  background: var(--primary);
  border-radius: 2px;
}

.tab-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.tab-pane {
  position: absolute;
  inset: 0;
  overflow-y: auto;
}

.section-label {
  font-size: 15px;
  font-weight: 800;
  padding: 14px 16px 8px;
  background: var(--bg-white);
  color: var(--text-primary);
}

.top-places {
  background: var(--bg-white);
}

.section-divider {
  height: 8px;
  background: var(--bg);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60%;
  gap: 10px;
  padding: 40px 20px;
}
.empty-state p {
  font-weight: 700;
  font-size: 15px;
  color: var(--text-secondary);
}
.empty-state span {
  font-size: 13px;
  color: var(--text-hint);
}

.refresh-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  opacity: 0;
  height: 0;
  overflow: hidden;
  transition: opacity 0.3s, height 0.3s;
}
.refresh-hint.visible {
  opacity: 1;
  height: 34px;
}
</style>
