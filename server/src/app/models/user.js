const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

UserSchema = new mongoose.Schema({
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
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  ra: {
    type: Number,
    unique: true,
    required: false,
  },
  rg: {
    type: Number,
    unique: true,
    required: false,
  },
});

async function encryptPassword(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
}

UserSchema.pre('save', encryptPassword);

const User = mongoose.model('User', UserSchema);

module.exports = User;
