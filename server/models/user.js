const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    required: true,
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
    unique: true,
    required: true,
  },
  rg: {
    type: Number,
    unique: true,
    required: true,
  },
});
//9:41
const user = mongoose.model('User', UserSchema);

module.exports = user;
