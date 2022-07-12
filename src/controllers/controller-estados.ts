import { Request, Response } from 'express'
import { bodyEstados } from "../interfaces/interface-estados";
import { prisma } from '../database';
export class Estados {
    async getAll(req: Request, res: Response) {
        try {
            const result = await prisma.estados.findMany({
                select: { id: true, nombre: true },
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
            const result = await prisma.estados.findMany({
                select: { id: true, nombre: true, activo: true },
                where: { id: Number(id) }
            })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const data: bodyEstados = req.body
        try {
            const result = await prisma.estados.create({ data })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async editById(req: Request, res: Response) {
        const { id } = req.params
        const data: bodyEstados = req.body
        try {
            const result = await prisma.estados.update({ data, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async deleteById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const result = await prisma.estados.update({ data: { activo: false }, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}