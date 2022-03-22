import { Request, Response } from 'express'
import { getPool } from '../database'
import { Int } from 'mssql/msnodesqlv8'
import { bodySubcategoria } from '../interfaces/interface-subCategorias'
export class Subcategorias {
    async getAll(req: Request, res: Response) {
        try {
            const pool = await getPool()
            const result = await pool?.query('SELECT id, nombre, idCategoria, categoria from VW_SubCategorias WHERE activo = 1')
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
            const result = await request?.query('SELECT id, nombre, idCategoria, categoria, activo from VW_SubCategorias WHERE id = @id')
            res.send(result?.recordset[0])
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const body: bodySubcategoria = req.body
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('nombre', body.nombre)
            request?.input('idCategoria', body.idCategoria)
            const result = await request?.query('INSERT INTO SubCategorias (nombre, idCategoria) VALUES (@nombre, @idCategoria)')
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async editById(req: Request, res: Response) {
        const { id } = req.params
        const body: bodySubcategoria = req.body
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('id', Int, id)
            request?.input('nombre', body.nombre)
            request?.input('idCategoria', Int, body.idCategoria)
            const result = await request?.query('UPDATE SubCategorias SET nombre = @nombre, idCategoria = @idCategoria WHERE id = @id')
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
            const result = await request?.query('UPDATE SubCategorias SET activo = 0 WHERE id = @id')
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
}