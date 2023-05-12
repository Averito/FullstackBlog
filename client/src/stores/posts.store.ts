import { action, makeObservable, observable, runInAction } from 'mobx'
import { CreatePostData, EditPostData, IPost } from '@/api/modules/post'
import { blogApi } from '@/api'

class PostsStore {
	@observable private _posts: IPost[] = []
	public get posts() {
		return this._posts
	}

	@observable private _total = 0
	public get total() {
		return this._total
	}

	constructor() {
		makeObservable(this)
	}

	@action
	public async createPost(postData: CreatePostData) {
		const newPost = await blogApi.post.create(postData)

		runInAction(() => {
			this.addPost(newPost.post)
			this._total = newPost.total
		})
	}

	@action
	public async remove(postId: string) {
		const removedPost = await blogApi.post.remove(postId)

		runInAction(() => {
			this.removePost(removedPost.post._id)
			this._total = removedPost.total
		})
	}

	@action
	public async getPosts(pageSize = 20, page = 1) {
		const newPosts = await blogApi.post.getAll(pageSize, page)

		runInAction(() => {
			this.setPosts(newPosts.posts)
			this._total = newPosts.total
		})
	}

	@action
	public async removeImageFromPost(postId: string, image: string) {
		await blogApi.post.removeImageFromPost({
			postId,
			filename: image
		})

		runInAction(() => {
			this.removeImage(postId, image)
		})
	}

	@action
	public async addImagesToPost(postId: string, media: File[]) {
		const post = await blogApi.post.addImagesToPost({
			postId,
			media
		})

		runInAction(() => {
			this.setImages(postId, post.images)
		})
	}

	@action
	public async edit(editData: EditPostData) {
		const post = await blogApi.post.edit(editData)

		runInAction(() => {
			this.editBodyAndTitle(post._id, post.title, post.body)
		})
	}

	@action
	private setPosts(posts: IPost[]) {
		this._posts = posts
	}

	@action
	private addPost(post: IPost) {
		this._posts.unshift(post)
	}

	@action
	private removePost(postId: string) {
		this._posts = this._posts.filter(post => post._id !== postId)
	}

	@action
	private removeImage(postId: string, image: string) {
		const postIdx = this._posts.findIndex(post => post._id === postId)
		const post = this._posts.find(post => post._id === postId) as IPost

		post.images = post.images.filter(oldImage => oldImage !== image)

		this._posts.splice(postIdx, 1, post)
	}

	@action
	private setImages(postId: string, images: string[]) {
		const postIdx = this._posts.findIndex(post => post._id === postId)
		const post = this._posts.find(post => post._id === postId) as IPost

		post.images = images

		this._posts.splice(postIdx, 1, post)
	}

	@action
	private editBodyAndTitle(postId: string, title: string, body: string) {
		const postIdx = this._posts.findIndex(post => post._id === postId)
		const post = this._posts.find(post => post._id === postId) as IPost

		post.title = title
		post.body = body

		this._posts.splice(postIdx, 1, post)
	}
}

export default new PostsStore()
