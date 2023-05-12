import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

import { AppHeader } from '@/app/components'
import { Home } from '@/pages/home'
import { Login } from '@pages/login'
import { Registration } from '@pages/registration'
import { useAuth } from '@hooks/useAuth.ts'

export const App: FC = () => {
	useAuth()

	return (
		<>
			<AppHeader />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/registration' element={<Registration />} />
			</Routes>
		</>
	)
}
