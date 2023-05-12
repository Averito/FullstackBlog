import { IUser } from '@/api/modules/user'

export interface IPost {
	_id: string
	title: string
	body: string
	images: string[]
	user: IUser
	createdAt: string
	updatedAt: string
}

export interface GetAllPostsResponse {
	posts: IPost[]
	total: number
}

export interface CreatePostData {
	title: string
	body: string
	media: File[]
}

export interface CreatePostResponse {
	post: IPost
	total: number
}

export interface RemovePostResponse {
	post: IPost
	total: number
}

export interface EditPostData {
	postId: string
	title?: string
	body?: string
}

export interface RemoveImageFromPostData {
	postId: string
	filename: string
}

export interface AddImagesToPostData {
	postId: string
	media: File[]
}
