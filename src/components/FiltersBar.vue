<script setup lang="ts">
import { computed } from 'vue'
import type { Spot, UtilityType, Side, Difficulty } from '../types'

export interface FilterState {
  keyword: string
  utilityType: UtilityType | 'all'
  side: Side | 'all'
  difficulty: Difficulty | 'all'
  tags: string[]
  sort: 'order' | 'updatedAt' | 'difficulty' | 'recent'
  favoritesOnly: boolean
}

const props = defineProps<{
  spots: Spot[]
  mapId: string
  modelValue: FilterState
}>()

const emit = defineEmits<{
  'update:modelValue': [FilterState]
}>()

const allTags = computed(() => {
  const set = new Set<string>()
  for (const spot of props.spots) spot.tags.forEach(t => set.add(t))
  return [...set].sort()
})

function update(patch: Partial<FilterState>) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}

function clearFilters() {
  emit('update:modelValue', {
    keyword: '',
    utilityType: 'all',
    side: 'all',
    difficulty: 'all',
    tags: [],
    sort: 'order',
    favoritesOnly: false
  })
}

function toggleTag(tag: string) {
  const tags = props.modelValue.tags.includes(tag)
    ? props.modelValue.tags.filter(t => t !== tag)
    : [...props.modelValue.tags, tag]
  update({ tags })
}
</script>

<template>
  <div class="filters-bar">
    <div class="filter-row">
      <input
        class="filter-input"
        type="text"
        placeholder="Search title, tags, area..."
        :value="modelValue.keyword"
        @input="update({ keyword: ($event.target as HTMLInputElement).value })"
      />
      <select class="filter-select" :value="modelValue.sort" @change="update({ sort: ($event.target as HTMLSelectElement).value as FilterState['sort'] })">
        <option value="order">Default Order</option>
        <option value="updatedAt">Recently Updated</option>
        <option value="difficulty">Difficulty</option>
        <option value="recent">Recently Viewed</option>
      </select>
    </div>
    <div class="filter-row">
      <div class="filter-group">
        <span class="filter-label">Type:</span>
        <button
          v-for="t in ['all','smoke','flash','molotov','he']"
          :key="t"
          class="filter-btn"
          :class="{ active: modelValue.utilityType === t }"
          @click="update({ utilityType: t as FilterState['utilityType'] })"
        >{{ t === 'all' ? 'All' : t }}</button>
      </div>
      <div class="filter-group">
        <span class="filter-label">Side:</span>
        <button
          v-for="s in ['all','T','CT','Any']"
          :key="s"
          class="filter-btn"
          :class="{ active: modelValue.side === s }"
          @click="update({ side: s as FilterState['side'] })"
        >{{ s === 'all' ? 'All' : s }}</button>
      </div>
      <div class="filter-group">
        <span class="filter-label">Difficulty:</span>
        <button
          v-for="d in ['all','easy','medium','hard']"
          :key="d"
          class="filter-btn"
          :class="{ active: modelValue.difficulty === d }"
          @click="update({ difficulty: d as FilterState['difficulty'] })"
        >{{ d === 'all' ? 'All' : d }}</button>
      </div>
    </div>
    <div v-if="allTags.length" class="filter-row">
      <span class="filter-label">Tags:</span>
      <div class="tag-list">
        <button
          v-for="tag in allTags"
          :key="tag"
          class="filter-btn tag-btn"
          :class="{ active: modelValue.tags.includes(tag) }"
          @click="toggleTag(tag)"
        >{{ tag }}</button>
      </div>
    </div>
    <div class="filter-row">
      <label class="filter-checkbox">
        <input type="checkbox" :checked="modelValue.favoritesOnly" @change="update({ favoritesOnly: ($event.target as HTMLInputElement).checked })" />
        Favorites only
      </label>
      <button class="clear-btn" @click="clearFilters">Clear filters</button>
    </div>
  </div>
</template>
