import * as z from "zod"

export const notificacionesPorRolModel = z.object({
  id: z.number().int().optional(),
  idRol: z.number().int(),
  idTipoNotificacion: z.number().int(),
  activo: z.boolean().nullish().optional(),
})
