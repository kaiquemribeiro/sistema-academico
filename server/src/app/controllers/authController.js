const express = require('express');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const { findOne } = require('../models/student');

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

const UserType = {
  Student,
  Teacher,
  Admin,
};

async function findOnUserTypes(params = {}) {
  let user = null;

  for (const key in UserType) {
    user = await UserType[key].findOne(params);

    if (user) return user;
  }

  return null;
}

router.post('/register', async (req, res) => {
  const { email, usertype, name, birthDate, password, ra, rg } = req.body;

  try {
    if (!UserType[usertype])
      return res
        .status(400)
        .send({ erro: 'O tipo de  usuário não foi informado!' });

    if (await findOnUserTypes({ email }))
      return res.status(400).send({ error: 'email já cadastrado!' });
    
    const user = new UserType[usertype](
      name,
      email,
      password,
      birthDate,
      ra,
      rg
    );

    await user.save();
    user.password = undefined;
    return res.send({ user, token: generateToken() });
  } catch (err) {
    console.warn(err);

    return res.status(400).send({ error: 'Erro ao tentar registrar.' });
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;
  
  const user =
    (await Student.model.findOne({ email }).select('+password')) ||
    (await Teacher.model.findOne({ email }).select('+password')) ||
    (await Admin.model.findOne({ email }).select('+password'));

    if (!user) return res.status(400).redirect('/./auth/authenticate?not_found=1');

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).redirect('/./auth/authenticate?wrong_pass=1');

  user.password = undefined;

  res.redirect('./aluno');
  res.send({ user, token: generateToken() });
});

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findOnUserTypes({ email });

    if (!user) return res.status(400).send({ error: 'email não cadastrado!' });

    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);

    await user.findByIdAndUpdate(user.id, {
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
  const { email, token, password } = req.body;

  try {
    const user =
      (await Student.model
        .findOne({ email })
        .select('+passwordResetToken passwordResetExpires')) ||
      (await Teacher.model
        .findOne({ email })
        .select('+passwordResetToken passwordResetExpires')) ||
      (await Admin.model
        .findOne({ email })
        .select('+passwordResetToken passwordResetExpires'));

    if (!user) return res.status(400).send({ error: 'email não cadastrado!' });

    if (token !== user.passwordResetToken)
      return res.status(400).send({ error: 'Token inválido' });

    const now = new Date();
    if (now > user.passwordResetExpires)
      return res.status(400).send({ error: 'Token expirado' });

    user.password = password;

    await user.save();

    res.send();
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: 'Ocorreu um erro ao redefinir a senha, tente novamente mais tarde',
    });
  }
});

module.exports = (app) => app.use('/auth', router);
