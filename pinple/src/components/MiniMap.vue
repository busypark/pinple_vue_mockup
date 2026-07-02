<template>
  <div class="mini-map">
    <div class="map-roads" />
    <div class="map-center">
      <svg viewBox="0 0 20 28" width="20" height="28">
        <path d="M10 0C5.03 0 1 4.03 1 9c0 6.28 9 19 9 19S19 15.28 19 9c0-4.97-4.03-9-9-9z" fill="#E8536A"/>
        <circle cx="10" cy="9" r="3.5" fill="white"/>
      </svg>
      <span class="place-label">{{ placeName }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ placeName: String })
</script>

<style scoped>
.mini-map {
  height: 110px;
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
  background-color: #D8E4D0;
  background-image:
    linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 18px 18px;
  margin: 10px 0 12px;
  border: 1px solid var(--border);
}

.map-roads {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.8) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255,255,255,0.8) 2px, transparent 2px),
    linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.5) 41%, transparent 41%);
  background-size: 44px 44px, 44px 44px, 80px 80px;
  background-position: 10px 8px, 8px 10px, 0 0;
  pointer-events: none;
}

.map-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  z-index: 2;
}

.place-label {
  background: var(--primary);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(232,83,106,0.4);
}
</style>
