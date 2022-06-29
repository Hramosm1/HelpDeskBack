import { Request, Response } from 'express';
import { writeFileSync, existsSync, mkdirSync } from "fs";
import sharp from "sharp";
export class Documentos {

    async uploadMainImage(req: Request, res: Response) {
        const { id } = req.params
        const path = 'C:\\Aplicaciones\\Help Desk\\files'
        if (req.file) {
            const ext = req.file.mimetype.split('/')[1]
            if (await !existsSync(path)) await mkdirSync(path, { recursive: true })
            const buff = await sharp(req.file.buffer)
                .resize(370, null, { fit: "contain" })
                .toBuffer()

            writeFileSync(`${path}\\${id}.${ext}`, buff)
            res.send('ok')
        }
    }

}