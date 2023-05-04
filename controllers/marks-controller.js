const { Student } = require('../models/user-models')
const { MarkSheet, StudentMarks } = require('../models/mark-model')

const studentmarks = async (req, res, next) => {
  console.log(req.body)

  try {
    const data = await Student.find({
      session: req.body.session,
      section: req.body.section,
      program: req.body.program,
    })
      .select('-password')
      .sort({ rollNo: 1 })
    console.log(req.body)
    console.log(data)

    const modifiedUserArray = data.map(user => ({
      _id: user._id,
      rollNo: user.rollNo,
      name: user.name,
      avatar: user.avatar,
      mids: '',
      sessional: '',
      finals: '',
    }))

    return res.send(modifiedUserArray)
  } catch (err) {
    console.log(err)
  }

  // modifiedUserArray.map(user => {
  //   const cgpa = user.mids + user.finals
  //   user.gpa = cgpa
  // })

  // res.status(200).send({ message: 'success', type: 'marks' })
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

  const sheet = MarkSheet({
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
    await sheet.save()
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .message({ type: 'sheet', message: 'Could not save mark sheet' })
  }

  for (let item of list) {
    const total =
      parseInt(item.mids) + parseInt(item.finals) + parseInt(item.sessional)
    let gpa
    let grade
    if (total >= 90) {
      gpa = 4
      grade = 'A+'
    } else if (total >= 86) {
      gpa = 3.9
      grade = 'A'
    } else if (total >= 83) {
      gpa = 3.8
      grade = 'A'
    } else if (total >= 80) {
      gpa = 3.7
      grade = 'A'
    } else if (total >= 79) {
      gpa = 3.6
      grade = 'B+'
    } else if (total >= 78) {
      gpa = 3.5
      grade = 'B+'
    } else if (total >= 77) {
      gpa = 3.4
      grade = 'B+'
    } else if (total >= 75) {
      gpa = 3.3
      grade = 'B+'
    } else if (total >= 74) {
      gpa = 3.2
      grade = 'B'
    } else if (total >= 72) {
      gpa = 3.1
      grade = 'B'
    } else if (total >= 70) {
      gpa = 3.0
      grade = 'B'
    } else if (total >= 69) {
      gpa = 2.9
      grade = 'B-'
    } else if (total >= 67) {
      gpa = 2.8
      grade = 'B-'
    } else if (total >= 65) {
      gpa = 2.7
      grade = 'B-'
    } else if (total >= 64) {
      gpa = 2.6
      grade = 'C+'
    } else if (total >= 63) {
      gpa = 2.5
      grade = 'C+'
    } else if (total >= 61) {
      gpa = 2.4
      grade = 'C+'
    } else if (total >= 60) {
      gpa = 2.3
      grade = 'C+'
    } else if (total >= 56) {
      gpa = 2.2
      grade = 'C'
    } else if (total >= 53) {
      gpa = 2.1
      grade = 'C'
    } else if (total >= 50) {
      gpa = 2.0
      grade = 'C'
    } else if (total < 50) {
      gpa = 0.0
      grade = 'F'
    }

    const singleStudentMarks = StudentMarks({
      ...item,
      markSheet: sheet._id,
      total,
      gpa,
      grade,
    })
    try {
      await singleStudentMarks.save()
    } catch (err) {
      console.log(err)
      return res
        .status(500)
        .message({ type: 'sheet', message: 'Could not save mark sheet' })
    }
  }

  res
    .status(200)
    .send({ message: 'success', type: 'mark-marks', sheet: sheet._id })
}

module.exports = {
  studentmarks,
  markMarksList,
}
