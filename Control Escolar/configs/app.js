import express from 'express'
import { config } from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import userRouter from '../src/user/user.routes.js'
import courseRouter from '../src/course/course.routes.js'
import assignCourseRouter from '../src/assignCourse/assignCourse.routes.js'

const app = express()
config()
const port = process.env.PORT 

// Middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

// Routes
app.use(userRouter)
app.use(courseRouter)
app.use(assignCourseRouter)

export const initServer = () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}
