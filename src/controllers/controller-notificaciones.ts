import {prisma} from "../database";
import {Handler} from "express";
import {NotFound, BadRequest} from "http-errors";
import {tiposNotificacionModel} from "../interfaces/zod";

export class Notificaciones {

    getTiposNotificacion: Handler = async (req, res, next) => {
        try {
            const result = await prisma.tiposNotificacion.findMany()
            res.send(result)
        } catch (ex: any) {
            next(new NotFound(ex))
        }
    }
    createTiposNotificacion: Handler = async (req, res, next) => {
        try {
            const data = tiposNotificacionModel.parse(req.body)
            const result = await prisma.tiposNotificacion.create({data})
            res.status(201).send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    getNotificacionesPorRol: Handler = async (req, res, next) => {
        try {
            const result = await prisma.$queryRaw`
                  SELECT 
                    npr.id, 
                    npr.idRol,
                    r.nombre rol,
                    npr.idTipoNotificacion,
                    tn.nombre tipoNotificacion,
                    npr.activo 
                  FROM notificacionesPorRol npr
                  INNER JOIN TiposNotificacion tn 
                    ON npr.idTipoNotificacion = tn.id 
                  INNER JOIN Autenticacion.dbo.Roles r
                    ON npr.idRol = r.id
                  ORDER BY rol, idTipoNotificacion`
            res.send(result)
        } catch (ex: any) {
            next(new NotFound(ex))
        }
    }
    updateNotificacionesPorRol: Handler = async (req, res, next) => {
        try {
            const id = Number(req.params.id)
            const {activo} = req.body
            const data = {activo}
            const result = await prisma.notificacionesPorRol
                .update({data, where: {id}})
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    getNotificaciones: Handler = async (req, res, next) => {
        const {idUsuario} = req.params
        try {
            const result = await prisma.notificaciones.findMany({
                take: 10,
                select: {
                    id: true,
                    titulo: true,
                    descripcion: true,
                    fecha: true,
                    icono: true,
                    link: true,
                    redirecciona: true,
                    visto: true
                },
                where: {AND: [{idUsuario}, {activo: true}]},
                orderBy: [
                    {visto: 'asc'},
                    {fecha: 'desc'}
                ]
            })
            res.send(result)
        } catch (ex: any) {
            next(new NotFound(ex))
        }
    }
    markAsRead: Handler = async (req, res, next) => {
        const {id} = req.params
        try {
            const result = await prisma.notificaciones.updateMany({
                data: {visto: true},
                where: {
                    id
                }
            })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    markAllAsRead: Handler = async (req, res, next) => {
        const {idUsuario} = req.params
        try {
            const result = await prisma.notificaciones.updateMany({
                data: {visto: true},
                where: {
                    idUsuario
                }
            })
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    deleteNotificacion: Handler = async (req, res, next) => {
        const {id} = req.params
        try {
            const result = await prisma.notificaciones.update({data: {activo: false}, where: {id}})
            res.send(result)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}