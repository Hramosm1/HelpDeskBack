import * as z from "zod"
import { CompleteTickets, relatedTicketsModel } from "./index"

export const documentoPorTicketModel = z.object({
  id: z.string().optional(),
  idTicket: z.number().int(),
  enlace: z.string(),
  tipoDocumento: z.string().nullish().optional(),
})

export interface CompleteDocumentoPorTicket extends z.infer<typeof documentoPorTicketModel> {
  Tickets: CompleteTickets
}

/**
 * relatedDocumentoPorTicketModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedDocumentoPorTicketModel: z.ZodSchema<CompleteDocumentoPorTicket> = z.lazy(() => documentoPorTicketModel.extend({
  Tickets: relatedTicketsModel,
}))
