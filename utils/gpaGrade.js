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
function calculateGrade(gpa) {
  if (gpa >= 4.0) {
    return 'A+'
  } else if (gpa >= 3.7) {
    return 'A'
  } else if (gpa >= 3.3) {
    return 'B+'
  } else if (gpa >= 3.0) {
    return 'B'
  } else if (gpa >= 2.8) {
    return 'B-'
  } else if (gpa >= 2.3) {
    return 'C+'
  } else if (gpa >= 2.0) {
    return 'C'
  } else {
    return 'F'
  }
}

module.exports = {
  GPA: calculateGPA,
  GRADE: calculateGrade,
}
