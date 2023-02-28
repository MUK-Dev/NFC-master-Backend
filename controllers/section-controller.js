const Model = require('../models/section-model')

const registerSection = async (req, res) => {
  const { section_title, department, program } = req.body
  const required = {
    section_title,
    department,
    program,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  const section = Model({
    section_title,
    department,
    program,
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

const getAllSections = async (req, res, next) => {
  try {
    const data = await Model.find().populate(['department', 'program'])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'sections' })
  }
}

module.exports = {
  registerSection,
  getAllSections,
}
