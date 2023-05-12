import { ChangeEventHandler } from 'react'

export interface FilePickerProps {
	onChange: ChangeEventHandler<HTMLInputElement>
	id: string
}
