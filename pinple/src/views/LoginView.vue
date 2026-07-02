<template>
  <div class="login-view">

    <div class="login-body">
      <!-- Logo -->
      <div class="logo-area">
        <div class="logo-icon">
          <svg viewBox="0 0 48 58" width="52" height="62" fill="none">
            <circle cx="24" cy="22" r="18" fill="var(--primary)" />
            <circle cx="24" cy="22" r="8" fill="white" />
            <path d="M24 39 L24 55" stroke="var(--primary)" stroke-width="5" stroke-linecap="round" />
          </svg>
        </div>
        <div class="logo-name">핀플</div>
        <div class="logo-tagline">여행의 순간을 핀에 꽂다</div>
      </div>

      <!-- Social login -->
      <div class="social-btns">
        <button class="btn-social btn-kakao" @click="loginSocial">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#3C1E1E" d="M12 3C7.03 3 3 6.36 3 10.5c0 2.6 1.63 4.88 4.1 6.23l-1.1 4.06c-.1.35.28.63.57.43l4.8-3.17c.51.05 1.04.08 1.58.08 4.97 0 9-3.36 9-7.5S16.97 3 12 3z" />
          </svg>
          카카오로 계속하기
        </button>
        <button class="btn-social btn-google" @click="loginSocial">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57C21.36 18.21 22.56 15.39 22.56 12.25z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google로 계속하기
        </button>
      </div>

      <!-- Divider -->
      <div class="divider">
        <span class="divider-line" />
        <span class="divider-text">또는</span>
        <span class="divider-line" />
      </div>

      <!-- Email login -->
      <button class="btn-email" @click="router.push('/login/email')">
        이메일로 로그인
      </button>
    </div>

    <!-- Signup row -->
    <div class="signup-row">
      <span class="signup-hint">계정이 없으신가요?</span>
      <button class="signup-link" @click="router.push('/signup')">회원가입</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { isLoggedIn } from '../store/auth.js'

const router = useRouter()

function loginSocial() {
  isLoggedIn.value = true
  router.push('/')
}
</script>

<style scoped>
.login-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
}

.login-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 28px 24px;
  gap: 0;
}

/* ── Logo ─── */
.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
}

.logo-icon {
  margin-bottom: 10px;
}

.logo-name {
  font-size: 30px;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -1px;
  margin-bottom: 6px;
}

.logo-tagline {
  font-size: 13px;
  color: var(--text-hint);
  letter-spacing: 0.2px;
}

/* ── Social buttons ─── */
.social-btns {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.btn-social {
  width: 100%;
  height: 50px;
  border-radius: var(--radius-md);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}

.btn-social:active { opacity: 0.85; }

.btn-kakao {
  background: #FEE500;
  color: #3C1E1E;
}

.btn-google {
  background: var(--bg-white);
  color: var(--text-primary);
  border: 1.5px solid var(--border-dark);
}

/* ── Divider ─── */
.divider {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.divider-text {
  font-size: 12px;
  color: var(--text-hint);
  flex-shrink: 0;
}

/* ── Email button ─── */
.btn-email {
  width: 100%;
  height: 50px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--border-dark);
  background: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.btn-email:active { background: var(--bg); }

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
