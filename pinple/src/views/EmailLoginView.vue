<template>
  <div class="auth-view">
    <!-- Header -->
    <div class="auth-header">
      <button class="back-btn" @click="router.back()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span class="auth-title">이메일로 로그인</span>
      <div style="width:34px" />
    </div>

    <!-- Form -->
    <div class="auth-body">
      <div class="field-group">
        <label class="field-label">이메일</label>
        <input
          v-model="email"
          type="email"
          class="field-input"
          placeholder="example@email.com"
          autocomplete="email"
        />
      </div>
      <div class="field-group">
        <label class="field-label">비밀번호</label>
        <input
          v-model="password"
          type="password"
          class="field-input"
          placeholder="비밀번호를 입력하세요"
          autocomplete="current-password"
        />
      </div>

      <button class="btn-forgot" @click="router.push('/password-reset')">비밀번호를 잊으셨나요?</button>

      <button class="btn-primary" @click="handleLogin">로그인</button>
    </div>

    <!-- Signup link -->
    <div class="signup-row">
      <span class="signup-hint">계정이 없으신가요?</span>
      <button class="signup-link" @click="router.push('/signup')">회원가입</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isLoggedIn } from '../store/auth.js'

const router = useRouter()
const email = ref('')
const password = ref('')

function handleLogin() {
  isLoggedIn.value = true
  router.push('/')
}
</script>

<style scoped>
.auth-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
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

.field-input:focus {
  border-color: var(--primary);
}

.field-input::placeholder {
  color: var(--text-hint);
}

.btn-forgot {
  background: none;
  border: none;
  font-size: 12px;
  color: var(--text-hint);
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  margin-bottom: 28px;
  padding: 0;
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
}

.btn-primary:active { opacity: 0.85; }

/* ── Signup row ─── */
.signup-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 20px 0 28px;
}

.signup-hint {
  font-size: 13px;
  color: var(--text-hint);
}

.signup-link {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
}
</style>
