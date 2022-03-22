import { Router } from 'express';
import { Categorias } from '../controllers/controller-categorias'
const controller = new Categorias()
const router = Router()

router.get('/',controller.getAll)
router.get('/:id',controller.getById)
router.post('/',controller.create)
router.put('/:id',controller.editById)
router.delete('/:id',controller.deleteById)

export default router