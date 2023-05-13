import { IPost } from '../../../domain/models/post'

export interface RemovePostResponseDto {
	post: IPost
	total: number
}
