import { FC } from 'react'
import { Button, Input, message } from 'antd'

import styles from './Login.module.scss'
import { useInput } from '@hooks/useInput.ts'
import userStore from '@stores/user.store.ts'
import { useNavigate } from 'react-router-dom'

export const Login: FC = () => {
	const navigate = useNavigate()
	const [messageApi, contextHolder] = message.useMessage()

	const [email, setEmail] = useInput('')
	const [password, setPassword] = useInput('')

	const onClickLogin = async () => {
		try {
			await userStore.login({
				email,
				password
			})
			navigate('/')
		} catch (error) {
			messageApi.error((error as Error).message)
		}
	}

	return (
		<>
			{contextHolder}
			<main className={styles.wrapper}>
				<div className={styles.container}>
					<Input
						value={email}
						onChange={setEmail}
						placeholder='example@gmail.com'
					/>
					<Input.Password
						className={styles.input}
						value={password}
						onChange={setPassword}
						placeholder='password'
					/>

					<Button
						className={styles.button}
						type='primary'
						onClick={onClickLogin}
					>
						Войти
					</Button>
				</div>
			</main>
		</>
	)
}
