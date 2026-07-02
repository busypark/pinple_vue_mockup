<template>
  <div class="search-view">
    <!-- 상단 지역 입력 -->
    <div class="search-header">
      <button class="back-btn" @click="router.back()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="region-wrap">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <input
          v-model="regionInput"
          @input="onRegionInput"
          @focus="showDropdown = true"
          @blur="delayHide"
          placeholder="지역을 입력하세요 (필수)"
          class="region-input"
        />
        <button v-if="selectedRegion" class="clear-btn" @click="clearRegion">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <!-- 지역 드롭다운 -->
      <div v-if="showDropdown && filteredRegions.length" class="dropdown">
        <div
          v-for="r in filteredRegions"
          :key="r"
          class="dropdown-item"
          @mousedown.prevent="selectRegion(r)"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#AAAAAA" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ r }}
        </div>
      </div>
    </div>

    <!-- 스크롤 본문 -->
    <div class="search-body">

      <!-- 키워드 -->
      <div class="section">
        <div class="section-row">
          <span class="section-title">키워드</span>
          <button class="add-btn" @click="addKeyword">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            키워드 추가
          </button>
        </div>
        <div v-if="keywords.length === 0" class="keyword-empty">
          키워드를 추가하면 장소명·리뷰 제목·본문에서 검색합니다
        </div>
        <div v-for="(_, i) in keywords" :key="i" class="keyword-row">
          <input
            v-model="keywords[i]"
            placeholder="키워드 입력"
            class="keyword-input"
          />
          <button class="remove-btn" @click="removeKeyword(i)">−</button>
        </div>
      </div>

      <!-- 인기 태그 (지역 선택 시에만) -->
      <div v-if="selectedRegion && currentPopularTags.length" class="section">
        <span class="section-title">인기 태그 <span class="region-badge">{{ selectedRegion }}</span></span>
        <div class="chip-list">
          <button
            v-for="tag in currentPopularTags"
            :key="tag"
            class="chip"
            :class="{ active: selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
          >{{ tag }}</button>
        </div>
      </div>

      <!-- 카테고리 -->
      <div class="section">
        <span class="section-title">카테고리</span>
        <div class="chip-list">
          <button
            v-for="cat in categories"
            :key="cat"
            class="chip"
            :class="{ active: selectedCategories.includes(cat) }"
            @click="toggleCategory(cat)"
          >{{ cat }}</button>
        </div>
      </div>

    </div>

    <!-- 검색 버튼 -->
    <div class="search-footer">
      <button
        class="search-btn"
        :disabled="!selectedRegion"
        @click="doSearch"
      >검색하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { regions, popularTags, categories } from '../data/dummy.js'

const router = useRouter()

const regionInput       = ref('')
const selectedRegion    = ref('')
const showDropdown      = ref(false)
const keywords          = ref([])
const selectedTags      = ref([])
const selectedCategories = ref([])

const filteredRegions = computed(() => {
  const q = regionInput.value.trim()
  if (!q) return regions.slice(0, 6)
  return regions.filter(r => r.includes(q)).slice(0, 8)
})

const currentPopularTags = computed(() => {
  if (!selectedRegion.value) return []
  const key = Object.keys(popularTags).find(k => selectedRegion.value.startsWith(k))
  return key ? popularTags[key] : []
})

function onRegionInput() {
  selectedRegion.value = ''
  showDropdown.value = true
}

function selectRegion(r) {
  selectedRegion.value = r
  regionInput.value   = r
  showDropdown.value  = false
  selectedTags.value  = []
}

function clearRegion() {
  selectedRegion.value = ''
  regionInput.value   = ''
  selectedTags.value  = []
}

function delayHide() {
  setTimeout(() => { showDropdown.value = false }, 150)
}

function addKeyword()      { keywords.value.push('') }
function removeKeyword(i)  { keywords.value.splice(i, 1) }

function toggleTag(tag) {
  const i = selectedTags.value.indexOf(tag)
  i === -1 ? selectedTags.value.push(tag) : selectedTags.value.splice(i, 1)
}

function toggleCategory(cat) {
  const i = selectedCategories.value.indexOf(cat)
  i === -1 ? selectedCategories.value.push(cat) : selectedCategories.value.splice(i, 1)
}

function doSearch() {
  if (!selectedRegion.value) return
  router.push({
    name: 'search-result',
    query: {
      region:     selectedRegion.value,
      keywords:   keywords.value.filter(Boolean).join(','),
      tags:       selectedTags.value.join(','),
      categories: selectedCategories.value.join(','),
    },
  })
}
</script>

<style scoped>
.search-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg);
}

.search-header {
  background: var(--bg-white);
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  position: relative;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  padding: 4px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.region-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--bg);
  border-radius: var(--radius-full);
  padding: 9px 14px;
  border: 1.5px solid var(--border-dark);
  transition: border-color 0.15s;
}
.region-wrap:focus-within { border-color: var(--primary); }

.region-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 13px;
  outline: none;
  color: var(--text-primary);
  min-width: 0;
}
.region-input::placeholder { color: var(--text-hint); }

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-hint);
  display: flex;
  align-items: center;
  padding: 0;
}

.dropdown {
  position: absolute;
  top: calc(100% - 1px);
  left: 14px;
  right: 14px;
  background: var(--bg-white);
  border: 1px solid var(--border-dark);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: 50;
  max-height: 180px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  font-size: 13px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
}
.dropdown-item:last-child { border-bottom: none; }
.dropdown-item:hover { background: var(--bg); }

.search-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0 4px;
}

.section {
  background: var(--bg-white);
  padding: 14px 16px;
  margin-bottom: 8px;
}

.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-title {
  font-weight: 700;
  font-size: 13px;
  color: var(--text-primary);
  display: block;
  margin-bottom: 10px;
}
.section-row .section-title { margin-bottom: 0; }

.region-badge {
  font-size: 11px;
  font-weight: 500;
  color: var(--primary);
  background: var(--primary-light);
  padding: 2px 8px;
  border-radius: var(--radius-full);
  margin-left: 6px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 1.5px dashed var(--primary);
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: var(--radius-full);
  cursor: pointer;
}

.keyword-empty {
  font-size: 12px;
  color: var(--text-hint);
  padding: 4px 0;
}

.keyword-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.keyword-row:last-child { margin-bottom: 0; }

.keyword-input {
  flex: 1;
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-sm);
  padding: 9px 12px;
  font-size: 13px;
  outline: none;
  background: var(--bg);
  transition: border-color 0.15s;
}
.keyword-input:focus { border-color: var(--primary); }

.remove-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #FF4444;
  color: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.chip {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--border-dark);
  background: var(--bg-white);
  font-size: 12px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s;
  font-family: inherit;
}
.chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
  font-weight: 600;
}

.search-footer {
  background: var(--bg-white);
  padding: 12px 16px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.search-btn {
  width: 100%;
  padding: 14px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s;
  font-family: inherit;
}
.search-btn:disabled {
  background: var(--border-dark);
  color: var(--text-hint);
  cursor: not-allowed;
}
.search-btn:not(:disabled):active { opacity: 0.85; }
</style>
