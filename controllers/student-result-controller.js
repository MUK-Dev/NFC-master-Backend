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
    Object.keys(resultsBySemester)?.map((row, i) => {
      const semesterArray = {
        sGPA: 0,
        sGrade: 'F',
        semester_hours: 0,
        semester_total: 0,
      }
      for (let result of resultsBySemester[row]) {
        if (!semesterResult[row]) {
          semesterResult[row] = []
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
    })

    console.log('71', semesterResult)

    console.log('Result Sheet')
    res.status(200).send({
      result: semesterResult,
      detailResult: resultsBySemester,
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({ type: 'server', message: 'Something went wrong' })
  }
}

module.exports = {
  studentAllResult,
}
