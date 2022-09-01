import * as z from "zod"
import { CompleteNotificacionesPorRol, relatedNotificacionesPorRolModel } from "./index"

export const tiposNotificacionModel = z.object({
  id: z.number().int().optional(),
  nombre: z.string(),
})

export interface CompleteTiposNotificacion extends z.infer<typeof tiposNotificacionModel> {
  NotificacionesPorRol: CompleteNotificacionesPorRol[]
}

/**
 * relatedTiposNotificacionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTiposNotificacionModel: z.ZodSchema<CompleteTiposNotificacion> = z.lazy(() => tiposNotificacionModel.extend({
  NotificacionesPorRol: relatedNotificacionesPorRolModel.array(),
}))
