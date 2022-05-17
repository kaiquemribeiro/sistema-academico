const express = require('express');
const Student = require('../../models/student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

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

module.exports = (app) => app.use('/auth', router);
