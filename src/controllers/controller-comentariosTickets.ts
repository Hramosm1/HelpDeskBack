import { NextFunction, Request, Response } from 'express'
import { BadRequest } from "http-errors"
import { prisma } from "../database";
import { app } from '../app'
import { comentariosModel } from '../interfaces/zod';
export class Comentariostickets {

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const result = await prisma
                .$queryRaw`SELECT * 
            FROM VW_Comentarios 
            WHERE idTicket = ${id} 
            ORDER BY fecha ASC`

            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = comentariosModel.parse(req.body)
            const result = await prisma.comentarios.create({ data })
            app.io.emit('nuevoComentario', null)
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}