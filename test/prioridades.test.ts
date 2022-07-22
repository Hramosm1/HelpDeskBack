
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
  test('Crea una prioridad', async () => {
    const body: bodyPrioridades = { nombre: 'prueba jest', color: "jest" }
    const result = await request.post('/prioridades').send(body)
    expect(result.statusCode).toBe(200)
  })
})

//PUT
describe('POST /prioridades', () => {
  test('Edita la prioridad', async () => {
    const last = await request.get('/prioridades')
    if (Array.isArray(last.body)) {
      const content: Array<iPrioridad> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const body: bodyPrioridades = { nombre: 'prueba jest', color: "editado" }
        const result = await request.put(`/prioridades/${id}`).send(body)
        expect(result.statusCode).toBe(200)
      }
    }
    else expect(false).toBe(true)
  })
})

//DELETE
describe('DELETE /prioridades/:id', () => {
  test('Elimina la prioridad', async () => {
    const last = await request.get('/prioridades')
    if (Array.isArray(last.body)) {
      const content: Array<iPrioridad> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest')?.id
      if (id) {
        const result = await request.delete(`/prioridades/${id}`)
        expect(result.statusCode).toBe(200)
      }
    }
    else expect(false).toBe(true)
  })
})
