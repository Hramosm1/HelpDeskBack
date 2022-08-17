import { NextFunction, Request, Response } from 'express'
import { BadRequest } from "http-errors"
import { prisma } from '../database'
import { setQueryFromTickets } from '../core/utils';
import { uniq } from "lodash";
import { app } from "../app";
import { NotificationsUtil } from '../core/notificaciones.util';
export class Tickets {
    async getAll(req: Request, res: Response, next: NextFunction) {
        const take = Number(req.params.take)
        const page = Number(req.params.page)
        const skip = take * page
        let where = setQueryFromTickets(req.query)
        try {
            const tickets = await prisma.tickets.findMany({
                select: {
                    id: true,
                    titulo: true,
                    solicitudDe: true,
                    fechaSolicitud: true,
                    activo: true,
                    Prioridades: { select: { nombre: true, color: true } },
                    Estados: { select: { nombre: true } },
                    PersonalDeSoporte: { select: { idUsuario: true, nombre: true } },
                    Comentarios: {
                        select: {
                            id: true
                        }
                    }
                },
                take,
                skip,
                where,
                orderBy: [{ activo: 'desc' }, { id: 'desc' }]
            })
            const ids = uniq(tickets.map(({ solicitudDe }) => `'${solicitudDe}'`)).join(', ')
            const users: any[] = await prisma.$queryRawUnsafe(`SELECT id, nombre FROM Autenticacion.dbo.Usuarios u WHERE id in (${ids})`)
            const rows = tickets.map(val => {
                let newRow: any = val
                newRow.solicitudDe = users.find(us => us.id === val.solicitudDe)
                newRow.Comentarios = val.Comentarios.length
                return newRow
            })
            const count = await prisma.tickets.count({ where })
            res.send({ count, rows })
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        let result
        try {
            const tickets = await prisma.tickets.findUnique({
                include: {
                    PersonalDeSoporte: true,
                    Prioridades: true,
                    Estados: true,
                },
                where: { id: Number(id) }
            })
            if (tickets) {
                const nombreSolicitante = await prisma.$queryRaw`SELECT id, nombre FROM Autenticacion.dbo.Usuarios WHERE id=${tickets.solicitudDe}`
                result = { ...tickets, nombreSolicitante }
            }
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        const { titulo, descripcion, prioridad, estado, categorias, solicitudDe, asignadoA } = req.body
        const ncategorias = categorias.map((id: number) => ({ idSubCategoria: id }))
        try {
            const ticket = await prisma.tickets.create({
                data: {
                    titulo,
                    descripcion,
                    idPrioridad: prioridad,
                    idEstado: estado,
                    solicitudDe,
                    asignadoA,
                    CategoriasPorTickets: { createMany: { data: ncategorias } }
                }
            })
            await NotificationsUtil
                .createNotificationForNewTicket(ticket.titulo, ticket.id, ticket.solicitudDe)
            if (ticket.asignadoA) await NotificationsUtil
                .createNotificationForAsignation(ticket.asignadoA, ticket.id)
            app.io.emit('nuevoTicket')
            res.status(201).send(ticket)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async cerrarTicket(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { comentario, idEstado, idUsuario, activo } = req.body
        try {
            const ticket = await prisma.tickets.update({
                data: { idEstado, activo },
                where: {
                    id: Number(id)
                }
            })
            await prisma.comentarios.create({
                data: {
                    comentario,
                    idUsuario,
                    idTicket: Number(id),
                    ComentarioDeCierre: true
                }
            })
            if (!ticket.activo) await NotificationsUtil
                .createNotificationForTicketCloset(idUsuario, Number(id))
            res.send(ticket)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    async editById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const data = req.body
        try {
            const result = await prisma.tickets.update({ data, where: { id: Number(id) } })
            if (data.solicitudDe) await NotificationsUtil
                .createNotificationForAsignation(data.solicitudDe, Number(id))
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}