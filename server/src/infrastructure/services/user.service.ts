import { IUser, User } from '../../domain/models/user'
import { NextFunction } from 'express'
import { HttpException } from '../../api/errors/httpException'

class UserService {
	async getMe(currentUser: IUser, next: NextFunction) {
		try {
			const user = await User.findOne({ _id: currentUser._id })
			if (!user) throw new HttpException('User not found', 400)

			return user
		} catch (error) {
			next(error)
		}
	}
}

export default new UserService()
