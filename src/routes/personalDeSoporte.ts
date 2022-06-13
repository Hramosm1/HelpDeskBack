import { Router } from 'express';
import { Personaldesoporte } from '../controllers/controller-personalDeSoporte'
const controller = new Personaldesoporte()
const router = Router()

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', controller.create)
router.delete('/:id', controller.deleteById)

export default router