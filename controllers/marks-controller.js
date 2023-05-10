const { Student } = require('../models/user-models')
const { MarkSheet, StudentMark } = require('../models/mark-model')
const Subject = require('../models/subject-model')
const { GPA, GRADE } = require('../utils/gpaGrade')

const studentMarks = async (req, res, next) => {
  console.log(req.body, '6')
  const count = await MarkSheet.countDocuments({
    subject: req.body.subject,
    section: req.body.section,
  })
  console.log(count, '11')
  if (count > 0) {
    try {
      const markList = await MarkSheet.findOne({
        subject: req.body.subject,
        section: req.body.section,
      })
      console.log(markList._id, '18')
      const studentMarkList = await StudentMark.find({
        markSheet: markList._id,
      }).populate('student')

      const modifiedUserArray = studentMarkList.map(user => ({
        _id: user.student._id,
        rollNo: user.student.rollNo,
        name: user.student.name,
        avatar: user.student.avatar,
        mids: user.mids,
        sessional: user.sessional,
        finals: user.finals,
        lab_final: user.lab_final,
        lab_sessional: user.lab_sessional,
      }))

      modifiedUserArray.sort(function (a, b) {
        return a.rollNo - b.rollNo
      })

      return res.send(modifiedUserArray)
    } catch (err) {
      console.log(err, '41')
    }
  } else {
    try {
      const studentList = await Student.find({
        session: req.body.session,
        section: req.body.section,
        program: req.body.program,
      })
        .select('-password')
        .sort({ rollNo: 1 })

      const modifiedUserArray = studentList.map(user => ({
        _id: user._id,
        rollNo: user.rollNo,
        name: user.name,
        avatar: user.avatar,
        mids: '',
        sessional: '',
        finals: '',
        lab_final: '',
        lab_sessional: '',
      }))

      return res.send(modifiedUserArray)
    } catch (err) {
      console.log(err, '67')
    }
  }
}

