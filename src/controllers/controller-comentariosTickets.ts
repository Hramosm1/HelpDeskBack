import { Request, Response } from 'express'
import { prisma } from "../database";
export class Comentariostickets {

    async getById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const result = await prisma.$queryRaw`SELECT id, nombre, usuario, idTicket, idUsuario, fecha, comentario FROM VW_Comentarios WHERE idTicket = ${id} ORDER BY fecha ASC`
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const data = req.body
        try {
            const result = await prisma.comentarios.create({ data })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}