import { ChangeEventHandler, FC, MouseEventHandler, useState } from 'react'
import { Button, Card, Image, Input } from 'antd'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { MdModeEditOutline } from 'react-icons/md'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'

import styles from './Post.module.scss'
import { PostProps } from '@components/post/Post.types.ts'
import { BLOG_API_POST_IMAGE_URI } from '@/variables.ts'
import userStore from '@stores/user.store.ts'
import postsStore from '@stores/posts.store.ts'
import { useInput } from '@hooks/useInput.ts'
import { FilePicker } from '@/components'

export const Post: FC<PostProps> = observer(({ post, messageApi }) => {
	const [editMode, setEditMode] = useState<boolean>(false)
	const [postTitle, setPostTitle, initialSetPostTitle] = useInput(post.title)
	const [postBody, setPostBody, initialSetPostBody] = useInput(post.body)

	const resetData = () => {
		initialSetPostTitle(post.title)
		initialSetPostBody(post.body)
	}

	const onClickRemovePost = async () => {
		try {
			await postsStore.remove(post._id)
			messageApi.success('Пост успешно удалён')
		} catch (err) {
			messageApi.error((err as Error).message)
		}
	}

	const toggleEditMode = () => {
		setEditMode(!editMode)
		resetData()
	}

	const closeEditMode = () => {
		setEditMode(false)
	}

	const removeImage = (image: string): MouseEventHandler<HTMLImageElement> => {
		return async () => {
			try {
				await postsStore.removeImageFromPost(post._id, image)
				messageApi.success('Картинка успешно удалена')
			} catch (err) {
				messageApi.error((err as Error).message)
			}
		}
	}

	const onChangeImagePicker: ChangeEventHandler<
		HTMLInputElement
	> = async event => {
		try {
			const files = event.currentTarget.files as FileList
			const filesArray: File[] = []

			for (let i = 0; i < files.length; i++) {
				const file = files.item(i)
				filesArray.push(file as File)
			}

			await postsStore.addImagesToPost(post._id, filesArray)
			messageApi.success('Картинка успешно добавлена!')
		} catch (error) {
			messageApi.error((error as Error).message)
		}
	}

	const onClickSave = async () => {
		try {
			if (!postTitle || !postBody)
				return messageApi.error('Заголовок и тело поста должны быть заполнены')

			await postsStore.edit({
				postId: post._id,
				title: postTitle,
				body: postBody
			})

			messageApi.success('Пост успешно сохранён!')
			setEditMode(false)
		} catch (error) {
			messageApi.error((error as Error).message)
		}
	}

	const extraElements = (
		<div className={styles.updateElements}>
			<MdModeEditOutline
				className={styles.editButton}
				onClick={toggleEditMode}
			/>
			<RiDeleteBin5Fill
				className={styles.removeButton}
				onClick={onClickRemovePost}
			/>
		</div>
	)

	return (
		<Card
			className={styles.post}
			size='small'
			title={postTitle}
			style={{ width: '100%' }}
			extra={post.user.email === userStore.user.email && extraElements}
		>
			{!editMode ? (
				post.body
			) : (
				<>
					<Input
						value={postTitle}
						onChange={setPostTitle}
						placeholder='Заголовок'
					/>
					<Input.TextArea
						className={styles.marginTop}
						value={postBody}
						onChange={setPostBody}
						placeholder='Описание'
					/>
					<FilePicker
						onChange={onChangeImagePicker}
						id={`image-picker-${post._id}`}
					/>
				</>
			)}

			<div className={styles.gallery}>
				{post.images.map(image =>
					editMode ? (
						<img
							key={image}
							className={styles.image}
							src={`${BLOG_API_POST_IMAGE_URI}/${image}`}
							alt='Картинка'
							onClick={removeImage(image)}
						/>
					) : (
						<Image
							key={image}
							className={styles.image}
							src={`${BLOG_API_POST_IMAGE_URI}/${image}`}
						/>
					)
				)}
			</div>

			{editMode ? (
				<div className={styles.saveButton}>
					<Button onClick={closeEditMode}>Отмена</Button>
					<Button type='primary' onClick={onClickSave}>
						Сохранить
					</Button>
				</div>
			) : (
				<>
					<p className={styles.marginTop}>
						Создано: {dayjs(post.createdAt).format('DD/MM/YYYY HH:mm')}
					</p>
					<p className={styles.postAuthor}>Автор: {post.user.login}</p>
				</>
			)}
		</Card>
	)
})
