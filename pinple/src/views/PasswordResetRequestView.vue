<template>
  <div class="auth-view">
    <!-- Header -->
    <div class="auth-header">
      <button class="back-btn" @click="router.back()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span class="auth-title">비밀번호 재설정</span>
      <div style="width:34px" />
    </div>

    <!-- Form -->
    <div class="auth-body" :class="{ 'auth-body-center': sent }">
      <template v-if="!sent">
        <div class="field-group">
          <label class="field-label">이메일</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            placeholder="example@email.com"
            autocomplete="email"
          />
          <span class="field-hint">가입하신 이메일로 재설정 링크를 보내드려요</span>
        </div>
        <button class="btn-primary" :disabled="!email.trim()" @click="handleSend">재설정 메일 보내기</button>
      </template>

      <template v-else>
        <div class="icon-wrap">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22 6 12 13 2 6"/>
          </svg>
        </div>
        <p class="sent-title">메일을 보냈어요</p>
        <p class="sent-desc"><b>{{ email }}</b>로<br>재설정 링크를 보냈습니다.</p>
        <button class="btn-primary" @click="goToConfirm">새 비밀번호 설정하기</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const sent = ref(false)

function handleSend() {
  if (!email.value.trim()) return
  sent.value = true
}

function goToConfirm() {
  router.push({ name: 'password-reset-confirm' })
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

.auth-body-center {
  align-items: center;
  justify-content: center;
  padding-bottom: 24px;
  text-align: center;
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

.field-hint {
  font-size: 11px;
  color: var(--text-hint);
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

.btn-primary:disabled {
  opacity: 0.4;
  cursor: default;
}

.btn-primary:not(:disabled):active { opacity: 0.85; }

/* ── Sent 상태 ─── */
.icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.sent-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 10px;
}

.sent-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 32px;
}

.sent-desc b {
  color: var(--text-primary);
}
</style>
