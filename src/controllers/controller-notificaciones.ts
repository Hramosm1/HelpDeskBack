import { prisma } from "../database";
import { Handler } from "express";
import { NotFound, BadRequest } from "http-errors";
import { notificacionesModel, tiposNotificacionModel } from "../interfaces/zod/index";
export class Notificaciones {
  funcion() {

  }
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
      const result = await prisma.tiposNotificacion.create({ data })
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
      const { activo } = req.body
      const data = { activo }
      const result = await prisma.notificacionesPorRol
        .update({ data, where: { id } })
      res.send(result)
    } catch (ex: any) {
      next(new BadRequest(ex))
    }
  }
  getNotificaciones: Handler = async (req, res, next) => {
    try {
      const result = await prisma.notificaciones.findMany()
      res.send(result)
    } catch (ex: any) {
      next(new NotFound(ex))
    }
  }
  createNotificacion: Handler = async (req, res, next) => {
    try {
      const data = notificacionesModel.parse(req.body)
      const result = await prisma.notificaciones.create({ data })
      res.status(201).send(result)
    } catch (ex: any) {
      next(new BadRequest(ex))
    }
  }
}