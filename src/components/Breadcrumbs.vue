<script setup lang="ts">
defineProps<{
  crumbs: Array<{ label: string; to?: string }>
}>()
</script>

<template>
  <nav class="breadcrumbs">
    <template v-for="(crumb, i) in crumbs" :key="i">
      <span v-if="i > 0" class="breadcrumb-sep">›</span>
      <router-link v-if="crumb.to" :to="crumb.to" class="breadcrumb-link">{{ crumb.label }}</router-link>
      <span v-else class="breadcrumb-current">{{ crumb.label }}</span>
    </template>
  </nav>
</template>
