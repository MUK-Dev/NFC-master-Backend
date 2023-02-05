const Model = require('../models/program-model')
const HttpError = require('../utils/HttpError')

const registerProgram = async (req, res, next) => {
  const { program_title, type, starting, ending, department } = req.body
  const required = { program_title, type, starting, ending, department }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  const program = Model({ program_title, type, starting, ending, department })

  try {
    await program.save()
    res.status(202).send({
      message: 'Successfully Registered',
      type: 'program',
    })
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'program' })
  }
}

module.exports = {
  registerProgram,
}