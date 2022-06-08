import { Request, Response } from 'express'
import { getPool } from '../database'
import { UniqueIdentifier, VarChar } from 'mssql/msnodesqlv8'
export class Comentariostickets {

    async getById(req: Request, res: Response) {
        const { id } = req.params
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('id', UniqueIdentifier, id)
            const result = await request?.query('SELECT id, nombre, usuario, idTicket, idUsuario, fecha, comentario FROM VW_Comentarios WHERE idTicket = @id ORDER BY fecha ASC')
            res.send(result?.recordset)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        console.log('entra en comentarios')
        const { ticket, usuario, comentario } = req.body
        console.log(req.body)
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('ticket', UniqueIdentifier, ticket)
            request?.input('usuario', UniqueIdentifier, usuario)
            request?.input('comentario', VarChar, comentario)
            const result = await request?.query('INSERT INTO Comentarios (idTicket, idUsuario, comentario) VALUES (@ticket, @usuario, @comentario)')
            console.log(result)
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    /*async editById(req: Request, res: Response) {
        const pool = await getPool()
        const { id } = req.params
        try {
            const request = pool.request()
            request.input('id', Int, id)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async deleteById(req: Request, res: Response) {
        const pool = await getPool()
        const { id } = req.params
        try {
            const request = pool.request()
            request.input('id', Int, id)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }*/
}