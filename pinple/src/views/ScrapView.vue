<template>
  <div class="scrap-view">
    <!-- Header -->
    <div class="scrap-header">
      <span class="scrap-view-title">스크랩</span>
      <span class="folder-count">{{ scrapFolders.length }}개 폴더</span>
    </div>

    <!-- Empty state -->
    <div v-if="scrapFolders.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--border)" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      <p>스크랩한 핀이 없습니다</p>
      <span>리뷰핀 스크랩 버튼을 눌러보세요</span>
    </div>

    <!-- Folder accordion list -->
    <div v-else class="folder-list">
      <div
        v-for="(folder, i) in scrapFolders"
        :key="folder.id"
        class="folder-item"
        :class="{ dragging: dragState.active && dragState.fromIdx === i }"
        :style="getDragStyle(i)"
      >
        <!-- Folder header row -->
        <div class="folder-header" @click="toggleFolder(folder.id)">
          <!-- Drag handle -->
          <div
            class="drag-handle"
            @pointerdown.stop="startDrag($event, i)"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="16" x2="20" y2="16"/></svg>
          </div>
          <!-- Folder name & count -->
          <span class="folder-name">{{ folder.folderName || '기본 폴더' }}</span>
          <span class="folder-pin-count">{{ folder.pins.length }}</span>
          <!-- Accordion arrow -->
          <span class="folder-arrow" :class="{ open: isExpanded(folder.id) }">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
          <!-- Delete folder button -->
          <button class="folder-delete" @click.stop="deleteFolder(folder.id)">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        <!-- Folder content (accordion body) -->
        <Transition name="accordion">
          <div v-if="isExpanded(folder.id)" class="folder-content">
            <p v-if="folder.pins.length === 0" class="folder-empty">(없습니다)</p>
            <div v-else class="pins-grid">
              <div
                v-for="item in folder.pins"
                :key="item.reviewPinId"
                class="pin-thumb"
                @click="goReview(item.reviewPinId)"
              >
                <img
                  :src="getPinImg(item.reviewPinId)"
                  :alt="getPlaceName(item.placePinId)"
                />
                <div class="pin-thumb-info">
                  <span class="pin-thumb-place">{{ getPlaceName(item.placePinId) }}</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- New folder input at bottom -->
    <div class="add-folder-row">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
      <input
        v-model="newFolderName"
        class="add-folder-input"
        placeholder="새 폴더 이름 입력 후 Enter"
        @keydown.enter="createFolder"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { scrapFolders, addFolder, removeFolder } from '../store/scrap.js'
import { reviewPins, placePins } from '../data/dummy.js'

const router = useRouter()

// ── Accordion state ──────────────────────────
const expandedIds = ref(new Set(scrapFolders.value.map(f => f.id)))

function toggleFolder(id) {
  if (expandedIds.value.has(id)) expandedIds.value.delete(id)
  else expandedIds.value.add(id)
  expandedIds.value = new Set(expandedIds.value)
}
function isExpanded(id) { return expandedIds.value.has(id) }

// ── Folder actions ───────────────────────────
const newFolderName = ref('')

function createFolder() {
  const name = newFolderName.value.trim()
  if (!name) return
  const id = addFolder(name)
  expandedIds.value.add(id)
  expandedIds.value = new Set(expandedIds.value)
  newFolderName.value = ''
}

function deleteFolder(id) {
  removeFolder(id)
  expandedIds.value.delete(id)
  expandedIds.value = new Set(expandedIds.value)
}

// ── Pin helpers ──────────────────────────────
function getPinImg(reviewPinId) {
  const rp = reviewPins.find(r => r.id === reviewPinId)
  return rp ? rp.images[rp.representativeImageIndex] : ''
}
function getPlaceName(placePinId) {
  return placePins.find(p => p.id === placePinId)?.name ?? ''
}
function goReview(reviewPinId) {
  router.push({ name: 'review-detail', params: { id: reviewPinId } })
}

// ── Drag to reorder ──────────────────────────
const dragState = reactive({
  active: false,
  fromIdx: -1,
  toIdx: -1,
  startY: 0,
  currentY: 0,
})

