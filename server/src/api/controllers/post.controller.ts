import { NextFunction, Request } from 'express'
import {
	Route,
	Get,
	Query,
	Controller,
	Post,
	Body,
	Header,
	Tags,
	Response,
	Patch,
	Path,
	Delete
} from 'tsoa'

import { postService } from '../../infrastructure/services'
import { AuthorizeRequest } from '../middlwares/jwt-access-middleware/jwtAccess.middleware.types'
import { CreatePostDto, EditPostDto, RemoveImageFromPostDto } from '../DTO/post'
import { IPost } from '../../domain/models/post'
import { PostService } from '../../infrastructure/services/post.service'
import { GetAllResponseDto } from '../DTO/post/getAllResponse.dto'
import { UploadedFile } from 'express-fileupload'
import { IUser } from '../../domain/models/user'
import { CreatePostResponseDto } from '../DTO/post/createPostResponse.dto'
import { RemovePostResponseDto } from '../DTO/post/removePostResponse.dto'

@Tags('Post')
@Route('post')
export class PostController extends Controller {
	constructor(private readonly _postService: PostService) {
		super()
	}

	@Get('all')
	public async getAllPosts(
		@Query() pageSize: number,
		@Query() page: number
	): Promise<GetAllResponseDto> {
		return (await this._postService.getAll(pageSize, page)) as GetAllResponseDto
	}

	@Post('create')
	async createPost(
		@Body() createPostDto: CreatePostDto,
		@Header() currentUserId: string
	): Promise<CreatePostResponseDto> {
		return await this._postService.create(
			createPostDto,
			createPostDto.media,
			currentUserId
		)
	}

	@Patch('post/images/remove/:postId')
	async removeImageFromPost(
		@Body() removeImageFromPostDto: RemoveImageFromPostDto,
		@Path() postId: string,
		@Header() currentUserId: string
	): Promise<IPost> {
		return await this._postService.removeFileFromPost(
			postId,
			removeImageFromPostDto.filename,
			currentUserId
		)
	}

	@Patch('post/images/add/:postId')
	async addImagesToPost(
		@Path() postId: string,
		@Body() media: UploadedFile | UploadedFile[],
		@Header() currentUserId: string
	): Promise<IPost> {
		return await this._postService.addFilesToPost(postId, media, currentUserId)
	}

	@Delete('post/remove/:postId')
	async removePost(
		@Path() postId: string,
		@Header() currentUserId: string
	): Promise<RemovePostResponseDto> {
		return await this._postService.remove(postId, currentUserId)
	}

	@Patch('post/edit')
	async editPost(
		@Body() editPostDto: EditPostDto,
		@Header() currentUserId: string
	): Promise<IPost> {
		return await this._postService.edit(editPostDto, currentUserId)
	}
}

export default new PostController(postService)
