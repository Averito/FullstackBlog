import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { message, Pagination } from 'antd'

import styles from './Home.module.scss'
import { HomePostCreate } from '@/pages/home/components'
import userStore from '@stores/user.store.ts'
import postsStore from '@stores/posts.store.ts'
import { PAGE_SIZE } from '@pages/home/Home.config.ts'
import { Post } from '@components/post'

export const Home: FC = observer(() => {
	const [messageApi, contextHolder] = message.useMessage()
	const [currentPage, setCurrentPage] = useState<number>(1)

	const onChangeCurrentPage = (page: number) => {
		setCurrentPage(page)
	}

	useEffect(() => {
		void postsStore.getPosts(PAGE_SIZE, currentPage)
	}, [currentPage])

	return (
		<>
			{contextHolder}
			<main className={styles.wrapper}>
				<div className={styles.container}>
					{userStore.isAuth && <HomePostCreate />}
					<div className={styles.posts}>
						{postsStore.posts.slice(0, 20).map(post => (
							<Post key={post._id} post={post} messageApi={messageApi} />
						))}
					</div>
					<div className={styles.pagination}>
						<Pagination
							pageSize={PAGE_SIZE}
							onChange={onChangeCurrentPage}
							total={postsStore.total}
							current={currentPage}
						/>
					</div>
				</div>
			</main>
		</>
	)
})
