'use strict'

import Course from './course.model.js'
import AssingCourse from '../assignCourse/assignCourse.model.js'
import { checkUpdate } from '../utils/validator.js'

export const addCourse = async (req, res) => {
    try {
        let data = req.body
        console.log(data)
        let course = new Course(data)
        await course.save()
        return res.send({ message: `Registered course` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering course', err: err })
    }
}

export const deleteCourses = async (req, res) => {
    try {
        const { id } = req.params;
        await AssingCourse.deleteMany({ course: id });
        const deletedCourse = await Course.deleteOne({ _id: id });
        if (deletedCourse.deletedCount === 0) return res.status(404).send({ message: 'Course not found and not deleted' });
        return res.send({ message: 'Deleted course successfully' });
    } catch (err) {
        console.error(err);
        return res.status(404).send({ message: 'Error deleting course' });
    }
}

export const updateCourses = async (req, res) => {
    try {
        let data = req.body
        let { id } = req.params
        let update = checkUpdate(data, false)
        if (!update) return res.status(400).send({ message: 'You have sent data that cannot be updated' })
        let updateACourse = await Course.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateACourse) return res.status(404).send({ message: 'Course not found and not updated' })
        return res.send({ message: 'Course updated', updateACourse })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating the course' })
    }
}

export const searchCoursesTeacher = async (req, res) => {
    try {
        const { teacherId } = req.body;
        const courses = await Course.find({ teacher: teacherId }).populate('teacher', ['name', 'surname', 'username', 'email', 'phone', 'role']);
        if (!courses.length) return res.status(404).send({ message: 'Courses not found' });
        return res.send({ message: 'Courses found', courses });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error trying to search courses' });
    }
}

export const getCourses = async (req, res) => {
    try {
        let courses = await Course.find();
        return res.send({courses});
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error trying to fetch courses', err: err });
    }
}
