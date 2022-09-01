import * as z from "zod"
import { CompleteComentarios, relatedComentariosModel } from "./index"

export const tiposComentarioModel = z.object({
  id: z.number().int().optional(),
  tipo: z.string(),
})

export interface CompleteTiposComentario extends z.infer<typeof tiposComentarioModel> {
  Comentarios: CompleteComentarios[]
}

/**
 * relatedTiposComentarioModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTiposComentarioModel: z.ZodSchema<CompleteTiposComentario> = z.lazy(() => tiposComentarioModel.extend({
  Comentarios: relatedComentariosModel.array(),
}))
