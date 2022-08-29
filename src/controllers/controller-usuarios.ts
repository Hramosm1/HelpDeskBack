import { NextFunction, Request, Response } from 'express'
import { BadRequest } from "http-errors"
import { prisma } from "../database";
export class Usuarios {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarios = await prisma.tickets.findMany({ distinct: ['solicitudDe'], select: { solicitudDe: true } })
      const strUs = usuarios.map(({ solicitudDe }) => `'${solicitudDe}'`).join(',')
      const result = await prisma
        .$queryRawUnsafe(`SELECT id, nombre 
      FROM Autenticacion.dbo.Usuarios 
      WHERE id IN (${strUs})`)
      res.send(result)
    } catch (ex: any) {
      next(new BadRequest(ex))
    }
  }
}