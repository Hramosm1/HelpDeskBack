import {Handler} from "express";
import {prisma} from "../database";
import {BadRequest} from "http-errors";
import {z} from "zod";

export class Calificacion {
    getAll: Handler = async (req, res, next) => {
        const {idTicket} = req.params
        const id = Buffer.from(idTicket, 'base64url').toString()
        try {
            const tickets = await prisma.tickets.findUnique({
                select: {
                    id: true,
                    titulo: true,
                    fechaSolicitud: true,
                    PersonalDeSoporte: {
                        select: {
                            nombre: true
                        }
                    }
                },
                where: {id: Number(id)}
            })
            res.send(tickets)
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
    qualify: Handler = async (req, res, next) => {
        const {idTicket} = req.params
        try {
            const id = z.number().parse(idTicket)
            prisma.tickets.update({data: {}, where: {id}})
        } catch (ex: any) {
            next(new BadRequest(ex))
        }
    }
}