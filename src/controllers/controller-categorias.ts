import { Request, Response } from 'express'
import { getPool } from '../database'
import { Int } from 'mssql'
import { bodyCategoria } from "../interfaces/interface-categorias";
export class Categorias {
    async getAll(req: Request, res: Response) {
        try {
            const pool = await getPool()
            const result = await pool?.query('SELECT id, nombre from Categorias WHERE activo = 1')
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
            const result = await request?.query('SELECT id, nombre, activo from Categorias WHERE id = @id')
            res.send(result?.recordset[0])
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const body: bodyCategoria = req.body
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('nombre', body.nombre)
            const result = await request?.query('INSERT INTO Categorias (nombre) VALUES (@nombre)')
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async editById(req: Request, res: Response) {
        const { id } = req.params
        const body: bodyCategoria = req.body
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('id', Int, id)
            request?.input('nombre', body.nombre)
            const result = await request?.query('UPDATE Categorias SET nombre = @nombre WHERE id = @id')
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
            const result = await request?.query('UPDATE Categorias SET activo = 0 WHERE id = @id')
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}