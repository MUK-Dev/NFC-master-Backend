const { Student } = require('../models/user-models')
const { MarkSheet, StudentMark } = require('../models/mark-model')

const studentMarks = async (req, res, next) => {
  console.log(req.body)
  const count = await MarkSheet.countDocuments({
    subject: req.body.subject,
    section: req.body.section,
  })
  console.log(count)
  if (count > 0) {
    try {
      const markList = await MarkSheet.find({
        subject: req.body.subject,
        section: req.body.section,
      })

      console.log(markList)
      console.log(markList[0]._id)
      const studentMarkList = await StudentMark.find({
        markSheet: markList[0]._id,
      }).populate('student')

      const modifiedUserArray = studentMarkList.map(user => ({
        _id: user.student._id,
        rollNo: user.student.rollNo,
        name: user.student.name,
        avatar: user.student.avatar,
        mids: '',
        sessional: '',
        finals: '',
        lab_final: '',
        lab_sessional: '',
      }))

      modifiedUserArray.sort(function (a, b) {
        return a.rollNo - b.rollNo
      })

      return res.send(modifiedUserArray)
    } catch (err) {
      console.log(err)
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
      console.log(err)
    }
  }

  // modifiedUserArray.map(user => {
  //   const cgpa = user.mids + user.finals
  //   user.gpa = cgpa
  // })

  // res.status(200).send({ message: 'success', type: 'marks' })
}

function calculateGPA(total) {
  if (total >= 90) {
    return 4
  } else if (total >= 86) {
    return 3.9
  } else if (total >= 83) {
    return 3.8
  } else if (total >= 80) {
    return 3.7
  } else if (total >= 79) {
    return 3.6
  } else if (total >= 78) {
    return 3.5
  } else if (total >= 77) {
    return 3.4
  } else if (total >= 75) {
    return 3.3
  } else if (total >= 74) {
    return 3.2
  } else if (total >= 72) {
    return 3.1
  } else if (total >= 70) {
    return 3.0
  } else if (total >= 69) {
    return 2.9
  } else if (total >= 67) {
    return 2.8
  } else if (total >= 65) {
    return 2.7
  } else if (total >= 64) {
    return 2.6
  } else if (total >= 63) {
    return 2.5
  } else if (total >= 61) {
    return 2.4
  } else if (total >= 60) {
    return 2.3
  } else if (total >= 56) {
    return 2.2
  } else if (total >= 53) {
    return 2.1
  } else if (total >= 50) {
    return 2.0
  } else {
    return 0.0
  }
}
function calculateGrade(total) {
  if (total >= 90) {
    return 'A+'
  } else if (total >= 80) {
    return 'A'
  } else if (total >= 75) {
    return 'B+'
  } else if (total >= 70) {
    return 'B'
  } else if (total >= 65) {
    return 'B-'
  } else if (total >= 60) {
    return 'C+'
  } else if (total >= 50) {
    return 'C'
  } else {
    return 'F'
  }
}

const markMarksList = async (req, res, next) => {
  const {
    teacher,
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
    teacher,
    department,
    program,
    session,
    section,
    semester,
    subject,
    date,
    list,
  }

  for (let val in required) {
    if (!required[val]) {
      return res.status(404).send({ message: `${val} is required!`, type: val })
    }
  }

  const count = await MarkSheet.countDocuments({ teacher, subject, section })
  if (count > 0) {
    return res
      .status(500)
      .send({ type: 'sheet', message: 'Mark already Entered' })
  } else {
    const markSheet = MarkSheet({
      teacher,
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

    for (let item of list) {
      const total =
        parseInt(item.mids) + parseInt(item.finals) + parseInt(item.sessional)
      const gpa = calculateGPA(total)
      const grade = calculateGrade(total)

      const singleStudentMarks = StudentMark({
        ...item,
        markSheet: markSheet._id,
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

const updateMarkList = async (req, res) => {
  const { list } = req.body

  try {
    for (let item of list) {
      const total =
        parseInt(item.mids) + parseInt(item.finals) + parseInt(item.sessional)
      const gpa = calculateGPA(total)
      const grade = calculateGrade(total)

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
            total: total,
            gpa: gpa,
            grade: grade,
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

  res
    .status(200)
    .send({ message: 'Marked attendance', type: 'mark-attendance' })
}

module.exports = {
  studentMarks,
  markMarksList,
  updateMarkList,
}
