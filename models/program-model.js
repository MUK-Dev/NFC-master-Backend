const mongoose = require('mongoose')

const programSchema = mongoose.Schema(
  {
    program_title: String,
    type: String,
    starting: Date,
    ending: Date,
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    change_history: [],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Program', programSchema)