const markMarksList = async (req, res, next) => {
  const {
    theory_teacher,
    lab_teacher,
    department,
    program,
    session,
    semester,
    subject,
    section,
    date,
    list,
  } = req.body

  const required = {
    theory_teacher,
    lab_teacher,
    department,
    program,
    session,
    section,
    semester,
    subject,
    date,
    list,
  }
  console.log(req.body, '172')

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  const theory_count = await MarkSheet.countDocuments({
    theory_teacher,
    subject,
    section,
  })
  const lab_count = await MarkSheet.countDocuments({
    lab_teacher,
    subject,
    section,
  })
  // console.log(theory_count, lab_count)
  if (theory_count > 0 || lab_count > 0) {
    return res
      .status(500)
      .send({ type: 'sheet', message: 'Mark already Entered' })
  } else {
    const count = await MarkSheet.countDocuments({
      subject: req.body.subject,
      section: req.body.section,
    })
    // console.log('first else', count)
    if (count > 0) {
      console.log('2nd if')
      const markList = await MarkSheet.findOne({
        subject: req.body.subject,
        section: req.body.section,
      })
      console.log('207', markList)

      try {
        const listStudent = await StudentMark.findOne({
          markSheet: markList._id,
        })
        console.log('213', listStudent)
        console.log(214, listStudent.lab_final)
        if (listStudent.lab_final) {
          console.log(216, listStudent.lab_final)
          await MarkSheet.updateOne(
            {
              _id: markList._id,
            },
            {
              $set: {
                theory_teacher: req.body.theory_teacher,
              },
            },
          )
        } else {
          await MarkSheet.updateOne(
            {
              _id: markList._id,
            },
            {
              $set: {
                lab_teacher: req.body.lab_teacher,
              },
            },
          )
        }
      } catch (err) {
        console.log(err)
      }

      try {
        const selectedSubject = await Subject.findById(subject)
        const theory_hours = selectedSubject.theory_hours
        const lab_hours = selectedSubject.lab_hours
        for (let item of list) {
          const theory_total =
            parseFloat(item.mids) +
            parseFloat(item.finals) +
            parseFloat(item.sessional)
          const lab_total =
            parseFloat(item.lab_final) + parseFloat(item.lab_sessional)
          const total =
            (parseFloat(theory_total) * parseFloat(theory_hours) +
              parseFloat(lab_total) * parseFloat(lab_hours)) /
            (parseFloat(theory_hours) + parseFloat(lab_hours))
          const gpa = GPA(total)
          const grade = GRADE(gpa)

          // console.log(item.mids, item.finals, item.sessional, item.student)

          await StudentMark.updateOne(
            {
              markSheet: markList._id,
              student: item.student,
            },
            {
              $set: {
                mids: item.mids,
                finals: item.finals,
                sessional: item.sessional,
                theory_total: theory_total,
                total: total,
                gpa: gpa,
                grade: grade,
                lab_final: item.lab_final,
                lab_sessional: item.lab_sessional,
                lab_total: lab_total,
              },
            },
          )
        }
      } catch (err) {
        console.log(err)
        return res
          .status(500)
          .send({ type: 'server', message: 'Something went wrong' })
      }

      res.status(200).send({ message: 'Result Marked', type: 'mark-result' })
      console.log('Here 278')
    } else {
      const markSheet = MarkSheet({
        theory_teacher,
        lab_teacher,
        department,
        program,
        session,
        section,
        semester,
        subject,
        date,
      })

      try {
        await markSheet.save()
        console.log('sheet saved')
      } catch (err) {
        console.log(err)
        return res
          .status(500)
          .send({ type: 'sheet', message: 'Could not save mark sheet' })
      }

      const selectedSubject = await Subject.findById(subject)
      const theory_hours = selectedSubject.theory_hours
      const lab_hours = selectedSubject.lab_hours

      for (let item of list) {
        let total = 0
        let theory_total = 0
        let lab_total = 0
        let gpa = 0
        let grade = 'F'
        if (
          !(item.mids === '' && item.lab_final === '') ||
          lab_hours === '0' ||
          theory_hours === '0'
        ) {
          theory_total =
            parseFloat(item.mids) +
            parseFloat(item.finals) +
            parseFloat(item.sessional)
          lab_total =
            parseFloat(item.lab_final) + parseFloat(item.lab_sessional)
          total =
            (parseFloat(theory_total) * parseFloat(theory_hours) +
              parseFloat(lab_total) * parseFloat(lab_hours)) /
            (parseFloat(theory_hours) + parseFloat(lab_hours))
          gpa = GPA(total)
          grade = GRADE(gpa)
        }
        console.log(item)

        const singleStudentMarks = StudentMark({
          ...item,
          markSheet: markSheet._id,
          theory_total,
          lab_total,
          total,
          gpa,
          grade,
        })
        try {
          await singleStudentMarks.save()
          console.log('mark Saved')
        } catch (err) {
          console.log(err)
          return res
            .status(500)
            .send({ type: 'sheet', message: 'Could not save marks Student' })
        }
      }

      res.status(200).send({
        message: 'success',
        type: 'mark-marks',
        markSheet: markSheet._id,
      })
    }
  }
}

const updateMarkList = async (req, res) => {
  const { subject, list } = req.body
  console.log('373', list)

  try {
    const selectedSubject = await Subject.findById(subject)
    const theory_hours = selectedSubject.theory_hours
    const lab_hours = selectedSubject.lab_hours
    if (lab_hours === '3') {
      console.log('line 380 3 entered')
    }
    for (let item of list) {
      let total = 0
      let theory_total = 0
      let lab_total = 0
      let gpa = 0
      let grade = 'F'
      if (
        !(item.mids === '' && item.lab_final === '') ||
        lab_hours === '0' ||
        theory_hours === '0'
      ) {
        theory_total =
          parseFloat(item.mids) +
          parseFloat(item.finals) +
          parseFloat(item.sessional)
        lab_total = parseFloat(item.lab_final) + parseFloat(item.lab_sessional)
        total =
          (parseFloat(theory_total) * parseFloat(theory_hours) +
            parseFloat(lab_total) * parseFloat(lab_hours)) /
          (parseFloat(theory_hours) + parseFloat(lab_hours))
        gpa = GPA(total)
        grade = GRADE(gpa)
      }

      // console.log(item.mids, item.finals, item.sessional, item.student)

      await StudentMark.updateOne(
        {
          markSheet: req.params.sheetId,
          _id: item.student,
        },
        {
          $set: {
            mids: item.mids,
            finals: item.finals,
            sessional: item.sessional,
            theory_total: theory_total,
            total: total,
            gpa: gpa,
            grade: grade,
            lab_final: item.lab_final,
            lab_sessional: item.lab_sessional,
            lab_total: lab_total,
          },
        },
      )
    }
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ type: 'server', message: 'Something went wrong' })
  }

  res.status(200).send({ message: 'Marked attendance', type: 'mark-result' })
}

module.exports = {
  studentMarks,
  markMarksList,
  updateMarkList,
}
