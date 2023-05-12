import { NextFunction } from 'express'
import { genSalt, hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

import { User } from '../../domain/models'
import { LoginDto, RegistrationDto } from '../../api/DTO/auth'
import { JwtAccessPayload } from '../../api/middlwares/jwt-access-middleware'
import { HttpException } from '../../api/errors/httpException'
import { HttpCode } from '../../api/errors/httpCode'

class AuthService {
	public async registration(
		registrationDto: RegistrationDto,
		next: NextFunction
	) {
		try {
			const user = await User.findOne({ email: registrationDto.email })
			if (user)
				throw new HttpException(
					'User with current email was found',
					HttpCode.BAD_REQUEST
				)

			const passwordHash = await this.genHash(registrationDto.password)

			const newUser = new User({
				login: registrationDto.login,
				email: registrationDto.email,
				password: passwordHash,
				posts: []
			})
			await newUser.save()

			const token = this.genToken({ userId: newUser._id })

			return {
				token,
				user: newUser
			}
		} catch (error) {
			next(error)
		}
	}

	public async login(loginDto: LoginDto, next: NextFunction) {
		try {
			const user = await User.findOne({ email: loginDto.email })
			if (!user)
				throw new HttpException(
					'User with current email not found',
					HttpCode.BAD_REQUEST
				)

			const truePassword = compare(loginDto.password, user.password)
			if (!truePassword)
				throw new HttpException('Password is wrong', HttpCode.BAD_REQUEST)

			return {
				user,
				token: this.genToken({ userId: user._id })
			}
		} catch (error) {
			next(error)
		}
	}

	private async genHash(value: string, rounds = 10): Promise<string> {
		const salt = await genSalt(rounds)
		return await hash(value, salt)
	}

	private genToken(payload: JwtAccessPayload): string {
		return sign(payload, process.env.JWT_SECRET as string, {
			expiresIn: 999999999,
			algorithm: 'HS512'
		})
	}
}

export default new AuthService()
