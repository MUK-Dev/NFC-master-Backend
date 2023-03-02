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
 *          department:
 *              type: string
 *              default: Department
 *          program:
 *              type: string
 *              default: Program
 *          session:
 *              type: string
 *              default: Session
 *          semester:
 *              type: string
 *              default: Semester
 *          subject:
 *              type: string
 *              default: Subject
 *          date:
 *            type: string
 *            format: date-time
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
 *        present:
 *          type: boolean
 */

const attendanceSheetSchema = mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    date: Date,
  },
  { timestamps: true },
)

const attendanceSchema = mongoose.Schema(
  {
    sheet: { type: mongoose.Schema.Types.ObjectId, ref: 'Sheet' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    present: Boolean,
  },
  { timestamps: true },
)

module.exports = {
  Attendance: mongoose.model('Attendance', attendanceSchema),
  Sheet: mongoose.model('Sheet', attendanceSheetSchema),
}
