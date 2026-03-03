<script setup lang="ts">
import { computed } from 'vue'
import type { Spot } from '../types'
import { useUserStateStore } from '../stores/userState'

const props = defineProps<{
  spot: Spot
  mapId: string
  active?: boolean
}>()

const userState = useUserStateStore()
const spotKey = computed(() => `${props.mapId}::${props.spot.id}`)
const isFav = computed(() => userState.isFavorite(spotKey.value))
const prog = computed(() => userState.progressOf(spotKey.value))

const progressLabels = ['未学', '练习中', '掌握']
const progressClasses = ['prog-none', 'prog-practice', 'prog-mastered']

const utilityIcons: Record<string, string> = {
  smoke: '💨',
  flash: '⚡',
  molotov: '🔥',
  he: '💣'
}

const difficultyColors: Record<string, string> = {
  easy: 'diff-easy',
  medium: 'diff-medium',
  hard: 'diff-hard'
}

function cycleProgress(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  const next = ((prog.value + 1) % 3) as 0 | 1 | 2
  userState.setProgress(spotKey.value, next)
}

function toggleFav(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  userState.toggleFavorite(spotKey.value)
}
</script>

<template>
  <router-link :to="`/map/${mapId}/spot/${spot.id}`" class="spot-card" :class="{ active }">
    <div class="spot-card-header">
      <span class="utility-icon">{{ utilityIcons[spot.utilityType] }}</span>
      <span class="utility-type">{{ spot.utilityType }}</span>
      <span :class="['diff-badge', difficultyColors[spot.difficulty]]">{{ spot.difficulty }}</span>
      <span class="side-badge">{{ spot.side }}</span>
    </div>
    <div class="spot-title">{{ spot.title }}</div>
    <div v-if="spot.tags.length" class="spot-tags">
      <span v-for="tag in spot.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
    <div class="spot-card-footer">
      <button :class="['fav-btn', { active: isFav }]" @click="toggleFav" :title="isFav ? 'Remove favorite' : 'Add favorite'">
        {{ isFav ? '★' : '☆' }}
      </button>
      <button :class="['prog-btn', progressClasses[prog]]" @click="cycleProgress" :title="progressLabels[prog]">
        {{ progressLabels[prog] }}
      </button>
    </div>
  </router-link>
</template>
