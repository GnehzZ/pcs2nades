<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogStore } from '../stores/catalog'
import { useUserStateStore } from '../stores/userState'
import FiltersBar, { type FilterState } from '../components/FiltersBar.vue'
import SpotCard from '../components/SpotCard.vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import type { Spot } from '../types'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const userState = useUserStateStore()
const mapId = computed(() => route.params.mapId as string)

const filters = ref<FilterState>({
  keyword: '',
  utilityType: 'all',
  side: 'all',
  difficulty: 'all',
  tags: [],
  sort: 'order',
  favoritesOnly: false
})

const difficultyOrder: Record<string, number> = { easy: 0, medium: 1, hard: 2 }

const spots = computed(() => catalog.spotsCache[mapId.value] ?? [])
const map = computed(() => catalog.maps.find(m => m.id === mapId.value))

const filteredSpots = computed((): Spot[] => {
  let list = [...spots.value]
  const f = filters.value
  const kw = f.keyword.toLowerCase()
  if (kw) {
    list = list.filter(s =>
      s.title.toLowerCase().includes(kw) ||
      s.tags.some(t => t.toLowerCase().includes(kw)) ||
      (s.area?.toLowerCase().includes(kw) ?? false) ||
      (s.summary?.toLowerCase().includes(kw) ?? false)
    )
  }
  if (f.utilityType !== 'all') list = list.filter(s => s.utilityType === f.utilityType)
  if (f.side !== 'all') list = list.filter(s => s.side === f.side)
  if (f.difficulty !== 'all') list = list.filter(s => s.difficulty === f.difficulty)
  if (f.tags.length) list = list.filter(s => f.tags.every(t => s.tags.includes(t)))
  if (f.favoritesOnly) list = list.filter(s => userState.isFavorite(`${mapId.value}::${s.id}`))

  list.sort((a, b) => {
    if (f.sort === 'updatedAt') return (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')
    if (f.sort === 'difficulty') return (difficultyOrder[a.difficulty] ?? 0) - (difficultyOrder[b.difficulty] ?? 0)
    if (f.sort === 'recent') {
      const ra = userState.recentOf(`${mapId.value}::${a.id}`)
      const rb = userState.recentOf(`${mapId.value}::${b.id}`)
      return rb - ra
    }
    return (a.order ?? 999) - (b.order ?? 999)
  })
  return list
})

const crumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: map.value?.name ?? mapId.value }
])

function navigateToSpot(spotId: string) {
  const seq = filteredSpots.value.map(s => s.id).join(',')
  const idx = filteredSpots.value.findIndex(s => s.id === spotId)
  router.push({ path: `/map/${mapId.value}/spot/${spotId}`, query: { seq, idx: String(idx) } })
}

onMounted(async () => {
  if (!catalog.maps.length) await catalog.loadMaps()
  await catalog.loadSpots(mapId.value)
})

watch(mapId, async (id) => {
  await catalog.loadSpots(id)
})
</script>

<template>
  <div class="page map-spots-page">
    <Breadcrumbs :crumbs="crumbs" />
    <h1 class="page-title">{{ map?.name ?? mapId }}</h1>
    <div v-if="catalog.loading" class="loading">Loading spots...</div>
    <FiltersBar v-model="filters" :spots="spots" :map-id="mapId" />
    <div v-if="filteredSpots.length" class="spots-grid">
      <div v-for="spot in filteredSpots" :key="spot.id" @click="navigateToSpot(spot.id)" style="cursor:pointer">
        <SpotCard :spot="spot" :map-id="mapId" />
      </div>
    </div>
    <div v-else class="empty-state">
      <p>No spots match your filters.</p>
      <button class="btn" @click="filters = { keyword: '', utilityType: 'all', side: 'all', difficulty: 'all', tags: [], sort: 'order', favoritesOnly: false }">Clear filters</button>
    </div>
  </div>
</template>
