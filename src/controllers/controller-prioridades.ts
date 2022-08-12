import { NextFunction, Request, Response } from 'express'
import { BadRequest } from "http-errors"
import { prisma } from '../database'
import { bodyPrioridades } from "../interfaces/interface-prioridades";
import { prioridadesModel } from '../interfaces/zod';
export class Prioridades {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await prisma.prioridades.findMany({
                select: { id: true, nombre: true, color: true, activo: true },
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
            const result = await prisma.prioridades.findFirst({
                select: { id: true, nombre: true, color: true, activo: true },
                where: { id: Number(id) }
            })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = prioridadesModel.parse(req.body)
            const result = await prisma.prioridades.create({ data })
            res.status(201).send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async editById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const data: bodyPrioridades = req.body
        try {
            const result = await prisma.prioridades.update({ data, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async deleteById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const result = await prisma.prioridades.update({ data: { activo: false }, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}