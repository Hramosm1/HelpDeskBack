import { Request, Response } from 'express'
import { getPool } from '../database'
import { Int } from 'mssql/msnodesqlv8'
import { bodyPrioridades } from "../interfaces/interface-prioridades";
export class Prioridades {
    async getAll(req: Request, res: Response) {
        try {
            const pool = await getPool()
            const result = await pool?.query('SELECT id, nombre, color from Prioridades WHERE activo = 1')

            res.send(result?.recordsets[0])
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
            const result = await request?.query('SELECT id, nombre, color, activo from Prioridades WHERE id = @id')

            res.send(result?.recordset[0])
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const body: bodyPrioridades = req.body
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('nombre', body.nombre),
                request?.input('color', body.color)
            const result = await request?.query('INSERT INTO Prioridades (nombre, color) VALUES (@nombre, @color)')

            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async editById(req: Request, res: Response) {
        const { id } = req.params
        const body: bodyPrioridades = req.body
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('id', Int, id)
            request?.input('nombre', body.nombre)
            request?.input('color', body.color)
            const result = await request?.query('UPDATE Prioridades SET nombre = @nombre, color = @color WHERE id = @id')

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
            const result = await request?.query('UPDATE Prioridades SET activo = 0 WHERE id = @id')

            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}