import { NextFunction, Request, Response } from 'express'
import { BadRequest } from "http-errors"
import { prisma } from '../database'
import { bodyPersonalDeSoporte } from '../interfaces/interface-personalDeSoporte'
import { personalDeSoporteModel } from '../interfaces/zod'
export class Personaldesoporte {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const rows = await prisma.personalDeSoporte.findMany()
            res.send(rows)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const row = await prisma.personalDeSoporte.findUnique({ where: { idUsuario: id } })
            res.send(row)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = personalDeSoporteModel.parse(req.body)
            const result = await prisma.personalDeSoporte.create({ data })
            res.status(201).send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async deleteById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const result = await prisma.personalDeSoporte.delete({ where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}