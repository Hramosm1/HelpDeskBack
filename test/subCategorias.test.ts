import request from "supertest";
import { app } from "../src/app";
import { iCategoria } from "../src/interfaces/interface-categorias";
import { bodySubcategoria, iSubCategoria } from "../src/interfaces/interface-subCategorias";

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
describe('POST /subCategorias', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const idCategoriaRequest = await request(app.app).get('/categorias')
    if (idCategoriaRequest.body.length > 0) {
      const categoria: iCategoria = idCategoriaRequest.body[0]
      const body: bodySubcategoria = { nombre: 'prueba jest', idCategoria: categoria.id }
      const result = await request(app.app).post('/subCategorias').send(body)
      expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
    }
    console.info('AGREGE UNA CATEGORIA PARA CREAR UNA SUB CATEGORIA')
  })
})

//PUT
describe('POST /subCategorias', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const subCategorias = await request(app.app).get('/subCategorias')
    if (Array.isArray(subCategorias.body)) {
      let body: iSubCategoria = subCategorias.body.find(val => val.nombre === 'prueba jest')
      if (body) {
        const result = await request(app.app).put('subCategorias').send(body)
        expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
      }
      else {
        console.info('FALLO DESDE LA CREACION')
      }
    }
    console.info('AGREGE UNA CATEGORIA PARA CREAR UNA SUB CATEGORIA')
  })
})

//DELETE
describe('DELETE /subCategorias/:id', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const last = await request(app.app).get('/subCategorias')
    if (Array.isArray(last.body)) {
      const content: Array<iSubCategoria> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest editada')?.id
      if (id) {
        const result = await request(app.app).delete(`/subCategorias/${id}`)
        expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
      }
    }
    else expect(false).toBe(true)
  })
})
