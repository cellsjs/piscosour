'use strict';

const _ = require('lodash');

const moment = require('moment');

const _reports = {};

/**
 * Report is an object with the following structure:
 * name: String,
 * context: String,
 * description: String,
 * results: Array,
 * timestamp: Date,
 * time: Date
 */

const _ensureTree = (name, context) => {
  if (!_.get(_reports, `${name}.${context}`, false)) {
    _.set(_reports, `${name}.${context}`, {});
  }
  return _reports[name][context];
};

const readReport = (name, context) => _.clone(_ensureTree(name, context).xxreport);

const readReportsByName = (name) => _.fromPairs(_.map(_.keys(_reports[name]), context => [context, readReport(name, context)]));

const saveReport = (report) => {
  _ensureTree(report.name, report.context).xxreport = report;
  return readReport(report.name, report.context);
};

const createStepReport = (stepName, context, description) => {
  return {
    name: stepName,
    context: context,
    description: description,
    results: [],
    timestamp: new Date(),
    time: moment()
  };
};

const ensureStepReport = (stepName, context, description) =>
  readReport(stepName, context) || createStepReport(stepName, context, description);

const addReportResult = (report, result) => {
  const _report = _.clone(report);
  const _result = _.clone(result);

  if (result && result.last) {
    _report.time = moment() - _report.time;
  }

  _report.results.push(_result);
  return _report;
};

module.exports = {
  readReport: readReport,
  readReportsByName: readReportsByName,
  saveReport: saveReport,
  addReportResult: addReportResult,
  createStepReport: createStepReport,
  ensureStepReport: ensureStepReport
};