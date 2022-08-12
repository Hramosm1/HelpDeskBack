import { Router } from 'express';
import { Notificaciones } from '../controllers/controller-notificaciones'
const controller = new Notificaciones()
const router = Router()

router.get('/tipos', controller.getTiposNotificacion)
router.post('/tipos', controller.createTiposNotificacion)

export default router