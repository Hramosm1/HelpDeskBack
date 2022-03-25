import request from "supertest";
import { app } from "../src/app";
import { bodyEstados, iEstado } from "../src/interfaces/interface-estados";

//GETS
describe('GET /estados', () => {
  test('Obtiene status code 200', async () => {
    const result = await request(app.app).get('/estados')
    expect(result.statusCode).toBe(200)
  })
  test('Obtiene un array', async () => {
    const result = await request(app.app).get('/estados')
    expect(result.body).toBeInstanceOf(Array)
  })
})

describe('GET /estados/:id', () => {
  test('Obtiene status code 200', async () => {
    const result = await request(app.app).get('/estados/1')
    expect(result.statusCode).toBe(200)
  })
})

//POST
describe('POST /estados', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const body: bodyEstados = { nombre: 'prueba jest' }
    const result = await request(app.app).post('/estados').send(body)
    expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
  })
  test('Verifica que se haya creado', async () => {
    const last = await request(app.app).get('/estados')
    if (Array.isArray(last.body)) {
      const content: Array<iEstado> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const bodyExpect: iEstado = { id, nombre: 'prueba jest', activo: true }
        const result = await request(app.app).get(`/estados/${id}`)
        expect(result.body).toMatchObject(bodyExpect)
      }
    }
    else expect(false).toBe(true)
  })
})

//PUT
describe('POST /estados', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const last = await request(app.app).get('/estados')
    if (Array.isArray(last.body)) {
      const content: Array<iEstado> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const body: bodyEstados = { nombre: 'prueba jest editada' }
        const result = await request(app.app).put(`/estados/${id}`).send(body)
        expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
      }
    }
    else expect(false).toBe(true)
  })
  test('Verifica que se haya editado', async () => {
    const last = await request(app.app).get('/estados')
    if (Array.isArray(last.body)) {
      const content: Array<iEstado> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest editada')?.id
      if (id) {
        const bodyExpect: iEstado = { id, nombre: 'prueba jest editada', activo: true }
        const result = await request(app.app).get(`/estados/${id}`)
        expect(result.body).toMatchObject(bodyExpect)
      }
    }
    else expect(false).toBe(true)
  })
})

//DELETE
describe('DELETE /estados/:id', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const last = await request(app.app).get('/estados')
    if (Array.isArray(last.body)) {
      const content: Array<iEstado> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest editada')?.id
      if (id) {
        const result = await request(app.app).delete(`/estados/${id}`)
        expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
      }
    }
    else expect(false).toBe(true)
  })
})
