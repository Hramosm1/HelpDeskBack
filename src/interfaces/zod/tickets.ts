import * as z from "zod"
import { CompletePersonalDeSoporte, relatedPersonalDeSoporteModel, CompleteEstados, relatedEstadosModel, CompletePrioridades, relatedPrioridadesModel, CompleteCategoriasPorTickets, relatedCategoriasPorTicketsModel, CompleteComentarios, relatedComentariosModel, CompleteDocumentoPorTicket, relatedDocumentoPorTicketModel, CompletelogTickets, relatedlogTicketsModel } from "./index"

export const ticketsModel = z.object({
  id: z.number().int(),
  titulo: z.string(),
  descripcion: z.string().nullish(),
  solicitudDe: z.string(),
  asignadoA: z.number().int().nullish(),
  idPrioridad: z.number().int(),
  idEstado: z.number().int(),
  fechaSolicitud: z.date().nullish(),
  activo: z.boolean().nullish(),
  Calificacion: z.number().int().nullish(),
})

export interface CompleteTickets extends z.infer<typeof ticketsModel> {
  PersonalDeSoporte?: CompletePersonalDeSoporte | null
  Estados: CompleteEstados
  Prioridades: CompletePrioridades
  CategoriasPorTickets: CompleteCategoriasPorTickets[]
  Comentarios: CompleteComentarios[]
  DocumentoPorTicket: CompleteDocumentoPorTicket[]
  logTickets: CompletelogTickets[]
}

/**
 * relatedTicketsModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTicketsModel: z.ZodSchema<CompleteTickets> = z.lazy(() => ticketsModel.extend({
  PersonalDeSoporte: relatedPersonalDeSoporteModel.nullish(),
  Estados: relatedEstadosModel,
  Prioridades: relatedPrioridadesModel,
  CategoriasPorTickets: relatedCategoriasPorTicketsModel.array(),
  Comentarios: relatedComentariosModel.array(),
  DocumentoPorTicket: relatedDocumentoPorTicketModel.array(),
  logTickets: relatedlogTicketsModel.array(),
}))
