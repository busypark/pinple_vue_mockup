<template>
  <div class="feed-card" @click="$emit('click')">
    <div class="feed-header">
      <img :src="author.profileImg" :alt="author.nickname" class="profile-img" />
      <div class="feed-meta">
        <div class="feed-top-row">
          <span class="nickname">{{ author.nickname }}</span>
          <span class="separator">·</span>
          <span class="place-name">{{ place.name }}</span>
        </div>
        <span class="feed-date">{{ pin.createdAt }}</span>
      </div>
    </div>

    <div class="feed-image-wrap">
      <img :src="pin.images[pin.representativeImageIndex]" :alt="place.name" class="feed-image" />
      <span class="category-block">{{ place.category }}</span>
      <span v-if="pin.images.length > 1" class="image-count">
        <svg viewBox="0 0 24 24" width="10" height="10" fill="white"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        {{ pin.images.length }}
      </span>
    </div>

    <div class="feed-content">
      <p v-if="pin.type === 'blog'" class="feed-title">{{ pin.title }}</p>
      <p class="feed-body">{{ truncate(pin.body, 100) }}</p>
    </div>

    <div class="feed-tags" v-if="pin.tags.length">
      <span v-for="tag in pin.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <div class="feed-stats">
      <span class="stat">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        {{ pin.likes }}
      </span>
      <span class="stat">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        {{ pin.comments }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { users, placePins } from '../data/dummy.js'

const props = defineProps({
  pin: { type: Object, required: true },
})
defineEmits(['click'])

const author = computed(() => users.find(u => u.id === props.pin.authorId))
const place  = computed(() => placePins.find(p => p.id === props.pin.placePinId))

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '...' : str
}
</script>

<style scoped>
.feed-card {
  background: var(--bg-white);
  border-bottom: 8px solid var(--bg);
  cursor: pointer;
  transition: opacity 0.15s;
}
.feed-card:active { opacity: 0.92; }

.feed-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px 8px;
}

.profile-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--border);
}

.feed-meta { flex: 1; min-width: 0; }

.feed-top-row {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.nickname { font-weight: 700; font-size: 13px; }
.separator { color: var(--text-hint); font-size: 12px; }
.place-name { font-size: 12px; color: var(--text-secondary); }
.feed-date  { font-size: 11px; color: var(--text-hint); }

.feed-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.feed-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--border);
}

.category-block {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0,0,0,0.55);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 4px;
  backdrop-filter: blur(2px);
}

.image-count {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.55);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 7px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.feed-content {
  padding: 10px 14px 6px;
}

.feed-title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feed-body {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.55;
}

.feed-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 4px 14px 8px;
}

.tag {
  font-size: 12px;
  color: var(--primary);
  background: var(--primary-light);
  padding: 2px 9px;
  border-radius: var(--radius-full);
  font-weight: 500;
}

.feed-stats {
  display: flex;
  gap: 14px;
  padding: 0 14px 12px;
  color: var(--text-hint);
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
</style>
