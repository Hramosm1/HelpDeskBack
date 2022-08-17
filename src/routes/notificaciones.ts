import { Router } from 'express';
import { Notificaciones } from '../controllers/controller-notificaciones'
const controller = new Notificaciones()
const router = Router()

router.get('/', controller.getNotificaciones)
router.post('/', controller.createNotificacion)
router.get('/porRol', controller.getNotificacionesPorRol)
router.put('/porRol/:id', controller.updateNotificacionesPorRol)
router.get('/tipos', controller.getTiposNotificacion)
router.post('/tipos/:id', controller.createTiposNotificacion)

export default router