import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import userStore from '@stores/user.store.ts'

export const useAuth = () => {
	const navigate = useNavigate()

	useEffect(() => {
		const asyncWrapper = async () => {
			const token = localStorage.getItem('access_token')
			if (!token) return navigate('/')

			await userStore.me()
		}

		void asyncWrapper()
	}, [])
}
