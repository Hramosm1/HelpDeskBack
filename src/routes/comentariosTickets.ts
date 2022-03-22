import { Router } from 'express';
import { Comentariostickets } from '../controllers/controller-comentariosTickets'
const controller = new Comentariostickets()
const router = Router()

router.get('/',controller.getAll)
router.get('/:id',controller.getById)
router.post('/',controller.create)
router.put('/:id',controller.editById)
router.delete('/:id',controller.deleteById)

export default router