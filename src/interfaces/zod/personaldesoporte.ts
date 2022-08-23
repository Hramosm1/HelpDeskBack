import * as z from "zod"
import { CompletelogTickets, relatedlogTicketsModel, CompleteTickets, relatedTicketsModel } from "./index"

export const personalDeSoporteModel = z.object({
  id: z.number().int().optional(),
  idUsuario: z.string(),
  nombre: z.string().nullish(),
  activo: z.boolean().nullish().optional(),
})

export interface CompletePersonalDeSoporte extends z.infer<typeof personalDeSoporteModel> {
  logTickets: CompletelogTickets[]
  Tickets: CompleteTickets[]
}

/**
 * relatedPersonalDeSoporteModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedPersonalDeSoporteModel: z.ZodSchema<CompletePersonalDeSoporte> = z.lazy(() => personalDeSoporteModel.extend({
  logTickets: relatedlogTicketsModel.array(),
  Tickets: relatedTicketsModel.array(),
}))
