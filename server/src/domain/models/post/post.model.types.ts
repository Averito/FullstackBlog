import { IUser } from '../user'

export interface IPost {
	_id: string
	title: string
	body: string
	images: string[]
	user: IUser
}
