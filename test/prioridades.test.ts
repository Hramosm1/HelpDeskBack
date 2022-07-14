
import { request } from "../src/app";
import { bodyPrioridades, iPrioridad } from "../src/interfaces/interface-prioridades";

//GETS
describe('GET /prioridades', () => {
  test('Obtiene status code 200', async () => {
    const result = await request.get('/prioridades')
    expect(result.statusCode).toBe(200)
  })
  test('Obtiene un array', async () => {
    const result = await request.get('/prioridades')
    expect(result.body).toBeInstanceOf(Array)
  })
})

describe('GET /prioridades/:id', () => {
  test('Obtiene status code 200', async () => {
    const result = await request.get('/prioridades/1')
    expect(result.statusCode).toBe(200)
  })
})

//POST
describe('POST /prioridades', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const body: bodyPrioridades = { nombre: 'prueba jest', color: "jest" }
    const result = await request.post('/prioridades').send(body)
    expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
  })
  test('Verifica que se haya creado', async () => {
    const last = await request.get('/prioridades')
    if (Array.isArray(last.body)) {
      const content: Array<iPrioridad> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const bodyExpect: iPrioridad = { id, nombre: 'prueba jest', color: 'jest', activo: true }
        const result = await request.get(`/prioridades/${id}`)
        expect(result.body).toMatchObject(bodyExpect)
      }
    }
    else expect(false).toBe(true)
  })
})

//PUT
describe('POST /prioridades', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const last = await request.get('/prioridades')
    if (Array.isArray(last.body)) {
      const content: Array<iPrioridad> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const body: bodyPrioridades = { nombre: 'prueba jest', color: "editado" }
        const result = await request.put(`/prioridades/${id}`).send(body)
        expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
      }
    }
    else expect(false).toBe(true)
  })
  test('Verifica que se haya editado', async () => {
    const last = await request.get('/prioridades')
    if (Array.isArray(last.body)) {
      const content: Array<iPrioridad> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const bodyExpect: iPrioridad = { id, nombre: 'prueba jest', color: 'editado', activo: true }
        const result = await request.get(`/prioridades/${id}`)
        expect(result.body).toMatchObject(bodyExpect)
      }
    }
    else expect(false).toBe(true)
  })
})

//DELETE
describe('DELETE /prioridades/:id', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const last = await request.get('/prioridades')
    if (Array.isArray(last.body)) {
      const content: Array<iPrioridad> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const result = await request.delete(`/prioridades/${id}`)
        expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
      }
    }
    else expect(false).toBe(true)
  })
})
