<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div id="app-root">
    <nav class="nav-bar">
      <RouterLink to="/" class="nav-brand">🎯 CS Utility Trainer</RouterLink>
      <div class="nav-links">
        <RouterLink to="/" class="nav-link">Maps</RouterLink>
        <RouterLink to="/favorites" class="nav-link">★ Favorites</RouterLink>
        <RouterLink to="/progress" class="nav-link">Progress</RouterLink>
      </div>
    </nav>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>
