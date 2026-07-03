<template>
  <div class="review-detail" v-if="pin">

    <!-- ══ 상단 1/4: 대표 이미지 ══ -->
    <div
      class="image-area"
      @pointerdown="imgSwipeStart"
      @pointerup="imgSwipeEnd"
    >
      <!-- 뒤로가기 -->
      <button class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <!-- 이미지 -->
      <img
        :src="currentImg"
        :alt="place.name"
        class="main-img"
      />

      <!-- 피드형 다중 이미지 닷 인디케이터 -->
      <div v-if="pin.type === 'feed' && pin.images.length > 1" class="img-dots">
        <span
          v-for="(_, i) in pin.images"
          :key="i"
          class="dot"
          :class="{ active: i === currentImgIdx }"
        />
      </div>

      <!-- 이미지 카운터 -->
      <div v-if="pin.type === 'feed' && pin.images.length > 1" class="img-counter">
        {{ currentImgIdx + 1 }} / {{ pin.images.length }}
      </div>
    </div>

    <!-- ══ 하단 3/4: 내용 ══ -->
    <div class="content-area">
      <div class="scroll-content">

        <!-- ─ 피드형 ─ -->
        <template v-if="pin.type === 'feed'">
          <div class="top-meta">
            <span class="cat-badge">{{ place.category }}</span>
            <span class="place-nm">{{ place.name }}</span>
          </div>
          <p class="sub-meta">
            {{ shortAddr }} &nbsp;·&nbsp; {{ pin.createdAt }}
          </p>
          <MiniMap :placeName="place.name" />
          <AuthorRow :author="author" :isMe="isMe" v-model:following="isFollowing" />
          <p class="body-text">{{ pin.body }}</p>
          <div class="tag-list">
            <span v-for="tag in pin.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </template>

        <!-- ─ 블로그형 ─ -->
        <template v-else>
          <span class="cat-badge">{{ place.category }}</span>
          <h2 class="blog-title">{{ pin.title }}</h2>
          <div class="top-meta" style="margin-top:4px">
            <span class="place-nm">{{ place.name }}</span>
            <span class="sub-meta-inline">&nbsp;·&nbsp;{{ shortAddr }}&nbsp;·&nbsp;{{ pin.createdAt }}</span>
          </div>
          <MiniMap :placeName="place.name" />
          <AuthorRow :author="author" :isMe="isMe" v-model:following="isFollowing" />
          <!-- 본문 (단락 + 인라인 이미지) -->
          <div class="blog-body">
            <template v-for="(item, i) in blogContent" :key="i">
              <p v-if="item.type === 'text'" class="body-text">{{ item.content }}</p>
              <img v-else :src="item.src" class="blog-inline-img" />
            </template>
          </div>
          <div class="tag-list">
            <span v-for="tag in pin.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </template>

        <!-- ─ 이 날에 함께 꽂은 핀 ─ -->
        <div class="same-day-section">
          <p class="same-day-title">이 날에 함께 꽂은 핀</p>
          <p v-if="sameDayPins.length === 0" class="same-day-empty">(없습니다)</p>
          <div v-else class="same-day-scroll">
            <div
              v-for="sp in sameDayPins"
              :key="sp.id"
              class="same-day-card"
              @click="$router.push({ name: 'review-detail', params: { id: sp.id } })"
            >
              <img :src="sp.images[sp.representativeImageIndex]" class="sd-thumb" />
              <span class="sd-place">{{ getPlace(sp.placePinId).name }}</span>
            </div>
          </div>
        </div>

      </div><!-- /scroll-content -->

      <!-- ─ 고정 액션 버튼 ─ -->
      <div class="sticky-actions">
        <div class="actions-main">
          <button class="action-btn" :class="{ liked: isLikedLocal }" @click="toggleLike">
            <svg viewBox="0 0 24 24" :fill="isLikedLocal ? '#E8536A' : 'none'" stroke="#E8536A" stroke-width="2" width="18" height="18"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>{{ likeCountLocal }}</span>
          </button>
          <button class="action-btn" @click="showComments = true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" width="18" height="18"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>{{ commentsForPin.length + localComments.length }}</span>
          </button>
          <button class="action-btn" :class="{ scrapped: isScrappedLocal }" @click="toggleScrap">
            <svg viewBox="0 0 24 24" :fill="isScrappedLocal ? '#E8536A' : 'none'" stroke="#E8536A" stroke-width="2" width="18" height="18"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <span>{{ scrapsDisplay }}</span>
          </button>
        </div>
        <button class="report-btn" @click="openReportModal" aria-label="신고하기">
          <svg viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
        </button>
      </div>
    </div>

    <!-- ══ 신고 오버레이 ══ -->
    <Transition name="fade-overlay">
      <div v-if="showReportModal" class="report-overlay-dim" @click.self="closeReportModal">
        <div class="report-dialog">
          <div class="report-dialog-title">신고하기</div>
          <div class="report-reason-list">
            <label
              v-for="r in reportReasons"
              :key="r.value"
              class="report-reason-item"
              :class="{ selected: reportReason === r.value }"
            >
              <input type="radio" :value="r.value" v-model="reportReason" class="report-radio" />
              <span>{{ r.label }}</span>
            </label>
          </div>
          <textarea
            v-if="reportReason === 'other'"
            v-model="reportDetail"
            class="report-detail-input"
            placeholder="신고 사유를 입력해주세요"
            rows="3"
          />
          <div class="report-dialog-btns">
            <button class="report-btn-cancel" @click="closeReportModal">취소</button>
            <button class="report-btn-submit" :disabled="!canSubmitReport" @click="submitReport">신고하기</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 신고 관련 토스트 -->
    <Transition name="toast-anim">
      <div v-if="showReportToast" class="report-toast">{{ reportToastMsg }}</div>
    </Transition>

    <!-- ══ 스크랩 폴더 선택 오버레이 ══ -->
    <Transition name="slide-up">
      <div v-if="showScrapModal" class="scrap-overlay">
        <div class="scrap-header">
          <span class="scrap-title">폴더에 저장</span>
          <button class="close-btn" @click="showScrapModal = false">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="scrap-folder-list">
          <button
            v-for="folder in scrapFolders"
            :key="folder.id"
            class="scrap-folder-item"
            @click="addToFolder(folder.id)"
          >
            <span class="sf-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </span>
            <span class="sf-name">{{ folder.folderName || '기본 폴더' }}</span>
            <span class="sf-count">{{ folder.pins.length }}개</span>
          </button>
          <p v-if="scrapFolders.length === 0" class="scrap-empty-hint">저장된 폴더가 없습니다</p>
        </div>
        <div class="scrap-new-folder-row">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <input
            v-model="newFolderInput"
            class="scrap-folder-input"
            placeholder="새 폴더 이름 입력 후 Enter"
            @keydown.enter="createFolderAndScrap"
          />
        </div>
      </div>
    </Transition>

    <!-- ══ 댓글 전체화면 오버레이 ══ -->
    <Transition name="slide-up">
      <div v-if="showComments" class="comment-overlay">
        <!-- 헤더 -->
        <div class="comment-header">
          <span class="comment-title">댓글 {{ commentsForPin.length + localComments.length }}</span>
          <button class="close-btn" @click="showComments = false">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <!-- 댓글 목록 (원댓글 + 답글 1단계) -->
        <div class="comment-list">
          <div v-for="c in groupedComments" :key="c.id" class="comment-thread">
            <div class="comment-item">
              <img :src="getUser(c.authorId).profileImg" class="c-avatar" />
              <div class="c-body">
                <div class="c-top">
                  <span class="c-name">{{ getUser(c.authorId).nickname }}</span>
                  <span class="c-time">{{ c.createdAt }}</span>
                </div>
                <p class="c-text">{{ c.text }}</p>
                <div class="c-actions">
                  <button class="c-like-btn">
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {{ c.likes }}
                  </button>
                  <button class="c-reply-btn" @click="startReply(c)">답글 달기</button>
                </div>
              </div>
            </div>

            <!-- 답글 (1단계만) -->
            <div v-if="c.replies.length" class="reply-list">
              <div v-for="r in c.replies" :key="r.id" class="comment-item reply-item">
                <img :src="getUser(r.authorId).profileImg" class="c-avatar c-avatar-sm" />
                <div class="c-body">
                  <div class="c-top">
                    <span class="c-name">{{ getUser(r.authorId).nickname }}</span>
                    <span class="c-time">{{ r.createdAt }}</span>
                  </div>
                  <p class="c-text">{{ r.text }}</p>
                  <div class="c-actions">
                    <button class="c-like-btn">
                      <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {{ r.likes }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 답글 대상 표시줄 -->
        <div v-if="replyTarget" class="reply-target-bar">
          <span>{{ replyTarget.nickname }}님에게 답글 남기는 중</span>
          <button class="reply-target-cancel" @click="cancelReply">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- 입력창 -->
        <div class="comment-input-row">
          <img :src="currentUser.profileImg" class="c-avatar" />
          <input
            v-model="newComment"
            :placeholder="replyTarget ? '답글을 입력하세요...' : '댓글을 입력하세요...'"
            class="comment-input"
            @keydown.enter="submitComment"
          />
          <button class="comment-send" @click="submitComment" :disabled="!newComment.trim()">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </Transition>

  </div>

  <!-- 핀 없을 때 -->
  <div v-else class="not-found">
    <p>리뷰핀을 찾을 수 없습니다</p>
    <button @click="$router.push('/')">홈으로</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reviewPins, placePins, users, currentUser, dummyComments } from '../data/dummy.js'
