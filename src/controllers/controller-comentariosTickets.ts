import { Request, Response } from 'express'
import { getPool } from '../database'
import { Int } from 'mssql'
export class Comentariostickets {
    async getAll(req: Request, res: Response){
        const pool = await getPool()
        try {
            const result = await pool.query('')
            res.send(result.recordset)
        } catch (ex:any) {
            res.status(404).send({message:'error en la consulta', error:ex.message})
        }
    }
    async getById(req: Request, res: Response){
        const pool = await getPool()
        const { id } = req.params
        try {
            const request = pool.request()
            request.input('id',Int,id)
        } catch (ex:any) {
            res.status(404).send({message:'error en la consulta', error:ex.message})
        }
    }
    async create(req: Request, res: Response){
        const pool = await getPool()
        const body = req.body
        try {
            const request = pool.request()
            request.input()
        } catch (ex:any) {
            res.status(404).send({message:'error en la consulta', error:ex.message})
        }
    }
    async editById(req: Request, res: Response){
        const pool = await getPool()
        const { id } = req.params
        try {
            const request = pool.request()
            request.input('id',Int,id)
        } catch (ex:any) {
            res.status(404).send({message:'error en la consulta', error:ex.message})
        }
    }
    async deleteById(req: Request, res: Response){
        const pool = await getPool()
        const { id } = req.params
        try {
            const request = pool.request()
            request.input('id',Int,id)
        } catch (ex:any) {
            res.status(404).send({message:'error en la consulta', error:ex.message})
        }
    }
}