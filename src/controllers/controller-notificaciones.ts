import { prisma } from "../database";
import { Handler } from "express";
import { BadRequest, NotFound } from "http-errors";
import { tiposNotificacionModel } from "../interfaces/zod/index";
export class Notificaciones {
  getTiposNotificacion: Handler = async (req, res, next) => {
    try {
      const result = await prisma.tiposNotificacion.findMany()
      res.send(result)
    } catch (ex: any) {
      next(new BadRequest(ex))
    }
  }
  createTiposNotificacion: Handler = async (req, res, next) => {
    try {
      const data = tiposNotificacionModel.parse(req.body)
      const result = await prisma.tiposNotificacion.create({
        data
      })
      res.status(201).send(data)
    } catch (ex: any) {
      next(new BadRequest(ex))
    }
  }
}