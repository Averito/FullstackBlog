import { Request } from 'express'
import { IUser } from '../../../domain/models/user'

export interface JwtAccessPayload {
	userId: string
}

export interface AuthorizeRequest extends Request {
	user: IUser
}
