import { z } from 'zod'

export const UtilityTypeSchema = z.enum(['smoke', 'flash', 'molotov', 'he'])
export type UtilityType = z.infer<typeof UtilityTypeSchema>

export const SideSchema = z.enum(['T', 'CT', 'Any'])
export type Side = z.infer<typeof SideSchema>

export const DifficultySchema = z.enum(['easy', 'medium', 'hard'])
export type Difficulty = z.infer<typeof DifficultySchema>

export const ThrowMethodSchema = z.enum(['left', 'right', 'both', 'jumpthrow', 'runthrow', 'walkthrow', 'crouchthrow', 'custom'])
export type ThrowMethod = z.infer<typeof ThrowMethodSchema>

export const MediaItemSchema = z.object({
  src: z.string().startsWith('/assets/'),
  caption: z.string().optional()
})
export type MediaItem = z.infer<typeof MediaItemSchema>

export const MapSchema = z.object({
  id: z.string(),
  name: z.string(),
  thumbnail: z.string(),
  spotsFile: z.string(),
  radar: z.string().optional()
})
export type Map = z.infer<typeof MapSchema>

export const SpotSchema = z.object({
  id: z.string(),
  title: z.string(),
  utilityType: UtilityTypeSchema,
  side: SideSchema,
  difficulty: DifficultySchema,
  tags: z.array(z.string()),
  media: z.object({
    position: z.array(MediaItemSchema).min(1).max(2),
    aim: z.array(MediaItemSchema).min(1).max(2),
    effect: z.array(MediaItemSchema).length(1)
  }),
  steps: z.object({
    position: z.array(z.string()),
    aim: z.array(z.string()),
    throw: z.object({
      method: ThrowMethodSchema,
      text: z.array(z.string()),
      timingNote: z.string().optional()
    })
  }),
  summary: z.string().optional(),
  area: z.string().optional(),
  order: z.number().optional(),
  updatedAt: z.string().optional(),
  location: z.object({
    radarX: z.number(),
    radarY: z.number()
  }).optional()
})
export type Spot = z.infer<typeof SpotSchema>

export interface ValidationError {
  kind: string
  mapId: string
  spotId?: string
  path: string
  message: string
}
