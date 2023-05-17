const Model = require('../models/session-model')

const registerSession = async (req, res, next) => {
  const {
    session_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
  } = req.body

  const required = {
    session_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  try {
    const existingSessions = await Model.find({
      session_title,
      department,
      program,
      type,
    })
    if (existingSessions.length > 0)
      return res.status(404).send({
        message: 'This session is already registered in this department',
        type: 'session',
      })
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'server' })
  }

  const session = Model({
    session_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
  })

  try {
    await session.save()
    res.status(202).send({
      type: 'session',
      message: 'Successfully Registered',
    })
  } catch (e) {
    console.error(e)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'session' })
  }
}

const getAllDependentSessions = async (req, res, next) => {
  try {
    const data = await Model.find({
      department: req.query.department,
      program: req.query.program,
    }).populate(['department', 'program'])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'sessions' })
  }
}

const getAllSessions = async (req, res) => {
  try {
    const data = await Model.find().populate(['department', 'program'])
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'sessions' })
  }
}

const getSessionById = async (req, res) => {
  const { sessionId } = req.params
  try {
    const data = await Model.findById(sessionId)
    if (!data)
      return res
        .status(404)
        .send({ message: 'Could not find any session', type: 'session' })
    res.status(200).send(data)
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'session' })
  }
}

const updateSession = async (req, res) => {
  const { sessionId } = req.params
  const { _id, ...rest } = req.body

  try {
    await Model.findOneAndReplace({ _id: sessionId }, { ...rest })
    return res
      .status(200)
      .send({ message: 'Successfully updated', type: 'session' })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ message: 'Something went wrong', type: 'session' })
  }
}

// const deleteSession = async (req,res) => {
//   const { sessionId } = req.params
//   try {
//     const data = await Model.findByIdAndDelete(sessionId)
//     res.status(200).send({message: 'Deleted successfully', type: 'session'})
//   } catch (err) {
//     return res
//       .status(500)
//       .send({ message: 'Something went wrong', type: 'session' })
//   }
// }

module.exports = {
  registerSession,
  getAllDependentSessions,
  getAllSessions,
  getSessionById,
  updateSession,
}