import { scrapFolders, isPinScrapped, scrapToFolder, unscrapPin, addFolder } from '../store/scrap.js'
import MiniMap from '../components/MiniMap.vue'
import AuthorRow from '../components/AuthorRow.vue'

const route  = useRoute()
const router = useRouter()

// ── 핀 데이터 ──
const pinId = computed(() => Number(route.params.id))
const pin   = computed(() => reviewPins.find(p => p.id === pinId.value) ?? null)
const place = computed(() => pin.value ? placePins.find(p => p.id === pin.value.placePinId) : null)
const author = computed(() => pin.value ? users.find(u => u.id === pin.value.authorId) : null)
const isMe  = computed(() => pin.value?.authorId === currentUser.id)

// ── 로컬 상태 (핀 변경 시 리셋) ──
const isLikedLocal    = ref(false)
const isScrappedLocal = computed(() => isPinScrapped(pinId.value))
const likeCountLocal  = ref(0)
const isFollowing     = ref(false)
const currentImgIdx   = ref(0)
const showComments    = ref(false)
const showScrapModal  = ref(false)
const newFolderInput  = ref('')
const newComment      = ref('')
const localComments   = ref([])
const replyTarget     = ref(null)  // { id, nickname } — 답글 작성 대상 (null이면 일반 댓글)

