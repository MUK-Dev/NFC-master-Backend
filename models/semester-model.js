const mongoose = require('mongoose')

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterSemesterRequest:
 *      type: object
 *      properties:
 *        semester_title:
 *          type: string
 *        type:
 *          type: string
 *        starting_year:
 *          type: string
 *        ending_year:
 *          type: string
 *        department:
 *          type: string
 *          format: uuid
 *        program:
 *          type: string
 *          format: uuid
 *        session:
 *          type: string
 *          format: uuid
 *    RegisterSemesterResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *    AllSemestersResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Semester'
 *    Semester:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        semester_title:
 *          type: string
 *        type:
 *          type: string
 *        starting_year:
 *          type: string
 *        ending_year:
 *          type: string
 *        department:
 *          type: string
 *          default: Department
 *        program:
 *          type: string
 *          default: Program
 *        session:
 *          type: string
 *          default: Session
 *        change_history:
 *          type: array
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const semesterSchema = mongoose.Schema(
  {
    semester_title: String,
    type: String,
    starting_year: String,
    ending_year: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Semester', semesterSchema)
