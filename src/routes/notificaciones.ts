import { Router } from 'express';
import { Notificaciones } from '../controllers/controller-notificaciones'
const controller = new Notificaciones()
const router = Router()

router.delete('/:id', controller.deleteNotificacion)
router.get('/list/:idUsuario', controller.getNotificaciones)
router.put('/vista/:id', controller.markAsRead)
router.put('/vistas/:idUsuario', controller.markAllAsRead)
router.get('/porRol', controller.getNotificacionesPorRol)
router.put('/porRol/:id', controller.updateNotificacionesPorRol)
router.get('/tipos', controller.getTiposNotificacion)
router.post('/tipos/:id', controller.createTiposNotificacion)
export default router