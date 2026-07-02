<template>
  <!-- Draft recovery modal -->
  <Transition name="fade-overlay">
    <div v-if="showDraftPrompt" class="reg-overlay-dim">
      <div class="draft-dialog">
        <div class="draft-icon">📋</div>
        <div class="draft-title">임시저장된 내용이 있어요</div>
        <div class="draft-desc">이전에 작성하던 내용을 불러올까요?</div>
        <div class="draft-btns">
          <button class="draft-btn-no" @click="discardDraft">새로 작성</button>
          <button class="draft-btn-yes" @click="loadDraft">이어서 작성</button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Representative image select modal (blog only) -->
  <Transition name="fade-overlay">
    <div v-if="showRepModal" class="reg-overlay-dim" @click.self="showRepModal = false">
      <div class="rep-modal">
        <div class="rep-modal-header">
          <span class="rep-modal-title">대표 이미지 선택</span>
          <button class="rep-modal-close" @click="showRepModal = false">✕</button>
        </div>
        <div v-if="bodyImageBlocks.length === 0" class="rep-modal-empty">
          본문에 이미지를 먼저 삽입해주세요
        </div>
        <div v-else class="rep-modal-grid">
          <div
            v-for="blk in bodyImageBlocks"
            :key="blk.id"
            class="rep-modal-img-wrap"
            :class="{ selected: repImgSrc === blk.src }"
            @click="setRepFromModal(blk.src)"
          >
            <img :src="blk.src" />
            <div v-if="repImgSrc === blk.src" class="rep-check">✓</div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Save toast -->
  <Transition name="toast-anim">
    <div v-if="showToast" class="save-toast">임시저장됨</div>
  </Transition>

  <!-- Main register view -->
  <div class="reg-view">
    <!-- Header -->
    <div class="reg-header">
      <button class="reg-close" @click="handleClose">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <span class="reg-title">{{ type === 'feed' ? '피드 작성' : '블로그 작성' }}</span>
      <button class="reg-tempsave" @click="handleTempSave">임시저장</button>
    </div>

    <!-- Scrollable body -->
    <div class="reg-body">

      <!-- ═══════ FEED TYPE ═══════ -->
      <template v-if="type === 'feed'">
        <!-- 노지일 때만 제목 입력 -->
        <template v-if="placeMode === 'nooji'">
          <div class="section-label">제목</div>
          <input v-model="feedTitle" class="reg-input reg-title-input" placeholder="제목을 입력하세요" maxlength="80" />
        </template>

        <!-- Images -->
        <div class="section-row">
          <span class="section-label">이미지</span>
          <span class="section-badge">{{ feedImages.length }}/10</span>
        </div>
        <div class="feed-imgs-scroll">
          <div v-if="feedImages.length < 10" class="img-add-card" @click="addFeedImage">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span class="add-card-label">추가</span>
          </div>
          <div v-for="(img, i) in feedImages" :key="img.id" class="feed-img-card" @click="toggleRepresentative(i)">
            <img :src="img.src" />
            <div v-if="img.isRep" class="rep-badge">대표</div>
            <button class="img-remove" @click.stop="feedImages.splice(i, 1)">×</button>
          </div>
        </div>
        <p class="section-hint">이미지를 탭하면 대표 이미지로 설정됩니다</p>
      </template>

      <!-- ═══════ BLOG TYPE ═══════ -->
      <template v-else>
        <!-- Representative image -->
        <div class="blog-rep-area">
          <div class="blog-rep-img" :class="{ 'blog-rep-empty': !repImgSrc }">
            <img v-if="repImgSrc" :src="repImgSrc" />
            <div v-else class="rep-placeholder">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#C0C0C8" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>대표 이미지</span>
            </div>
          </div>
          <button class="change-rep-btn" @click="showRepModal = true">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            대표 이미지 변경
          </button>
        </div>

        <!-- Title -->
        <div class="section-label">제목</div>
        <input v-model="blogTitle" class="reg-input reg-title-input" placeholder="제목을 입력하세요" maxlength="80" />
      </template>

      <!-- ═══════ COMMON: Place ═══════ -->
      <div class="section-label">장소핀</div>

      <!-- 장소 유형 선택 -->
      <div class="place-mode-row">
        <button
          class="place-mode-btn"
          :class="{ active: placeMode === 'existing' }"
          @click="placeMode = 'existing'"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          기존 장소 선택
        </button>
        <button
          class="place-mode-btn"
          :class="{ active: placeMode === 'nooji' }"
          @click="placeMode = 'nooji'"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          노지 직접 등록
        </button>
      </div>

      <!-- 기존 장소 검색 -->
      <div v-if="placeMode === 'existing'" class="place-input-wrap">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="var(--text-hint)" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <input class="reg-input place-inp" placeholder="장소를 검색하세요 (추후 구현 예정)" disabled />
      </div>

      <!-- 노지 위치 등록 -->
      <div v-else class="nooji-area">
        <div class="nooji-map-placeholder">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--text-hint)" stroke-width="1.5" stroke-linecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span class="nooji-map-label">지도에서 위치 선택</span>
          <span class="nooji-map-sub">추후 구현 예정</span>
        </div>
        <div class="nooji-info-row">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--text-hint)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>선택한 위치는 <b>핀크루 발견 장소</b>에 자동으로 묶입니다</span>
        </div>
      </div>

      <!-- ═══════ COMMON: Category ═══════ -->
      <div class="section-label">카테고리</div>
      <!-- 노지: 자동 지정 -->
      <div v-if="placeMode === 'nooji'" class="nooji-cat-row">
        <span class="nooji-cat-chip">사용자 등록</span>
        <span class="nooji-cat-hint">노지 장소는 자동 지정됩니다</span>
      </div>
      <!-- 기존 장소: 선택 -->
      <div v-else class="cat-scroll">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-chip"
          :class="{ active: selectedCat === cat }"
          @click="selectedCat = selectedCat === cat ? '' : cat"
        >{{ cat }}</button>
      </div>

      <!-- ═══════ FEED: Body textarea ═══════ -->
      <template v-if="type === 'feed'">
        <div class="section-label">내용</div>
        <textarea
          v-model="feedBody"
          class="reg-textarea"
          placeholder="방문 후기를 자유롭게 써주세요"
          rows="7"
        />
      </template>

      <!-- ═══════ BLOG: Block editor ═══════ -->
      <template v-else>
        <div class="section-label">내용</div>
        <div class="blog-editor">
          <template v-for="(blk, i) in bodyBlocks" :key="blk.id">
            <textarea
              v-if="blk.type === 'text'"
              v-model="blk.content"
              class="reg-textarea blog-block-text"
              :placeholder="i === 0 ? '본문을 입력하세요' : '계속 입력하세요...'"
              rows="4"
              @focus="focusedBlockIdx = i"
            />
            <div v-else class="body-img-blk">
              <img :src="blk.src" />
              <button class="img-blk-remove" @click="removeBodyBlock(i)">×</button>
            </div>
          </template>
        </div>

        <!-- Image insert toolbar -->
        <div class="blog-toolbar">
          <button class="toolbar-btn" @click="insertBodyImage">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>
          <span class="toolbar-hint">이미지 삽입</span>
        </div>
      </template>

      <div class="reg-body-bottom-pad" />
    </div>

    <!-- Footer -->
    <div class="reg-footer">
      <!-- Tags -->
      <div class="tags-area">
        <div class="tags-chips-wrap">
          <span v-for="tag in tags" :key="tag" class="tag-chip">
            #{{ tag }}<button class="tag-remove" @click="removeTag(tag)">×</button>
          </span>
          <input
            v-model="tagInput"
            class="tag-input"
            placeholder="#태그 추가 (Enter)"
            @keydown.enter.prevent="addTag"
          />
        </div>
      </div>

      <!-- Submit -->
      <button class="submit-btn" @click="handleSubmit">핀 등록하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { feedDraft, blogDraft } from '../store/register.js'
