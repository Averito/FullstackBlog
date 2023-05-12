import { IPost } from '@/api/modules/post'
import { MessageInstance } from 'antd/es/message/interface'

export interface PostProps {
	post: IPost
	messageApi: MessageInstance
}
