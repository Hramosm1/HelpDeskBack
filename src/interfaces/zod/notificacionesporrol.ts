import * as z from "zod"
import { CompleteTiposNotificacion, relatedTiposNotificacionModel } from "./index"

export const notificacionesPorRolModel = z.object({
  id: z.number().int(),
  idRol: z.number().int(),
  idTipoNotificacion: z.number().int(),
  activo: z.boolean().nullish(),
})

export interface CompleteNotificacionesPorRol extends z.infer<typeof notificacionesPorRolModel> {
  TiposNotificacion: CompleteTiposNotificacion
}

/**
 * relatedNotificacionesPorRolModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedNotificacionesPorRolModel: z.ZodSchema<CompleteNotificacionesPorRol> = z.lazy(() => notificacionesPorRolModel.extend({
  TiposNotificacion: relatedTiposNotificacionModel,
}))
