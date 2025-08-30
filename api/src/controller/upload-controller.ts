import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth-middleware'
import type { ApplicationVariables } from '../model/app-model'
import { UploadService } from '../service/upload-service'
import { File as FormDataNodeFile } from 'formdata-node'

export const uploadController = new Hono<{ Variables: ApplicationVariables }>()

uploadController.post('/upload-url', authMiddleware, async (c) => {
    try {
        const body = await c.req.parseBody()

        const file = body['file']

        if (!file) {
            return c.json({ error: 'No file uploaded' }, 400)
        }

        if (file instanceof File) {
            console.log('File:', file)
        } else {
            console.log('Unexpected file format:', typeof file)
            return c.json({ error: 'Invalid file format' }, 400)
        }


        const { File: FormDataNodeFile } = await import('formdata-node')
        const convertedFile = new FormDataNodeFile([file], file.name, { type: file.type })
        const imageUrl = await UploadService.uploadFile(convertedFile)
        return c.json({ imageUrl })
    } catch (err) {
        console.error('Error uploading file:', err)
        return c.json({ error: 'File upload failed' }, 500)
    }
})