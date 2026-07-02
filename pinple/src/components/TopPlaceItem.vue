<template>
  <div class="top-place-item" @click="$emit('click')">
    <span class="rank" :class="`rank-${place.rank}`">{{ place.rank }}</span>
    <div class="place-info">
      <span class="place-name">{{ place.name }}</span>
      <span class="place-category">{{ place.category }}</span>
    </div>
    <div class="review-count">
      <span class="count-num">{{ place.todayReviewCount }}</span>
      <span class="count-label">오늘의 핀</span>
    </div>
    <svg class="arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
  </div>
</template>

<script setup>
defineProps({ place: { type: Object, required: true } })
defineEmits(['click'])
</script>

<style scoped>
.top-place-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.1s;
}
.top-place-item:active { background: var(--bg); }

.rank {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
  flex-shrink: 0;
}
.rank-1 { background: #FFD700; color: #7A6000; }
.rank-2 { background: #C0C0C0; color: #555; }
.rank-3 { background: #CD7F32; color: #fff; }

.place-info {
  flex: 1;
  min-width: 0;
}

.place-name {
  display: block;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.place-category {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 1px;
  display: block;
}

.review-count {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.count-num {
  font-weight: 800;
  font-size: 20px;
  color: var(--primary);
  line-height: 1;
}

.count-label {
  font-size: 10px;
  color: var(--text-hint);
  margin-top: 1px;
}

.arrow {
  color: var(--text-hint);
  flex-shrink: 0;
}
</style>