function startDrag(e, idx) {
  e.target.setPointerCapture(e.pointerId)
  dragState.active  = true
  dragState.fromIdx = idx
  dragState.toIdx   = idx
  dragState.startY  = e.clientY
  dragState.currentY = e.clientY

  e.target.addEventListener('pointermove', onDragMove)
  e.target.addEventListener('pointerup', onDragEnd)
}

function onDragMove(e) {
  dragState.currentY = e.clientY
  const delta = dragState.currentY - dragState.startY
  const itemHeight = 50
  const newIdx = Math.max(0, Math.min(
    scrapFolders.value.length - 1,
    dragState.fromIdx + Math.round(delta / itemHeight)
  ))
  dragState.toIdx = newIdx
}

function onDragEnd(e) {
  e.target.removeEventListener('pointermove', onDragMove)
  e.target.removeEventListener('pointerup', onDragEnd)

  if (dragState.fromIdx !== dragState.toIdx) {
    const arr = [...scrapFolders.value]
    const [moved] = arr.splice(dragState.fromIdx, 1)
    arr.splice(dragState.toIdx, 0, moved)
    scrapFolders.value = arr
  }
  dragState.active  = false
  dragState.fromIdx = -1
  dragState.toIdx   = -1
}

function getDragStyle(i) {
  if (!dragState.active) return {}
  if (i === dragState.fromIdx) {
    return {
      transform: `translateY(${dragState.currentY - dragState.startY}px)`,
      zIndex: 10,
      opacity: 0.85,
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    }
  }
  return {}
}
</script>

<style scoped>
.scrap-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg);
}

/* ── Header ─────────────────────────────── */
.scrap-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px 10px;
  background: var(--bg-white);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.scrap-view-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
}

.folder-count {
  font-size: 12px;
  color: var(--text-hint);
}

/* ── Empty state ─────────────────────────── */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--text-hint);
}

.empty-state p {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.empty-state span {
  font-size: 12px;
}

/* ── Folder list ─────────────────────────── */
.folder-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.folder-item {
  margin: 0 12px 8px;
  background: var(--bg-white);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  overflow: hidden;
  transition: box-shadow 0.15s, transform 0.15s;
  position: relative;
}

.folder-item.dragging {
  border-color: var(--primary);
}

/* ── Folder header row ───────────────────── */
.folder-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  cursor: pointer;
  user-select: none;
}

.drag-handle {
  flex-shrink: 0;
  color: var(--text-hint);
  cursor: grab;
  touch-action: none;
  display: flex;
  padding: 2px;
}

.drag-handle:active { cursor: grabbing; }

.folder-name {
  flex: 1;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.folder-pin-count {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-light);
  border-radius: var(--radius-full);
  padding: 1px 8px;
  min-width: 24px;
  text-align: center;
}

.folder-arrow {
  color: var(--text-hint);
  display: flex;
  transition: transform 0.2s;
}
.folder-arrow.open { transform: rotate(180deg); }

.folder-delete {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: none;
  border: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-hint);
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.folder-delete:hover {
  background: #FDEEF1;
  border-color: var(--primary);
  color: var(--primary);
}

/* ── Folder content ──────────────────────── */
.folder-content {
  padding: 4px 12px 12px;
  border-top: 1px solid var(--border);
  background: var(--bg);
}

.folder-empty {
  font-size: 12px;
  color: var(--text-hint);
  text-align: center;
  padding: 12px 0;
}

.pins-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 8px;
}

.pin-thumb {
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
  position: relative;
  background: var(--border);
}

.pin-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pin-thumb-info {
  position: absolute;
  inset: auto 0 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.55));
  padding: 16px 6px 5px;
}

.pin-thumb-place {
  font-size: 9px;
  font-weight: 700;
  color: white;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Add folder row ──────────────────────── */
.add-folder-row {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--bg-white);
  border-top: 1px solid var(--border);
}

.add-folder-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-primary);
  background: transparent;
}

.add-folder-input::placeholder { color: var(--text-hint); }

/* ── Accordion transition ────────────────── */
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s;
  overflow: hidden;
  max-height: 400px;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
