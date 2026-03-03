import { createRouter, createWebHashHistory } from 'vue-router'
import MapsPage from '../pages/MapsPage.vue'
import MapSpotsPage from '../pages/MapSpotsPage.vue'
import SpotDetailPage from '../pages/SpotDetailPage.vue'
import FavoritesPage from '../pages/FavoritesPage.vue'
import ProgressPage from '../pages/ProgressPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: MapsPage },
    { path: '/map/:mapId', component: MapSpotsPage },
    { path: '/map/:mapId/spot/:spotId', component: SpotDetailPage },
    { path: '/favorites', component: FavoritesPage },
    { path: '/progress', component: ProgressPage }
  ]
})

export default router
