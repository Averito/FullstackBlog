import { NextFunction, Request, Response } from 'express'
import { AuthorizeRequest } from '../middlwares/jwt-access-middleware/jwtAccess.middleware.types'
import { userService } from '../../infrastructure/services'

export const getMe = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const currentUser = (req as AuthorizeRequest).user

	res.json(await userService.getMe(currentUser, next))
}
