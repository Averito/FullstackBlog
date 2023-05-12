import { action, makeObservable, observable, runInAction } from 'mobx'
import { LoginData, RegistrationData } from '@/api/modules/auth'
import { IUser } from '@/api/modules/user'
import { blogApi } from '@/api'

class UserStore {
	@observable private _isAuth = false
	public get isAuth() {
		return this._isAuth
	}

	@observable private _user: IUser = {} as IUser
	public get user() {
		return this._user
	}

	constructor() {
		makeObservable(this)
	}

	@action
	async registration(registrationData: RegistrationData) {
		const response = await blogApi.auth.registration(registrationData)
		localStorage.setItem('access_token', response.token)

		runInAction(() => {
			this._user = response.user
			this._isAuth = true
		})
	}

	@action
	async login(loginData: LoginData) {
		const response = await blogApi.auth.login(loginData)
		localStorage.setItem('access_token', response.token)

		runInAction(() => {
			this._user = response.user
			this._isAuth = true
		})
	}

	@action
	async me() {
		const me = await blogApi.user.me()

		runInAction(() => {
			this._user = me
			this._isAuth = true
		})
	}
}

export default new UserStore()
