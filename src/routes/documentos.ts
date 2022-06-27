import { Router } from 'express';
import { Documentos } from '../controllers/controller-documentos'
import multer, { Options, memoryStorage } from "multer";

const opts: Options = {
  // dest: '/Aplicaciones/HelpDesk/files'
  storage: memoryStorage()
}
const upload = multer(opts)

const controller = new Documentos()
const router = Router()

router.post('/:id', upload.single('file'), controller.uploadMainImage)

export default router