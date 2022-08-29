import { Handler, Request, Response } from 'express'
import { writeFileSync, readdir, readFileSync } from "fs";
import sharp from "sharp";
import { UploadedFile, FileArray } from 'express-fileupload'
export class Documentos {

    getFiles: Handler = async (req, res, next) => {
        const { id } = req.params
        readdir(this.getPath(), (err, files) => {
            if (err)
                res.status(500).send()
            else {
                res.send(files.filter(name => name.substring(0, id.length + 1) === id + ' '))
            }
        })
    }
    getFile: Handler = async (req, res, next) => {
        const { fileName } = req.params
        const file = readFileSync(this.getPath() + fileName)
        res.send(file)
    }
    uploadFiles: Handler = async (req, res, next) => {
        const files = req.files as FileArray
        for (const key in files) {
            if (Object.prototype.hasOwnProperty.call(files, key)) {
                const element = files[key] as UploadedFile;
                await writeFileSync(
                    this.getPath() + this.setName(req.params.id, key),
                    element.data,
                    {}
                )
            }
        }
        res.status(201).send()
    }
    private setName(id: string, filename: string): string {
        const date = new Date()
        const datestr = date.toLocaleDateString().replaceAll('/', '')
        const time = date.toLocaleTimeString().replaceAll(':', '')
        return `${id} ${datestr}${time} ${filename}`
    }
    private getPath(): string {
        return 'C:\\Aplicaciones\\Help Desk\\archivos\\'
    }
}