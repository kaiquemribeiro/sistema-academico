const user = {
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
    // unique: true,
    required: false,
  },
  rg: {
    type: Number,
    // unique: true,
    required: false,
  },
};

module.exports = user;