import { IPost } from '../../../domain/models/post'

export interface CreatePostResponseDto {
	post: IPost
	total: number
}
