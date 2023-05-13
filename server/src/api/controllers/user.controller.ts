import { Controller, Get, Header, Route, Tags } from 'tsoa'

import { UserService } from '../../infrastructure/services/user.service'
import { IUser } from '../../domain/models/user'
import { userService } from '../../infrastructure/services'

@Tags('User')
@Route('user')
export class UserController extends Controller {
	constructor(private readonly _userService: UserService) {
		super()
	}

	@Get('me')
	async getMe(@Header() currentUserId: string): Promise<IUser> {
		return await this._userService.getMe(currentUserId)
	}
}

export default new UserController(userService)
