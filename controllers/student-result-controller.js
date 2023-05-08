const { StudentMark } = require('../models/mark-model')

const studentAllResult = async (req, res, next) => {
  try {
    const studentResult = await StudentMark.find({
      student: req.userInfo.tokenUser.id,
    }).populate({
      path: 'markSheet',
      populate: ['semester', 'teacher', 'subject'],
    })

    const modifiedResultArray = studentResult.map(data => ({
      _id: data._id,
      mids: data.mids,
      finals: data.finals,
      sessional: data.sessional,
      total: data.total,
      gpa: data.gpa,
      grade: data.grade,
      semester_title: data.markSheet.semester.semester_title,
      subject_code: data.markSheet.subject.subject_code,
      subject_title: data.markSheet.subject.subject_title,
      teacher: data.markSheet.teacher.name,
    }))

    modifiedResultArray.sort(function (a, b) {
      return a.semester_title - b.semester_title
    })

    console.log('Result Sheet')
    res.status(200).send(modifiedResultArray)
  } catch (err) {
    console.log(err)
    res.status(500).send({ type: 'server', message: 'Something went wrong' })
  }
}

module.exports = {
  studentAllResult,
}
