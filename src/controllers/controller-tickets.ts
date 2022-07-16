import { Request, Response } from 'express'
import { prisma } from '../database'
import { setQueryFromTickets } from '../core/utils';
export class Tickets {
    async getAll(req: Request, res: Response) {
        console.log(req.url, req.baseUrl)
        const take = Number(req.params.take)
        const page = Number(req.params.page)
        const skip = take * page
        console.log(req.query)
        let where = setQueryFromTickets(req.query)
        console.log(where)
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
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const { titulo, descripcion, prioridad, estado, categorias, solicitudDe, asignadoA } = req.body
        const ncategorias = categorias.map((id: number) => ({ idSubCategoria: id }))
        try {
            const result = await prisma.tickets.create({
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