<template>
  <div class="author-row">
    <div class="author-info" @click="goToAuthor">
      <img :src="author.profileImg" class="author-img" />
      <span class="author-name">{{ author.nickname }}</span>
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
import { useRouter } from 'vue-router'
import { currentUser } from '../data/dummy.js'

const props = defineProps({
  author:     { type: Object, required: true },
  isMe:       { type: Boolean, default: false },
  modelValue: { type: Boolean, default: false },
})
defineEmits(['update:following'])

const router = useRouter()

function goToAuthor() {
  if (props.isMe) {
    router.push('/my')
  } else {
    router.push({ name: 'user-profile', params: { id: props.author.id } })
  }
}
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

</style>
