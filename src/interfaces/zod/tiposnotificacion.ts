import * as z from "zod"

export const tiposNotificacionModel = z.object({
  id: z.number().int().optional(),
  nombre: z.string(),
})
