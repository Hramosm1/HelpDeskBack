import { request } from "../src/app";
describe('GET /dashboard/:mes', () => {
  it('Recibe total de tickets creados por mes', async () => {
    const result = await request.get('/dashboard')
    expect(result.body.ticketsCreados).toBeDefined()
  })
  it('Recibe total de tickets cerrados por mes', async () => {
    const result = await request.get('/dashboard')
    expect(result.body.ticketCerrados).toBeDefined()
  })
  it('Recibe tabla tickets asignados por mes', async () => {
    const result = await request.get('/dashboard')
    expect(result.statusCode).toBe(200)
  })
})/*
describe('GET /dashboard/:mes', () => {
  it('Recibe total de tickets creados por mes', async () => {
    const result = await request.get('/dashboard')
    expect(result.body.ticketsCreados).toBeDefined()
  })
  it('Recibe total de tickets cerrados por mes', async () => {
    const result = await request.get('/dashboard')
    expect(result.body.ticketCerrados).toBeDefined()
  })
  it('Recibe tabla tickets asignados por mes', async () => {
    const result = await request.get('/dashboard')
    expect(result.statusCode).toBe(200)
  })
})

describe('GET /dashboard/:mes', () => {
  it('Recibe total de tickets creados por mes', async () => {
    const result = await request.get('/dashboard')
    expect(result.body.ticketsCreados).toBeDefined()
  })
  it('Recibe total de tickets cerrados por mes', async () => {
    const result = await request.get('/dashboard')
    expect(result.body.ticketCerrados).toBeDefined()
  })
  it('Recibe tabla tickets asignados por mes', async () => {
    const result = await request.get('/dashboard')
    expect(result.statusCode).toBe(200)
  })
})

*/