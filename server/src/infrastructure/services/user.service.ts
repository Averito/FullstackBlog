import { IUser, User } from '../../domain/models/user'
import { HttpException } from '../../api/errors/httpException'

export class UserService {
	async getMe(currentUserId: string): Promise<IUser> {
		const user = await User.findOne({ _id: currentUserId })
		if (!user) throw new HttpException('User not found', 400)

		return user
	}
}

export default new UserService()
