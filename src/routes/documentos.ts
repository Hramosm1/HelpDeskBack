import { Router } from 'express';
import { Documentos } from '../controllers/controller-documentos'
import multer, { Options, memoryStorage } from "multer";

const opts: Options = {
  // dest: '/Aplicaciones/HelpDesk/files'
  storage: memoryStorage()
}

const controller = new Documentos()
const router = Router()

//upload.single('file'), controller.uploadMainImage
router.get('/download/:fileName', controller.getFile)
router.get('/list/:id', controller.getFiles)
router.post('/:id', controller.uploadFiles)

export default router