import { Observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { FC } from 'react'

import styles from './AppHeader.module.scss'
import userStore from '@stores/user.store.ts'

export const AppHeader: FC = () => {
	return (
		<header className={styles.wrapper}>
			<div className={styles.container}>
				<Observer>
					{() => (
						<h4 className={styles.marginRight}>
							{userStore.isAuth ? userStore.user.login : 'Гость'}
						</h4>
					)}
				</Observer>

				<Link className={styles.marginRight} to='/login'>
					Войти
				</Link>
				<Link to='/registration'>Регистрация</Link>
			</div>
		</header>
	)
}
