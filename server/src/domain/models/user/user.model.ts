import { model, Schema } from 'mongoose'
import { IUser } from './user.model.types'

const userSchema = new Schema<IUser>(
	{
		login: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
	},
	{ timestamps: true }
)

export const User = model<IUser>('User', userSchema)
