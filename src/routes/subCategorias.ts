import { Router } from 'express';
import { Subcategorias } from '../controllers/controller-subCategorias'
const controller = new Subcategorias()
const router = Router()

router.get('/',controller.getAll)
router.get('/:id',controller.getById)
router.post('/',controller.create)
router.put('/:id',controller.editById)
router.delete('/:id',controller.deleteById)

export default router