
import { request } from "../src/app";
import { bodyCategoria, iCategoria } from "../src/interfaces/interface-categorias";

//GETS
describe('GET /categorias', () => {
  test('Obtiene status code 200', async () => {
    const result = await request.get('/categorias')
    expect(result.statusCode).toBe(200)
  })
  test('Obtiene un array', async () => {
    const result = await request.get('/categorias')
    expect(result.body).toBeInstanceOf(Array)
  })
})

describe('GET /categorias/:id', () => {
  test('Obtiene status code 200', async () => {
    const result = await request.get('/categorias/1')
    expect(result.statusCode).toBe(200)
  })
})

//POST
describe('POST /categorias', () => {
  test('Verifica que se haya creado', async () => {
    const result = await request.post('/categorias').send({ nombre: 'prueba categorias' })
    expect(result.statusCode).toBe(201)
  })
})

//PUT
describe('POST /categorias', () => {
  test('Verifica que se haya editado', async () => {
    const last = await request.get('/categorias')
    if (Array.isArray(last.body)) {
      const content: Array<iCategoria> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba categorias')?.id
      if (id) {
        const body: bodyCategoria = { nombre: 'prueba jest editada' }
        const result = await request.put(`/categorias/${id}`).send(body)
        expect(result.statusCode).toBe(200)
      }
    }
    else expect(false).toBe(true)
  })
})

//DELETE
describe('DELETE /categorias/:id', () => {
  test('Verifica que se haya eliminado', async () => {
    const last = await request.get('/categorias')
    if (Array.isArray(last.body)) {
      const content: Array<iCategoria> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest editada')?.id
      if (id) {
        const result = await request.delete(`/categorias/${id}`)
        expect(result.statusCode).toBe(200)
      }
    }
    else expect(false).toBe(true)
  })
})
