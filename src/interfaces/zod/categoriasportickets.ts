import * as z from "zod"
import { CompleteSubCategorias, relatedSubCategoriasModel, CompleteTickets, relatedTicketsModel } from "./index"

export const categoriasPorTicketsModel = z.object({
  id: z.number().int(),
  idTicket: z.number().int(),
  idSubCategoria: z.number().int(),
})

export interface CompleteCategoriasPorTickets extends z.infer<typeof categoriasPorTicketsModel> {
  SubCategorias: CompleteSubCategorias
  Tickets: CompleteTickets
}

/**
 * relatedCategoriasPorTicketsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCategoriasPorTicketsModel: z.ZodSchema<CompleteCategoriasPorTickets> = z.lazy(() => categoriasPorTicketsModel.extend({
  SubCategorias: relatedSubCategoriasModel,
  Tickets: relatedTicketsModel,
}))
