const mongoose = require('../../database');
const User = require('./user');

const StudentSchema = new mongoose.Schema({
  subjectList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
  ],
  periodo: {
    type: Number,
    default: 1
  },
  turno: {
    type: String,
    default: "Manhã"
  },
  timetable: {
    type: [[String]],
    default: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  reportcard: [Array],
});

const keyTurn = {
  m: 0,
  t: 1,
  n: 2,
};

StudentSchema.methods.updateTimetable = function () {
  this.timetable = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  for (subject of this.subjectList) {
    for (time of subject.timetable) {
      this.timetable[time.day][keyTurn[time.turn]] = subject.name;
    }
  }

  StudentSchema.methods.add;

  return this.timetable;
};

const Student = User.discriminator('Student', StudentSchema);

module.exports = Student;
