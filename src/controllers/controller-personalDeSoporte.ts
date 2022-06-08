import { Request, Response } from 'express'
import { Int } from 'mssql/msnodesqlv8'
import { getPool } from '../database'
import { bodyPersonalDeSoporte } from '../interfaces/interface-personalDeSoporte'
import { UniqueIdentifier, VarChar } from "mssql/msnodesqlv8";
export class Personaldesoporte {
    async getAll(req: Request, res: Response) {
        try {
            const pool = await getPool()
            const result = await pool?.query('SELECT id, idUsuario, nombre FROM VW_PersonalSoporte WHERE activo = 1')

            res.send(result?.recordset)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async getById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('id', Int, id)
            const result = await request?.query('SELECT id, idUsuario, nombre FROM VW_PersonalSoporte WHERE id = @id')

            res.send(result?.recordset[0])
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const body: bodyPersonalDeSoporte = req.body
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('idUsuario', UniqueIdentifier, body.idUsuario)
            const result = await request?.query('INSERT INTO PersonalDeSoporte (idUsuario) values (@idUsuario)')

            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async deleteById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('id', Int, id)
            const result = await request?.query('DELETE PersonalDeSoporte WHERE id = @id')

            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}