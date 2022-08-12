import * as z from "zod"
import { CompleteTickets, relatedTicketsModel } from "./index"

export const comentariosModel = z.object({
  id: z.string().optional(),
  idTicket: z.number().int(),
  idUsuario: z.string(),
  comentario: z.string(),
  fecha: z.date().nullish().optional(),
  ComentarioDeCierre: z.boolean().nullish().optional(),
})

export interface CompleteComentarios extends z.infer<typeof comentariosModel> {
  Tickets: CompleteTickets
}

/**
 * relatedComentariosModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedComentariosModel: z.ZodSchema<CompleteComentarios> = z.lazy(() => comentariosModel.extend({
  Tickets: relatedTicketsModel,
}))
