const mongoose = require('mongoose')

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterProgramRequest:
 *      type: object
 *      properties:
 *        program_title:
 *          type: string
 *        program_abbreviation:
 *          type: string
 *        type:
 *          type: string
 *        starting:
 *          type: string
 *          format: date-time
 *        ending:
 *          type: string
 *          format: date-time
 *        department:
 *          type: string
 *          format: uuid
 *    GeneralResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *    RegisterProgramResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *    AllProgramsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Program'
 *    Program:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        program_title:
 *          type: string
 *        program_abbreviation:
 *          type: string
 *        type:
 *          type: string
 *        starting:
 *          type: string
 *          format: date-time
 *        ending:
 *          type: string
 *          format: date-time
 *        department:
 *          type: string
 *          default: Department
 *        change_history:
 *          type: array
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const programSchema = mongoose.Schema(
  {
    program_title: String,
    program_abbreviation: String,
    type: String,
    starting: Date,
    ending: Date,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Program', programSchema)
