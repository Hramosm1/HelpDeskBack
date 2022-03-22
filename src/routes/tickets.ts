import { Router } from 'express';
import { Tickets } from '../controllers/controller-tickets'
const controller = new Tickets()
const router = Router()

router.get('/',controller.getAll)
router.get('/:id',controller.getById)
router.post('/',controller.create)
router.put('/:id',controller.editById)
router.delete('/:id',controller.deleteById)

export default router