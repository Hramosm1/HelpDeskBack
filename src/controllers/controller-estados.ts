import { NextFunction, Request, Response } from 'express'
import { BadRequest } from "http-errors"
import { bodyEstados } from "../interfaces/interface-estados";
import { prisma } from '../database';
import { estadosModel } from '../interfaces/zod';
export class Estados {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await prisma.estados.findMany({
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
            const result = await prisma.estados.findFirst({
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
            const data = estadosModel.parse(req.body)
            const result = await prisma.estados.create({ data })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async editById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const data: bodyEstados = req.body
        try {
            const result = await prisma.estados.update({ data, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async deleteById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const result = await prisma.estados.update({ data: { activo: false }, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}