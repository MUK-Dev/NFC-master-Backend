const mongoose = require('mongoose')

/**
 * @openapi
 * components:
 *  schemas:
 *    AttendanceListPostResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *    AttendanceListRequest:
 *      type: object
 *      properties:
 *          teacher:
 *              type: string
 *              default: Teacher
 *          list:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Attendance'
 *    Attendance:
 *      type: object
 *      properties:
 *        student:
 *          type: string
 *          default: Student
 *        department:
 *          type: string
 *          default: Department
 *        program:
 *          type: number
 *          default: Program
 */

const attendanceSchema = mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    department: String,
    program: Number,
  },
  { timestamps: true },
)

module.exports = mongoose.model('Attendance', attendanceSchema)
