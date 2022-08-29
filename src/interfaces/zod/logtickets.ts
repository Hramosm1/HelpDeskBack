import * as z from "zod"
import { CompleteEstados, relatedEstadosModel, CompleteTickets, relatedTicketsModel, CompletePersonalDeSoporte, relatedPersonalDeSoporteModel } from "./index"

export const logTicketsModel = z.object({
  id: z.string(),
  idTicket: z.number().int(),
  idEstado: z.number().int(),
  idUsuarioAccion: z.string(),
  idUsuarioAsignado: z.number().int().nullish(),
  accion: z.string(),
  fecha: z.date().nullish(),
})

export interface CompletelogTickets extends z.infer<typeof logTicketsModel> {
  Estados: CompleteEstados
  Tickets: CompleteTickets
  PersonalDeSoporte?: CompletePersonalDeSoporte | null
}

/**
 * relatedlogTicketsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedlogTicketsModel: z.ZodSchema<CompletelogTickets> = z.lazy(() => logTicketsModel.extend({
  Estados: relatedEstadosModel,
  Tickets: relatedTicketsModel,
  PersonalDeSoporte: relatedPersonalDeSoporteModel.nullish(),
}))
