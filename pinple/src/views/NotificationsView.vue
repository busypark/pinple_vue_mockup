<template>
  <div class="notif-view">
    <!-- Header -->
    <div class="notif-header">
      <button class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="notif-title">알림</span>
      <button class="clear-btn" @click="clearAll">모두 읽음</button>
    </div>

    <!-- Notification list -->
    <div class="notif-scroll">
      <template v-for="(group, date) in grouped" :key="date">
        <div class="date-label">{{ date }}</div>
        <div
          v-for="n in group"
          :key="n.id"
          class="notif-item"
          :class="{ unread: !readIds.has(n.id) }"
          @click="markRead(n.id, n)"
        >
          <!-- Actor avatar or system icon -->
          <div class="notif-icon">
            <img v-if="n.actorId" :src="getUser(n.actorId).profileImg" class="actor-avatar" />
            <div v-else class="system-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--primary)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
          </div>
          <!-- Text -->
          <div class="notif-body">
            <p class="notif-text">{{ n.text }}</p>
          </div>
          <!-- Unread dot -->
          <div v-if="!readIds.has(n.id)" class="unread-dot" />
        </div>
      </template>

      <div v-if="notifications.length === 0" class="notif-empty">
        <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--border)" stroke-width="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <p>알림이 없습니다</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { notifications, users } from '../data/dummy.js'

const router = useRouter()
const readIds = ref(new Set())

function getUser(id) { return users.find(u => u.id === id) ?? {} }

function markRead(id, n) {
  readIds.value.add(id)
  readIds.value = new Set(readIds.value)
  if (n.targetReviewPinId) {
    router.push({ name: 'review-detail', params: { id: n.targetReviewPinId } })
  }
}

function clearAll() {
  readIds.value = new Set(notifications.map(n => n.id))
}

const grouped = computed(() => {
  const map = {}
  notifications.forEach(n => {
    if (!map[n.date]) map[n.date] = []
    map[n.date].push(n)
  })
  return map
})
</script>

<style scoped>
.notif-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
}

/* ── Header ─────────────────────────────── */
.notif-header {
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
  flex-shrink: 0;
}

.notif-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}

.clear-btn {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
  padding: 4px;
}

/* ── List ─────────────────────────────── */
.notif-scroll {
  flex: 1;
  overflow-y: auto;
  background: var(--bg);
}

.date-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-hint);
  padding: 10px 16px 4px;
  background: var(--bg);
  position: sticky;
  top: 0;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.1s;
  position: relative;
}

.notif-item:active { background: var(--bg); }

.notif-item.unread { background: var(--primary-light); }
.notif-item.unread:active { background: #F5D8DD; }

.notif-icon { flex-shrink: 0; }

.actor-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.system-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notif-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 2px;
}

.notif-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
  margin: 0;
}

.unread-dot {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
}

.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-top: 80px;
  color: var(--text-hint);
}

.notif-empty p {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0;
}
</style>
