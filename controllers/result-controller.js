const { MarkSheet, StudentMark } = require('../models/mark-model')

const getAllResultSheets = async (req, res) => {
  try {
    const resultSheets = await MarkSheet.find({
      teacher: req.userInfo.tokenUser.id,
    })
      .sort({ date: -1 })
      .populate([
        'department',
        'program',
        'session',
        'section',
        'semester',
        'subject',
      ])
    console.log('Get all result Sheet')
    res.status(200).send(resultSheets)
  } catch (err) {
    console.log(err)
    res.status(500).send({ type: 'server', message: 'Something went wrong' })
  }
}

const findResultSheetById = async (req, res) => {
  console.log(req.params.sheetId)
  try {
    const resultSheet = await MarkSheet.findById(req.params.sheetId).populate([
      'department',
      'program',
      'session',
      'section',
      'semester',
      'subject',
    ])
    const resultList = await StudentMark.find({
      markSheet: req.params.sheetId,
    }).populate('student')

    res.status(200).send({
      resultSheet,
      list: resultList,
      subject_Id: resultSheet.subject._id,
      session_title: resultSheet.session.session_title,
      program_abbreviation: resultSheet.program.program_abbreviation,
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({ type: 'server', message: 'Something went wrong' })
  }
}

module.exports = {
  getAllResultSheets,
  findResultSheetById,
}
