import { Request, Response } from 'express'
import { prisma } from '../database'
import { setQueryFromTickets } from '../core/utils';
export class Tickets {
    async getAll(req: Request, res: Response) {
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
                },
                take,
                skip,
                where,
                orderBy: [{ activo: 'desc' }, { id: 'desc' }]
            })
            const ids = tickets.map(({ solicitudDe }) => solicitudDe).join(',')
            const users: any[] = await prisma.$queryRaw`SELECT id, nombre FROM Autenticacion.dbo.Usuarios u WHERE id in (${ids})`
            const rows = tickets.map(val => {
                val.solicitudDe = users.find(us => us.id = val.solicitudDe)
                return val
            })
            const count = await prisma.tickets.count({ where })
            res.send({ count, rows })
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async getById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const result = await prisma.$queryRaw`SELECT * FROM VW_Tickets WHERE id = ${id}`
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const { titulo, descripcion, prioridad, estado, categorias, solicitudDe, asignadoA } = req.body
        try {
            const result = await prisma.tickets.create({
                data: {
                    titulo,
                    descripcion,
                    idPrioridad: prioridad,
                    idEstado: estado,
                    solicitudDe,
                    asignadoA,
                    CategoriasPorTickets: { createMany: { data: categorias } }
                }
            })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async cerrarTicket(req: Request, res: Response) {
        const { id } = req.params
        const data = req.body
        try {
            const result = await prisma.tickets.update({ data, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async editById(req: Request, res: Response) {
        const { id } = req.params
        const data = req.body
        try {
            const result = await prisma.tickets.update({ data, where: { id: Number(id) } })
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}