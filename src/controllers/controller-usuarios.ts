import { Request, Response } from 'express'
import { prisma } from "../database";
export class Usuarios {
  async getAll(req: Request, res: Response) {
    try {
      const usuarios = await prisma.tickets.findMany({ distinct: ['solicitudDe'], select: { solicitudDe: true } })
      const strUs = usuarios.map(({ solicitudDe }) => `'${solicitudDe}'`).join(',')
      const result = await prisma.$queryRawUnsafe(`SELECT id, nombre FROM Autenticacion.dbo.Usuarios WHERE id IN (${strUs})`)
      res.send(result)
    } catch (ex: any) {
      res.status(404).send({ message: 'error en la consulta', error: ex.message })
    }
  }
}