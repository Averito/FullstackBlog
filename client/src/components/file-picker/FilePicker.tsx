import { FC } from 'react'

import styles from './FilePicker.module.scss'
import { FilePickerProps } from '@components/file-picker/FilePicker.types.ts'

export const FilePicker: FC<FilePickerProps> = ({ onChange, id }) => {
	return (
		<>
			<label htmlFor={id}>
				<p className={styles.imagePickerButton}>Выбрать картинку</p>
			</label>
			<input
				className={styles.imagePicker}
				onChange={onChange}
				type='file'
				accept='image/png, image/gif, image/jpeg'
				id={id}
				multiple
			/>
		</>
	)
}
