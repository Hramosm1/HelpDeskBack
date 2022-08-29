import {Router} from 'express';
import {Calificacion} from "../controllers/controller-calificacion";

const controller = new Calificacion()
const router = Router()

router.get('/:idTicket', controller.getAll)
router.post('/:idTicket',controller.qualify)

export default router