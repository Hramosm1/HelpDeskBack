import { Request, Response } from 'express'
import { bodyCategoria } from "../interfaces/interface-categorias";
import { prisma } from "../database";
export class Categorias {
    async getAll(req: Request, res: Response) {
        try {
            prisma.categorias.findMany({ select: { id: true } })
            const result = await prisma.categorias.findMany({
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
            const result = await prisma.categorias.findFirst({
                select: { id: true, nombre: true, activo: true },
                where: { id: Number(id) }
            })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const data: bodyCategoria = req.body
        try {
            const result = await prisma.categorias.create({ data })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async editById(req: Request, res: Response) {
        const { id } = req.params
        const data: bodyCategoria = req.body
        try {
            const result = await prisma.categorias.update({ data, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async deleteById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const result = await prisma.categorias.update({ data: { activo: false }, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}