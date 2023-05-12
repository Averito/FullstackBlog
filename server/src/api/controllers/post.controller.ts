import { NextFunction, Request, Response } from 'express'
import { postService } from '../../infrastructure/services'
import { AuthorizeRequest } from '../middlwares/jwt-access-middleware/jwtAccess.middleware.types'
import { CreatePostDto, EditPostDto, RemoveImageFromPostDto } from '../DTO/post'
import { IPost } from '../../domain/models/post'

export const getAllPosts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pageSize = req.query.pageSize as string
	const page = req.query.page as string

	res.json(
		await postService.getAll(
			parseInt(pageSize) || 20,
			parseInt(page) || 1,
			next
		)
	)
}

export const createPost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const media = (req.files || {}).media
	const currentUser = (req as AuthorizeRequest).user

	res.json(
		await postService.create(
			req.body as CreatePostDto,
			media,
			currentUser,
			next
		)
	)
}

export const getPostImage = async (req: Request, res: Response) => {
	return res.sendFile(req.params.imageName, { root: 'uploads/media' })
}

export const removeImageFromPost = async (
	req: Request<Record<string, never>, IPost, RemoveImageFromPostDto>,
	res: Response,
	next: NextFunction
) => {
	const filename = req.body.filename
	const postId = req.params.postId
	const currentUser = (req as unknown as AuthorizeRequest).user

	res.json(
		await postService.removeFileFromPost(postId, filename, currentUser, next)
	)
}

export const addImagesToPost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const media = (req.files || {}).media
	const postId = req.params.postId
	const currentUser = (req as AuthorizeRequest).user

	res.json(await postService.addFilesToPost(postId, media, currentUser, next))
}

export const removePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const postId = req.params.postId
	const currentUser = (req as AuthorizeRequest).user

	res.json(await postService.remove(postId, currentUser, next))
}

export const editPost = async (
	req: Request<Record<string, never>, IPost, EditPostDto>,
	res: Response,
	next: NextFunction
) => {
	const currentUser = (req as unknown as AuthorizeRequest).user

	res.json(await postService.edit(req.body, currentUser, next))
}
