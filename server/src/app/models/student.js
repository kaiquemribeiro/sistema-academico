const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const user = require('./user');

const StudentSchema = new mongoose.Schema({
  ...user,
});

StudentSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

const student = mongoose.model('Student', StudentSchema);

module.exports = student;
