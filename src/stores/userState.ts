import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type ProgressLevel = 0 | 1 | 2

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

export const useUserStateStore = defineStore('userState', () => {
  const favorites = ref<string[]>(loadJson('csutil:favorites', []))
  const progress = ref<Record<string, ProgressLevel>>(loadJson('csutil:progress', {}))
  const recent = ref<Record<string, number>>(loadJson('csutil:recent', {}))

  function saveFavorites() { localStorage.setItem('csutil:favorites', JSON.stringify(favorites.value)) }
  function saveProgress() { localStorage.setItem('csutil:progress', JSON.stringify(progress.value)) }
  function saveRecent() { localStorage.setItem('csutil:recent', JSON.stringify(recent.value)) }

  function toggleFavorite(spotKey: string) {
    const idx = favorites.value.indexOf(spotKey)
    if (idx >= 0) favorites.value.splice(idx, 1)
    else favorites.value.push(spotKey)
    saveFavorites()
  }

  function setProgress(spotKey: string, level: ProgressLevel) {
    progress.value[spotKey] = level
    saveProgress()
  }

  function trackRecent(spotKey: string) {
    recent.value[spotKey] = Date.now()
    saveRecent()
  }

  const isFavorite = computed(() => (spotKey: string) => favorites.value.includes(spotKey))
  const progressOf = computed(() => (spotKey: string): ProgressLevel => progress.value[spotKey] ?? 0)
  const recentOf = computed(() => (spotKey: string): number => recent.value[spotKey] ?? 0)

  return { favorites, progress, recent, toggleFavorite, setProgress, trackRecent, isFavorite, progressOf, recentOf }
})
