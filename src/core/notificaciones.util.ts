import { Tickets } from "@prisma/client";
import { app } from "../app";
import { prisma } from "../database";

export class NotificationsUtil {
  static async createNotificationForNewTicket(titulo: string, id: number, solicitudDe: string) {
    const listOfUsers = await this.getListOfUsers(1)
    const solicitante: { nombre: string }[] = await prisma.$queryRaw`
  SELECT nombre FROM Autenticacion.dbo.Usuarios
  WHERE id = ${solicitudDe}`

    const data = listOfUsers.map(({ idUsuario }) => ({
      idUsuario,
      titulo: 'Nuevo ticket',
      descripcion: `${solicitante[0].nombre} ha creado un nuevo ticket: ${titulo}`,
      redirecciona: true,
      link: `tickets/${id}`,
      icono: 'heroicons_outline:document-add'
    }))
    await prisma.notificaciones.createMany({ data })
    app.io.emit('notificacion', null)
  }
  static async createNotificationForAsignation(asignadoA: number, id: number) {
    const usuario = await prisma.personalDeSoporte.findUnique({
      select: { idUsuario: true },
      where: { id: asignadoA! }
    })
    const data = {
      idUsuario: usuario?.idUsuario!,
      titulo: 'Ticket asignado',
      descripcion: `Se te ha asignado el ticket ${id}`,
      redirecciona: true,
      link: `tickets/${id}`,
      icono: 'heroicons_solid:user'
    }
    await prisma.notificaciones.create({ data })
    app.io.emit('notificacion', null)
  }
  static async createNotificationForComent(idTicket: number, idUsuarioComentario: string) {
    const listOfUsers = await this.getListOfUsers(2)
    const usuario: { nombre: string }[] = await prisma.$queryRaw`
    SELECT nombre FROM Autenticacion.dbo.Usuarios WHERE id = ${idUsuarioComentario}`
    const data = listOfUsers.map(({ idUsuario }) => ({
      idUsuario,
      titulo: 'Nuevo comentario',
      descripcion: `${usuario[0].nombre} escribió un comentario en el ticket No:${idTicket}`,
      redirecciona: true,
      link: `tickets/${idTicket}`,
      icono: 'heroicons_outline:chat'
    }))
    await prisma.notificaciones.createMany({ data })
    app.io.emit('notificacion', null)
  }
  static async createNotificationForTicketCloset(idUsuarioCierre: string, idTicket: number) {
    const listOfUsers = await this.getListOfUsers(2)
    const usuario: { nombre: string }[] = await prisma.$queryRaw`
    SELECT nombre FROM Autenticacion.dbo.Usuarios WHERE id = ${idUsuarioCierre}`
    const data = listOfUsers.map(({ idUsuario }) => ({
      idUsuario,
      titulo: 'Cierre de ticket',
      descripcion: `${usuario[0].nombre} cerró el ticket No:${idTicket}`,
      redirecciona: true,
      link: `tickets/${idTicket}`,
      icono: 'heroicons_outline:x-circle'
    }))
    await prisma.notificaciones.createMany({ data })
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
}


