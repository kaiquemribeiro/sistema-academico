const express = require('express');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Admin = require('../models/admin');
const Subject = require('../models/subject');
const Course = require('../models/course');
const User = require('../models/user');
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

router.post('/subject/enroll', async (req, res) => {
  const { ra, id } = req.body;
  const originURL = req.get('referer');

  try {
    let student = await Student.findOne({ ra }).populate([
      'subjectList',
      'timetable',
    ]);
    const subject = await Subject.findOne({ id });

    student.updateTimetable();

    await Student.updateOne(
      { _id: student._id },
      {
        $push: { subjectList: subject },
      }
    );

    await Student.updateOne(
      { _id: student._id },
      {
        $push: { reportcard: [subject.name, 0] },
      }
    );

    student = await Student.findOne({ ra }).populate([
      'subjectList',
      'timetable',
    ]);

    await Student.updateOne(
      { _id: student._id },
      {
        $set: { timetable: student.updateTimetable() },
      }
    );

    await Subject.updateOne(
      { _id: subject._id },
      {
        $push: { studentList: student },
      }
    );

    const reportcardEntry = { name: subject.name, note: 0 };

    res.redirect(originURL + '?success=1');
  } catch (err) {
    console.log('Houve um erro');
    console.warn(err);
    res.redirect(originURL + '?failed=1');
  }
});

router.get('/subject/cancel', async (req, res) => {
  const ra = req.query.student;
  const id = req.query.subject;
  const originURL = req.get('referer');

  try {
    let student = await Student.findOne({ ra }).populate([
      'subjectList',
      'timetable',
    ]);
    const subject = await Subject.findOne({ id });

    student.updateTimetable();
    await Student.updateOne(
      { _id: student._id },
      { $pull: { subjectList: subject._id } }
    );

    await Student.updateOne(
      { _id: student._id },
      { $pull: { reportcard: [subject.name, 0] } }
    );

    student = await Student.findOne({ ra }).populate([
      'subjectList',
      'timetable',
    ]);

    await Student.updateOne(
      { _id: student._id },
      {
        $set: { timetable: student.updateTimetable() },
      }
    );
    await Subject.updateOne(
      { _id: subject._id },
      { $pull: { studentList: student._id } }
    );
    res.redirect(originURL + '?success=1');
  } catch (err) {
    console.warn(err);
    res.redirect(originURL + '?failed=1');
  }
});

router.post('/register/student', async (req, res) => {
  const { email, idcourse } = req.body;
  const originURL = req.get('referer');
  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'email já cadastrado!' });

    const course = await Course.findOne({ idcode: idcourse });

    const student = await Student.create({ ...req.body, course });

    student.password = undefined;
    res.redirect(originURL + '?success=1');
  } catch (err) {
    console.warn(err);

    res.redirect(originURL + '?failed=1');
  }
});

router.post('/register/teacher', async (req, res) => {
  const { email } = req.body;
  const originURL = req.get('referer');

  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'email já cadastrado!' });

    const teacher = await Teacher.create(req.body);

    teacher.password = undefined;
    // return res.send({ teacher, token: generateToken({ id: teacher.id }) });
    res.redirect(originURL + '?success=1');
  } catch (err) {
    console.warn(err);

    // return res.status(400).send({ error: 'Erro ao tentar registrar.' });
    res.redirect(originURL + '?failed=1');
  }
});

router.post('/register/admin', async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'email já cadastrado!' });

    const admin = await Admin.create(req.body);

    admin.password = undefined;
    return res.send({ admin, token: generateToken({ id: admin.id }) });
    // return res.send('/./a')
  } catch (err) {
    console.warn(err);

    return res.status(400).send({ error: 'Erro ao tentar registrar.' });
  }
});

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user)
    return res.status(400).redirect('/./auth/authenticate?not_found=1');

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).redirect('/./auth/authenticate?wrong_pass=1');

  user.password = undefined;

  if (user.__t === 'Admin') {
    res.redirect(
      `/./admin?token=${generateToken({ id: user.id })}&id=${user.id}`
    );
  } else if (user.__t === 'Student') {
    res.redirect(
      `/./aluno?token=${generateToken({ id: user.id })}&id=${user.id}`
    );
  } else if (user.__t === 'Teacher') {
    res.redirect(
      `/./professor?token=${generateToken({ id: user.id })}&id=${user.id}`
    );
  }

  // res.redirect(`/./aluno?token=${generateToken()}&nome=${user.name}`);
  // res.redirect('./aluno?')
  // res.send({ user, token: generateToken() });
});

