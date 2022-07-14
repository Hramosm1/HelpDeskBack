import { Request, Response } from 'express'
import { prisma } from '../database'
import { bodySubcategoria } from '../interfaces/interface-subCategorias'
export class Subcategorias {
    async getAll(req: Request, res: Response) {
        try {
            const result = await prisma.subCategorias.findMany({
                select: {
                    id: true,
                    nombre: true,
                },
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
            const result = await prisma.subCategorias.findMany({
                select: {
                    id: true,
                    nombre: true,
                    activo: true,
                    Categorias: { select: { id: true, nombre: true } }
                },
                where: { id: Number(id) }
            })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const data: bodySubcategoria = req.body
        try {
            const result = await prisma.subCategorias.create({ data })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async editById(req: Request, res: Response) {
        const { id } = req.params
        const data: bodySubcategoria = req.body
        try {
            const result = await prisma.subCategorias.update({ data, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async deleteById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const result = await prisma.subCategorias.update({ data: { activo: false }, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}