import { categories } from '../data/dummy.js'

const route = useRoute()
const router = useRouter()

const type = computed(() => route.params.type === 'blog' ? 'blog' : 'feed')

// ── Dummy image pool ──────────────────────────
let _imgIdx = 0
const _imgPool = [
  'https://picsum.photos/seed/rg1/400/300',
  'https://picsum.photos/seed/rg2/400/300',
  'https://picsum.photos/seed/rg3/400/300',
  'https://picsum.photos/seed/rg4/400/300',
  'https://picsum.photos/seed/rg5/400/300',
  'https://picsum.photos/seed/rg6/400/300',
]
function getDummyImg() { return _imgPool[_imgIdx++ % _imgPool.length] }

let _blkId = 200
function nextId() { return _blkId++ }

// ── Feed state ────────────────────────────────
const feedImages = ref([])   // { id, src, isRep }
const feedBody   = ref('')
const feedTitle  = ref('')   // 노지일 때만 사용

// ── Blog state ────────────────────────────────
const repImgSrc  = ref('')
const blogTitle  = ref('')
const bodyBlocks = ref([{ id: nextId(), type: 'text', content: '' }])
const focusedBlockIdx = ref(null)

// ── Common state ──────────────────────────────
const placeMode   = ref('existing')  // 'existing' | 'nooji'
const selectedCat = ref('')
const tags        = ref([])
const tagInput    = ref('')

