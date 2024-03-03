'use strint'

import { Router } from "express"
import { 
    validateJwt,
    isTeacher
} from '../middlewares/validate-jwt.js';
import { assignCourse, findCourseStudent } from "./assignCourse.controller.js"

const api = Router()

api.post('/assignCourse', [ validateJwt ], assignCourse)
api.post('/findCourseStudent', [ validateJwt ], findCourseStudent)

export default api