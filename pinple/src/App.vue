<template>
  <div class="desktop-bg">
    <div class="phone-wrap">
      <div class="phone-frame">
        <!-- Status bar -->
        <div class="status-bar">
          <span class="status-time">9:41</span>
          <div class="status-icons">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <rect x="0" y="4" width="3" height="8" rx="1"/>
              <rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/>
              <rect x="9" y="0.5" width="3" height="11.5" rx="1"/>
            </svg>
            <svg width="16" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
              <circle cx="12" cy="20" r="1" fill="currentColor"/>
            </svg>
            <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
              <rect x="0.5" y="0.5" width="18" height="11" rx="3.5" stroke="currentColor"/>
              <rect x="2" y="2" width="13" height="8" rx="2" fill="currentColor"/>
              <path d="M20 4.5v3a2 2 0 0 0 0-3z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="phone-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>

        <!-- Nav bar -->
        <NavBar v-if="showNav" />

        <!-- Type selector overlay -->
        <Transition name="type-slide">
          <div v-if="showTypeSelector" class="type-overlay" @click.self="showTypeSelector = false">
            <div class="type-panel">
              <div class="type-handle" />
              <p class="type-question">어떤 유형의 리뷰핀을 등록할까요?</p>
              <div class="type-btns">
                <button class="type-btn" @click="selectType('feed')">
                  <span class="type-btn-icon">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </span>
                  <span class="type-btn-name">피드형</span>
                  <span class="type-btn-desc">이미지 중심 · 간편 작성</span>
                </button>
                <button class="type-btn" @click="selectType('blog')">
                  <span class="type-btn-icon">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </span>
                  <span class="type-btn-name">블로그형</span>
                  <span class="type-btn-desc">텍스트 중심 · 이미지 삽입 가능</span>
                </button>
              </div>
              <button class="type-cancel" @click="showTypeSelector = false">취소</button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { showTypeSelector } from './store/register.js'

const route = useRoute()
const router = useRouter()
const showNav = computed(() => route.meta.showNav)

function selectType(type) {
  showTypeSelector.value = false
  router.push({ name: 'register', params: { type } })
}
</script>

<style scoped>
.desktop-bg {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #CDD5DE 0%, #A8B4C0 100%);
}

.phone-frame {
  width: 390px;
  height: 844px;
  background: var(--bg-white);
  border-radius: 48px;
  border: 10px solid #1C1C1E;
  box-shadow:
    0 0 0 1px #3A3A3C,
    0 40px 80px rgba(0,0,0,0.45),
    inset 0 0 0 1px rgba(255,255,255,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.status-bar {
  height: var(--status-height);
  background: var(--bg-white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px 0 26px;
  flex-shrink: 0;
  color: var(--text-primary);
}

.status-time {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
}

.phone-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ── Type selector overlay ── */
.type-overlay {
  position: absolute;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.type-panel {
  background: var(--bg-white);
  border-radius: 20px 20px 0 0;
  padding: 12px 20px 28px;
}

.type-handle {
  width: 36px;
  height: 4px;
  background: #D0D0D5;
  border-radius: 2px;
  margin: 0 auto 16px;
}

.type-question {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 14px;
  text-align: center;
}

.type-btns {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
}

.type-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 10px;
  border: 1.5px solid var(--border);
  border-radius: 14px;
  background: var(--bg-white);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  font-family: inherit;
}

.type-btn:hover,
.type-btn:active {
  border-color: var(--primary);
  background: var(--primary-light);
}

.type-btn-icon {
  width: 44px;
  height: 44px;
  background: var(--bg);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}

.type-btn-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.type-btn-desc {
  font-size: 11px;
  color: var(--text-hint);
  text-align: center;
  line-height: 1.4;
}

.type-cancel {
  width: 100%;
  height: 42px;
  background: var(--bg);
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
}

.type-slide-enter-active,
.type-slide-leave-active {
  transition: opacity 0.2s ease;
}
.type-slide-enter-active .type-panel,
.type-slide-leave-active .type-panel {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}
.type-slide-enter-from,
.type-slide-leave-to {
  opacity: 0;
}
.type-slide-enter-from .type-panel,
.type-slide-leave-to .type-panel {
  transform: translateY(100%);
}
</style>
