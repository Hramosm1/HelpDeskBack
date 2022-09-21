import { Router } from 'express';
import { Tickets } from '../controllers/controller-tickets'
const controller = new Tickets()
const router = Router()

router.get('/', controller.getToQualify)
router.get('/:id', controller.getById)
router.get('/:take/:page', controller.getAll)
router.post('/', controller.create)
router.post('/calificar/:idTicket/:idUsuario', controller.calificar)
router.put('/cerrar/:id', controller.cerrarTicket)
router.put('/:id', controller.editById)

export default router