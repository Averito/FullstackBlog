import { NextFunction, Response, Request } from 'express'

import { HttpException } from '../../errors/httpException'

export const errorHandlerMiddleware = (
	err: HttpException,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error('[Error]:', err.message)

	res.status(err.status || 500).json({
		status: err.status || 500,
		message: err.message
	})

	next()
}