// ── 신고 ──
const showReportModal = ref(false)
const reportReason    = ref('')
const reportDetail    = ref('')
const isReportedLocal = ref(false)
const showReportToast = ref(false)
const reportToastMsg  = ref('')

const reportReasons = [
  { value: 'spam', label: '스팸/광고' },
  { value: 'abuse', label: '욕설·혐오 표현' },
  { value: 'adult', label: '음란물' },
  { value: 'misinformation', label: '허위 정보' },
  { value: 'copyright', label: '저작권 침해' },
  { value: 'other', label: '기타' },
]

const FOLLOWING_IDS = [1, 2, 3]
const commentsForPin = computed(() => dummyComments.filter(c => c.pinId === pinId.value))
const scrapsDisplay  = computed(() => {
  if (!pin.value) return 0
  const base = pin.value.scraps
  if (isScrappedLocal.value === pin.value.isScrapped) return base
  return isScrappedLocal.value ? base + 1 : base - 1
})

watch(pinId, init, { immediate: true })
function init() {
  const p = reviewPins.find(r => r.id === pinId.value)
  isLikedLocal.value    = p?.isLiked ?? false
  likeCountLocal.value  = p?.likes   ?? 0
  isFollowing.value     = FOLLOWING_IDS.includes(p?.authorId ?? -1)
  currentImgIdx.value   = 0
  showComments.value    = false
  showScrapModal.value  = false
  newFolderInput.value  = ''
  newComment.value      = ''
  localComments.value   = []
  replyTarget.value     = null
  showReportModal.value = false
  reportReason.value    = ''
  reportDetail.value    = ''
  isReportedLocal.value = false
}

