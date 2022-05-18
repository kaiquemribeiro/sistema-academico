const express = require('express');
const Student = require('../../models/student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const crypto = require('crypto');

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

router.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    if (await Student.findOne({ email }))
      return res.status(400).send({ error: 'email já cadastrado!' });

    const student = await Student.create(req.body);

    student.password = undefined;
    return res.send({ student, token: generateToken() });
  } catch (err) {
    console.warn(err);

    return res.status(400).send({ error: 'Erro ao tentar registrar.' });
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email }).select('+password');

  if (!student) return res.status(400).send({ error: 'email não cadastrado!' });

  if (!(await bcrypt.compare(password, student.password)))
    return res.status(400).send({ error: 'Senha incorreta!' });

  student.password = undefined;

  res.send({ student, token: generateToken() });
});

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const student = Student.findOne({ email });

    if (!user) return res.status(400).send({ error: 'email não cadastrado!' });

    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);

    await Student.findByIdAndupdate(student.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });
    console.log('token e now: ', token, now);
  } catch (err) {
    console.warn(err);
    res.status(400).send({
      error:
        'Houve um erro ao tentar recuperar a senha, tente novamente mais tarde.',
    });
  }
});

module.exports = (app) => app.use('/auth', router);
