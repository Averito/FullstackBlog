import { Body, Controller, Post, Route, Tags } from 'tsoa'

import {
	RegistrationResponseDto,
	RegistrationDto,
	LoginResponseDto,
	LoginDto
} from '../DTO/auth'
import { authService } from '../../infrastructure/services'
import { AuthService } from '../../infrastructure/services/auth.service'

@Tags('Auth')
@Route('auth')
export class AuthController extends Controller {
	constructor(private readonly _authService: AuthService) {
		super()
	}

	@Post('login')
	public async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
		return await this._authService.login(loginDto)
	}

	@Post('registration')
	public async registration(
		@Body() registrationDto: RegistrationDto
	): Promise<RegistrationResponseDto> {
		return await this._authService.registration(registrationDto)
	}
}

export default new AuthController(authService)
