import { Router } from 'express';
import { Dashboard } from '../controllers/controller-dashboard'

const controller = new Dashboard()
const router = Router()

router.get('/stats/:mes', controller.getStats)
router.get('/average/:mes?', controller.getAverage)
router.get('/graph/:mes', controller.getGraph)

export default router