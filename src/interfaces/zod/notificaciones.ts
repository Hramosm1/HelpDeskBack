import * as z from "zod"

export const notificacionesModel = z.object({
  id: z.string().optional(),
  icono: z.string().nullish(),
  titulo: z.string(),
  descripcion: z.string(),
  fecha: z.date().nullish(),
  visto: z.boolean().nullish(),
  link: z.string().nullish(),
  redirecciona: z.boolean(),
  idUsuario: z.string(),
  activo: z.boolean().nullish(),
})
