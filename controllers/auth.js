const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { hash, compare } = require('bcryptjs');
const { BadRequestError } = require('../errors');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide name, email and password');
  }
  const salt = await hash(password, 10);
  const user = await User.create({ name, email, password: salt });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.getName() }, token });
};

module.exports = {
  register,
  login,
};