// ── UI state ─────────────────────────────────
const showDraftPrompt = ref(false)
const showRepModal    = ref(false)
const showToast       = ref(false)

// ── Computed ──────────────────────────────────
const bodyImageBlocks = computed(() => bodyBlocks.value.filter(b => b.type === 'image'))

// ── Feed functions ────────────────────────────
function addFeedImage() {
  const src = getDummyImg()
  const isFirst = feedImages.value.length === 0
  feedImages.value.push({ id: nextId(), src, isRep: isFirst })
}

function toggleRepresentative(i) {
  feedImages.value.forEach((img, idx) => { img.isRep = idx === i })
}

// ── Blog functions ────────────────────────────
function insertBodyImage() {
  const src = getDummyImg()
  bodyBlocks.value.push({ id: nextId(), type: 'image', src })
  bodyBlocks.value.push({ id: nextId(), type: 'text', content: '' })
  if (!repImgSrc.value) repImgSrc.value = src
}

function removeBodyBlock(i) {
  bodyBlocks.value.splice(i, 1)
  if (bodyBlocks.value.length === 0) {
    bodyBlocks.value.push({ id: nextId(), type: 'text', content: '' })
  }
}

function setRepFromModal(src) {
  repImgSrc.value = src
  showRepModal.value = false
}

// ── Tags ──────────────────────────────────────
function addTag() {
  const t = tagInput.value.replace(/^#/, '').trim()
  if (t && !tags.value.includes(t) && tags.value.length < 10) {
    tags.value.push(t)
  }
  tagInput.value = ''
}

function removeTag(tag) {
  tags.value = tags.value.filter(t => t !== tag)
}

// ── Draft helpers ─────────────────────────────
function getDraft() {
  return type.value === 'feed' ? feedDraft.value : blogDraft.value
}

function hasMeaningfulContent() {
  if (type.value === 'feed') {
    return feedImages.value.length > 0 || feedBody.value.trim() || feedTitle.value.trim()
  }
  return blogTitle.value.trim() ||
    bodyBlocks.value.some(b => b.content?.trim() || b.type === 'image')
}

function saveDraftData() {
  if (type.value === 'feed') {
    feedDraft.value = {
      feedImages: feedImages.value.map(img => ({ ...img })),
      feedBody:   feedBody.value,
      feedTitle:  feedTitle.value,
      placeMode:  placeMode.value,
      selectedCat: selectedCat.value,
      tags: [...tags.value],
    }
  } else {
    blogDraft.value = {
      repImgSrc:  repImgSrc.value,
      blogTitle:  blogTitle.value,
      bodyBlocks: JSON.parse(JSON.stringify(bodyBlocks.value)),
      placeMode:  placeMode.value,
      selectedCat: selectedCat.value,
      tags: [...tags.value],
    }
  }
}

function loadDraft() {
  const draft = getDraft()
  if (!draft) return
  placeMode.value   = draft.placeMode  ?? 'existing'
  selectedCat.value = draft.selectedCat
  tags.value        = draft.tags
  if (type.value === 'feed') {
    feedImages.value = draft.feedImages
    feedBody.value   = draft.feedBody
    feedTitle.value  = draft.feedTitle ?? ''
  } else {
    repImgSrc.value  = draft.repImgSrc
    blogTitle.value  = draft.blogTitle
    bodyBlocks.value = draft.bodyBlocks
  }
  showDraftPrompt.value = false
}

function discardDraft() {
  if (type.value === 'feed') feedDraft.value = null
  else                       blogDraft.value = null
  showDraftPrompt.value = false
}

// ── Actions ───────────────────────────────────
function handleTempSave() {
  saveDraftData()
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2000)
}

