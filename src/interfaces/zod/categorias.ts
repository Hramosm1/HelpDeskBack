import * as z from "zod"
import { CompleteSubCategorias, relatedSubCategoriasModel } from "./index"

export const categoriasModel = z.object({
  id: z.number().int().optional(),
  nombre: z.string(),
  activo: z.boolean().nullish().optional(),
})

export interface CompleteCategorias extends z.infer<typeof categoriasModel> {
  SubCategorias: CompleteSubCategorias[]
}

/**
 * relatedCategoriasModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCategoriasModel: z.ZodSchema<CompleteCategorias> = z.lazy(() => categoriasModel.extend({
  SubCategorias: relatedSubCategoriasModel.array(),
}))
