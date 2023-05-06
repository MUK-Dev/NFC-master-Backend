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
 *            $ref: '#/components/schemas/Mark'
 *    MarkListPostResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *        sheet:
 *          type: string
 *    MarkChartDataResponse:
 *      type: object
 *      properties:
 *        x:
 *          type: string
 *          format: date-time
 *        y:
 *          type: number
 *    MarkCalendarDataResponse:
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
 *    MarkListRequest:
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
 *              $ref: '#/components/schemas/Mark'
 *    Mark:
 *      type: object
 *      properties:
 *        student:
 *          type: string
 *          default: Student
 *        mids:
 *          type: number
 *          default: 20
 *        finals:
 *          type: number
 *          default: 30
 *        sessional:
 *          type: number
 *          default: 15
 *        total:
 *          type: number
 *          default: 65
 *        gpa:
 *          type: number
 *          default: 2.7
 *        grade:
 *          type: string
 *          default: B-
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

const markSheetSchema = mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    date: Date,
  },
  { timestamps: true },
)

const markSchema = mongoose.Schema(
  {
    markSheet: { type: mongoose.Schema.Types.ObjectId, ref: 'MarkSheet' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    mids: Number,
    finals: Number,
    sessional: Number,
    total: Number,
    gpa: Number,
    grade: String,
    date: Date,
  },
  { timestamps: true },
)

module.exports = {
  StudentMark: mongoose.model('StudentMark', markSchema),
  MarkSheet: mongoose.model('MarkSheet', markSheetSchema),
}
