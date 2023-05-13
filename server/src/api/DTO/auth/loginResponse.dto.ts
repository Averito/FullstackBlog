import { IUser } from '../../../domain/models/user'

export interface LoginResponseDto {
	user: IUser
	token: string
}
