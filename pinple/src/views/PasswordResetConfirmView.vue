<template>
  <div class="auth-view">
    <!-- Header -->
    <div class="auth-header">
      <span class="auth-title">새 비밀번호 설정</span>
    </div>

    <!-- Form -->
    <div class="auth-body">
      <div class="field-group">
        <label class="field-label">새 비밀번호</label>
        <input
          v-model="newPw"
          type="password"
          class="field-input"
          placeholder="8자 이상"
          autocomplete="new-password"
        />
      </div>
      <div class="field-group">
        <label class="field-label">새 비밀번호 확인</label>
        <input
          v-model="newPwConfirm"
          type="password"
          class="field-input"
          :class="{ 'field-input-error': newPwConfirm && newPw !== newPwConfirm }"
          placeholder="비밀번호를 한 번 더 입력하세요"
          autocomplete="new-password"
        />
        <span v-if="newPwConfirm && newPw !== newPwConfirm" class="field-error">비밀번호가 일치하지 않습니다</span>
      </div>

      <button class="btn-primary" :disabled="!canSubmit" @click="handleSubmit">비밀번호 변경</button>
    </div>

    <!-- 완료 토스트 -->
    <Transition name="toast-anim">
      <div v-if="showToast" class="reset-toast">비밀번호가 변경됐어요</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const newPw = ref('')
const newPwConfirm = ref('')
const showToast = ref(false)

const canSubmit = computed(() =>
  newPw.value.length >= 8 && newPw.value === newPwConfirm.value
)

function handleSubmit() {
  if (!canSubmit.value) return
  showToast.value = true
  setTimeout(() => router.replace('/login'), 900)
}
</script>

<style scoped>
.auth-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
  position: relative;
}

/* ── Header ─── */
.auth-header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.auth-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}

/* ── Body ─── */
.auth-body {
  flex: 1;
  padding: 28px 24px 0;
  display: flex;
  flex-direction: column;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.field-input {
  height: 48px;
  border: 1.5px solid var(--border-dark);
  border-radius: var(--radius-md);
  padding: 0 14px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-white);
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus { border-color: var(--primary); }
.field-input::placeholder { color: var(--text-hint); }
.field-input-error { border-color: #E05C5C; }

.field-error {
  font-size: 11px;
  color: #E05C5C;
}

.btn-primary {
  width: 100%;
  height: 50px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
  margin-top: 8px;
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: default;
}

.btn-primary:not(:disabled):active { opacity: 0.85; }

/* ── 토스트 ─── */
.reset-toast {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: rgba(30, 30, 30, 0.85);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 20px;
  white-space: nowrap;
}

.toast-anim-enter-active, .toast-anim-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-anim-enter-from, .toast-anim-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }
</style>
