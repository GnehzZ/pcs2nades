<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { MediaItem } from '../types'

const props = defineProps<{
  images: MediaItem[]
  initialIndex: number
  onClose: () => void
}>()

const current = ref(props.initialIndex)

function prev() { if (current.value > 0) current.value-- }
function next() { if (current.value < props.images.length - 1) current.value++ }

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') props.onClose()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="lightbox-overlay" @click.self="onClose">
    <button class="lightbox-close" @click="onClose">✕</button>
    <button v-if="images.length > 1 && current > 0" class="lightbox-arrow left" @click="prev">‹</button>
    <div v-if="images[current]" class="lightbox-content">
      <img :src="images[current]!.src" :alt="images[current]!.caption ?? ''" />
      <p v-if="images[current]!.caption" class="lightbox-caption">{{ images[current]!.caption }}</p>
      <span v-if="images.length > 1" class="lightbox-counter">{{ current + 1 }} / {{ images.length }}</span>
    </div>
    <button v-if="images.length > 1 && current < images.length - 1" class="lightbox-arrow right" @click="next">›</button>
  </div>
</template>
