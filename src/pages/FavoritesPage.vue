<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCatalogStore } from '../stores/catalog'
import { useUserStateStore } from '../stores/userState'
import SpotCard from '../components/SpotCard.vue'

const catalog = useCatalogStore()
const userState = useUserStateStore()

const groupedFavorites = computed(() => {
  return catalog.maps.map(map => {
    const spots = (catalog.spotsCache[map.id] ?? []).filter(s =>
      userState.isFavorite(`${map.id}::${s.id}`)
    )
    return { map, spots }
  }).filter(g => g.spots.length > 0)
})

onMounted(async () => {
  if (!catalog.maps.length) await catalog.loadMaps()
  for (const map of catalog.maps) {
    await catalog.loadSpots(map.id)
  }
})
</script>

<template>
  <div class="page favorites-page">
    <h1 class="page-title">Favorites</h1>
    <div v-if="catalog.loading" class="loading">Loading...</div>
    <div v-else-if="groupedFavorites.length === 0" class="empty-state">
      <p>No favorites yet. Star spots to add them here.</p>
    </div>
    <div v-else>
      <div v-for="group in groupedFavorites" :key="group.map.id" class="fav-group">
        <h2 class="fav-map-name">{{ group.map.name }}</h2>
        <div class="spots-grid">
          <SpotCard
            v-for="spot in group.spots"
            :key="spot.id"
            :spot="spot"
            :map-id="group.map.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>
