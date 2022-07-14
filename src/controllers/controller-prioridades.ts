import { Request, Response } from 'express'
import { prisma } from '../database'
import { bodyPrioridades } from "../interfaces/interface-prioridades";
export class Prioridades {
    async getAll(req: Request, res: Response) {
        try {
            const result = await prisma.prioridades.findMany({
                select: { id: true, nombre: true, color: true, activo: true },
                where: { activo: true }
            })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async getById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const result = await prisma.prioridades.findFirst({
                select: { id: true, nombre: true, color: true, activo: true },
                where: { id: Number(id) }
            })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const data: bodyPrioridades = req.body
        try {
            const result = await prisma.prioridades.create({ data })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async editById(req: Request, res: Response) {
        const { id } = req.params
        const data: bodyPrioridades = req.body
        try {
            const result = await prisma.prioridades.update({ data, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async deleteById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const result = await prisma.prioridades.update({ data: { activo: false }, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}