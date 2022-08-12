import * as z from "zod"
import { CompletelogTickets, relatedlogTicketsModel, CompleteTickets, relatedTicketsModel } from "./index"

export const estadosModel = z.object({
  id: z.number().int().optional(),
  nombre: z.string(),
  activo: z.boolean().nullish().optional(),
})

export interface CompleteEstados extends z.infer<typeof estadosModel> {
  logTickets: CompletelogTickets[]
  Tickets: CompleteTickets[]
}

/**
 * relatedEstadosModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedEstadosModel: z.ZodSchema<CompleteEstados> = z.lazy(() => estadosModel.extend({
  logTickets: relatedlogTicketsModel.array(),
  Tickets: relatedTicketsModel.array(),
}))
