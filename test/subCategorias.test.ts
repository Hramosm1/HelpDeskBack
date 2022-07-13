
import { request } from "../src/app";
import { iCategoria } from "../src/interfaces/interface-categorias";
import { bodySubcategoria, iSubCategoria } from "../src/interfaces/interface-subCategorias";

//GETS
describe('GET /subCategorias', () => {
  test('Obtiene status code 200', async () => {
    const result = await request.get('/subCategorias')
    expect(result.statusCode).toBe(200)
  })
  test('Obtiene un array', async () => {
    const result = await request.get('/subCategorias')
    expect(result.body).toBeInstanceOf(Array)
  })
})

describe('GET /subCategorias/:id', () => {
  test('Obtiene status code 200', async () => {
    const result = await request.get('/subCategorias/1')
    expect(result.statusCode).toBe(200)
  })
})

//POST
describe('POST /subCategorias', () => {
  test('Filas afectadas son mayor que 0', async () => {
    // const categoria = await request.post('/categorias').send({ nombre: 'prueba sub categoria' })
    const idCategoriaRequest = await request.get('/categorias')
    const categoria: iCategoria = idCategoriaRequest.body[0]
    const body: bodySubcategoria = { nombre: 'prueba jest', idCategoria: categoria.id }
    const result = await request.post('/subCategorias').send(body)
    expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
  })
})

//PUT
describe('POST /subCategorias', () => {
  test('Filas afectadas son mayor que 0', async () => {
    const subCategorias = await request.get('/subCategorias')
    if (Array.isArray(subCategorias.body)) {
      let body: iSubCategoria = subCategorias.body.find(val => val.nombre === 'prueba jest')
      if (body) {
        const result = await request.put('subCategorias').send(body)
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
    const last = await request.get('/subCategorias')
    if (Array.isArray(last.body)) {
      const content: Array<iSubCategoria> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest editada')?.id
      if (id) {
        const result = await request.delete(`/subCategorias/${id}`)
        expect(result.body.rowsAffected[0]).toBeGreaterThan(0)
      }
    }
    else expect(false).toBe(true)
  })
})
