import { IPost } from '@/api/modules/post'

export interface IUser {
	_id: string
	login: string
	email: string
	password: string
	posts: IPost[]
	createdAt: string
	updatedAt: string
}
