import {Router} from 'express';
import {PushNotifications} from "../controllers/controller-pushNotifications";

const controller = new PushNotifications()
const router = Router()

router.post('', controller.updateProfile)

export default router