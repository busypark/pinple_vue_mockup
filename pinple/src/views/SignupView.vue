<template>
  <div class="auth-view">
    <!-- Header -->
    <div class="auth-header">
      <button class="back-btn" @click="router.back()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span class="auth-title">회원가입</span>
      <div style="width:34px" />
    </div>

    <!-- Form -->
    <div class="auth-scroll">
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
          <span class="field-hint">로그인 시 사용됩니다</span>
        </div>

        <div class="field-group">
          <label class="field-label">닉네임</label>
          <input
            v-model="nickname"
            type="text"
            class="field-input"
            placeholder="2~12자 이내"
            maxlength="12"
          />
          <span class="field-hint">다른 사용자에게 표시되는 이름입니다</span>
        </div>

        <div class="field-group">
          <label class="field-label">비밀번호</label>
          <input
            v-model="password"
            type="password"
            class="field-input"
            placeholder="8자 이상"
            autocomplete="new-password"
          />
        </div>

        <div class="field-group">
          <label class="field-label">비밀번호 확인</label>
          <input
            v-model="passwordConfirm"
            type="password"
            class="field-input"
            :class="{ 'field-input-error': passwordConfirm && password !== passwordConfirm }"
            placeholder="비밀번호를 한 번 더 입력하세요"
            autocomplete="new-password"
          />
          <span v-if="passwordConfirm && password !== passwordConfirm" class="field-error">
            비밀번호가 일치하지 않습니다
          </span>
        </div>

        <div class="terms-box">
          <label class="terms-item">
            <input type="checkbox" v-model="agreeAll" class="terms-check" />
            <span class="terms-label terms-all">전체 동의</span>
          </label>
          <div class="terms-divider" />
          <label class="terms-item">
            <input type="checkbox" v-model="agreeService" class="terms-check" />
            <span class="terms-label">[필수] 서비스 이용약관</span>
          </label>
          <label class="terms-item">
            <input type="checkbox" v-model="agreePrivacy" class="terms-check" />
            <span class="terms-label">[필수] 개인정보 처리방침</span>
          </label>
          <label class="terms-item">
            <input type="checkbox" v-model="agreeMarketing" class="terms-check" />
            <span class="terms-label">[선택] 마케팅 정보 수신</span>
          </label>
        </div>

        <button class="btn-primary" :disabled="!canSubmit" @click="handleSignup">
          가입하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const nickname = ref('')
const password = ref('')
const passwordConfirm = ref('')
const agreeService = ref(false)
const agreePrivacy = ref(false)
const agreeMarketing = ref(false)

const agreeAll = computed({
  get: () => agreeService.value && agreePrivacy.value && agreeMarketing.value,
  set: (v) => {
    agreeService.value = v
    agreePrivacy.value = v
    agreeMarketing.value = v
  },
})

const canSubmit = computed(() =>
  email.value && nickname.value && password.value &&
  password.value === passwordConfirm.value &&
  agreeService.value && agreePrivacy.value
)

function handleSignup() {
  if (!canSubmit.value) return
  router.push('/login')
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

/* ── Scroll ─── */
.auth-scroll {
  flex: 1;
  overflow-y: auto;
}

.auth-body {
  padding: 24px 24px 32px;
  display: flex;
  flex-direction: column;
}

/* ── Fields ─── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
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

.field-hint {
  font-size: 11px;
  color: var(--text-hint);
}

.field-error {
  font-size: 11px;
  color: #E05C5C;
}

/* ── Terms ─── */
.terms-box {
  background: var(--bg);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.terms-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.terms-check {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
  flex-shrink: 0;
}

.terms-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.terms-all {
  font-weight: 700;
  color: var(--text-primary);
}

.terms-divider {
  height: 1px;
  background: var(--border);
}

/* ── Submit ─── */
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
</style>
