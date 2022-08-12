import * as z from "zod"

export const notificacionesModel = z.object({
  id: z.string().optional(),
  icono: z.string().nullish(),
  titulo: z.string(),
  descripcion: z.string(),
  fecha: z.date().nullish().optional(),
  visto: z.boolean().nullish().optional(),
  link: z.string().nullish(),
  redirecciona: z.boolean(),
  idUsuario: z.string(),
})
