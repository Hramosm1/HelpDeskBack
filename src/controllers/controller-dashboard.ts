import {RequestHandler} from 'express'
import {prisma} from "../database";
import {NotFound, BadRequest} from 'http-errors'
import {getFirstAndLastDateByMonth, GetPrismaFilterByMonth} from '../core/utils';
import {groupBy, omitBy} from 'lodash';
import {StatsQuery} from '../interfaces/interface-dashboard';

export class Dashboard {
    getStats: RequestHandler = async (req, res, next) => {
        GetPrismaFilterByMonth('fechaSolicitud', Number(req.params.mes));
        const {firstDay, lastDay} = getFirstAndLastDateByMonth(Number(req.params.mes))
        try {
            const ticketsPorUsuario: StatsQuery[] = await prisma.$queryRaw`
      SELECT 
	      e.personalAsignado, 
	      SUM(t) activos, 
	      SUM(f) cerrados
      FROM (
        SELECT 
		      pds.nombre personalAsignado, 
		      CASE t.activo WHEN 1 THEN 1 ELSE 0 END t,
		      CASE t.activo WHEN 0 THEN 1 ELSE 0 END f
	      FROM Tickets t
	      INNER JOIN PersonalDeSoporte pds
		      ON t.asignadoA = pds.id
	      WHERE t.fechaSolicitud > ${firstDay} AND
	            t.fechaSolicitud < ${lastDay} AND
	            pds.activo = 1
      ) e
      GROUP BY e.personalAsignado`
            let ticketsActivos = 0
            let ticketsCerrados = 0
            ticketsPorUsuario.forEach(({activos, cerrados}) => {
                ticketsActivos += activos
                ticketsCerrados += cerrados
            });
            //*************OPTIENE LOS TICKETS AGRUPADOS POR ASIGNACION Y ACTIVO */
            res.send({ticketsActivos, ticketsCerrados, ticketsPorUsuario, firstDay, lastDay})

        } catch (ex: any) {
            next(new NotFound(ex))
        }
    }
    getAverage: RequestHandler = async (req, res, next) => {
        const where = GetPrismaFilterByMonth('fecha', Number(req.params.mes))
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
                where: {...where, OR: [{accion: 'Nuevo ticket'}, {accion: 'cierre de ticket'}]},
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
                res.send(result)
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