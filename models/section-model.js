const mongoose = require('mongoose')

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterSectionRequest:
 *      type: object
 *      properties:
 *        section_title:
 *          type: string
 *        department:
 *          type: string
 *          format: uuid
 *        program:
 *          type: string
 *          format: uuid
 *    RegisterSectionResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *    AllSectionsResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Session'
 *    Session:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        section_title:
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

const sectionSchema = mongoose.Schema(
  {
    section_title: String,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Section', sectionSchema)
