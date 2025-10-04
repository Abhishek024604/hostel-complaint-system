const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Clerk = require('../models/Clerk');
const Warden = require('../models/Warden');

const modelForRole = { student: Student, clerk: Clerk, warden: Warden };

exports.register = async (req, res) => {
  try {
    const { role } = req.body;
    if (!modelForRole[role]) return res.status(400).json({ msg: 'Invalid role' });
    const Model = modelForRole[role];

    // check unique fields depending on role
    if (role === 'student') {
      const existing = await Student.findOne({ rollNo: req.body.rollNo });
      if (existing) return res.status(400).json({ msg: 'Student with this roll no already exists' });
    } else {
      const existing = await Model.findOne({ idNo: req.body.idNo });
      if (existing) return res.status(400).json({ msg: 'User with this id already exists' });
    }

    const data = { ...req.body };
    // remove confirmPassword before saving
    delete data.confirmPassword;

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    const user = new Model(data);
    await user.save();

    const payload = { user: { id: user._id, role, model: Model.modelName } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user: { id: user._id, name: user.name, role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { role, identifier, password } = req.body;
    if (!modelForRole[role]) return res.status(400).json({ msg: 'Invalid role' });
    const Model = modelForRole[role];

    // identifier is rollNo for student, idNo for others, or email if you prefer
    const query = role === 'student' ? { rollNo: identifier } : { idNo: identifier };
    const user = await Model.findOne(query);
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user._id, role, model: Model.modelName } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user: { id: user._id, name: user.name, role } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