// ── 이미지 ──
const currentImg = computed(() => {
  if (!pin.value) return ''
  if (pin.value.type === 'feed') return pin.value.images[currentImgIdx.value]
  return pin.value.images[pin.value.representativeImageIndex]
})

let _imgX = 0
function imgSwipeStart(e) { _imgX = e.clientX }
function imgSwipeEnd(e) {
  if (pin.value?.type !== 'feed') return
  const dx = e.clientX - _imgX
  if (Math.abs(dx) < 40) return
  const max = pin.value.images.length - 1
  if (dx < 0 && currentImgIdx.value < max) currentImgIdx.value++
  if (dx > 0 && currentImgIdx.value > 0)   currentImgIdx.value--
}

// ── 블로그 본문 (텍스트 + 인라인 이미지 혼합) ──
const blogContent = computed(() => {
  if (!pin.value || pin.value.type !== 'blog') return []
  const paras = pin.value.body.split('\n').filter(Boolean)
  const imgs  = pin.value.images.filter((_, i) => i !== pin.value.representativeImageIndex)
  const result = []
  paras.forEach((p, i) => {
    result.push({ type: 'text', content: p })
    if (imgs[i]) result.push({ type: 'image', src: imgs[i] })
  })
  imgs.slice(paras.length).forEach(src => result.push({ type: 'image', src }))
  return result
})

// ── 이 날에 함께 꽂은 핀 ──
const sameDayPins = computed(() => {
  if (!pin.value) return []
  return reviewPins.filter(r =>
    r.id !== pin.value.id &&
    r.authorId   === pin.value.authorId &&
    r.createdAt  === pin.value.createdAt
  )
})

// ── 헬퍼 ──
const shortAddr = computed(() =>
  place.value?.address.split(' ').slice(0, 2).join(' ') ?? ''
)
function getPlace(id) { return placePins.find(p => p.id === id) ?? {} }
function getUser(id)  { return users.find(u => u.id === id) ?? {} }

// ── 액션 ──
function toggleLike() {
  isLikedLocal.value = !isLikedLocal.value
  likeCountLocal.value += isLikedLocal.value ? 1 : -1
}
function toggleScrap() {
  if (isScrappedLocal.value) {
    unscrapPin(pinId.value)
  } else {
    showScrapModal.value = true
  }
}
function addToFolder(folderId) {
  scrapToFolder(pinId.value, pin.value?.placePinId, folderId)
  showScrapModal.value = false
}
function createFolderAndScrap() {
  const name = newFolderInput.value.trim()
  if (!name) return
  const folderId = addFolder(name)
  scrapToFolder(pinId.value, pin.value?.placePinId, folderId)
  newFolderInput.value = ''
  showScrapModal.value = false
}

// ── 신고 ──
const canSubmitReport = computed(() => {
  if (!reportReason.value) return false
  if (reportReason.value === 'other' && !reportDetail.value.trim()) return false
  return true
})

function flashReportToast(msg) {
  reportToastMsg.value = msg
  showReportToast.value = true
  setTimeout(() => { showReportToast.value = false }, 2000)
}

function openReportModal() {
  if (isReportedLocal.value) {
    flashReportToast('이미 신고한 리뷰핀이에요')
    return
  }
  reportReason.value = ''
  reportDetail.value = ''
  showReportModal.value = true
}

function closeReportModal() {
  showReportModal.value = false
}

function submitReport() {
  if (!canSubmitReport.value) return
  showReportModal.value = false
  isReportedLocal.value = true
  flashReportToast('신고가 접수됐어요')
}

