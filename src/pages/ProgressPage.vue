<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCatalogStore } from '../stores/catalog'
import { useUserStateStore } from '../stores/userState'
import SpotCard from '../components/SpotCard.vue'

const catalog = useCatalogStore()
const userState = useUserStateStore()
const filterProg = ref<number | 'all'>('all')

const allSpots = computed(() => {
  return catalog.maps.flatMap(map =>
    (catalog.spotsCache[map.id] ?? []).map(spot => ({ spot, mapId: map.id }))
  )
})

const stats = computed(() => {
  const total = allSpots.value.length
  let none = 0, practice = 0, mastered = 0
  for (const { spot, mapId } of allSpots.value) {
    const p = userState.progressOf(`${mapId}::${spot.id}`)
    if (p === 0) none++
    else if (p === 1) practice++
    else mastered++
  }
  return { total, none, practice, mastered }
})

const filteredSpots = computed(() => {
  if (filterProg.value === 'all') return allSpots.value
  return allSpots.value.filter(({ spot, mapId }) =>
    userState.progressOf(`${mapId}::${spot.id}`) === filterProg.value
  )
})

onMounted(async () => {
  if (!catalog.maps.length) await catalog.loadMaps()
  for (const map of catalog.maps) {
    await catalog.loadSpots(map.id)
  }
})
</script>

<template>
  <div class="page progress-page">
    <h1 class="page-title">Progress</h1>
    <div v-if="catalog.loading" class="loading">Loading...</div>
    <div v-else>
      <div class="progress-stats">
        <div class="stat-card">
          <span class="stat-num">{{ stats.total }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-card prog-none-card">
          <span class="stat-num">{{ stats.none }}</span>
          <span class="stat-label">未学</span>
        </div>
        <div class="stat-card prog-practice-card">
          <span class="stat-num">{{ stats.practice }}</span>
          <span class="stat-label">练习中</span>
        </div>
        <div class="stat-card prog-mastered-card">
          <span class="stat-num">{{ stats.mastered }}</span>
          <span class="stat-label">掌握</span>
        </div>
      </div>
      <div class="filter-row">
        <button class="filter-btn" :class="{ active: filterProg === 'all' }" @click="filterProg = 'all'">All</button>
        <button class="filter-btn" :class="{ active: filterProg === 0 }" @click="filterProg = 0">未学</button>
        <button class="filter-btn" :class="{ active: filterProg === 1 }" @click="filterProg = 1">练习中</button>
        <button class="filter-btn" :class="{ active: filterProg === 2 }" @click="filterProg = 2">掌握</button>
      </div>
      <div v-if="filteredSpots.length" class="spots-grid">
        <SpotCard
          v-for="item in filteredSpots"
          :key="`${item.mapId}::${item.spot.id}`"
          :spot="item.spot"
          :map-id="item.mapId"
        />
      </div>
      <div v-else class="empty-state">No spots in this category yet.</div>
    </div>
  </div>
</template>
