import { IPost } from '../post'

export interface IUser {
	_id: string
	login: string
	email: string
	password: string
	posts: IPost[]
}
