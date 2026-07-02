<template>
  <div class="placeholder-view">
    <div class="placeholder-header" v-if="!route.meta.showNav">
      <button class="back-btn" @click="router.back()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="header-title">{{ route.meta.label }}</span>
    </div>
    <div class="placeholder-body">
      <div class="icon-wrap">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#DDDDDD" stroke-width="1.5" stroke-linecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
      </div>
      <p class="placeholder-label">{{ route.meta.label }}</p>
      <span class="placeholder-sub">세션 {{ route.meta.session }}에서 구현 예정</span>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route  = useRoute()
const router = useRouter()
</script>

<style scoped>
.placeholder-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg);
}

.placeholder-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  padding: 4px;
  display: flex;
  align-items: center;
}

.header-title {
  font-weight: 700;
  font-size: 15px;
}

.placeholder-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.icon-wrap {
  margin-bottom: 4px;
}

.placeholder-label {
  font-weight: 700;
  font-size: 16px;
  color: var(--text-secondary);
}

.placeholder-sub {
  font-size: 13px;
  color: var(--text-hint);
}
</style>
