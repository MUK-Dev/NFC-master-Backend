const mongoose = require('mongoose')

/**
 * @openapi
 * components:
 *  schemas:
 *    RegisterDepartmentRequest:
 *      type: object
 *      properties:
 *        department_name:
 *          type: string
 *        department_abbreviation:
 *          type: string
 *        no_of_programs:
 *          type: string
 *        lat:
 *          type: number
 *        lng:
 *          type: number
 *    UpdateDepartmentRequest:
 *      type: object
 *      properties:
 *        department_name:
 *          type: string
 *        department_abbreviation:
 *          type: string
 *        no_of_programs:
 *          type: string
 *        location:
 *          type: object
 *          properties:
 *            lat:
 *              type: number
 *            lng:
 *              type: number
 *    RegisterDepartmentResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        type:
 *          type: string
 *    AllDepartmentResponse:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/Department'
 *    Department:
 *      type: object
 *      properties:
 *        location:
 *          type: object
 *          properties:
 *            lat:
 *              type: number
 *            lng:
 *              type: number
 *        _id:
 *          type: string
 *        department_name:
 *          type: string
 *        department_abbreviation:
 *          type: string
 *        no_of_programs:
 *          type: number
 *        change_history:
 *          type: array
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

const departmentSchema = mongoose.Schema(
  {
    department_name: String,
    department_abbreviation: String,
    no_of_programs: Number,
    location: {
      lat: Number,
      lng: Number,
    },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Department', departmentSchema)
