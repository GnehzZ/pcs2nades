<script setup lang="ts">
import { onMounted } from 'vue'
import { useCatalogStore } from '../stores/catalog'
import MapCard from '../components/MapCard.vue'

const catalog = useCatalogStore()

onMounted(async () => {
  if (!catalog.maps.length) await catalog.loadMaps()
  // Preload all spots to show correct counts on home page
  for (const map of catalog.maps) {
    catalog.loadSpots(map.id)
  }
})
</script>

<template>
  <div class="page maps-page">
    <h1 class="page-title">CS Utility Trainer</h1>
    <div v-if="catalog.loading" class="loading">Loading maps...</div>
    <div v-if="catalog.errors.length" class="error-panel">
      <h3>Validation Errors</h3>
      <ul>
        <li v-for="(err, i) in catalog.errors" :key="i">
          <strong>[{{ err.kind }}]</strong> {{ err.mapId }} / {{ err.path }}: {{ err.message }}
        </li>
      </ul>
    </div>
    <div class="maps-grid">
      <MapCard
        v-for="map in catalog.maps"
        :key="map.id"
        :map="map"
        :spot-count="catalog.spotsCache[map.id]?.length ?? 0"
      />
    </div>
  </div>
</template>
