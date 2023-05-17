const { MarkSheet, StudentMark } = require('../models/mark-model')

const getAllResultSheets = async (req, res) => {
  try {
    const resultSheets = await MarkSheet.find({
      $or: [
        { theory_teacher: req.userInfo.tokenUser.id },
        { lab_teacher: req.userInfo.tokenUser.id },
      ],
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
    res.status(200).send(resultSheets)
  } catch (err) {
    console.log(err)
    res.status(500).send({ type: 'server', message: 'Something went wrong' })
  }
}

const findResultSheetById = async (req, res) => {
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

const generateClassResultReport = async (req, res) => {
  const { sheetId } = req.body
  try {
    const sheet = await MarkSheet.findById({
      _id: sheetId,
    }).populate(['semester', 'theory_teacher', 'subject', 'program', 'session'])
    const values = {
      semester_title: sheet.semester.semester_title,
      session_title: sheet.session.session_title,
      session_start: sheet.session.starting_year,
      session_end: sheet.session.ending_year,
      program_title: sheet.program.program_title,
      program_abbreviation: sheet.program.program_abbreviation,
      subject_code: sheet.subject.subject_code,
      subject_name: sheet.subject.subject_title,
      teacher_name: sheet.theory_teacher.name,
    }

    const tableColumn = ['Sr.', 'Roll No.', 'Name']
    const tableRows = []

    if (!(sheet.subject.theory_hours === '0')) {
      tableColumn.push('Theory Mids')
      tableColumn.push('Theory Finals')
      tableColumn.push('Theory Sessional')
      tableColumn.push('Theory Totals')
    } else {
      tableColumn.push('Theory')
    }
    if (!(sheet.subject.lab_hours === '0')) {
      tableColumn.push('Lab Finals')
      tableColumn.push('Lab Sessional')
      tableColumn.push('Lab Totals')
    } else {
      tableColumn.push('Lab')
    }
    tableColumn.push('Subject Totals')
    tableColumn.push('Subject GPA')
    tableColumn.push('Subject Grade')

    const classResultRecords = await StudentMark.find({
      markSheet: sheetId,
    })
      .sort({ rollNo: 1 })
      .populate('student')

    for (let j = 0; j < classResultRecords.length; j++) {
      if (!!!tableRows[j]) {
        if (
          sheet.subject.theory_hours === '0' &&
          !(sheet.subject.lab_hours === '0')
        ) {
          tableRows[j] = [
            j + 1,
            `${sheet.session.session_title}-${sheet.program.program_abbreviation}-${classResultRecords[j].student.rollNo}`,
            classResultRecords[j].student.name,
            'NO',
            classResultRecords[j].lab_final,
            classResultRecords[j].lab_sessional,
            classResultRecords[j].lab_total,
            classResultRecords[j].total,
            classResultRecords[j].gpa,
            classResultRecords[j].grade,
          ]
        } else if (
          sheet.subject.lab_hours === '0' &&
          !(sheet.subject.theory_hours === '0')
        ) {
          tableRows[j] = [
            j + 1,
            `${sheet.session.session_title}-${sheet.program.program_abbreviation}-${classResultRecords[j].student.rollNo}`,
            classResultRecords[j].student.name,
            classResultRecords[j].mids,
            classResultRecords[j].finals,
            classResultRecords[j].sessional,
            classResultRecords[j].theory_total,
            'NO',
            classResultRecords[j].total,
            classResultRecords[j].gpa,
            classResultRecords[j].grade,
          ]
        } else {
          tableRows[j] = [
            j + 1,
            `${sheet.session.session_title}-${sheet.program.program_abbreviation}-${classResultRecords[j].student.rollNo}`,
            classResultRecords[j].student.name,
            classResultRecords[j].mids,
            classResultRecords[j].finals,
            classResultRecords[j].sessional,
            classResultRecords[j].theory_total,
            classResultRecords[j].lab_final,
            classResultRecords[j].lab_sessional,
            classResultRecords[j].lab_total,
            classResultRecords[j].total,
            classResultRecords[j].gpa,
            classResultRecords[j].grade,
          ]
        }
      } else tableRows[j].push('null')
    }
    return res.send({
      values,
      tableColumn,
      tableRows,
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getAllResultSheets,
  findResultSheetById,
  generateClassResultReport,
}
