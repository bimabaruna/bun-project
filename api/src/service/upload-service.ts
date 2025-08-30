import { File as FormDataNodeFile } from 'formdata-node'
import { supabase } from '../utils/supabase-client'

export class UploadService {
  static async uploadFile(file: FormDataNodeFile): Promise<string> {
    const ext = file.name.split('.').pop()
    const date = new Date()
    const dateNow = date.toISOString().replace(/:/g, '-').replace(/\..+/, '')
    const filename = `products/${dateNow}.${ext}`

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(filename, file.stream(), {
        contentType: file.type,
        upsert: false,
      })

    if (error) throw error

    return supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .getPublicUrl(filename).data.publicUrl
  }
}
