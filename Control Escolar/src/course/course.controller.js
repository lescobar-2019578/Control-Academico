'use strict'

import Course from './course.model.js'
import User from '../user/user.model.js'
import AssignCourse from '../assignCourse/assignCourse.model.js'
import jwt from 'jsonwebtoken'

import { checkUpdateCourse } from '../utils/validator.js'

export const addCourse = async (req, res) => {
    try {
        let data = req.body
        
        let { token } = req.headers

        if (!token) return res.status(401).send({ message: `Token is required. | Login required.` })

        let { role, uid } = jwt.verify(token, process.env.SECRET_KEY)
        data.teacher = uid

        let user = await User.findOne({ _id: data.teacher })
        if (user.role == 'STUDENT_ROLE') return res.status(404).send({ message: 'is not teacher' })

        let course = new Course(data)
        await course.save()
        return res.send({ message: 'Registered successfully' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering course', err: err })
    }
}

export const deleteCourses = async (req, res) => {
    try {
        let { id } = req.params
        let {token} = req.headers
        if (!token) {
             return res.status(401).send({ message: `Token is required. | Login required.` })
            }
        let { uid } = jwt.verify(token,process.env.SECRET_KEY )
        let user = await User.findById(uid);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        let course = await Course.findOne({ _id: id, teacher: uid });

        if (!course) {
            return res.status(403).send({ message: 'You are not authorized to delete this course' });
        }
        await AssignCourse.deleteMany({ course: id });
        let deleted = await Course.findOneAndDelete({ _id: id })
        if (!deleted) return res.status(404).send({ message: 'Course not found and not deleted' })
        return res.send({ message: `Course with name ${deleted.name} deleted successfully` }) 

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting Course' })
    }
}


export const updateCourses = async (req, res) => {
    try {
        let { id } = req.params
        let { token } = req.headers 
        let data = req.body

        if (!token) return res.status(401).send({ message: `Authorization token is missing. Please log in.` })

        let { role, uid } = jwt.verify(token, process.env.SECRET_KEY)
        let user = await User.findById(uid)

        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }

        let course = await Course.findOne({ _id: id, teacher: uid })

        if (!course) {
            return res.status(403).send({ message: 'You are not authorized to update this course' })
        }

        let update = checkUpdateCourse(data, id)

        if (!update) {
            return res.status(400).send({ message: 'Invalid or missing data for updating the course' })
        }
        
        let updatedCourse = await Course.findOneAndUpdate(
            { _id: id }, 
            data, 
            { new: true }
            ) 
        if (!updatedCourse)
        return res.status(401).send({ message: 'Course not found and not updated' })

        await  AssignCourse.updateMany(
            { course: id },
            { $set: { course: updatedCourse } }
            ) 
        return res.send({ message: 'Course updated successfully', updatedCourse }) 
    } catch (err) {
        console.error(err) 
        return res.status(500).send({ message: 'Error updating the course' }) 
    }
} 


export const searchCoursesTeacher = async (req, res) => {
    try {
        let { teacher } = req.body 
        let course = await Course.find({ teacher: teacher }).populate('teacher', ['name', 'surname', 'username', 'email', 'phone', 'role']) 
        if (!course.length) return res.status(404).send({ message: 'Courses not found' }) 
        return res.send({ message: 'Courses found', course }) 
    } catch (error) {
        console.error(error) 
        return res.status(500).send({ message: 'Error trying to search courses' }) 
    }
}

export const getCourses = async (req, res) => {
    try {
        let courses = await Course.find() 
        return res.send({ courses }) 
    } catch (err) {
        console.error(err) 
        return res.status(500).send({ message: 'Error trying to fetch courses', err: err }) 
    }
}
