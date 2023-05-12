import { axiosInstance } from '@/api'
import {
	LoginData,
	LoginResponse,
	RegistrationData,
	RegistrationResponse
} from './auth.types.ts'

export const auth = {
	async registration(registrationData: RegistrationData) {
		const response = await axiosInstance.post<RegistrationResponse>(
			'/auth/registration',
			registrationData
		)
		return response.data
	},
	async login(loginData: LoginData) {
		const response = await axiosInstance.post<LoginResponse>(
			'/auth/login',
			loginData
		)
		return response.data
	}
}
