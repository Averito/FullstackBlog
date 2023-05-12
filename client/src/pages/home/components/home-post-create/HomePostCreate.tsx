import { ChangeEventHandler, FC, MouseEventHandler, useState } from 'react'
import { Button, Input, message } from 'antd'
import cs from 'classnames'

import styles from './HomePostCreate.module.scss'
import postsStore from '@stores/posts.store.ts'
import { useImagePicker } from '@hooks/useImagePicker.ts'
import { FilePicker } from '@/components'

export const HomePostCreate: FC = () => {
	const [messageApi, contextHolder] = message.useMessage()

	const [postBody, setPostBody] = useState<string>('')
	const [postTitle, setPostTitle] = useState<string>('')

	const onChangeBody: ChangeEventHandler<HTMLTextAreaElement> = event => {
		setPostBody(event.currentTarget.value)
	}

	const onChangeTitle: ChangeEventHandler<HTMLInputElement> = event => {
		setPostTitle(event.currentTarget.value)
	}

	const { images, setImages, files, setFiles, onChangeFilePicker } =
		useImagePicker()

	const onClickUploadedImage = (
		image: string
	): MouseEventHandler<HTMLImageElement> => {
		return () => {
			setImages(prevState => prevState.filter(prevImage => prevImage !== image))
		}
	}

	const resetData = () => {
		setPostTitle('')
		setPostBody('')
		setImages([])
		setFiles([])
	}

	const onClickCreate = async () => {
		try {
			if (!postTitle || !postBody)
				return messageApi.error('Заголовок и тело поста должно быть заполнено')

			await postsStore.createPost({
				title: postTitle,
				body: postBody,
				media: files
			})
			resetData()

			messageApi.success('Пост успешно создан!')
		} catch (err) {
			messageApi.error((err as Error).message)
		}
	}

	return (
		<>
			{contextHolder}
			<div className={styles.wrapper}>
				<Input
					className={styles.input}
					value={postTitle}
					onChange={onChangeTitle}
					placeholder='Заголовок'
				/>
				<Input.TextArea
					className={styles.textarea}
					value={postBody}
					onChange={onChangeBody}
					placeholder='Описание'
				/>
				<FilePicker onChange={onChangeFilePicker} id='image-picker' />
			</div>
			<div className={styles.buttons}>
				<Button type='primary' onClick={onClickCreate}>
					Опубликовать
				</Button>
			</div>
			<div
				className={cs(styles.gallery, {
					[styles.galleryShow]: images.length > 0
				})}
			>
				{images.map(image => (
					<img
						key={image}
						className={styles.image}
						src={image}
						alt='Картинка'
						onClick={onClickUploadedImage(image)}
					/>
				))}
			</div>
		</>
	)
}