// ── 댓글 (답글은 1단계로 평탄화) ──
const allFlatComments = computed(() => [...commentsForPin.value, ...localComments.value])
const groupedComments = computed(() => {
  const top = allFlatComments.value.filter(c => !c.parentId)
  return top.map(c => ({
    ...c,
    replies: allFlatComments.value.filter(r => r.parentId === c.id),
  }))
})

function startReply(comment) {
  replyTarget.value = { id: comment.id, nickname: getUser(comment.authorId).nickname }
  newComment.value = `@${replyTarget.value.nickname} `
}

function cancelReply() {
  replyTarget.value = null
  newComment.value = ''
}

function submitComment() {
  const text = newComment.value.trim()
  if (!text) return
  localComments.value.push({
    id: Date.now(),
    authorId: currentUser.id,
    parentId: replyTarget.value?.id ?? null,
    text,
    createdAt: new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    likes: 0,
  })
  newComment.value = ''
  replyTarget.value = null
}
</script>

<style scoped>
.review-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: var(--bg-white);
}

/* ── 이미지 영역 ── */
.image-area {
  flex: 0 0 25%;
  position: relative;
  overflow: hidden;
  background: #DDD;
  user-select: none;
}

.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

.back-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
  width: 32px;
  height: 32px;
  background: rgba(0,0,0,0.35);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
}

.img-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}
.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  transition: background 0.2s, transform 0.2s;
}
.dot.active {
  background: white;
  transform: scale(1.3);
}

.img-counter {
  position: absolute;
  bottom: 10px;
  right: 12px;
  background: rgba(0,0,0,0.5);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

/* ── 콘텐츠 영역 ── */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px 8px;
}

/* ── 공통 메타 ── */
.cat-badge {
  display: inline-block;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  margin-bottom: 6px;
}

.top-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 3px;
}
.place-nm {
  font-size: 15px;
  font-weight: 800;
  color: var(--text-primary);
}
.sub-meta {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}
.sub-meta-inline {
  font-size: 12px;
  color: var(--text-secondary);
}

/* ── 블로그형 ── */
.blog-title {
  font-size: 17px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 4px;
}

.blog-body {
  margin: 10px 0;
}
.blog-inline-img {
  width: 100%;
  border-radius: var(--radius-md);
  margin: 10px 0;
  object-fit: cover;
  max-height: 200px;
}

/* ── 공통 본문/태그 ── */
.body-text {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.7;
  margin: 10px 0;
  white-space: pre-wrap;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0 16px;
}
.tag {
  font-size: 12px;
  color: var(--primary);
  background: var(--primary-light);
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

/* ── 이 날에 함께 꽂은 핀 ── */
.same-day-section {
  border-top: 1px solid var(--border);
  padding-top: 14px;
  margin-top: 6px;
  padding-bottom: 16px;
}
.same-day-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 10px;
}
.same-day-empty {
  font-size: 12px;
  color: var(--text-hint);
  padding: 4px 0;
}
.same-day-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.same-day-card {
  flex-shrink: 0;
  width: 80px;
  cursor: pointer;
}
.sd-thumb {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: var(--border);
}
.sd-place {
  display: block;
  font-size: 10px;
  color: var(--text-secondary);
  margin-top: 4px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── 고정 액션 버튼 ── */
.sticky-actions {
  display: flex;
  align-items: stretch;
  border-top: 1px solid var(--border);
  background: var(--bg-white);
  flex-shrink: 0;
}
.actions-main {
  flex: 1;
  display: flex;
}
.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 13px 0;
  background: none;
  border: none;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.1s;
  font-family: inherit;
  font-weight: 600;
}
.action-btn:active { background: var(--bg); }
.action-btn.liked span  { color: var(--primary); }
.action-btn.scrapped span { color: var(--primary); }

.report-btn {
  flex-shrink: 0;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-left: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.1s;
}
.report-btn:active { background: var(--bg); }

/* ── 신고 오버레이 ── */
.report-overlay-dim {
  position: absolute;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-dialog {
  background: var(--bg-white);
  border-radius: 18px;
  padding: 22px 20px 18px;
  width: 290px;
}

.report-dialog-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 14px;
  text-align: center;
}

