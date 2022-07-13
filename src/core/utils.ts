import { Prisma } from "@prisma/client";
export function setQueryFromTickets(query: any): Prisma.TicketsWhereInput {
  let AND: Prisma.Enumerable<Prisma.TicketsWhereInput> = []
  for (const key in query) {
    switch (key) {
      case 'PersonalDeSoporte':
        AND.push({ PersonalDeSoporte: { idUsuario: { equals: query[key] } } })
        break;
      case 'asignadoA':
        AND.push({ [key]: { equals: Number(query[key]) } })
        break;
      case 'activo':
        AND.push({ [key]: { equals: Boolean(query[key]) } })
        break;
      default:
        AND.push({ [key]: { equals: query[key] } })
        break;
    }
  }
  const where: Prisma.TicketsWhereInput = { AND }
  return where
}