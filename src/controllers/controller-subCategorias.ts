import { NextFunction, Request, Response } from 'express'
import { BadRequest } from "http-errors"
import { prisma } from '../database'
import { bodySubcategoria } from '../interfaces/interface-subCategorias'
import { subCategoriasModel } from '../interfaces/zod'
export class Subcategorias {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await prisma.subCategorias.findMany({
                select: {
                    id: true,
                    nombre: true,
                    Categorias: {
                        select: {
                            id: true,
                            nombre: true
                        }
                    }
                },
                where: { activo: true }
            })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async getById(req: Request, res: Response, next: NextFunction) {
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
            next(new BadRequest(ex))
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = subCategoriasModel.parse(req.body)
            const result = await prisma.subCategorias.create({ data })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async editById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const data: bodySubcategoria = req.body
        try {
            const result = await prisma.subCategorias.update({ data, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async deleteById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const result = await prisma.subCategorias.update({ data: { activo: false }, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}