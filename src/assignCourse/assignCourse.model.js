import { Schema, model } from 'mongoose';

const assignCourseSchema = Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
},{
    versionKey: false
})

export default model('assignCourse', assignCourseSchema)