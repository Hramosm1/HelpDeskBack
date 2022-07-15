import { Prisma } from "@prisma/client";
export function setQueryFromTickets(query: any): Prisma.TicketsWhereInput {
  let AND: Prisma.Enumerable<Prisma.TicketsWhereInput> = []
  for (const key in query) {
    switch (key) {
      case 'PersonalDeSoporte':
        AND.push({ PersonalDeSoporte: { idUsuario: { in: query[key] } } })
        break;
      case 'asignadoA':
        AND.push({ [key]: { in: query[key].map((id: string) => Number(id)) } })
        break;
      case 'id':
        AND.push({ [key]: { equals: Number(query[key]) } })
        break;
      case 'titulo':
        AND.push({ [key]: { contains: query[key] } })
        break;
      case 'desde':
        AND.push({ fechaSolicitud: { gte: query[key] } })
        break;
      case 'hasta':
        AND.push({ fechaSolicitud: { lte: query[key] } })
        break;
      case 'idEstado':
        AND.push({ [key]: { in: query[key].map((id: string) => Number(id)) } })
        break;
      case 'idPrioridad':
        AND.push({ [key]: { in: query[key].map((id: string) => Number(id)) } })
        break;
      case 'activo':
        AND.push({ [key]: { equals: query[key] === 'true' ? true : false } })
        break;
      default:
        AND.push({ [key]: { in: query[key] } })
        break;
    }
  }
  const where: Prisma.TicketsWhereInput = { AND }
  return where
}