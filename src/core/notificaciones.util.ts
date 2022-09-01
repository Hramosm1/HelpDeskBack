import {app} from "../app";
import {prisma} from "../database";

export class NotificationsUtil {
    static async createNotificationForNewTicket(titulo: string, id: number, solicitudDe: string) {
        const listOfUsers = await this.getListOfUsers(1)
        const solicitante: { nombre: string }[] = await prisma.$queryRaw`
  SELECT nombre FROM Autenticacion.dbo.Usuarios
  WHERE id = ${solicitudDe}`

        const data = listOfUsers.map(({idUsuario}) => ({
            idUsuario,
            titulo: 'Nuevo ticket',
            descripcion: `${solicitante[0].nombre} ha creado un nuevo ticket: ${titulo}`,
            redirecciona: true,
            link: `tickets/${id}`,
            icono: 'heroicons_outline:document-add'
        }))
        await prisma.notificaciones.createMany({data})
        app.io.emit('notificacion', null)
    }

    static async createNotificationForAsignation(asignadoA: number, id: number) {
        const listOfUsers = await this.getListOfUsers(3)
        const usuario = await prisma.personalDeSoporte.findUnique({
            select: {idUsuario: true, nombre: true},
            where: {id: asignadoA!}
        })
        const listWithoutPersonalUser = listOfUsers.filter(({idUsuario}) => idUsuario != usuario?.idUsuario)
        const data = listWithoutPersonalUser.map(({idUsuario}) => ({
            idUsuario,
            titulo: 'Ticket asignado',
            descripcion: `El ticket No:${id} fue asignado a ${usuario?.nombre}`,
            redirecciona: true,
            link: `tickets/${id}`,
            icono: 'heroicons_solid:user'
        }))
        data.push({
            idUsuario: usuario?.idUsuario!,
            titulo: 'Ticket asignado',
            descripcion: `Se te ha asignado el ticket No:${id}`,
            redirecciona: true,
            link: `tickets/${id}`,
            icono: 'heroicons_solid:user'
        })
        await prisma.notificaciones.createMany({data})
        app.io.emit('notificacion', null)
    }

    static async createNotificationForComent(idTicket: number, idUsuarioComentario: string) {
        const listOfUsers = await this.getListOfUsers(4)
        const usuario: { nombre: string }[] = await prisma.$queryRaw`
    SELECT nombre FROM Autenticacion.dbo.Usuarios WHERE id = ${idUsuarioComentario}`
        const data = listOfUsers.map(({idUsuario}) => ({
            idUsuario,
            titulo: 'Nuevo comentario',
            descripcion: `${usuario[0].nombre} escribió un comentario en el ticket No:${idTicket}`,
            redirecciona: true,
            link: `tickets/${idTicket}`,
            icono: 'heroicons_outline:chat'
        }))
        await prisma.notificaciones.createMany({data})
        app.io.emit('notificacion', null)
    }

    static async createNotificationForTicketCloset(idUsuarioCierre: string, idTicket: number) {
        const listOfUsers = await this.getListOfUsers(2)

        const usuario: { nombre: string }[] = await prisma.$queryRaw`
            SELECT nombre FROM Autenticacion.dbo.Usuarios WHERE id = ${idUsuarioCierre}`
        const data = listOfUsers.map(({idUsuario}) => ({
            idUsuario,
            titulo: 'Cierre de ticket',
            descripcion: `${usuario[0].nombre} cerró el ticket No:${idTicket}`,
            redirecciona: true,
            link: `tickets/${idTicket}`,
            icono: 'heroicons_outline:lock-closed'
        }))
        await prisma.notificaciones.createMany({data})
        await this.qualityNotification(idTicket)
        app.io.emit('notificacion', null)
    }

    static async createNotificationFroReOpenTicket(idUsuarioCierre: string, idTicket: number){
        const listOfUsers = await this.getListOfUsers(5)
        const usuario: { nombre: string }[] = await prisma.$queryRaw`
            SELECT nombre FROM Autenticacion.dbo.Usuarios WHERE id = ${idUsuarioCierre}`
        const data = listOfUsers.map(({idUsuario}) => ({
            idUsuario,
            titulo: 'Ticket re abierto',
            descripcion: `${usuario[0].nombre} volvio a abrir ticket No:${idTicket}`,
            redirecciona: true,
            link: `tickets/${idTicket}`,
            icono: 'heroicons_outline:lock-open'
        }))
        await prisma.notificaciones.createMany({data})
        await this.qualityNotification(idTicket)
        app.io.emit('notificacion', null)
    }

    private static getListOfUsers(idTipoNotificacion: number): Promise<{ idUsuario: string }[]> {
        return prisma
            .$queryRaw`
          SELECT idUsuario FROM Autenticacion.dbo.RolPorUsuario  
          WHERE idRol IN (
              select idRol FROM NotificacionesPorRol npr 
              WHERE npr.activo = 1 AND npr.idTipoNotificacion = ${idTipoNotificacion}
          )`
    }

    private static getUserTicket(id: number): Promise<{ solicitudDe: string } | null> {
        return prisma.tickets.findUnique({
            select: {solicitudDe: true},
            where: {id}
        })
    }

    static async qualityNotification(idTicket: number) {
        const solicitante = await this.getUserTicket(idTicket)
        const data = {
            idUsuario: solicitante!.solicitudDe,
            titulo: 'Calificacion de ticket',
            descripcion: `Ayudanos a mejorar la atención recibida con el ticket No: ${idTicket}`,
            redirecciona: true,
            link: `tickets/qualify/${Buffer.from(idTicket.toString()).toString('base64url')}`,
            icono: 'heroicons_outline:sparkles'
        }
        await prisma.notificaciones.create({data})
    }
}