.report-reason-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.report-reason-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: background 0.1s, color 0.1s;
}

.report-reason-item.selected {
  color: var(--primary);
  font-weight: 700;
  background: var(--primary-light);
}

.report-radio {
  accent-color: var(--primary);
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.report-detail-input {
  width: 100%;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-primary);
  resize: none;
  outline: none;
  box-sizing: border-box;
  line-height: 1.5;
  margin: 6px 0 4px;
  transition: border-color 0.15s;
}
.report-detail-input:focus { border-color: var(--primary); }

.report-dialog-btns {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.report-btn-cancel {
  flex: 1;
  height: 42px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
}

.report-btn-submit {
  flex: 1;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: var(--primary);
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.report-btn-submit:disabled {
  opacity: 0.4;
  cursor: default;
}

/* ── 신고 토스트 ── */
.report-toast {
  position: absolute;
  bottom: 76px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 300;
  background: rgba(30, 30, 30, 0.85);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: 20px;
  white-space: nowrap;
}

/* ── 스크랩 오버레이 ── */
.scrap-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: var(--bg-white);
  display: flex;
  flex-direction: column;
}

.scrap-header {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.scrap-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.scrap-folder-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.scrap-folder-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.1s;
}

.scrap-folder-item:active { background: var(--bg); }

.sf-icon { color: var(--text-hint); flex-shrink: 0; display: flex; }

.sf-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.sf-count {
  font-size: 12px;
  color: var(--text-hint);
}

.scrap-empty-hint {
  text-align: center;
  font-size: 13px;
  color: var(--text-hint);
  padding: 24px 0;
}

.scrap-new-folder-row {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid var(--border);
  color: var(--primary);
}

.scrap-folder-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-primary);
}

.scrap-folder-input::placeholder { color: var(--text-hint); }

/* ── 댓글 오버레이 ── */
.comment-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: var(--bg-white);
  display: flex;
  flex-direction: column;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.comment-title {
  font-size: 15px;
  font-weight: 800;
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-primary);
  padding: 4px;
  display: flex;
  align-items: center;
}

.comment-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}
.comment-item {
  display: flex;
  gap: 10px;
  padding: 10px 16px;
}
.c-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--border);
}
.c-body { flex: 1; min-width: 0; }
.c-top {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 3px;
}
.c-name {
  font-size: 12px;
  font-weight: 700;
}
.c-time {
  font-size: 11px;
  color: var(--text-hint);
}
.c-text {
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
}
.c-actions {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.c-like-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  font-size: 11px;
  color: var(--text-hint);
  cursor: pointer;
  padding: 0;
}
.c-reply-btn {
  background: none;
  border: none;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-hint);
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}
.c-reply-btn:active { color: var(--primary); }

/* ── 답글 (1단계) ── */
.reply-list {
  margin-left: 42px;
  border-left: 2px solid var(--border);
  padding-left: 10px;
}
.reply-item { padding: 8px 16px 8px 0; }
.c-avatar-sm { width: 26px; height: 26px; }

/* ── 답글 대상 표시줄 ── */
.reply-target-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--primary-light);
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
}
.reply-target-cancel {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
}

.comment-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  background: var(--bg-white);
}
.comment-input {
  flex: 1;
  border: 1px solid var(--border-dark);
  border-radius: var(--radius-full);
  padding: 9px 14px;
  font-size: 13px;
  outline: none;
  background: var(--bg);
  font-family: inherit;
}
.comment-input:focus { border-color: var(--primary); }
.comment-send {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--primary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  flex-shrink: 0;
}
.comment-send:disabled { background: var(--border-dark); }

/* ── not-found ── */
.not-found {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.not-found p { color: var(--text-hint); }
.not-found button {
  background: var(--primary);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: var(--radius-full);
  cursor: pointer;
}

/* ── 트랜지션 ── */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity 0.2s; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }

.toast-anim-enter-active, .toast-anim-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-anim-enter-from, .toast-anim-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }
</style>
