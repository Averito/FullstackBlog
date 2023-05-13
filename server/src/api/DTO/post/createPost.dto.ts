import { UploadedFile } from 'express-fileupload'

export interface CreatePostDto {
	title: string
	body: string
	media: UploadedFile | UploadedFile[]
}
