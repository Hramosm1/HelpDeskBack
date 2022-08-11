import { Router } from 'express';
import { Notificaciones } from '../controllers/controller-notificaciones'
const controller = new Notificaciones()
const router = Router()

router.get('/')

export default router