import { Router } from 'express';
import { Usuarios } from '../controllers/controller-usuarios'
const controller = new Usuarios()
const router = Router()

router.get('/', controller.getAll)

export default router