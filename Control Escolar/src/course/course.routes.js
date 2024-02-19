'use strict'

import { Router } from "express"
import { 
    validateJwt,
    isTeacher
} from '../middlewares/validate-jwt.js';
import { addCourse, deleteCourses, updateCourses, searchCoursesTeacher, getCourses } from './course.controller.js'

const api = Router()

api.post('/addCourse', [validateJwt, isTeacher], addCourse)
api.delete('/deleteCourses/:id', [validateJwt, isTeacher], deleteCourses)
api.put('/updateCourses/:id', [validateJwt, isTeacher], updateCourses)
api.post('/searchCoursesTeacher', [validateJwt, isTeacher], searchCoursesTeacher)
api.get('/getCourses', getCourses)

export default api