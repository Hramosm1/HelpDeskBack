import { Handler, NextFunction, Request, Response } from 'express';
import { BadRequest, Forbidden, NotFound } from "http-errors";
import { prisma } from '../database';
import { setQueryFromTickets } from '../core/utils';
import { uniq } from "lodash";
import { app } from "../app";
import { z } from "zod";


import { NotificationsUtil } from '../core/notificaciones.util';

export class Tickets {
    getAll: Handler = async (req, res, next) => {
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
    };
    getById: Handler = async (req, res, next) => {
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
    create: Handler = async (req, res, next) => {
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
    editById = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params
        const body = z.object({
            asignadoA: z.number(),
            idEstado: z.number().optional()
        })
        try {
            let data = body.parse(req.body)
            const estado = await prisma.tickets.findUnique({
                select: { idEstado: true },
                where: { id: Number(id) }
            })
            if (estado!.idEstado === 1) data.idEstado = 3
            const result = await prisma.tickets.update({ data, where: { id: Number(id) } })
            if (data.asignadoA) await NotificationsUtil
                .createNotificationForAsignation(data.asignadoA, Number(id))
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    };
    cerrarTicket: Handler = async (req, res, next) => {
        const { id } = req.params
        const { comentario, idUsuario, activo } = req.body
        try {
            const ticket = await prisma.tickets.update({
                data: { idEstado: activo ? 4 : 2, activo },
                where: {
                    id: Number(id)
                }
            })
            await prisma.comentarios.create({
                data: {
                    comentario,
                    idUsuario,
                    idTicket: Number(id),
                    tipo: activo ? 3 : 2,
                    ComentarioDeCierre: true
                }
            })
            await ticket.activo ?
                NotificationsUtil.createNotificationFroReOpenTicket(idUsuario, Number(id)) :
                NotificationsUtil.createNotificationForTicketCloset(idUsuario, Number(id))

            res.send(ticket)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    getToQualify: Handler = async (req, res, next) => {
        try {
            const result = await prisma.tickets.findMany({
                where: {
                    AND: [{ activo: false }, { Calificacion: 0 }]
                }
            })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    calificar: Handler = async (req, res, next) => {

        const idUsuario = req.params.idUsuario
        const idTicket = Buffer.from(req.params.idTicket, 'base64url').toString()


        try {
            const body = z.object({ calificacion: z.number(), comentario: z.string() }).parse(req.body)
            const ticket = await prisma.tickets.findUnique({
                select: { solicitudDe: true },
                where: { id: Number(idTicket) }
            })
            if (ticket) {
                if (ticket.solicitudDe === idUsuario) {
                    await prisma.tickets.update({
                        where: { id: Number(idTicket) },
                        data: { Calificacion: body.calificacion }
                    })
                    await prisma.comentarios.create({
                        data: {
                            idTicket: Number(idTicket),
                            idUsuario,
                            comentario: body.comentario,
                            ComentarioDeCierre: true,
                            tipo: 4
                        }
                    })
                    await prisma.notificaciones.updateMany({
                        data: { activo: false },
                        where: { link: { equals: `tickets/qualify/${req.params.idTicket}` } }
                    })
                    res.status(201).send({ message: 'Calificacion enviada' })
                } else {
                    next(new Forbidden('Solo el usuario que creo el ticket puede calificarlo'))
                }
            } else {
                next(new NotFound('no se encontro el ticket'))
            }
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}