router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send({ error: 'email não cadastrado!' });

    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
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
    const user = await User.findOne({ email }).select(
      '+passwordResetToken passwordResetExpires'
    );

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

router.get('/fetch_user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate([
      'subjectList',
      'course',
      'studentList',
    ]);
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Error loading student' });
  }
});

router.post('/subject/create', async (req, res) => {
  const { id, name, rg } = req.body;
  const originURL = req.get('referer');

  const timetable = [];

  const { m0, m1, m2, m3, m4, t0, t1, t2, t3, t4, n0, n1, n2, n3, n4 } =
    req.body;

  if (m0) timetable.push({ day: 0, turn: 'm' });
  if (m1) timetable.push({ day: 1, turn: 'm' });
  if (m2) timetable.push({ day: 2, turn: 'm' });
  if (m3) timetable.push({ day: 3, turn: 'm' });
  if (m4) timetable.push({ day: 4, turn: 'm' });
  if (t0) timetable.push({ day: 0, turn: 't' });
  if (t1) timetable.push({ day: 1, turn: 't' });
  if (t2) timetable.push({ day: 2, turn: 't' });
  if (t3) timetable.push({ day: 3, turn: 't' });
  if (t4) timetable.push({ day: 4, turn: 't' });
  if (n0) timetable.push({ day: 0, turn: 'n' });
  if (n1) timetable.push({ day: 1, turn: 'n' });
  if (n2) timetable.push({ day: 2, turn: 'n' });
  if (n3) timetable.push({ day: 3, turn: 'n' });
  if (n4) timetable.push({ day: 4, turn: 'n' });

  try {
    const teacher = await Teacher.findOne({ rg });
    const subject = await Subject.create({
      id,
      name,
      teacher,
      timetable,
    });

    await Teacher.updateOne(
      { _id: teacher._id },
      {
        $push: { subjectList: subject },
      }
    );

    res.redirect(originURL + '?success=1');
  } catch (err) {
    console.log(err);
    res.redirect(originURL + '?failed=1');
  }
});

router.post('/course/create', async (req, res) => {
  const { idcode, name } = req.body;
  const originURL = req.get('referer');

  try {
    const course = await Course.create(req.body);
    res.redirect(originURL + '?success=1');
  } catch (err) {
    console.log(err);
    res.redirect(originURL + '?failed=1');
  }
});

// router.get('/fetch_teacher/:teacherId', async (req, res) => {
//   try {
//     const teacher = await Teacher.findById(req.params.teacherId);
//     return res.send({ teacher });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send({ error: 'Error loading teacher' });
//   }
// });

// router.get('/fetch_admin/:adminId', async (req, res) => {
//   try {
//     const admin = await Admin.findById(req.params.adminId);
//     return res.send({ admin });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send({ error: 'Error loading admin' });
//   }
// });

router.post('/student/changenote', async (req, res) => {
  const originURL = req.get('referer');
  const { ra, nota, id } = req.body;

  try {
    const student = await Student.findOne({ ra });
    const subject = await Subject.findOne({ id });

    const { reportcard } = student;

    const idx = reportcard.findIndex((element) => element[0] === subject.name);

    reportcard[idx][1] = nota;

    // console.log(reportcard);
    await Student.updateOne({ _id: student._id }, { $set: { reportcard } });

    res.redirect(originURL + '?success=1');
  } catch (err) {
    console.log(err);
    res.redirect(originURL + '?failed=1');
  }
});

module.exports = (app) => app.use('/auth', router);
