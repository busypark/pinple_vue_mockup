<template>
  <div class="settings-view">
    <!-- Header -->
    <div class="settings-header">
      <button class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="settings-title">설정</span>
      <div style="width:34px" />
    </div>

    <!-- Settings list -->
    <div class="settings-scroll">

      <!-- 계정 섹션 -->
      <div class="settings-section-label">계정</div>
      <div class="settings-group">
        <button class="settings-item" @click="router.push('/account')">
          <span class="settings-item-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <span class="settings-item-label">계정 관리</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text-hint)" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="settings-item" @click="router.push('/pincrew')">
          <span class="settings-item-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <span class="settings-item-label">핀크루 관리</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text-hint)" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <!-- 알림 섹션 -->
      <div class="settings-section-label">알림</div>
      <div class="settings-group">
        <div class="settings-item">
          <span class="settings-item-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </span>
          <span class="settings-item-label">푸시 알림</span>
          <div class="toggle-wrap">
            <input type="checkbox" id="push-toggle" v-model="pushEnabled" class="toggle-input" />
            <label for="push-toggle" class="toggle-label" />
          </div>
        </div>
        <div class="settings-item">
          <span class="settings-item-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </span>
          <span class="settings-item-label">좋아요 알림</span>
          <div class="toggle-wrap">
            <input type="checkbox" id="like-toggle" v-model="likeEnabled" class="toggle-input" />
            <label for="like-toggle" class="toggle-label" />
          </div>
        </div>
      </div>

      <!-- 앱 정보 섹션 -->
      <div class="settings-section-label">앱 정보</div>
      <div class="settings-group">
        <div class="settings-item">
          <span class="settings-item-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
          <span class="settings-item-label">앱 버전</span>
          <span class="settings-item-value">1.0.0 (Mockup)</span>
        </div>
        <div class="settings-item">
          <span class="settings-item-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </span>
          <span class="settings-item-label">개인정보 처리방침</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text-hint)" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div class="settings-item">
          <span class="settings-item-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </span>
          <span class="settings-item-label">서비스 이용약관</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--text-hint)" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      <!-- 로그아웃 / 탈퇴 -->
      <div class="settings-group settings-group-danger">
        <button class="settings-item settings-item-danger" @click="handleLogout">
          <span class="settings-item-label">로그아웃</span>
        </button>
        <button class="settings-item settings-item-withdraw" @click="showWithdrawDialog = true">
          <span class="settings-item-label">서비스 탈퇴</span>
        </button>
      </div>

      <div style="height: 20px" />
    </div>

    <!-- Withdraw confirm dialog -->
    <Transition name="fade-overlay">
      <div v-if="showWithdrawDialog" class="overlay-dim">
        <div class="dialog">
          <div class="dialog-title">정말 탈퇴하시겠어요?</div>
          <div class="dialog-desc">탈퇴 시 모든 데이터가 삭제되며<br>복구할 수 없습니다.</div>
          <div class="dialog-btns">
            <button class="dialog-btn-cancel" @click="showWithdrawDialog = false">취소</button>
            <button class="dialog-btn-confirm" @click="showWithdrawDialog = false">탈퇴</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const pushEnabled = ref(true)
const likeEnabled = ref(true)
const showWithdrawDialog = ref(false)

function handleLogout() {
  router.push('/')
}
</script>

<style scoped>
.settings-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  position: relative;
}

/* ── Header ─────────────────────────────── */
.settings-header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  background: var(--bg-white);
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

.settings-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}

/* ── Scroll ─────────────────────────────── */
.settings-scroll {
  flex: 1;
  overflow-y: auto;
  padding-top: 8px;
}

.settings-section-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-hint);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 16px 4px;
}

.settings-group {
  background: var(--bg-white);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 8px;
}

.settings-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: none;
  border: none;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s;
}

.settings-item:last-child { border-bottom: none; }
.settings-item:active { background: var(--bg); }

.settings-item-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.settings-item-label {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  text-align: left;
}

.settings-item-value {
  font-size: 12px;
  color: var(--text-hint);
}

/* Danger items */
.settings-group-danger { margin-top: 8px; }

.settings-item-danger .settings-item-label {
  color: #E05C5C;
  font-weight: 600;
}

.settings-item-withdraw .settings-item-label {
  color: var(--text-hint);
  font-weight: 500;
  font-size: 13px;
}

/* ── Toggle ─────────────────────────────── */
.toggle-wrap { position: relative; }

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  display: block;
  width: 40px;
  height: 22px;
  background: var(--border);
  border-radius: 11px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.toggle-label::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle-input:checked + .toggle-label { background: var(--primary); }
.toggle-input:checked + .toggle-label::after { transform: translateX(18px); }

/* ── Dialog ─────────────────────────────── */
.overlay-dim {
  position: absolute;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  background: var(--bg-white);
  border-radius: 16px;
  padding: 24px 20px 18px;
  width: 280px;
  text-align: center;
}

.dialog-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.dialog-desc {
  font-size: 13px;
  color: var(--text-hint);
  line-height: 1.6;
  margin-bottom: 20px;
}

.dialog-btns { display: flex; gap: 10px; }

.dialog-btn-cancel {
  flex: 1;
  height: 42px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
}

.dialog-btn-confirm {
  flex: 1;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: #E05C5C;
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity 0.2s; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }
</style>
