import { IPost } from '../../../domain/models/post'

export interface GetAllResponseDto {
	posts: IPost[]
	total: number
}
