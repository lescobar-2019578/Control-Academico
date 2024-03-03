'use strint'

import AssignCourse from './assignCourse.model.js'
import User from '../user/user.model.js';
import Course from '../course/course.model.js'
import jwt from 'jsonwebtoken'

export const assignCourse = async (req, res) => {
    try {
        let {token} = req.headers
        if (!token) return res.status(401).send({ message: `Token is required. | Login required.` })
        let {role, uid} = jwt.verify(token,process.env.SECRET_KEY )
        let data = req.body
        let existingAssignment = await AssingCourse.findOne({
            student: uid,
            course: data.course
        });

        if (existingAssignment) {
            return res.status(400).send({ message: 'User is already assigned to this course' });
        }
        let user = await User.findById(uid);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        if (user.role == 'TEACHER') return res.status(400).send({ message: 'Teacher cannot be assigned to a course' });
        let assignmentCount = await AssingCourse.countDocuments({ student: uid });
        if (assignmentCount >= 3) {
            return res.status(400).send({ message: 'User cannot be assigned to more than 3 courses' });
        }

        let course = await Course.findById(data.course);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }
        data.student = uid
        let assigned = new AssingCourse(data)
        await assigned.save()
        return res.send({ message: 'assigned successfully' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'error when assigning to a course' })
    }
}

export const findCourseStudent = async (req, res) => {
    try {
        let { username } = req.body;

        let student = await User.findOne({ username });
        if (!student) return res.status(404).send({ message: 'Estudiante no encontrado' });

        let assignedCourses = await AssignCourse.find({ student: student._id });

        if (!assignedCourses.length) return res.status(404).send({ message: 'No se encontraron cursos para el estudiante' });

        let courses = [];
        for (let assignedCourse of assignedCourses) {
            let course = await Course.findById(assignedCourse.course).select('name description price duration teacher');
            if (course) {
                courses.push(course);
            }
        }

        return res.send({ message: 'Se encontraron los cursos', courses });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar cursos por estudiante', err: err.message });
    }
};
