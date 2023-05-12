import { v4 } from 'uuid'
import * as fs from 'fs'

import { Post } from '../../domain/models'
import { CreatePostDto, EditPostDto } from '../../api/DTO/post'
import { UploadedFile } from 'express-fileupload'
import { IUser } from '../../domain/models/user'
import { HttpException } from '../../api/errors/httpException'
import { NextFunction } from 'express'

class PostService {
	public async getAll(pageSize: number, page: number, next: NextFunction) {
		try {
			const posts = await Post.find({})
				.skip(pageSize * (page - 1))
				.limit(pageSize)
				.populate('user')

			return {
				posts: posts || [],
				total: await Post.countDocuments({})
			}
		} catch (error) {
			next(error)
		}
	}

	public async create(
		createPostDto: CreatePostDto,
		media: UploadedFile | UploadedFile[],
		currentUser: IUser,
		next: NextFunction
	) {
		try {
			let mediaArray: UploadedFile[] = []

			if (Array.isArray(media)) mediaArray = [...media]
			else mediaArray = [media]
			if (!media) mediaArray = []

			const postMedia: string[] = []

			for (const file of mediaArray) {
				const fileName = await this.saveFile(file, next)
				if (!fileName) continue

				postMedia.push(fileName)
			}

			const post = new Post({
				title: createPostDto.title,
				body: createPostDto.body,
				images: postMedia,
				user: currentUser._id
			})

			await post.save()

			const createdPost = await Post.findOne({ _id: post._id }).populate('user')

			return {
				post: createdPost,
				total: await Post.countDocuments({})
			}
		} catch (error) {
			next(error)
		}
	}

	public async addFilesToPost(
		postId: string,
		media: UploadedFile | UploadedFile[],
		currentUser: IUser,
		next: NextFunction
	) {
		try {
			const post = await Post.findOne({ _id: postId, user: currentUser._id })
			if (!post) throw new HttpException('Post not found', 400)

			let mediaArray: UploadedFile[] = []

			if (Array.isArray(media)) mediaArray = [...media]
			else mediaArray = [media]

			const newMedia: string[] = []
			for (const file of mediaArray) {
				const fileName = await this.saveFile(file, next)
				if (!fileName) continue

				newMedia.push(fileName)
			}

			post.images = [...post.images, ...newMedia]
			await post.save()

			return post
		} catch (error) {
			next(error)
		}
	}

	public async removeFileFromPost(
		postId: string,
		filename: string,
		currentUser: IUser,
		next: NextFunction
	) {
		try {
			const post = await Post.findOne({ _id: postId, user: currentUser._id })
			if (!post) throw new HttpException('Post not found', 400)

			await this.removeFile(filename, next)

			post.images = post.images.filter(image => image !== filename)
			await post.save()

			return post
		} catch (error) {
			next(error)
		}
	}

	public async remove(postId: string, currentUser: IUser, next: NextFunction) {
		try {
			const post = await Post.findOne({ _id: postId, user: currentUser._id })
			if (!post) throw new HttpException('Post not found', 400)

			post.images.forEach(image => this.removeFile(image, next))

			return {
				post: await Post.findOneAndRemove({ _id: postId }),
				total: await Post.countDocuments({})
			}
		} catch (err) {
			next(err)
		}
	}

	public async edit(
		editPostDto: EditPostDto,
		currentUser: IUser,
		next: NextFunction
	) {
		try {
			const post = await Post.findOne({
				_id: editPostDto.postId,
				user: currentUser._id
			})
			if (!post) throw new HttpException('Post not found', 400)

			if (editPostDto.title !== undefined) post.title = editPostDto.title
			if (editPostDto.body !== undefined) post.body = editPostDto.body

			await post.save()
			return post
		} catch (err) {
			next(err)
		}
	}

	private async saveFile(file: UploadedFile, next: NextFunction) {
		try {
			console.log('file', file)
			const extension = file?.mimetype?.split('/')?.at(-1) || 'jpg'
			const fileName = `${v4()}.${extension}`

			await file.mv(`./uploads/media/${fileName}`)

			return fileName
		} catch (error) {
			next(error)
		}
	}

	private async removeFile(fileName: string, next: NextFunction) {
		try {
			fs.unlink(`./uploads/media/${fileName}`, error => {
				if (!error) return
				throw new HttpException(error.message, 500)
			})
		} catch (error) {
			next(error)
		}
	}
}

export default new PostService()
