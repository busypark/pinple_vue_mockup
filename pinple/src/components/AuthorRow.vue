<template>
  <div class="author-row">
    <div class="author-info" @mouseenter="showHint = true" @mouseleave="showHint = false">
      <img :src="author.profileImg" class="author-img" />
      <span class="author-name">{{ author.nickname }}</span>
      <!-- 타 유저 프로필 hover hint -->
      <Transition name="hint">
        <div v-if="showHint && !isMe" class="hover-hint">타 유저 프로필 준비 중</div>
      </Transition>
    </div>
    <button
      v-if="!isMe"
      class="follow-btn"
      :class="{ following: modelValue }"
      @click="$emit('update:following', !modelValue)"
    >
      {{ modelValue ? '팔로잉' : '팔로우' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  author:     { type: Object, required: true },
  isMe:       { type: Boolean, default: false },
  modelValue: { type: Boolean, default: false },
})
defineEmits(['update:following'])

const showHint = ref(false)
</script>

<style scoped>
.author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.author-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--border);
}

.author-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.hover-hint {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: rgba(0,0,0,0.75);
  color: white;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
}

.follow-btn {
  font-size: 12px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--primary);
  background: var(--bg-white);
  color: var(--primary);
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.follow-btn.following {
  background: var(--primary);
  color: white;
}

.hint-enter-active, .hint-leave-active { transition: opacity 0.15s; }
.hint-enter-from, .hint-leave-to       { opacity: 0; }
</style>
