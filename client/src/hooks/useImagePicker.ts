import { ChangeEventHandler, useState } from 'react'

export const useImagePicker = () => {
	const [images, setImages] = useState<string[]>([])
	const [files, setFiles] = useState<File[]>([])

	const onChangeFilePicker: ChangeEventHandler<HTMLInputElement> = event => {
		const files = event.currentTarget.files
		if (!files) return

		setFiles(prevState => [...prevState, ...files])

		for (let i = 0; i < files.length; i++) {
			const file = files.item(i) as File

			const fileReader = new FileReader()

			fileReader.readAsDataURL(file)
			fileReader.addEventListener('loadend', () => {
				setImages(prevState => [...prevState, fileReader.result as string])
			})
		}
	}

	return {
		images,
		setImages,
		files,
		setFiles,
		onChangeFilePicker
	}
}
