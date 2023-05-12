import { axiosInstance } from '@/api'
import { IUser } from '@/api/modules/user/user.types.ts'

export const user = {
	async me() {
		const response = await axiosInstance.get<IUser>('/user/me', {
			headers: {
				authorization: `Bearer ${localStorage.getItem('access_token')}`
			}
		})
		return response.data
	}
}
