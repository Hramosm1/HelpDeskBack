import { request } from "../src/app";
describe('GET /dashboard', () => {
  const mes = new Date().getMonth() + 1
  test.concurrent('Recibe total de tickets creados por mes', async () => {
    const result = await request.get('/dashboard/stats/' + mes)
    expect(result.body.ticketsCreados).toBeDefined()
  })
  test.concurrent('Recibe total de tickets cerrados por mes', async () => {
    const result = await request.get('/dashboard/stats/' + mes)
    expect(result.body.ticketCerrados).toBeDefined()
  })
  test.concurrent('Recibe listado de tickets asignados a personal de soporte', async () => {
    const result = await request.get('/dashboard/stats/' + mes)
    expect(result.body.personalDeSoporte).toBeDefined()
  })
  test.concurrent('Recibe listado de tiempos por ticket', async () => {
    const result = await request.get('/dashboard/average/' + mes)
    expect(result.body).toBeInstanceOf(Array)
  })
  test.concurrent('Recibe listado de tickets creados y eliminados por dia', async () => {
    const result = await request.get('/dashboard/graph/' + mes)
    expect(result.body).toBeInstanceOf(Array)
  })
})
