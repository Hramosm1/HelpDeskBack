import { Router } from 'express';
import { Comentariostickets } from '../controllers/controller-comentariosTickets'
const controller = new Comentariostickets()
const router = Router()

router.get('/:id', controller.getById)
router.post('/', controller.create)

export default router