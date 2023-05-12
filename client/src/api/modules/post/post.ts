import { axiosInstance } from '@/api'
import {
	AddImagesToPostData,
	CreatePostData,
	CreatePostResponse,
	EditPostData,
	GetAllPostsResponse,
	IPost,
	RemoveImageFromPostData,
	RemovePostResponse
} from '@/api/modules/post/post.types.ts'

export const post = {
	async getAll(pageSize = 20, page = 1) {
		const response = await axiosInstance.get<GetAllPostsResponse>(
			`/post/all?pageSize=${pageSize}&page=${page}`
		)
		return response.data
	},
	async create(createPostData: CreatePostData) {
		const formData = new FormData()

		Object.entries(createPostData).forEach(([key, value]) => {
			if (!Array.isArray(value)) return formData.append(key, value)

			value.forEach((file: File) => {
				formData.append(key, file)
			})
		})

		const response = await axiosInstance.post<CreatePostResponse>(
			'/post/create',
			formData,
			{
				headers: {
					authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			}
		)
		return response.data
	},
	async remove(postId: string) {
		const response = await axiosInstance.delete<RemovePostResponse>(
			`/post/remove/${postId}`,
			{
				headers: {
					authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			}
		)
		return response.data
	},
	async edit(editPostData: EditPostData) {
		const response = await axiosInstance.patch<IPost>(
			'/post/edit',
			editPostData,
			{
				headers: {
					authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			}
		)
		return response.data
	},
	async removeImageFromPost(removeImageFromPostData: RemoveImageFromPostData) {
		const response = await axiosInstance.patch<IPost>(
			`/post/images/remove/${removeImageFromPostData.postId}`,
			{ filename: removeImageFromPostData.filename },
			{
				headers: {
					authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			}
		)
		return response.data
	},
	async addImagesToPost(addImagesToPost: AddImagesToPostData) {
		const formData = new FormData()

		addImagesToPost.media.forEach(file => formData.append('media', file))

		const response = await axiosInstance.patch<IPost>(
			`/post/images/add/${addImagesToPost.postId}`,
			formData,
			{
				headers: {
					authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			}
		)

		return response.data
	}
}
