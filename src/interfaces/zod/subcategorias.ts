import * as z from "zod"
import { CompleteCategorias, relatedCategoriasModel, CompleteCategoriasPorTickets, relatedCategoriasPorTicketsModel } from "./index"

export const subCategoriasModel = z.object({
  id: z.number().int().optional(),
  nombre: z.string(),
  idCategoria: z.number().int(),
  activo: z.boolean().nullish().optional(),
})

export interface CompleteSubCategorias extends z.infer<typeof subCategoriasModel> {
  Categorias: CompleteCategorias
  CategoriasPorTickets: CompleteCategoriasPorTickets[]
}

/**
 * relatedSubCategoriasModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSubCategoriasModel: z.ZodSchema<CompleteSubCategorias> = z.lazy(() => subCategoriasModel.extend({
  Categorias: relatedCategoriasModel,
  CategoriasPorTickets: relatedCategoriasPorTicketsModel.array(),
}))
