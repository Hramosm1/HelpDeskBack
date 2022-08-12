import { NextFunction, Request, Response } from 'express'
import { BadRequest } from "http-errors"
import { bodyCategoria } from "../interfaces/interface-categorias";
import { prisma } from "../database";
import { categoriasModel } from '../interfaces/zod';
export class Categorias {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            prisma.categorias.findMany({ select: { id: true } })
            const result = await prisma.categorias.findMany({
                select: { id: true, nombre: true },
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
            const result = await prisma.categorias.findFirst({
                select: { id: true, nombre: true, activo: true },
                where: { id: Number(id) }
            })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = categoriasModel.parse(req.body)
            const result = await prisma.categorias.create({ data })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async editById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const data: bodyCategoria = req.body
        try {
            const result = await prisma.categorias.update({ data, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async deleteById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const result = await prisma.categorias.update({ data: { activo: false }, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}