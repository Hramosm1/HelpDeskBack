import { isArrowFunction } from "typescript";
import { request } from "../src/app";
/**
 * GET /usuarios
 */
describe('GET /usuarios', () => {
  it('Regresa status 200', async () => {
    const result = await request.get('/usuarios')
    expect(result.statusCode).toBe(200)
  })
  it('Regresa un array', async () => {
    const result = await request.get('/usuarios')
    expect(result.body).toBeInstanceOf(Array)
  })
})