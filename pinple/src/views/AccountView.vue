<template>
  <div class="account-view">
    <!-- Header -->
    <div class="account-header">
      <button class="back-btn" @click="handleBack">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="account-title">계정 관리</span>
      <button class="save-btn" @click="handleSave" :disabled="!hasChanges">저장</button>
    </div>

    <!-- Save toast -->
    <Transition name="toast-anim">
      <div v-if="showToast" class="save-toast">저장됐습니다</div>
    </Transition>

    <div class="account-scroll">

      <!-- Profile photo -->
      <div class="photo-section">
        <div class="account-photo-wrap">
          <img :src="previewImg || currentUser.profileImg" class="account-photo" />
          <div class="photo-overlay" @click="cyclePhoto">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
        </div>
        <span class="photo-hint">사진 변경</span>
      </div>

      <!-- Nickname -->
      <div class="field-group">
        <label class="field-label">닉네임</label>
        <input v-model="nickname" class="field-input" placeholder="닉네임을 입력하세요" maxlength="20" />
        <span class="field-counter">{{ nickname.length }}/20</span>
      </div>

      <!-- Bio -->
      <div class="field-group">
        <label class="field-label">한 줄 소개</label>
        <textarea v-model="bio" class="field-textarea" placeholder="자신을 소개해보세요" rows="3" maxlength="80" />
        <span class="field-counter">{{ bio.length }}/80</span>
      </div>

      <div style="height: 24px" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { currentUser } from '../data/dummy.js'

const router = useRouter()

const nickname   = ref(currentUser.nickname)
const bio        = ref(currentUser.bio)
const previewImg = ref('')
const showToast  = ref(false)

// Cycle through dummy avatars for photo change
const photoPool = [
  currentUser.profileImg,
  'https://i.pravatar.cc/80?img=60',
  'https://i.pravatar.cc/80?img=65',
  'https://i.pravatar.cc/80?img=70',
]
let photoIdx = 0

function cyclePhoto() {
  photoIdx = (photoIdx + 1) % photoPool.length
  previewImg.value = photoPool[photoIdx]
}

const hasChanges = computed(() =>
  nickname.value !== currentUser.nickname ||
  bio.value !== currentUser.bio ||
  previewImg.value !== ''
)

function handleSave() {
  if (!hasChanges.value) return
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2000)
}

function handleBack() {
  router.back()
}
</script>

<style scoped>
.account-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  position: relative;
}

/* ── Header ─────────────────────────────── */
.account-header {
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

.account-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}

.save-btn {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: 4px;
}

.save-btn:disabled {
  color: var(--text-hint);
  cursor: default;
}

/* ── Scroll ─────────────────────────────── */
.account-scroll {
  flex: 1;
  overflow-y: auto;
}

/* ── Photo section ─────────────────────── */
.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 0 16px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--border);
}

.account-photo-wrap {
  position: relative;
  width: 80px;
  height: 80px;
}

.account-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.photo-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.photo-hint {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
}

/* ── Fields ─────────────────────────────── */
.field-group {
  padding: 12px 16px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--border);
  position: relative;
}

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-hint);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 6px;
}

.field-input {
  width: 100%;
  height: 38px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--bg-white);
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus { border-color: var(--primary); }
.field-input.error { border-color: #E05C5C; }

.field-textarea {
  width: 100%;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--bg-white);
  box-sizing: border-box;
  resize: none;
  outline: none;
  line-height: 1.5;
  transition: border-color 0.15s;
}

.field-textarea:focus { border-color: var(--primary); }

.field-counter {
  position: absolute;
  bottom: 16px;
  right: 22px;
  font-size: 10px;
  color: var(--text-hint);
}

.field-error {
  display: block;
  font-size: 11px;
  color: #E05C5C;
  margin-top: 5px;
}

/* ── Toast ─────────────────────────────── */
.save-toast {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: rgba(30,30,30,0.82);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 20px;
  white-space: nowrap;
  font-family: inherit;
}

.toast-anim-enter-active, .toast-anim-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-anim-enter-from, .toast-anim-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }
</style>
