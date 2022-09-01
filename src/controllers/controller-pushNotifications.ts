import { prisma } from "../database";
import { Handler } from "express";
import { BadRequest } from "http-errors";
import { pushNotificationsModel } from "../interfaces/zod";

export class PushNotifications {
    updateProfile: Handler = async (req, res, next) => {
        try {
            /*const {id, explorer} = pushNotificationsModel.parse(req.body)
            const result = await prisma.pushNotifications.upsert({
                create: {id, explorer},
                update: {explorer},
                where: {id}
            })*/
            res.status(201).send('result')
        } catch (e: any) {
            next(new BadRequest(e))
        }
    }
}