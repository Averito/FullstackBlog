import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import fileUploader from 'express-fileupload'
import morgan from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import 'colors'

import { errorHandlerMiddleware, jwtAccessMiddleware } from './api/middlwares'
import { router } from './api/router'

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

app.use('/docs', swaggerUi.serve, async (_: Request, res: Response) => {
	return res.send(
		swaggerUi.generateHTML(await import('./../dist/swagger.json'))
	)
})

app.use(router)

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
