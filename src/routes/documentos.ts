import { Router } from 'express';
import { Documentos } from '../controllers/controller-documentos'
const controller = new Documentos()
const router = Router()

router.get('/',controller.getAll)
router.get('/:id',controller.getById)
router.post('/',controller.create)
router.put('/:id',controller.editById)
router.delete('/:id',controller.deleteById)

export default router