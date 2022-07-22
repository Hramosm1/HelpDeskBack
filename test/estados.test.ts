import { request } from "../src/app";
import { bodyEstados, iEstado } from "../src/interfaces/interface-estados";

/**
 * GETS
 */
describe('GET /estados', () => {
  test('Obtiene status code 200', async () => {
    const result = await request.get('/estados')
    expect(result.statusCode).toBe(200)
  })
  test('Obtiene un array', async () => {
    const result = await request.get('/estados')
    expect(result.body).toBeInstanceOf(Array)
  })
})

describe('GET /estados/:id', () => {
  test('Obtiene status code 200', async () => {
    const result = await request.get('/estados/1')
    expect(result.statusCode).toBe(200)
  })
})
/**
 * POST /estados
 */
describe('POST /estados', () => {
  test('Fue creado', async () => {
    const body: bodyEstados = { nombre: 'prueba jest' }
    const result = await request.post('/estados').send(body)
    expect(result.statusCode).toBe(200)
  })
})

/**
 * PUT
 */
describe('PUT /estados', () => {
  test('Verifica que se haya editado', async () => {
    const last = await request.get('/estados')
    if (Array.isArray(last.body)) {
      const content: Array<iEstado> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const body: bodyEstados = { nombre: 'prueba jest editada' }
        const result = await request.put(`/estados/${id}`).send(body)
        expect(result.statusCode).toBe(200)
      }
    }
    else expect(false).toBe(true)
  })
})
/**
 * DELETE
 */
describe('DELETE /estados/:id', () => {
  test('Fue eliminado', async () => {
    const last = await request.get('/estados')
    if (Array.isArray(last.body)) {
      const content: Array<any> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest editada')?.id
      if (id) {
        const result = await request.delete(`/estados/${id}`)
        expect(result.statusCode).toBe(200)
      }
    }
    else expect(false).toBe(true)
  })
})
