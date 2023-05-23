const { StudentMark } = require('../models/mark-model')
const { GRADE } = require('../utils/gpaGrade')

function generateUniqueArray(arr) {
  const uniqueNames = new Map()
  for (const obj of arr) {
    const { subject_code, total } = obj
    if (uniqueNames.has(subject_code)) {
      if (total > uniqueNames.get(subject_code).total) {
        uniqueNames.set(subject_code, obj)
      }
    } else {
      uniqueNames.set(subject_code, obj)
    }
  }
  return Array.from(uniqueNames.values())
}

const studentAllResult = async (req, res, next) => {
  const id = req.body.studentId
  try {
    const studentResult = await StudentMark.find({
      student: id,
    }).populate({
      path: 'markSheet',
      populate: ['semester', 'theory_teacher', 'subject'],
    })

    const studentResultArray = studentResult.map(data => ({
      _id: data._id,
      mids: data.mids,
      finals: data.finals,
      sessional: data.sessional,
      theory_total: data.theory_total,
      lab_final: data.lab_final,
      lab_sessional: data.lab_sessional,
      lab_total: data.lab_total,
      total: data.total,
      gpa: data.gpa,
      grade: data.grade,
      semester_title: data.markSheet.semester.semester_title,
      subject_code: data.markSheet.subject.subject_code,
      subject_title: data.markSheet.subject.subject_title,
      subject_theory: data.markSheet.subject.theory_hours,
      subject_lab: data.markSheet.subject.lab_hours,
      theory_teacher: data.markSheet.theory_teacher.name,
    }))

    const modifiedResultArray = generateUniqueArray(studentResultArray)

    const resultsBySemester = {}
    if (modifiedResultArray) {
      for (let result of modifiedResultArray) {
        if (!resultsBySemester[result.semester_title]) {
          resultsBySemester[result.semester_title] = []
        }
        resultsBySemester[result.semester_title].push(result)
      }
    }

    const semesterResult = {}
    const overallResult = {}
    const resultArray = {
      cGPA: 0,
      cGrade: 'F',
      pcGPA: 0,
      pcGrade: 'F',
      overall_hours: 0,
      overall_total: 0,
    }
    Object.keys(resultsBySemester)?.map((row, i) => {
      const overallArray = {
        cGPA: resultArray.cGPA,
        cGrade: resultArray.cGrade,
        pcGPA: resultArray.pcGPA,
        pcGrade: resultArray.pcGrade,
        overall_hours: resultArray.overall_hours,
        overall_total: resultArray.overall_total,
      }
      const semesterArray = {
        sGPA: 0,
        sGrade: 'F',
        semester_hours: 0,
        semester_total: 0,
      }
      for (let result of resultsBySemester[row]) {
        if (!semesterResult[row]) {
          semesterResult[row] = []
          overallResult[row] = []
        }
        semesterArray.semester_total = (
          parseFloat(semesterArray.semester_total) +
          parseFloat(result.gpa) *
            (parseFloat(result.subject_theory) + parseFloat(result.subject_lab))
        ).toFixed(2)
        semesterArray.semester_hours = (
          parseFloat(semesterArray.semester_hours) +
          parseFloat(result.subject_theory) +
          parseFloat(result.subject_lab)
        ).toFixed(2)
      }
      semesterArray.sGPA = (
        parseFloat(semesterArray.semester_total) /
        parseFloat(semesterArray.semester_hours)
      ).toFixed(2)
      semesterArray.sGrade = GRADE(semesterArray.sGPA)
      semesterResult[row] = semesterArray

      overallArray.pcGPA = overallArray.cGPA
      overallArray.pcGrade = overallArray.cGrade
      overallArray.overall_total = (
        parseFloat(overallArray.overall_total) +
        parseFloat(semesterArray.semester_total)
      ).toFixed(2)
      overallArray.overall_hours = (
        parseFloat(overallArray.overall_hours) +
        parseFloat(semesterArray.semester_hours)
      ).toFixed(2)
      overallArray.cGPA = (
        parseFloat(overallArray.overall_total) /
        parseFloat(overallArray.overall_hours)
      ).toFixed(2)
      overallArray.cGrade = GRADE(overallArray.cGPA)

      overallResult[row] = overallArray

      resultArray.cGPA = overallArray.cGPA
      resultArray.cGrade = overallArray.cGrade
      resultArray.pcGPA = overallArray.pcGPA
      resultArray.pcGrade = overallArray.pcGrade
      resultArray.overall_hours = overallArray.overall_hours
      resultArray.overall_total = overallArray.overall_total
    })
    res.status(200).send({
      result: semesterResult,
      detailResult: resultsBySemester,
      overall: overallResult,
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({ type: 'server', message: 'Something went wrong' })
  }
}

const studentPDFResult = async (req, res, next) => {
  const id = req.body.studentId
  try {
    const studentResult = await StudentMark.find({
      student: id,
    }).populate({
      path: 'markSheet',
      populate: ['semester', 'theory_teacher', 'subject', 'program', 'session'],
    })
    const values = {
      session_title: studentResult[0].markSheet.session.session_title,
      session_start: studentResult[0].markSheet.session.starting_year,
      session_end: studentResult[0].markSheet.session.ending_year,
      program_title: studentResult[0].markSheet.program.program_title,
      program_abbreviation:
        studentResult[0].markSheet.program.program_abbreviation,
    }

    const studentResultArray = studentResult.map(data => ({
      _id: data._id,
      mids: data.mids,
      finals: data.finals,
      sessional: data.sessional,
      theory_total: data.theory_total,
      lab_final: data.lab_final,
      lab_sessional: data.lab_sessional,
      lab_total: data.lab_total,
      total: data.total,
      gpa: data.gpa,
      grade: data.grade,
      semester_title: data.markSheet.semester.semester_title,
      subject_code: data.markSheet.subject.subject_code,
      subject_title: data.markSheet.subject.subject_title,
      subject_theory: data.markSheet.subject.theory_hours,
      subject_lab: data.markSheet.subject.lab_hours,
      theory_teacher: data.markSheet.theory_teacher.name,
    }))

    const modifiedResultArray = generateUniqueArray(studentResultArray)

    const resultsBySemester = {}
    if (modifiedResultArray) {
      for (let result of modifiedResultArray) {
        if (!resultsBySemester[result.semester_title]) {
          resultsBySemester[result.semester_title] = []
        }
        resultsBySemester[result.semester_title].push(result)
      }
    }

    const tableColumn = {}
    const tableRows = {}

    const semesterResult = {}
    const overallResult = {}
    const resultArray = {
      cGPA: 0,
      cGrade: 'F',
      pcGPA: 0,
      pcGrade: 'F',
      overall_hours: 0,
      overall_total: 0,
    }
    Object.keys(resultsBySemester)?.map(row => {
      tableColumn[row] = [
        'Course Code',
        'Course Title',
        'GPA',
        'Grade',
        'Credit Hours',
      ]
      const overallArray = {
        cGPA: resultArray.cGPA,
        cGrade: resultArray.cGrade,
        pcGPA: resultArray.pcGPA,
        pcGrade: resultArray.pcGrade,
        overall_hours: resultArray.overall_hours,
        overall_total: resultArray.overall_total,
      }
      const semesterArray = {
        sGPA: 0,
        sGrade: 'F',
        semester_hours: 0,
        semester_total: 0,
      }
      let i = 0
      const tableRow = []
      for (let result of resultsBySemester[row]) {
        if (!semesterResult[row]) {
          semesterResult[row] = []
          overallResult[row] = []
        }
        semesterArray.semester_total = (
          parseFloat(semesterArray.semester_total) +
          parseFloat(result.gpa) *
            (parseFloat(result.subject_theory) + parseFloat(result.subject_lab))
        ).toFixed(2)
        semesterArray.semester_hours = (
          parseFloat(semesterArray.semester_hours) +
          parseFloat(result.subject_theory) +
          parseFloat(result.subject_lab)
        ).toFixed(2)
        tableRow[i] = [
          result.subject_code,
          result.subject_title,
          result.gpa,
          result.grade,
          `${result.subject_theory}+${result.subject_lab}`,
        ]
        i++
      }
      semesterArray.sGPA = (
        parseFloat(semesterArray.semester_total) /
        parseFloat(semesterArray.semester_hours)
      ).toFixed(2)
      semesterArray.sGrade = GRADE(semesterArray.sGPA)
      semesterResult[row] = semesterArray

      tableRow[i] = [
        ,
        `Semester ${row} SGPA`,
        semesterArray.sGPA,
        semesterArray.sGrade,
      ]
      i++

      overallArray.pcGPA = overallArray.cGPA
      overallArray.pcGrade = overallArray.cGrade
      overallArray.overall_total = (
        parseFloat(overallArray.overall_total) +
        parseFloat(semesterArray.semester_total)
      ).toFixed(2)
      overallArray.overall_hours = (
        parseFloat(overallArray.overall_hours) +
        parseFloat(semesterArray.semester_hours)
      ).toFixed(2)
      overallArray.cGPA = (
        parseFloat(overallArray.overall_total) /
        parseFloat(overallArray.overall_hours)
      ).toFixed(2)
      overallArray.cGrade = GRADE(overallArray.cGPA)

      tableRow[i] = [
        ,
        `Semester ${row} CGPA`,
        overallArray.cGPA,
        overallArray.cGrade,
      ]
      tableRows[row] = tableRow

      overallResult[row] = overallArray

      resultArray.cGPA = overallArray.cGPA
      resultArray.cGrade = overallArray.cGrade
      resultArray.pcGPA = overallArray.pcGPA
      resultArray.pcGrade = overallArray.pcGrade
      resultArray.overall_hours = overallArray.overall_hours
      resultArray.overall_total = overallArray.overall_total
    })

    res.status(200).send({
      values,
      tableColumn,
      tableRows,
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({ type: 'server', message: 'Something went wrong' })
  }
}

module.exports = {
  studentAllResult,
  studentPDFResult,
}
