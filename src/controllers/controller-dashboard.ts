import {RequestHandler} from 'express'
import {prisma} from "../database";
import {NotFound, BadRequest} from 'http-errors'
import {getFirstAndLastDateByMonth, GetPrismaFilterByMonth} from '../core/utils';
import {groupBy, omitBy} from 'lodash';

export class Dashboard {
    getStats: RequestHandler = async (req, res, next) => {
        GetPrismaFilterByMonth('fechaSolicitud', Number(req.params.mes));
        const {firstDay, lastDay} = getFirstAndLastDateByMonth(Number(req.params.mes))
        try {
            const ticketsPorUsuario: { personal: string, activos: number, cerrados: number }[] = await prisma.$queryRaw`
            SELECT
                pds.nombre personal,
                SUM(CASE WHEN t.activo = 1 THEN 1 ELSE 0 END) AS activos,
                SUM(CASE WHEN t.activo = 0 THEN 1 ELSE 0 END) AS cerrados
            FROM Tickets t
            INNER JOIN PersonalDeSoporte pds 
                on pds.id = t.asignadoA
            WHERE
                fechaSolicitud > ${firstDay} AND
                fechaSolicitud < ${lastDay}
            GROUP BY pds.nombre`;
            const ticketsActivos = ticketsPorUsuario.reduce((prev, cur) => (prev + cur.activos), 0)
            const ticketsCerrados = ticketsPorUsuario.reduce((prev, cur) => (prev + cur.cerrados), 0)
            res.send({ticketsPorUsuario, ticketsActivos, ticketsCerrados})
        } catch (ex: any) {
            next(new NotFound(ex))
        }
    }
    getAverage: RequestHandler = async (req, res, next) => {
        let where = GetPrismaFilterByMonth('fecha', Number(req.params.mes))
        const AND: any = where.AND
        AND!.push({PersonalDeSoporte: {activo: true}})
        try {
            const data = await prisma.logTickets.findMany({
                select: {

                    idTicket: true,
                    fecha: true,
                    accion: true,
                    PersonalDeSoporte: {
                        select: {
                            nombre: true
                        }
                    }
                },
                where: {AND, OR: [{accion: 'Nuevo ticket'}, {accion: 'Cierre de ticket'}]},
                orderBy: {accion: 'desc'}
            })
            if (data.length > 0) {
                const grouping = groupBy(data, 'idTicket')
                const omitiendoTicketsNoCerrados = omitBy(grouping, k => k.length === 1)
                const result = []
                for (const key in omitiendoTicketsNoCerrados) {
                    if (Object.prototype.hasOwnProperty.call(omitiendoTicketsNoCerrados, key)) {
                        const val = omitiendoTicketsNoCerrados[key];
                        const fechaCreacion = val[0].fecha!.getTime()
                        const fechaCierre = val[1].fecha!.getTime()
                        const tiempoAbierto = Math.floor((fechaCierre - fechaCreacion) / (1000))
                        result.push({
                            personal: val[1].PersonalDeSoporte?.nombre || 'No asignado',
                            tiempoAbierto,
                            ticket: key
                        })
                    }
                }
                res.send(result);
            } else {
                res.send([])
            }
        } catch (ex: any) {
            next(new NotFound(ex))
        }

    }
    getGraph: RequestHandler = async (req, res, next) => {
        GetPrismaFilterByMonth('fecha', Number(req.params.mes));
        try {
            const data = await prisma.$queryRaw`
                SELECT * 
                FROM VW_LogTicketsPorDia 
                WHERE MONTH (dia) = ${req.params.mes} AND
                    (accion = 'cierre de ticket' OR accion = 'nuevo ticket') ORDER BY dia`
            res.send(data)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}