function handleClose() {
  if (hasMeaningfulContent()) saveDraftData()
  router.go(-1)
}

function handleSubmit() {
  if (type.value === 'feed') feedDraft.value = null
  else                       blogDraft.value = null
  router.replace({ name: 'home' })
}

// ── On mount: check draft ─────────────────────
onMounted(() => {
  if (getDraft() !== null) {
    showDraftPrompt.value = true
  }
})
</script>

<style scoped>
/* ── Layout ─────────────────────────────── */
.reg-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
  position: relative;
}

/* ── Header ─────────────────────────────── */
.reg-header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.reg-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  border-radius: 50%;
}

.reg-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.reg-tempsave {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
  padding: 6px 4px;
}

/* ── Body ───────────────────────────────── */
.reg-body {
  flex: 1;
  overflow-y: auto;
  padding: 4px 16px 0;
}

.reg-body-bottom-pad { height: 8px; }

/* ── Section labels ─────────────────────── */
.section-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 14px 0 6px;
}

.section-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-hint);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin: 14px 0 6px;
}

.section-badge {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-hint);
}

.section-hint {
  font-size: 11px;
  color: var(--text-hint);
  margin: 4px 0 10px;
}

/* ── Feed images ────────────────────────── */
.feed-imgs-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0 8px;
}

.img-add-card {
  flex-shrink: 0;
  width: 82px;
  height: 82px;
  border: 2px dashed var(--border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  color: var(--text-hint);
  transition: border-color 0.15s, background 0.15s;
}

.img-add-card:hover { border-color: var(--primary); background: var(--primary-light); color: var(--primary); }

.add-card-label { font-size: 11px; font-weight: 600; }

.feed-img-card {
  flex-shrink: 0;
  width: 82px;
  height: 82px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.feed-img-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.rep-badge {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: var(--primary);
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.img-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Blog rep image ─────────────────────── */
.blog-rep-area {
  margin: 10px 0 6px;
}

.blog-rep-img {
  height: 180px;
  border-radius: 14px;
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--border);
}

.blog-rep-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.blog-rep-empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rep-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.rep-placeholder span {
  font-size: 12px;
  color: var(--text-hint);
}

.change-rep-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
  margin-top: 6px;
  padding: 2px 0;
}

/* ── Common inputs ──────────────────────── */
.reg-input {
  width: 100%;
  height: 40px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 0 12px;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-primary);
  background: var(--bg-white);
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.15s;
}

.reg-input:focus { border-color: var(--primary); }
.reg-input:disabled { background: var(--bg); color: var(--text-hint); cursor: not-allowed; }

.reg-title-input {
  height: 42px;
  font-size: 14px;
  font-weight: 600;
}

/* ── Place mode toggle ──────────────────── */
.place-mode-row {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.place-mode-btn {
  flex: 1;
  height: 38px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: var(--bg-white);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.15s;
}

.place-mode-btn.active {
  border-color: var(--primary);
  background: var(--primary-light);
  color: var(--primary);
}

/* ── Place search ───────────────────────── */
.place-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.place-input-wrap svg {
  position: absolute;
  left: 12px;
  pointer-events: none;
}

.place-inp {
  padding-left: 32px;
}

/* ── Nooji area ─────────────────────────── */
.nooji-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nooji-map-placeholder {
  height: 100px;
  border: 1.5px dashed var(--border-dark);
  border-radius: 12px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: default;
}

.nooji-map-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.nooji-map-sub {
  font-size: 11px;
  color: var(--text-hint);
}

.nooji-info-row {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  padding: 0 2px;
}

.nooji-info-row svg { flex-shrink: 0; margin-top: 1px; color: var(--text-hint); }

.nooji-info-row span {
  font-size: 11px;
  color: var(--text-hint);
  line-height: 1.5;
}

.nooji-info-row b { color: var(--text-secondary); }

/* ── Nooji category ─────────────────────── */
.nooji-cat-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.nooji-cat-chip {
  background: var(--bg);
  border: 1.5px solid var(--border-dark);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 5px 14px;
}

.nooji-cat-hint {
  font-size: 11px;
  color: var(--text-hint);
}

/* ── Category chips ─────────────────────── */
.cat-scroll {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding: 2px 0 8px;
}

.cat-chip {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--border);
  background: var(--bg-white);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
}

