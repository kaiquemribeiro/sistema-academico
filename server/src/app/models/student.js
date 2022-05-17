const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  birthDate: {
    type: Date,
    required: false,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  ra: {
    type: Number,
    // unique: true,
    required: false,
  },
  rg: {
    type: Number,
    // unique: true,
    required: false,
  },
});

StudentSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
})

const student = mongoose.model('Student', StudentSchema);

module.exports = student;
