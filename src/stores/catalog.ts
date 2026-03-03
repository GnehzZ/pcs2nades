import { defineStore } from 'pinia'
import { ref } from 'vue'
import { z } from 'zod'
import { MapSchema, SpotSchema, type Map, type Spot, type ValidationError } from '../types'

export const useCatalogStore = defineStore('catalog', () => {
  const maps = ref<Map[]>([])
  const spotsCache = ref<Record<string, Spot[]>>({})
  const loading = ref(false)
  const errors = ref<ValidationError[]>([])

  async function loadMaps() {
    loading.value = true
    errors.value = []
    try {
      const res = await fetch('/data/maps.json')
      const raw = await res.json()
      const parsed = z.array(MapSchema).safeParse(raw)
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          errors.value.push({
            kind: 'maps_schema',
            mapId: 'maps.json',
            path: issue.path.join('.'),
            message: issue.message
          })
        }
      } else {
        maps.value = parsed.data
      }
    } catch (e) {
      errors.value.push({ kind: 'maps_fetch', mapId: 'maps.json', path: '', message: String(e) })
    } finally {
      loading.value = false
    }
  }

  async function loadSpots(mapId: string) {
    if (spotsCache.value[mapId]) return
    const map = maps.value.find(m => m.id === mapId)
    if (!map) {
      errors.value.push({ kind: 'map_not_found', mapId, path: '', message: `Map ${mapId} not found` })
      return
    }
    loading.value = true
    try {
      const res = await fetch(map.spotsFile)
      const raw = await res.json()
      const parsed = z.array(SpotSchema).safeParse(raw)
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const spotId = typeof issue.path[0] === 'number' ? String(raw[issue.path[0]]?.id ?? issue.path[0]) : undefined
          errors.value.push({
            kind: 'spots_schema',
            mapId,
            spotId,
            path: issue.path.join('.'),
            message: issue.message
          })
        }
        spotsCache.value[mapId] = []
      } else {
        spotsCache.value[mapId] = parsed.data
      }
    } catch (e) {
      errors.value.push({ kind: 'spots_fetch', mapId, path: '', message: String(e) })
      spotsCache.value[mapId] = []
    } finally {
      loading.value = false
    }
  }

  return { maps, spotsCache, loading, errors, loadMaps, loadSpots }
})
