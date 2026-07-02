import { ref } from 'vue'
import { scraps } from '../data/dummy.js'

export const scrapFolders = ref(JSON.parse(JSON.stringify(scraps)))

let _nextFolderId = 100

export function isPinScrapped(reviewPinId) {
  return scrapFolders.value.some(f => f.pins.some(p => p.reviewPinId === reviewPinId))
}

export function getPinFolder(reviewPinId) {
  return scrapFolders.value.find(f => f.pins.some(p => p.reviewPinId === reviewPinId)) ?? null
}

export function scrapToFolder(reviewPinId, placePinId, folderId) {
  scrapFolders.value.forEach(f => {
    f.pins = f.pins.filter(p => p.reviewPinId !== reviewPinId)
  })
  const folder = scrapFolders.value.find(f => f.id === folderId)
  if (folder) folder.pins.push({ reviewPinId, placePinId })
}

export function unscrapPin(reviewPinId) {
  scrapFolders.value.forEach(f => {
    f.pins = f.pins.filter(p => p.reviewPinId !== reviewPinId)
  })
}

export function addFolder(name) {
  const id = _nextFolderId++
  scrapFolders.value.push({ id, folderName: name || null, pins: [] })
  return id
}

export function removeFolder(folderId) {
  scrapFolders.value = scrapFolders.value.filter(f => f.id !== folderId)
}
