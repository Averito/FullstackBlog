import { IUser } from '../../../domain/models/user'

export interface RegistrationResponseDto {
	token: string
	user: IUser
}
