import { request } from "../src/app";
/**
 * GETS
 */
describe('GET /tickets/:take/:page', () => {
  it('Regresa status 200', async () => {
    const result = await request.get('/tickets/4/0')
    expect(result.statusCode).toBe(200)
  })
  it('El body contiene count', async () => {
    const result = await request.get('/tickets/4/0')
    expect(result.body.count).toBeDefined()
  })
  it('El body contiene rows', async () => {
    const result = await request.get('/tickets/4/0')
    expect(result.body.rows).toBeDefined()
  })
  it('El body contiene comentarios cantidad de comentarios', async () => {
    const result = await request.get('/tickets/1/0')
    expect(typeof result.body.rows[0].Comentarios).toBe('number')
  })
  it('Regresa un array', async () => {
    const result = await request.get('/tickets/4/0')
    expect(result.body.rows).toBeInstanceOf(Array)
  })
  it('Regresa regresa la cantidad solicitada', async () => {
    const result = await request.get('/tickets/4/0')
    expect(result.body.rows.length).toBe(4)
  })

})
describe('GET /tickets/:take/:page?query', () => {

})