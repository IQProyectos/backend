const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Report = require('../models/Report');

const HttpError = require('../models/http-error');
const User = require('../models/User');

//Get a report by ID
const getReportById = async (req, res, next) => {
  const reportId = req.params.bid;

  let report;
  try {
    report = await Report.findById(reportId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a report.',
      500
    );
    return next(error);
  }

  if (!report) {
    const error = new HttpError(
      'Could not find report for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ report: report.toObject({ getters: true }) });
};

// Create a report
const createReport = async (req, res, next) => {

  const { name, description,objetives,justification,department,district,definition, isTimeSeries, image, programs, factors} = req.body;

  const createdReport = new Report({
    name,
    description,
    objetives,
    justification,
    department,
    district,
    definition,
    isTimeSeries,
    image,
    programs,
    factors
  });

   let user;
   try {
     user = await User.findById(req.userData.userId, {image: 0});
    
   } catch (err) {
     const error = new HttpError(
       'Creating report failed, please try again.',
       500
     );
     return next(error);
   }

   if (!user) {
     const error = new HttpError('Could not find user for provided id.', 404);
     return next(error);
   }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdReport.save({ session: sess });
    // user.reports.push(createdReport);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating report failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }
  createdReport.image = "";
  res.status(201).json({ report: createdReport });
};

const getReports = async (req, res, next) => {
  
  let reports;
  try {
    reports = await Report.find({}, {image: 0});
    console.log(reports);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Fetching reports failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    reports: reports.map(report =>
      report.toObject({ getters: true })
    )
  });
};

const getFilteredReports = async (req, res, next) => {
  const userId = req.params.uid;
  let reports;
  try {
    reports = await Report.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching reports failed, please try again later.',
      500
    );
    return next(error);
  }
  let user;
  try {
    user = await User.findById(userId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not fetch user.',
      500
    );
    return next(error);
  }
  var bioIdArray = [];
  reports.forEach(function (arrayitem){
    bioIdArray.push(arrayitem.id);
  });
  
  console.log(user);
  if(user && reports && user.roles.length > 0){
    var roles = Object.values(user.roles);
    roles.forEach(function (arrayitem){
      if(bioIdArray.includes(arrayitem.reportId)){ 
        reports.splice(bioIdArray.indexOf(arrayitem.reportId),1);
        bioIdArray.splice(bioIdArray.indexOf(arrayitem.reportId),1);
      }
    });
  }

  
    

  res.json({
    reports: reports.map(user =>
      user.toObject({ getters: true })
    )
  });
};

const deleteReport = async (req, res, next) => {
  const reportId = req.params.bid;

  let report;
  try {
    report = await Report.findById(reportId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find report.',
      500
    );
    return next(error);
  }
  if (report.factors.length > 0){
    const error = new HttpError(
      'El proyecto contiene datos. No se puede eliminar.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await report.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete report.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted report.' });
}

const updateReport = async (req, res, next) => {

  const { name, description,objetives,justification,department,district,definition, isTimeSeries, image, programs, factors} = req.body;
  const reportId = req.params.bid;

  let report;
  try {
    report = await Report.findById(reportId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update report.',
      500
    );
    return next(error);
  }

  report.name = name;
  report.description = description;
  report.objetives = objetives;
  report.justification = justification;
  report.department = department;
  report.district = district;
  report.definition = definition;
  report.isTimeSeries = isTimeSeries;
  report.image = image;
  report.programs = programs;
  report.factors = factors;

  try {
    await report.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update report.',
      500
    );
    return next(error);
  }
  report.image = "";
  res.status(200).json({ report: report.toObject({ getters: true }) });
};

exports.getReportById = getReportById;
exports.createReport = createReport;
exports.getReports = getReports;
exports.getFilteredReports = getFilteredReports;
exports.deleteReport = deleteReport;
exports.updateReport = updateReport;