<template>
  <div class="verify-view">
    <div class="verify-body">
      <div class="icon-wrap">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22 6 12 13 2 6"/>
        </svg>
      </div>
      <p class="verify-title">인증 메일을 보냈어요</p>
      <p class="verify-desc">
        <b>{{ email || '가입하신 이메일' }}</b> 주소로<br>
        인증 메일을 보냈습니다.<br>
        메일함에서 인증 링크를 확인해주세요.
      </p>

      <button class="btn-primary" @click="router.push('/login')">로그인하러 가기</button>
      <button class="btn-resend" @click="handleResend">인증 메일 재전송</button>
    </div>

    <!-- 재전송 토스트 -->
    <Transition name="toast-anim">
      <div v-if="showResendToast" class="resend-toast">인증 메일을 다시 보냈어요</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const email = route.query.email
const showResendToast = ref(false)

function handleResend() {
  showResendToast.value = true
  setTimeout(() => { showResendToast.value = false }, 2000)
}
</script>

<style scoped>
.verify-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
  position: relative;
}

.verify-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 32px 24px;
}

.icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.verify-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 12px;
}

.verify-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  text-align: center;
  margin: 0 0 36px;
}

.verify-desc b {
  color: var(--text-primary);
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

.btn-resend {
  margin-top: 16px;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-hint);
  cursor: pointer;
  font-family: inherit;
  padding: 4px;
}

/* ── 토스트 ─── */
.resend-toast {
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
