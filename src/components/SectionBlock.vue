<script setup lang="ts">
import { ref } from 'vue'
import type { MediaItem } from '../types'
import Lightbox from './Lightbox.vue'

const props = withDefaults(defineProps<{
  title: string
  steps: string[]
  images: MediaItem[]
  showImages?: boolean
}>(), {
  showImages: true
})

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const failedImages = ref<Set<string>>(new Set())

function openLightbox(idx: number) {
  lightboxIndex.value = idx
  lightboxOpen.value = true
}

function onImgError(src: string) {
  failedImages.value = new Set([...failedImages.value, src])
}
</script>

<template>
  <div class="section-block">
    <h3 class="section-title">{{ title }}</h3>
    <ol v-if="steps.length" class="step-list">
      <li v-for="(step, i) in steps" :key="i">{{ step }}</li>
    </ol>
    <div v-if="showImages && images.length" class="image-grid">
      <div v-for="(img, i) in images" :key="img.src" class="image-item">
        <img
          :src="failedImages.has(img.src) ? '/assets/placeholder.webp' : img.src"
          :alt="img.caption ?? ''"
          class="section-img"
          @click="openLightbox(i)"
          @error="onImgError(img.src)"
        />
        <p v-if="failedImages.has(img.src)" class="img-missing">Missing: {{ img.src }}</p>
        <p v-if="img.caption" class="img-caption">{{ img.caption }}</p>
      </div>
    </div>
    <Teleport to="body">
      <Lightbox
        v-if="lightboxOpen"
        :images="images"
        :initial-index="lightboxIndex"
        :on-close="() => lightboxOpen = false"
      />
    </Teleport>
  </div>
</template>
