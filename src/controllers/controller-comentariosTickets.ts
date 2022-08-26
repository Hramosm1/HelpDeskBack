import {NextFunction, Request, Response} from 'express'
import {BadRequest} from "http-errors"
import {prisma} from "../database";
import {app} from '../app'
import {NotificationsUtil} from '../core/notificaciones.util';

export class Comentariostickets {

    async getById(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        try {
            const result = await prisma.$queryRaw`SELECT
                c.id, 
                u.nombre, 
                u.usuario, 
                c.idTicket,
                c.idUsuario,
                c.fecha,
                c.comentario,
                c.ComentarioDeCierre, 
                tc.tipo
            FROM Comentarios c
            INNER JOIN TiposComentario tc ON tc.id = c.tipo
            INNER JOIN Autenticacion.dbo.Usuarios u ON u.id = c.idUsuario
            WHERE c.idTicket = ${id}
                ORDER BY fecha ASC`
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body
            const result = await prisma.comentarios.create({data})
            await NotificationsUtil.createNotificationForComent(data.idTicket, data.idUsuario)
            app.io.emit('nuevoComentario', null)
            res.status(201).send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}