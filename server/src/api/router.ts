import express, { NextFunction, Request, Response } from 'express'
import authController from './controllers/auth.controller'
import postController from './controllers/post.controller'
import { AuthorizeRequest } from './middlwares/jwt-access-middleware/jwtAccess.middleware.types'
import userController from './controllers/user.controller'

const router = express.Router()

router.post(
	'/auth/registration',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json(await authController.registration(req.body))
		} catch (error) {
			next(error)
		}
	}
)
router.post(
	'/auth/login',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.json(await authController.login(req.body))
		} catch (error) {
			next(error)
		}
	}
)

router.get(
	'/post/all',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const pageSize = req.query.pageSize as string
			const page = req.query.page as string

			res.json(
				await postController.getAllPosts(
					parseInt(pageSize) || 20,
					parseInt(page) || 1
				)
			)
		} catch (error) {
			next(error)
		}
	}
)
router.post(
	'/post/create',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const media = (req.files || {}).media
			const currentUser = (req as AuthorizeRequest).user

			req.body.media = media

			res.json(await postController.createPost(req.body, currentUser._id))
		} catch (error) {
			next(error)
		}
	}
)
router.get(
	'/post/image/:imageName',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			res.sendFile(req.params.imageName, { root: 'uploads/media' })
		} catch (error) {
			next(error)
		}
	}
)
router.patch(
	'/post/images/remove/:postId',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const postId = req.params.postId
			const currentUser = (req as unknown as AuthorizeRequest).user

			res.json(
				await postController.removeImageFromPost(
					req.body,
					postId,
					currentUser._id
				)
			)
		} catch (error) {
			next(error)
		}
	}
)
router.patch(
	'/post/images/add/:postId',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const media = (req.files || {}).media
			const postId = req.params.postId
			const currentUser = (req as AuthorizeRequest).user

			res.json(
				await postController.addImagesToPost(postId, media, currentUser._id)
			)
		} catch (error) {
			next(error)
		}
	}
)
router.delete(
	'/post/remove/:postId',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const postId = req.params.postId
			const currentUser = (req as AuthorizeRequest).user

			res.json(await postController.removePost(postId, currentUser._id))
		} catch (error) {
			next(error)
		}
	}
)
router.patch(
	'/post/edit',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const currentUser = (req as AuthorizeRequest).user

			res.json(await postController.editPost(req.body, currentUser._id))
		} catch (error) {
			next(error)
		}
	}
)

router.get(
	'/user/me',
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const currentUser = (req as AuthorizeRequest).user

			res.json(await userController.getMe(currentUser._id))
		} catch (error) {
			next(error)
		}
	}
)

export { router }
