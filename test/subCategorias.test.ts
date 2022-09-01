
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
  test('Crea sub categoria', async () => {
    // const categoria = await request.post('/categorias').send({ nombre: 'prueba sub categoria' })
    const idCategoriaRequest = await request.get('/categorias')
    const categoria: iCategoria = idCategoriaRequest.body[0]
    const body: bodySubcategoria = { nombre: 'prueba jest', idCategoria: categoria.id }
    const result = await request.post('/subCategorias').send(body)
    expect(result.statusCode).toBe(201)
  })
})

//PUT
describe('POST /subCategorias', () => {
  test('Edita Sub categoria', async () => {
    const subCategorias = await request.get('/subCategorias')
    if (Array.isArray(subCategorias.body)) {
      const arrPruebas: iSubCategoria[] = subCategorias.body.filter(val => val.nombre === 'prueba jest')
      const body = arrPruebas.find(b => b.activo = true)
      if (body) {
        const result = await request.put('/subCategorias/' + body.id).send({ nombre: 'prueba jest editada' })
        expect(result.statusCode).toBe(200)
      }
      else {
        expect(false).toBe(true)
      }
    }
  })
})

//DELETE
describe('DELETE /subCategorias/:id', () => {
  test('Elimina una sub categoria', async () => {
    const last = await request.get('/subCategorias')
    if (Array.isArray(last.body)) {
      const content: Array<iSubCategoria> = last.body
      const id: number | undefined = content.find(val => val.nombre === 'prueba jest editada')?.id
      if (id) {
        const result = await request.delete(`/subCategorias/${id}`)
        expect(result.statusCode).toBe(200)
      }
    }
    else expect(false).toBe(true)
  })
})
