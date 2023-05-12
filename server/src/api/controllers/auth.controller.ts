import { NextFunction, Request, Response } from 'express'

import {
	RegistrationResponseDto,
	RegistrationDto,
	LoginResponseDto,
	LoginDto
} from '../DTO/auth'
import { authService } from '../../infrastructure/services'

export const registration = async (
	req: Request<Record<string, never>, RegistrationResponseDto, RegistrationDto>,
	res: Response,
	next: NextFunction
) => {
	return res.json(await authService.registration(req.body, next))
}
export const login = async (
	req: Request<Record<string, never>, LoginResponseDto, LoginDto>,
	res: Response,
	next: NextFunction
) => {
	return res.json(await authService.login(req.body, next))
}
