import {RequestHandler} from 'express'
import {prisma} from "../database";
import {NotFound, BadRequest} from 'http-errors'
import {getFirstAndLastDateByMonth, GetPrismaFilterByMonth} from '../core/utils';
import {groupBy, omitBy} from 'lodash';
import {number} from "zod";

export class Dashboard {
    getStats: RequestHandler = async (req, res, next) => {
        const {mes} = req.params;
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
                month(fechaSolicitud) = ${mes}
            GROUP BY pds.nombre`;
            const ticketsActivos = ticketsPorUsuario.reduce((prev, cur) => (prev + cur.activos), 0)
            const ticketsCerrados = ticketsPorUsuario.reduce((prev, cur) => (prev + cur.cerrados), 0)
            res.send({ticketsPorUsuario, ticketsActivos, ticketsCerrados})
        } catch (ex: any) {
            next(new NotFound(ex))
        }
    }
    getAverage: RequestHandler = async (req, res, next) => {
        const {mes} = req.params
        try {
            const result: { personal: string, tiempoPromedio: number }[] = await prisma.$queryRaw`SP_GetAverageTimeForTickets ${mes}`
            res.send(result)
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