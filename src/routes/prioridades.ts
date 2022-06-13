import { Router } from 'express';
import { Prioridades } from '../controllers/controller-prioridades'
const controller = new Prioridades()
const router = Router()

router.get('/',controller.getAll)
router.get('/:id',controller.getById)
router.post('/',controller.create)
router.put('/:id',controller.editById)
router.delete('/:id',controller.deleteById)

export default router