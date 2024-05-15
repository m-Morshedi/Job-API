const Job = require('../models/Job');
const { NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  return res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: req.user.userId,
  });
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  return res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  return res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position } = req.body;
  if (company == '' || position == '') {
    throw new BadRequestError('Company or Position fields cannot be empty');
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  )
    .sort('createdAt')
    .exec();
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  return res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOneAndRemove({
    _id: jobId,
    createdBy: req.user.userId,
  });
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  return res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
