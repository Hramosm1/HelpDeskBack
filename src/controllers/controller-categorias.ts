import { Request, Response } from 'express'
import { getPool } from '../database'
import { Int } from 'mssql'
export class Categorias {
    async getAll(req: Request, res: Response) {
        try {
            const pool = await getPool()
            const result = await pool?.query('')
            res.send(result.recordset)
        } catch (error) {
            res.status(404).send({ message: 'error en la consulta' })
        }
    }
    async getById(req: Request, res: Response) {
        const pool = await getPool()
        const { id } = req.params
        try {
            const request = pool?.request()
            request.input('id', Int, id)
        } catch (error) {
            res.status(404).send({ message: 'error en la consulta' })
        }
    }
    async create(req: Request, res: Response) {
        const pool = await getPool()
        const body = req.body
        try {
            const request = pool?.request()
            request.input()
        } catch (error) {
            res.status(404).send({ message: 'error en la consulta' })
        }
    }
    async editById(req: Request, res: Response) {
        const pool = await getPool()
        const { id } = req.params
        try {
            const request = pool?.request()
            request.input('id', Int, id)
        } catch (error) {
            res.status(404).send({ message: 'error en la consulta' })
        }
    }
    async deleteById(req: Request, res: Response) {
        const pool = await getPool()
        const { id } = req.params
        try {
            const request = pool?.request()
            request.input('id', Int, id)
        } catch (error) {
            res.status(404).send({ message: 'error en la consulta' })
        }
    }
}