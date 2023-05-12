import axios from 'axios'
import { BLOG_API_URI } from '@/variables.ts'
import { auth, post, user } from '@/api/modules'

export const axiosInstance = axios.create({
	baseURL: BLOG_API_URI
})

export const blogApi = {
	auth,
	post,
	user
}
