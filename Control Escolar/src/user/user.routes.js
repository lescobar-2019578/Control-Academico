import express from 'express'
import { 
    validateJwt,
    isTeacher
} from '../middlewares/validate-jwt.js';
import {
    test,
    login, 
    updateUser, 
    deleteUser,
    registerStudent,
    registerTeacher
} from './user.controller.js';

const api = express.Router();

api.post('/registerStudent', registerStudent)
api.post('/registerTeacher', registerTeacher)
api.post('/login', login)
api.get('/test', [validateJwt, isTeacher], test)
api.put('/updateUser/:id', [validateJwt], updateUser)
api.delete('/deleteUser/:id', [validateJwt], deleteUser)

export default api