const mongoose = require('mongoose')

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterSessionRequest:
 *      type: object
 *      properties:
 *        session_title:
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
 *    RegisterSessionResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *    AllSessionsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Session'
 *    Session:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        session_title:
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
 *        change_history:
 *          type: array
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const sessionSchema = mongoose.Schema(
  {
    session_title: String,
    type: String,
    starting_year: String,
    ending_year: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Session', sessionSchema)
