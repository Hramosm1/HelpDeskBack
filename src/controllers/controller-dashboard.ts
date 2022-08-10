import { RequestHandler } from 'express'
import { prisma } from "../database";
import { NotFound, BadRequest } from 'http-errors'
import { GetPrismaFilterByMonth } from '../core/utils';
import { groupBy, omitBy } from 'lodash';
export class Dashboard {
  getStats: RequestHandler = async (req, res, next) => {
    const where = GetPrismaFilterByMonth('fechaSolicitud', Number(req.params.mes))
    const result = { ticketsCreados: 0, ticketCerrados: 0 }
    let mPersonal: any = {}
    const personalDeSoporte: { [key: string]: { personalAsignado: string, ticketsActivos: number, ticketsCerrados: number } } = {}
    try {
      //*************OPTIENE LOS TICKETS AGRUPADOS POR ASIGNACION Y ACTIVO */
      const activosEInactivos = await prisma.tickets.groupBy({
        by: ['activo', 'asignadoA'],
        _count: { activo: true },
        where
      })

      if (activosEInactivos.length > 0) {
        const personal = await prisma.personalDeSoporte.findMany({
          select: {
            id: true,
            nombre: true
          }
        })
        activosEInactivos.map(row => {
          const nombre = personal.find(({ id }) => row.asignadoA === id)?.nombre || 'SIN ASIGNAR'
          //************SI NO EXISTE DENTRO DEL OBJETO ESA LLAVE LA CREA CON VALORES EN 0 */
          if (!personalDeSoporte[nombre]) {
            personalDeSoporte[nombre] = { ticketsActivos: 0, ticketsCerrados: 0, personalAsignado: nombre }
          }
          /**
           * SI ES DE TIPO ACTIVO SUMA LOS TICKETS ACTIVOS
           * SINO
           * SUMA LOS TICKETS CERRADOS
           */
          if (row.activo) {
            result.ticketsCreados += row._count.activo
            personalDeSoporte[nombre].ticketsActivos = row._count.activo
          } else {
            result.ticketCerrados += row._count.activo
            personalDeSoporte[nombre].ticketsCerrados = row._count.activo
          }

        })
        res.send({
          ...result, personalDeSoporte: Object.values(personalDeSoporte
          )
        })
      } else {
        res.send(result)
      }
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
        where: { ...where, OR: [{ accion: 'Nuevo ticket' }, { accion: 'cierre de ticket' }] },
        orderBy: { accion: 'desc' }
      })
      if (data.length > 0) {
        const grouping = groupBy(data, 'idTicket')
        const omitiendoTicketsNoCerrados = omitBy(grouping, k => k.length === 1)
        const result = []
        for (const key in omitiendoTicketsNoCerrados) {
          if (Object.prototype.hasOwnProperty.call(omitiendoTicketsNoCerrados, key)) {
            const val = omitiendoTicketsNoCerrados[key];
            console.table(val)
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
    const where = GetPrismaFilterByMonth('fecha', Number(req.params.mes))
    try {
      const data = await prisma.$queryRaw`SELECT * FROM VW_LogTicketsPorDia WHERE MONTH (dia) = ${req.params.mes} AND (accion = 'cierre de ticket' OR accion = 'nuevo ticket') ORDER BY dia`
      res.send(data)
    } catch (ex: any) {
      next(new BadRequest(ex))
    }
  }
}