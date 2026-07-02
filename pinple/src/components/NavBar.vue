<template>
  <nav class="navbar">
    <button
      v-for="item in navItems"
      :key="item.name"
      class="nav-item"
      :class="{ active: isActive(item.to), 'nav-plus': item.isPlus }"
      @click="handleNav(item)"
    >
      <span class="nav-icon" v-html="item.icon" />
      <span v-if="!item.isPlus" class="nav-label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { showTypeSelector } from '../store/register.js'

const route = useRoute()
const router = useRouter()

const homeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
const scrapIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`
const plusIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
const randomIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`
const myIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`

const navItems = [
  { name: 'home',   label: '홈',    to: '/',           icon: homeIcon },
  { name: 'scrap',  label: '스크랩', to: '/scrap',      icon: scrapIcon },
  { name: 'plus',   label: '',      to: null,           icon: plusIcon, isPlus: true },
  { name: 'random', label: '랜덤',  to: '/random-map', icon: randomIcon },
  { name: 'my',     label: 'MY',    to: '/my',         icon: myIcon },
]

function isActive(to) {
  if (!to) return false
  return route.path === to
}

function handleNav(item) {
  if (item.isPlus) {
    showTypeSelector.value = true
    return
  }
  if (item.to && item.to !== route.path) {
    router.push(item.to)
  }
}
</script>

<style scoped>
.navbar {
  height: var(--nav-height);
  background: var(--bg-white);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-shrink: 0;
  padding: 0 8px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  min-width: 56px;
  color: var(--text-hint);
  transition: color 0.2s;
}

.nav-item:active { opacity: 0.7; }

.nav-item.active {
  color: var(--primary);
}

.nav-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.nav-label {
  font-size: 10px;
  font-weight: 600;
}

.nav-plus {
  background: var(--primary);
  border-radius: 50%;
  width: 46px;
  height: 46px;
  min-width: 46px;
  padding: 0;
  color: white;
  box-shadow: 0 3px 10px rgba(232, 83, 106, 0.45);
  transition: transform 0.15s, box-shadow 0.15s;
}

.nav-plus:active {
  transform: scale(0.93);
  opacity: 1;
  box-shadow: 0 1px 4px rgba(232, 83, 106, 0.3);
}

.nav-plus .nav-icon {
  width: 24px;
  height: 24px;
}

.nav-plus .nav-icon :deep(svg) {
  width: 24px;
  height: 24px;
  stroke: white;
}
</style>
