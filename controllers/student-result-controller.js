const { StudentMark } = require('../models/mark-model')
const { GRADE } = require('../utils/gpaGrade')

const studentAllResult = async (req, res, next) => {
  try {
    const studentResult = await StudentMark.find({
      student: req.userInfo.tokenUser.id,
    }).populate({
      path: 'markSheet',
      populate: ['semester', 'theory_teacher', 'subject'],
    })

    const modifiedResultArray = studentResult.map(data => ({
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
    console.log('29', modifiedResultArray)

    const resultsBySemester = {}
    if (modifiedResultArray) {
      for (let result of modifiedResultArray) {
        if (!resultsBySemester[result.semester_title]) {
          resultsBySemester[result.semester_title] = []
        }
        resultsBySemester[result.semester_title].push(result)
      }

      console.log('43', resultsBySemester)
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

      console.log('101', row)
      console.log('102', resultArray)

      overallResult[row] = overallArray

      resultArray.cGPA = overallArray.cGPA
      resultArray.cGrade = overallArray.cGrade
      resultArray.pcGPA = overallArray.pcGPA
      resultArray.pcGrade = overallArray.pcGrade
      resultArray.overall_hours = overallArray.overall_hours
      resultArray.overall_total = overallArray.overall_total
    })

    console.log('106', overallResult)
    console.log('107', semesterResult)

    console.log('Result Sheet')
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
  try {
    const studentResult = await StudentMark.find({
      student: req.userInfo.tokenUser.id,
    }).populate({
      path: 'markSheet',
      populate: ['semester', 'theory_teacher', 'subject'],
    })

    const modifiedResultArray = studentResult.map(data => ({
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
    console.log('29', modifiedResultArray)

    const resultsBySemester = {}
    if (modifiedResultArray) {
      for (let result of modifiedResultArray) {
        if (!resultsBySemester[result.semester_title]) {
          resultsBySemester[result.semester_title] = []
        }
        resultsBySemester[result.semester_title].push(result)
      }

      console.log('43', resultsBySemester)
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

    console.log('Student Result PDF')
    res.status(200).send({
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
