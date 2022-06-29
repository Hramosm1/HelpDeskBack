import { request, Request, Response } from 'express'
import { getPool } from '../database'
import { Int, VarChar, UniqueIdentifier, Bit, MAX } from 'mssql/msnodesqlv8'
export class Tickets {
    async getAll(req: Request, res: Response) {
        try {
            const pool = await getPool()
            const result = await pool?.query('SELECT id, titulo, prioridad, colorPrioridad, estado,  asignadoA, solicitudDe, fechaSolicitud, activo FROM VW_Tickets ORDER BY activo DESC')
            res.send(result?.recordset)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async getByUser(req: Request, res: Response) {
        const { id } = req.params
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('id', UniqueIdentifier, id)
            const result = await request?.query('SELECT id, titulo, prioridad, colorPrioridad, estado, asignadoA, solicitudDe, fechaSolicitud, activo FROM VW_Tickets WHERE idSolicitante = @id OR idUsuarioAsignado = @id ORDER BY activo DESC')
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
            const result = await request?.query('SELECT * FROM VW_Tickets WHERE id = @id')
            res.send(result?.recordset[0])
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async create(req: Request, res: Response) {
        const { titulo, descripcion, prioridad, estado, categorias, solicitudDe, asignadoA } = req.body
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('titulo', VarChar(150), titulo)
            request?.input('descripcion', VarChar(MAX), descripcion)
            request?.input('idPrioridad', Int, prioridad)
            request?.input('idEstado', Int, estado)
            request?.input('solicitadoPor', UniqueIdentifier, solicitudDe)
            request?.input('asignadoA', Int, asignadoA)
            const idInserted = await request?.query('INSERT INTO Tickets (titulo, descripcion, idPrioridad, idEstado, solicitudDe, asignadoA) output INSERTED.id VALUES (@titulo, @descripcion, @idPrioridad, @idEstado, @solicitadoPor, @asignadoA)')
            if (categorias.length > 0) {
                const request2 = pool?.request()
                request2?.input('id', Int, idInserted?.recordset[0].id)
                const queryCategorias = categorias.map((val: number) => `(@id,${val})`).splice(',')
                const result = await request2?.query('INSERT INTO CategoriasPorTickets (idTicket, idSubCategoria) VALUES' + queryCategorias)
            }

            res.send({ recordsets: [], recordset: null, rowsAffected: [1], id: idInserted?.recordset[0].id })
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async cerrarTicket(req: Request, res: Response) {
        const { id } = req.params
        const { idEstado, activo } = req.body
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('id', Int, id)
            request?.input('estado', Int, idEstado)
            request?.input('activo', Bit, activo)
            const result = await request?.query('UPDATE Tickets SET activo = @activo, idEstado = @estado WHERE id = @id')
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    async editById(req: Request, res: Response) {
        const { id } = req.params
        const { personal, estado } = req.body
        try {
            const pool = await getPool()
            const request = pool?.request()
            request?.input('id', Int, id)
            request?.input('personal', Int, personal)
            request?.input('estado', estado)
            const result = await request?.query('UPDATE Tickets SET asignadoA = @personal, idEstado = @estado WHERE id = @id')
            res.send(result)
        } catch (ex: any) {
            res.status(404).send({ message: 'error en la consulta', error: ex.message })
        }
    }
    /* async deleteById(req: Request, res: Response) {
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