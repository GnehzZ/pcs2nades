<script setup lang="ts">
import type { Map } from '../types'

defineProps<{
  map: Map
  spotCount: number
  recentCount?: number
}>()
</script>

<template>
  <router-link :to="`/map/${map.id}`" class="map-card">
    <div class="map-thumb-wrap">
      <img :src="map.thumbnail" :alt="map.name" class="map-thumb" @error="($event.target as HTMLImageElement).src = '/assets/placeholder.webp'" />
    </div>
    <div class="map-info">
      <h2 class="map-name">{{ map.name }}</h2>
      <span class="map-meta">{{ spotCount }} spots</span>
      <span v-if="recentCount" class="map-recent">{{ recentCount }} recent</span>
    </div>
  </router-link>
</template>
