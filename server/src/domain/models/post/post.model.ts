import { model, Schema } from 'mongoose'
import { IPost } from './post.model.types'

const postSchema = new Schema<IPost>(
	{
		title: { type: String, required: true },
		body: { type: String, required: false },
		images: [{ type: String, required: false }],
		user: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
	},
	{ timestamps: true }
)

export const Post = model<IPost>('Post', postSchema)
