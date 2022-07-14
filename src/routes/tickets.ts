import { Router } from 'express';
import { Tickets } from '../controllers/controller-tickets'
const controller = new Tickets()
const router = Router()

router.get('/:take/:page', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', controller.create)
router.put('/cerrar/:id', controller.cerrarTicket)
router.put('/:id', controller.editById)

export default router