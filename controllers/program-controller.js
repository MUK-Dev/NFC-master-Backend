const Model = require('../models/program-model')

const registerProgram = async (req, res, next) => {
  const {
    program_title,
    program_abbreviation,
    type,
    starting,
    ending,
    department,
  } = req.body

  const required = {
    program_title,
    program_abbreviation,
    type,
    starting,
    ending,
    department,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  try {
    const existingProgram = await Model.find({ program_title })
    if (existingProgram.length > 0)
      return res.status(404).send({
        message: 'Another program is already registered by this name',
        type: 'program',
      })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'server' })
  }

  const program = Model({
    program_title,
    program_abbreviation,
    type,
    starting,
    ending,
    department,
  })

  try {
    await program.save()
    res.status(202).send({
      message: 'Successfully Registered',
      type: 'program',
    })
  } catch (e) {
    console.error(e.message)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'program' })
  }
}

const getAllDependentPrograms = async (req, res, next) => {
  try {
    const data = await Model.find({
      department: req.query.department,
    }).populate('department')
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'programs' })
  }
}

const getAllPrograms = async (req, res, next) => {
  try {
    const data = await Model.find().populate('department')
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'programs' })
  }
}

const getProgramById = async (req, res) => {
  const { programId } = req.params
  try {
    const data = await Model.findById(programId)
    if (!data)
      return res
        .status(404)
        .send({ message: 'Could not find any program', type: 'program' })
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'program' })
  }
}

const updateProgram = async (req, res) => {
  const { programId } = req.params
  const { _id, ...rest } = req.body

  try {
    await Model.findOneAndReplace({ _id: programId }, { ...rest })
    return res
      .status(200)
      .send({ message: 'Successfully updated', type: 'program' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'program' })
  }
}

module.exports = {
  registerProgram,
  getAllDependentPrograms,
  getAllPrograms,
  getProgramById,
  updateProgram,
}
