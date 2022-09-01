import { request } from "../src/app";
/**
 * GETS
 */
describe('GET /personalDeSoporte', () => {
  it('Regresa status 200', async () => {
    const result = await request.get('/personalDeSoporte')
    expect(result.statusCode).toBe(200)
  })
  it('Regresa un array', async () => {
    const result = await request.get('/personalDeSoporte')
    expect(result.body).toBeInstanceOf(Array)
  })
})
describe('GET /personalDeSoporte/:id', () => {
  it('Regresa status 200', async () => {
    const result = await request.get('/personalDeSoporte/94197630-983e-40f4-a2bd-451fec4a7ff4')
    expect(result.statusCode).toBe(200)
  })
  it('Regresa un objeto', async () => {
    const result = await request.get('/personalDeSoporte')
    expect(result.body).toBeInstanceOf(Object)
  })
})
/** 
 * POST
 */
describe('POST /personalDeSoporte', () => {
  it('Crea personal', async () => {
    const result = await request.post('/personalDeSoporte').send({ idUsuario: '2c2cae44-7b5e-4872-9a2f-74be050674d8', nombre: 'prueba unitaria' })
    expect(result.statusCode).toBe(201)
  })
})
/**
 * DELETE
 */
describe('DELETE /personalDeSoporte/:id', () => {
  it('Elimina personal', async () => {
    const getId = await request.get('/personalDeSoporte/2c2cae44-7b5e-4872-9a2f-74be050674d8')
    const result = await request.delete('/personalDeSoporte/' + getId.body.id)
    expect(result.statusCode).toBe(200)
  })
})