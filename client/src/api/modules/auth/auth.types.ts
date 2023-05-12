import { IUser } from '@/api/modules/user/user.types.ts'

export interface LoginData {
	email: string
	password: string
}

export interface LoginResponse {
	user: IUser
	token: string
}

export interface RegistrationData {
	login: string
	email: string
	password: string
}

export interface RegistrationResponse {
	user: IUser
	token: string
}
