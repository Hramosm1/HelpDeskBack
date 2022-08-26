import * as z from "zod"
import { CompleteTickets, relatedTicketsModel } from "./index"

export const prioridadesModel = z.object({
  id: z.number().int(),
  nombre: z.string(),
  color: z.string(),
  activo: z.boolean().nullish(),
})

export interface CompletePrioridades extends z.infer<typeof prioridadesModel> {
  Tickets: CompleteTickets[]
}

/**
 * relatedPrioridadesModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedPrioridadesModel: z.ZodSchema<CompletePrioridades> = z.lazy(() => prioridadesModel.extend({
  Tickets: relatedTicketsModel.array(),
}))
