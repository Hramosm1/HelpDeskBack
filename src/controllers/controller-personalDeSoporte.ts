import { Request, Response } from 'express'
import { prisma } from '../database'
import { bodyPersonalDeSoporte } from '../interfaces/interface-personalDeSoporte'
export class Personaldesoporte {
    async getAll(req: Request, res: Response) {
        try {
            const rows = await prisma.personalDeSoporte.findMany()
            res.send(rows)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async getById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const row = await prisma.personalDeSoporte.findUnique({ where: { idUsuario: id } })
            res.send(row)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const data: bodyPersonalDeSoporte = req.body
        try {
            const result = await prisma.personalDeSoporte.create({ data })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async deleteById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const result = await prisma.personalDeSoporte.delete({ where: { idUsuario: id } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}