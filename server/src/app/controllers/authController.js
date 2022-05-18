const express = require('express');
const Student = require('../models/student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

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
    const student = await Student.findOne({ email });

    if (!student)
      return res.status(400).send({ error: 'email não cadastrado!' });

    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);

    await Student.findByIdAndUpdate(student.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    mailer.sendMail(
      {
        to: email,
        from: 'sistema@servidor.com.br',
        template: 'auth/forgot_password',
        context: { token },
      },
      (err) => {
        if (err) {
          console.log(err);
          return res.status(400).send({
            error: 'Não foi possível enviar o email de recuperação de senha',
          });
        }

        return res.send();
      }
    );
  } catch (err) {
    console.warn(err);
    res.status(400).send({
      error:
        'Houve um erro ao tentar recuperar a senha, tente novamente mais tarde.',
    });
  }
});

router.post('/reset_password', async (req, res) => {
  const {email, token, password} = req.body;

  try {
    const student = await Student.findOne({email})
    .select('+passwordResetToken passwordResetExpires');

    if (!student)
      return res.status(400).send({ error: 'email não cadastrado!' });

    if (token !== student.passwordResetToken)
      return res.status(400).send({error: 'Token inválido'});

    const now = new Date();
    if (now > student.passwordResetExpires)
      return res.status(400).send({error: "Token expirado"})

    student.password = password;

    await student.save();
    
    res.send();
  } catch(err) {
    res.status(400).send({error:'Ocorreu um erro ao redefinir a senha, tente novamente mais tarde'})
  }
});

module.exports = (app) => app.use('/auth', router);
