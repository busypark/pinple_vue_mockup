<template>
  <div class="pincrew-view">
    <!-- Header -->
    <div class="pc-header">
      <button class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="pc-title">핀크루</span>
      <div style="width:34px" />
    </div>

    <!-- Tabs -->
    <div class="pc-tabs">
      <button
        class="pc-tab"
        :class="{ active: activeTab === 'following' }"
        @click="activeTab = 'following'"
      >
        팔로잉 <span class="tab-count">{{ currentUser.following }}</span>
      </button>
      <button
        class="pc-tab"
        :class="{ active: activeTab === 'followers' }"
        @click="activeTab = 'followers'"
      >
        팔로워 <span class="tab-count">{{ currentUser.followers }}</span>
      </button>
    </div>

    <!-- User list -->
    <div class="pc-list">
      <div v-for="u in displayUsers" :key="u.id" class="user-item">
        <img :src="u.profileImg" class="user-avatar" />
        <div class="user-info">
          <span class="user-name">{{ u.nickname }}</span>
          <span class="user-bio">{{ u.bio }}</span>
          <div class="user-stats">
            <span>리뷰핀 {{ u.reviewPinCount }}</span>
            <span>팔로워 {{ u.followers }}</span>
          </div>
        </div>
        <button
          v-if="u.id !== currentUser.id"
          class="follow-btn"
          :class="{ following: followState[u.id] }"
          @click="toggleFollow(u.id)"
        >
          {{ followState[u.id] ? '팔로잉' : '팔로우' }}
        </button>
      </div>

      <p v-if="displayUsers.length === 0" class="pc-empty">
        {{ activeTab === 'following' ? '팔로잉한 유저가 없습니다' : '팔로워가 없습니다' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { users, currentUser } from '../data/dummy.js'

const route = useRoute()

const activeTab = ref(route.query.tab === 'followers' ? 'followers' : 'following')

// Following: users 1,2,3 (hardcoded from dummy)
const followingIds  = [1, 2, 3]
// Followers: users 1-4 shown (subset for demo)
const followerIds   = [1, 2, 3, 4]

const followState = ref({})

onMounted(() => {
  const state = {}
  followingIds.forEach(id => { state[id] = true })
  followState.value = state
})

const displayUsers = computed(() => {
  const ids = activeTab.value === 'following' ? followingIds : followerIds
  return ids.map(id => users.find(u => u.id === id)).filter(Boolean)
})

function toggleFollow(id) {
  followState.value = { ...followState.value, [id]: !followState.value[id] }
}
</script>

<style scoped>
.pincrew-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
}

/* ── Header ─────────────────────────────── */
.pc-header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 14px;
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

.pc-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}

/* ── Tabs ─────────────────────────────── */
.pc-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.pc-tab {
  flex: 1;
  height: 42px;
  background: none;
  border: none;
  border-bottom: 2.5px solid transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-hint);
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: color 0.15s, border-color 0.15s;
}

.pc-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab-count {
  background: var(--bg);
  border-radius: var(--radius-full);
  padding: 1px 7px;
  font-size: 11px;
}

.pc-tab.active .tab-count {
  background: var(--primary-light);
  color: var(--primary);
}

/* ── List ─────────────────────────────── */
.pc-list {
  flex: 1;
  overflow-y: auto;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.user-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.user-bio {
  font-size: 11px;
  color: var(--text-hint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-stats {
  display: flex;
  gap: 8px;
  font-size: 10px;
  color: var(--text-hint);
  margin-top: 2px;
}

.follow-btn {
  flex-shrink: 0;
  padding: 7px 16px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--primary);
  background: var(--bg-white);
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}

.follow-btn.following {
  background: var(--primary);
  color: white;
}

.pc-empty {
  font-size: 13px;
  color: var(--text-hint);
  text-align: center;
  padding: 40px 0;
}
</style>
