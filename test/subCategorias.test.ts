import request from "supertest";
import { app } from "../src/app";

//GETS
describe('GET /subCategorias', () => {
  test('Obtiene status code 200', async () => {
    const result = await request(app.app).get('/subCategorias')
    expect(result.statusCode).toBe(200)
  })
  test('Obtiene un array', async () => {
    const result = await request(app.app).get('/subCategorias')
    expect(result.body).toBeInstanceOf(Array)
  })
})

describe('GET /subCategorias/:id', () => {
  test('Obtiene status code 200', async () => {
    const result = await request(app.app).get('/subCategorias/1')
    expect(result.statusCode).toBe(200)
  })
})

//POST
/*describe('POST /subCategorias', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const body: bodyCategoria = { nombre: 'prueba jest' }
    const result = await request(app.app).post('/subCategorias').send(body)
    expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
  })
  test('Verifica que se haya creado', async () => {
    const last = await request(app.app).get('/subCategorias')
    if (Array.isArray(last.body)) {
      const content: Array<iCategoria> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const bodyExpect: iCategoria = { id, nombre: 'prueba jest', activo: true }
        const result = await request(app.app).get(`/subCategorias/${id}`)
        console.log(result.body)
        expect(result.body).toMatchObject(bodyExpect)
      }
    }
    else expect(false).toBe(true)
  })
})

//PUT
describe('POST /subCategorias', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const last = await request(app.app).get('/subCategorias')
    if (Array.isArray(last.body)) {
      const content: Array<iCategoria> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const body: bodyCategoria = { nombre: 'prueba jest editada' }
        const result = await request(app.app).put(`/subCategorias/${id}`).send(body)
        expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
      }
    }
    else expect(false).toBe(true)
  })
  test('Verifica que se haya editado', async () => {
    const last = await request(app.app).get('/subCategorias')
    if (Array.isArray(last.body)) {
      const content: Array<iCategoria> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest editada')?.id
      if (id) {
        const bodyExpect: iCategoria = { id, nombre: 'prueba jest editada', activo: true }
        const result = await request(app.app).get(`/subCategorias/${id}`)
        expect(result.body).toMatchObject(bodyExpect)
      }
    }
    else expect(false).toBe(true)
  })
})

//DELETE
describe('DELETE /subCategorias/:id', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const last = await request(app.app).get('/subCategorias')
    if (Array.isArray(last.body)) {
      const content: Array<iCategoria> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest editada')?.id
      if (id) {
        const result = await request(app.app).delete(`/subCategorias/${id}`)
        expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
      }
    }
    else expect(false).toBe(true)
  })
})
*/