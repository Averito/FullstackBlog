import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { ALLOWED_PATHS } from './jwtAccess.middleware.config'
import { HttpException } from '../../errors/httpException'
import { HttpCode } from '../../errors/httpCode'
import {
	AuthorizeRequest,
	JwtAccessPayload
} from './jwtAccess.middleware.types'
import { User } from '../../../domain/models'

export const jwtAccessMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (ALLOWED_PATHS.some(path => req.path.includes(path))) return next()
		if (
			!req.headers['authorization'] ||
			!req.headers['authorization'].toString().startsWith('Bearer ')
		) {
			throw new HttpException('Not Authorized', HttpCode.NOT_AUTHORIZE)
		}

		const token = req.headers['authorization'].toString().slice(7)

		const payload = verify(
			token,
			process.env.JWT_SECRET as string
		) as JwtAccessPayload

		const user = await User.findOne({
			_id: payload?.userId
		})

		if (!user) throw new HttpException('Not Authorized', HttpCode.NOT_AUTHORIZE)
		;(req as AuthorizeRequest).user = user

		next()
	} catch (err) {
		next(err)
	}
}
