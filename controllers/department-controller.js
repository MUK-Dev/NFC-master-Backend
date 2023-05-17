const Model = require('../models/department-model')

const registerDepartment = async (req, res, next) => {
  const { department_name, department_abbreviation, no_of_programs, lat, lng } =
    req.body
  const required = {
    department_name,
    department_abbreviation,
    no_of_programs,
    lat,
    lng,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  try {
    const existingDepartment = await Model.find({ department_name })
    if (existingDepartment.length > 0)
      return res.status(404).send({
        message: 'Another department is already registered by this name',
        type: 'department',
      })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'server' })
  }

  const department = Model({
    department_name,
    department_abbreviation,
    no_of_programs,
    location: {
      lat,
      lng,
    },
  })

  try {
    await department.save()
    res.status(202).send({
      message: 'Successfully Registered',
      type: 'department',
    })
  } catch (e) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'department' })
  }
}

const getAllDepartments = async (req, res, next) => {
  try {
    const data = await Model.find()
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'departments' })
  }
}

const getDepartmentById = async (req, res) => {
  const { departmentId } = req.params

  try {
    const data = await Model.findById(departmentId)
    if (!data)
      return res
        .status(404)
        .send({ message: 'Could not find any department', type: 'department' })
    return res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'department' })
  }
}

const updateDepartment = async (req, res) => {
  const { departmentId } = req.params
  const { _id, ...rest } = req.body

  try {
    await Model.findOneAndReplace({ _id: departmentId }, { ...rest })
    return res
      .status(200)
      .send({ message: 'Successfully updated', type: 'department' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'department' })
  }
}

module.exports = {
  registerDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
}
