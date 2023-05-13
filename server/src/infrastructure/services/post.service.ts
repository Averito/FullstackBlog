import { v4 } from 'uuid'
import * as fs from 'fs'

import { Post } from '../../domain/models'
import { CreatePostDto, EditPostDto } from '../../api/DTO/post'
import { UploadedFile } from 'express-fileupload'
import { HttpException } from '../../api/errors/httpException'
import { CreatePostResponseDto } from '../../api/DTO/post/createPostResponse.dto'
import { IPost } from '../../domain/models/post'
import { RemovePostResponseDto } from '../../api/DTO/post/removePostResponse.dto'

export class PostService {
	public async getAll(pageSize: number, page: number) {
		const posts = await Post.find({})
			.skip(pageSize * (page - 1))
			.limit(pageSize)
			.populate('user')

		return {
			posts: posts || [],
			total: await Post.countDocuments({})
		}
	}

	public async create(
		createPostDto: CreatePostDto,
		media: UploadedFile | UploadedFile[],
		currentUserId: string
	): Promise<CreatePostResponseDto> {
		let mediaArray: UploadedFile[] = []

		if (Array.isArray(media)) mediaArray = [...media]
		else mediaArray = [media]
		if (!media) mediaArray = []

		const postMedia: string[] = []

		for (const file of mediaArray) {
			const fileName = await this.saveFile(file)
			if (!fileName) continue

			postMedia.push(fileName)
		}

		const post = new Post({
			title: createPostDto.title,
			body: createPostDto.body,
			images: postMedia,
			user: currentUserId
		})

		await post.save()

		const createdPost = await Post.findOne({ _id: post._id }).populate('user')

		return {
			post: createdPost as IPost,
			total: await Post.countDocuments({})
		}
	}

	public async addFilesToPost(
		postId: string,
		media: UploadedFile | UploadedFile[],
		currentUserId: string
	): Promise<IPost> {
		const post = await Post.findOne({ _id: postId, user: currentUserId })
		if (!post) throw new HttpException('Post not found', 400)

		let mediaArray: UploadedFile[] = []

		if (Array.isArray(media)) mediaArray = [...media]
		else mediaArray = [media]

		const newMedia: string[] = []
		for (const file of mediaArray) {
			const fileName = await this.saveFile(file)
			if (!fileName) continue

			newMedia.push(fileName)
		}

		post.images = [...post.images, ...newMedia]
		await post.save()

		return post
	}

	public async removeFileFromPost(
		postId: string,
		filename: string,
		currentUserId: string
	): Promise<IPost> {
		const post = await Post.findOne({ _id: postId, user: currentUserId })
		if (!post) throw new HttpException('Post not found', 400)

		await this.removeFile(filename)

		post.images = post.images.filter(image => image !== filename)
		await post.save()

		return post
	}

	public async remove(
		postId: string,
		currentUserId: string
	): Promise<RemovePostResponseDto> {
		const post = await Post.findOne({ _id: postId, user: currentUserId })
		if (!post) throw new HttpException('Post not found', 400)

		post.images.forEach(image => this.removeFile(image))

		return {
			post: (await Post.findOneAndRemove({ _id: postId })) as IPost,
			total: await Post.countDocuments({})
		}
	}

	public async edit(
		editPostDto: EditPostDto,
		currentUserId: string
	): Promise<IPost> {
		const post = await Post.findOne({
			_id: editPostDto.postId,
			user: currentUserId
		})
		if (!post) throw new HttpException('Post not found', 400)

		if (editPostDto.title !== undefined) post.title = editPostDto.title
		if (editPostDto.body !== undefined) post.body = editPostDto.body

		await post.save()
		return post
	}

	private async saveFile(file: UploadedFile): Promise<string> {
		const slicedMimetype = file?.mimetype?.split('/')
		const extension = slicedMimetype[slicedMimetype.length - 1] || 'jpg'
		const fileName = `${v4()}.${extension}`

		await file.mv(`./uploads/media/${fileName}`)

		return fileName
	}

	private async removeFile(fileName: string): Promise<void> {
		fs.unlink(`./uploads/media/${fileName}`, error => {
			if (!error) return
			console.error(error.message)
		})
	}
}

export default new PostService()
