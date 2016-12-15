'use strict';

const _ = require('lodash');

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

const readReport = (name, context) => {
  return _.clone(_ensureTree(name, context).xxreport);
};

const saveReport = (report) => {
  _ensureTree(report.name, report.context).xxreport = report;
  return readReport(report.name, report.context);
};

module.exports = {
  readReport: readReport,
  saveReport: saveReport
};