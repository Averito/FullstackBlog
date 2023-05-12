import express from 'express'
import bodyParser from 'body-parser'
import fileUploader from 'express-fileupload'
import morgan from 'morgan'
import cors from 'cors'
import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import 'colors'

import { errorHandlerMiddleware, jwtAccessMiddleware } from './api/middlwares'
import { registration, login } from './api/controllers/auth.controller'
import {
	addImagesToPost,
	createPost,
	editPost,
	getAllPosts,
	getPostImage,
	removeImageFromPost,
	removePost
} from './api/controllers/post.controller'
import { getMe } from './api/controllers/user.controller'

dotenv.config()

const app = express()

const port = process.env.PORT
const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_DATABASE = process.env.MONGO_DATABASE

app.use(
	cors({
		origin: '*'
	})
)
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(fileUploader({ createParentPath: true }))
app.use(jwtAccessMiddleware)

app.post('/auth/registration', registration)
app.post('/auth/login', login)

app.get('/post/all', getAllPosts)
app.post('/post/create', createPost)
app.delete('/post/remove/:postId', removePost)
app.patch('/post/edit', editPost)
app.get('/post/image/:imageName', getPostImage)
app.patch('/post/images/remove/:postId', removeImageFromPost)
app.patch('/post/images/add/:postId', addImagesToPost)

app.get('/user/me', getMe)

app.listen(port, () => {
	try {
		mongoose.connect(
			`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.0wdcazw.mongodb.net/${MONGO_DATABASE}?retryWrites=true&w=majority`
		)
		console.log(`Server is running at http://localhost:${port}`.blue.bold)
	} catch (err) {
		console.log(err)
		process.exit(1)
	}
})

app.use(errorHandlerMiddleware)
