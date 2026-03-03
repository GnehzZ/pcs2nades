<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogStore } from '../stores/catalog'
import { useUserStateStore } from '../stores/userState'
import SectionBlock from '../components/SectionBlock.vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const userState = useUserStateStore()

const mapId = computed(() => route.params.mapId as string)
const spotId = computed(() => route.params.spotId as string)
const spotKey = computed(() => `${mapId.value}::${spotId.value}`)

const map = computed(() => catalog.maps.find(m => m.id === mapId.value))
const spots = computed(() => catalog.spotsCache[mapId.value] ?? [])
const spot = computed(() => spots.value.find(s => s.id === spotId.value))
const isFav = computed(() => userState.isFavorite(spotKey.value))
const prog = computed(() => userState.progressOf(spotKey.value))

const seq = computed(() => {
  const s = route.query.seq as string | undefined
  return s ? s.split(',') : spots.value.map(s => s.id)
})
const currentIdx = computed(() => seq.value.indexOf(spotId.value))
const prevId = computed(() => currentIdx.value > 0 ? seq.value[currentIdx.value - 1] : null)
const nextId = computed(() => currentIdx.value < seq.value.length - 1 ? seq.value[currentIdx.value + 1] : null)

const crumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: map.value?.name ?? mapId.value, to: `/map/${mapId.value}` },
  { label: spot.value?.title ?? spotId.value }
])

const progressLabels = ['未学', '练习中', '掌握']

function navigate(id: string) {
  const newIdx = seq.value.indexOf(id)
  router.push({ path: `/map/${mapId.value}/spot/${id}`, query: { seq: seq.value.join(','), idx: String(newIdx) } })
}

async function ensureLoaded() {
  if (!catalog.maps.length) await catalog.loadMaps()
  if (!catalog.spotsCache[mapId.value]) await catalog.loadSpots(mapId.value)
}

onMounted(async () => {
  await ensureLoaded()
  userState.trackRecent(spotKey.value)
})

watch(spotKey, async () => {
  await ensureLoaded()
  userState.trackRecent(spotKey.value)
})
</script>

<template>
  <div class="page spot-detail-page">
    <Breadcrumbs :crumbs="crumbs" />
    <div v-if="catalog.loading" class="loading">Loading...</div>
    <div v-else-if="!spot" class="error-panel">
      <p>Spot "{{ spotId }}" not found in map "{{ mapId }}".</p>
      <router-link :to="`/map/${mapId}`" class="btn">Back to map</router-link>
    </div>
    <template v-else>
      <div class="spot-detail-header">
        <h1 class="page-title">{{ spot.title }}</h1>
        <div class="spot-meta-row">
          <span :class="['diff-badge', `diff-${spot.difficulty}`]">{{ spot.difficulty }}</span>
          <span class="side-badge">{{ spot.side }}</span>
          <span class="utility-type-badge">{{ spot.utilityType }}</span>
          <span v-if="spot.area" class="area-badge">{{ spot.area }}</span>
        </div>
        <p v-if="spot.summary" class="spot-summary">{{ spot.summary }}</p>
        <div v-if="spot.tags.length" class="spot-tags">
          <span v-for="tag in spot.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="spot-actions">
          <button :class="['fav-btn', { active: isFav }]" @click="userState.toggleFavorite(spotKey)">
            {{ isFav ? '★ Favorited' : '☆ Favorite' }}
          </button>
          <div class="prog-selector">
            <button
              v-for="(label, idx) in progressLabels"
              :key="idx"
              :class="['prog-opt', { active: prog === idx }]"
              @click="userState.setProgress(spotKey, idx as 0|1|2)"
            >{{ label }}</button>
          </div>
        </div>
      </div>

      <SectionBlock title="站位 (Position)" :steps="spot.steps.position" :images="spot.media.position" />
      <SectionBlock title="描点 (Aim)" :steps="spot.steps.aim" :images="spot.media.aim" />
      <SectionBlock
        title="投法 (Throw)"
        :steps="[...spot.steps.throw.text, ...(spot.steps.throw.timingNote ? ['⏱ ' + spot.steps.throw.timingNote] : []), '方式: ' + spot.steps.throw.method]"
        :images="[]"
        :show-images="false"
      />
      <SectionBlock title="效果 (Effect)" :steps="[]" :images="spot.media.effect" />

      <div class="spot-nav">
        <button v-if="prevId" class="btn nav-btn" @click="navigate(prevId)">← Prev</button>
        <span v-else class="nav-placeholder" />
        <router-link :to="`/map/${mapId}`" class="btn">Map</router-link>
        <button v-if="nextId" class="btn nav-btn" @click="navigate(nextId)">Next →</button>
        <span v-else class="nav-placeholder" />
      </div>
    </template>
  </div>
</template>