.cat-chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

/* ── Textarea ───────────────────────────── */
.reg-textarea {
  width: 100%;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-primary);
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  line-height: 1.6;
  transition: border-color 0.15s;
}

.reg-textarea:focus { border-color: var(--primary); }

/* ── Blog editor ────────────────────────── */
.blog-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.blog-block-text { min-height: 90px; resize: none; }

.body-img-blk {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.body-img-blk img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  display: block;
}

.img-blk-remove {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Blog toolbar ───────────────────────── */
.blog-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0 4px;
  border-top: 1px solid var(--border);
  margin-top: 4px;
}

.toolbar-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--bg);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: background 0.15s;
}

.toolbar-btn:hover { background: var(--primary-light); color: var(--primary); }

.toolbar-hint {
  font-size: 11px;
  color: var(--text-hint);
}

/* ── Footer ─────────────────────────────── */
.reg-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--border);
  padding: 10px 16px 14px;
  background: var(--bg-white);
}

/* Tags */
.tags-area {
  margin-bottom: 10px;
}

.tags-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  min-height: 32px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 6px 10px;
}

.tag-chip {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px 3px 9px;
  border-radius: var(--radius-full);
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--primary);
  line-height: 1;
  padding: 0 0 0 2px;
  display: flex;
  align-items: center;
}

.tag-input {
  border: none;
  outline: none;
  font-size: 12px;
  font-family: inherit;
  color: var(--text-primary);
  min-width: 80px;
  flex: 1;
  background: transparent;
}

.tag-input::placeholder { color: var(--text-hint); }

/* Submit */
.submit-btn {
  width: 100%;
  height: 46px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
  letter-spacing: -0.2px;
}

.submit-btn:active { opacity: 0.85; }

/* ── Overlays ────────────────────────────── */
.reg-overlay-dim {
  position: absolute;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Draft dialog */
.draft-dialog {
  background: var(--bg-white);
  border-radius: 18px;
  padding: 28px 22px 22px;
  width: 280px;
  text-align: center;
}

.draft-icon { font-size: 28px; margin-bottom: 10px; }

.draft-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.draft-desc {
  font-size: 13px;
  color: var(--text-hint);
  margin-bottom: 22px;
  line-height: 1.5;
}

.draft-btns { display: flex; gap: 10px; }

.draft-btn-no {
  flex: 1;
  height: 44px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: var(--bg-white);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
}

.draft-btn-yes {
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: var(--primary);
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

/* Rep image modal */
.rep-modal {
  background: var(--bg-white);
  border-radius: 18px;
  padding: 16px;
  width: 310px;
  max-height: 380px;
  display: flex;
  flex-direction: column;
}

.rep-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.rep-modal-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.rep-modal-close {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.rep-modal-empty {
  text-align: center;
  font-size: 13px;
  color: var(--text-hint);
  padding: 24px 0;
}

.rep-modal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  overflow-y: auto;
}

.rep-modal-img-wrap {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 2.5px solid transparent;
  transition: border-color 0.15s;
}

.rep-modal-img-wrap.selected { border-color: var(--primary); }

.rep-modal-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.rep-check {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Toast ──────────────────────────────── */
.save-toast {
  position: absolute;
  bottom: 72px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 300;
  background: rgba(30, 30, 30, 0.82);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 20px;
  white-space: nowrap;
  font-family: inherit;
}

/* ── Transitions ────────────────────────── */
.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity 0.2s; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }

.toast-anim-enter-active, .toast-anim-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-anim-enter-from, .toast-anim-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }
</style>
