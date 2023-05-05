const mongoose = require('mongoose')

/**
 * @openapi
 * components:
 *  schemas:
 *    GetSheetResponse:
 *      type: object
 *      properties:
 *        sheet:
 *          $ref: '#/components/schemas/Sheet'
 *        list:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Attendance'
 *    MarkByQrPostResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *    AttendanceListPostResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *        sheet:
 *          type: string
 *    SubjectAttendanceReportRequest:
 *      type: object
 *      properties:
 *        subjectId:
 *          type: string
 *          default: Subject
 *    SubjectAttendanceReportResponse:
 *      type: object
 *      properties:
 *        subjectId:
 *          type: string
 *    AttendanceChartDataResponse:
 *      type: object
 *      properties:
 *        x:
 *          type: string
 *          format: date-time
 *        y:
 *          type: number
 *    AttendanceCalendarDataResponse:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *        date:
 *          type: string
 *          format: date-time
 *        color:
 *          type: string
 *          default: "#4caf50 or #ef5350"
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
 *          section:
 *            type: string
 *            default: Section
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
 *        leave:
 *          type: boolean
 *    MarkAttendanceByQRRequest:
 *      type: object
 *      properties:
 *        student:
 *          type: string
 *          default: Student
 *    GetAllSheetsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Sheet'
 *    Sheet:
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
 *          section:
 *            type: string
 *            default: Section
 *          subject:
 *              type: string
 *              default: Subject
 *          date:
 *            type: string
 *            format: date-time
 */

const attendanceSheetSchema = mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    subjectType: String,
    creditHours: String,
    date: Date,
  },
  { timestamps: true },
)

const attendanceSchema = mongoose.Schema(
  {
    sheet: { type: mongoose.Schema.Types.ObjectId, ref: 'Sheet' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    present: Boolean,
    leave: Boolean,
    date: Date,
  },
  { timestamps: true },
)

module.exports = {
  Attendance: mongoose.model('Attendance', attendanceSchema),
  Sheet: mongoose.model('Sheet', attendanceSheetSchema),
}
