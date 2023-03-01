const mongoose = require('mongoose')

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterSubjectRequest:
 *      type: object
 *      properties:
 *        subject_title:
 *          type: string
 *        type:
 *          type: string
 *        subject_code:
 *          type: string
 *        theory_hours:
 *          type: string
 *        lab_hours:
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
 *        semester:
 *          type: string
 *          format: uuid
 *    RegisterSubjectResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *    AllSubjectsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Subject'
 *    Subject:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        subject_title:
 *          type: string
 *        type:
 *          type: string
 *        subject_code:
 *          type: string
 *        theory_hours:
 *          type: string
 *        lab_hours:
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
 *        semester:
 *          type: string
 *          default: Semester
 *        change_history:
 *          type: array
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const subjectSchema = mongoose.Schema(
  {
    subject_title: String,
    type: String,
    subject_code: String,
    theory_hours: String,
    lab_hours: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester' },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Subject', subjectSchema)
