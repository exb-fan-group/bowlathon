import { z } from 'zod'

/** Body of `PUT /api/games/:id`. The server computes the score of `frames` games itself. */
export const SaveGame = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('frames'),
    baseVersion: z.number().int(),
    rolls: z.array(z.number().int().min(0).max(10)).max(21),
  }),
  z.object({
    mode: z.literal('total'),
    baseVersion: z.number().int(),
    score: z.number().int().min(0).max(300),
  }),
])
export type SaveGame = z.infer<typeof SaveGame>
