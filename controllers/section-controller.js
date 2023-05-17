const Model = require('../models/section-model')

const registerSection = async (req, res) => {
  const { section_title, department, program, session } = req.body
  const required = {
    section_title,
    department,
    program,
    session,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  try {
    const existingSections = await Model.find({
      section_title,
      department,
      program,
      session,
    })
    if (existingSections.length > 0)
      return res.status(404).send({
        message: 'This section is already registered in this department',
        type: 'section',
      })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'server' })
  }

  const section = Model({
    section_title,
    department,
    program,
    session,
  })

  try {
    await section.save()
    res.status(202).send({
      type: 'section',
      message: 'Successfully Registered',
    })
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'section' })
  }
}

const getAllDependentSections = async (req, res, next) => {
  try {
    const data = await Model.find({
      department: req.query.department,
      program: req.query.program,
      session: req.query.session,
    }).populate(['department', 'program', 'session'])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'sections' })
  }
}

const getAllSection = async (req, res) => {
  try {
    const data = await Model.find().populate([
      'department',
      'program',
      'session',
    ])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'sections' })
  }
}

const getSectionById = async (req, res) => {
  const { sectionId } = req.params
  try {
    const data = await Model.findById(sectionId)
    if (!data)
      return res
        .status(404)
        .send({ message: 'Could not find any section', type: 'section' })
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'section' })
  }
}

const updateSection = async (req, res) => {
  const { sectionId } = req.params
  const { _id, ...rest } = req.body

  try {
    await Model.findOneAndReplace({ _id: sectionId }, { ...rest })
    return res
      .status(200)
      .send({ message: 'Successfully updated', type: 'section' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'section' })
  }
}

module.exports = {
  registerSection,
  getAllDependentSections,
  getAllSection,
  getSectionById,
  updateSection,
}
