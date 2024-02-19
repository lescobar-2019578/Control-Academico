'use strint'

import AssingCourse from './assignCourse.model.js'
import User from '../user/user.model.js';
import Course from '../course/course.model.js'
export const assignCourse = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
       
        // Verificar que el estudiante exista
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).send({ message: 'Estudiante no encontrado' });
        }
       
        // Verificar que el curso ya exista
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).send({ message: 'Curso no encontrado' });
        }
       
        // Verificar si el estudiante ya está asignado en el curso
        const existingAssignment = await AssingCourse.findOne({ student: studentId, course: courseId });
        if (existingAssignment) {
            return res.status(400).send({ message: 'El estudiante ya está asignado a este curso' });
        }
       
        // Verificar si el estudiante ya está asignado en 3 cursos
        const assignedCoursesCount = await AssingCourse.countDocuments({ student: studentId });
        if (assignedCoursesCount >= 3) {
            return res.status(400).send({ message: 'Ya ha sido asignado a 3 cursos' });
        }
       
        // Crear y guardar la asignación del curso
        const newAssignment = new AssingCourse({ student: studentId, course: courseId });
        await newAssignment.save();
        return res.send({ message: `Asignado correctamente al curso` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'No se asignó correctamente al curso', err: err });
    }
}

export const findCourseStudent = async (req, res) => {
    try {
        const { username } = req.body;

        // Buscar el ID del estudiante por su nombre de usuario
        const student = await User.findOne({ username });
        if (!student) return res.status(404).send({ message: 'Estudiante no encontrado' });

        // Buscar cursos en los que el estudiante está asignado
        const courses = await AssingCourse.find({ student: student._id }).populate('course', ['name', 'description', 'price', 'duration', 'teacher']);
        
        // Validar la respuesta
        if (!courses.length) return res.status(404).send({ message: 'No se encontraron cursos' });
       
        // Responder si todo está bien
        return res.send({ message: 'Se encontraron los cursos', courses });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar cursos por estudiante', err: err });
    }
};
