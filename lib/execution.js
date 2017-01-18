'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const moment = require('moment');

const bus = require('./bus');
const config = require('./config');
const fsUtils = require('./utils/fsUtils');
const logger = require('./logger');
const params = require('./params');

// Node prototype
const children = Symbol();
const Node = (id, type, data) => ({

  id: id,

  type: type,

  initTime: null,

  endTime: null,

  status: -1,

  parent: null,

  data: data || {},

  get runningTime() {
    return this.endTime !== null
      ? this.endTime - this.initTime
      : 0;
  },

  [children]: [],

  get children() {
    return this[children];
  },

  append(child) {
    child.parent = this;
    this.children.push(child);

    return this;
  },

  get stats() {
    const traversed = this.traverse();
    const stats = {
      executed: traversed.filter(child => child.children.length === 0).length,
      warnings: traversed.filter(child => child.children.length === 0 && child.status === 2).length,
      failures: traversed.filter(child => child.children.length === 0 && child.status === 1 && child.data.keep).length,
      errors: traversed.filter(child => child.children.length === 0 && child.status === 1 && !child.data.keep).length,
      softOk: () => stats.errors === 0 && stats.failures === 0,
      hardOk: () => stats.errors === 0 && stats.failures === 0 && stats.warnings === 0
    };

    return stats;
  },

  get output() {
    const keys = ['message', 'data', 'error', 'stack', 'stderr'];
    return keys
      .map(key => this.data[key])
      .filter(out => out !== undefined && out.length > 0)
      .shift();
  },

  traverse() {
    const nodes = [];
    (function _depth(root) {
      nodes.push(root);
      root.children.forEach(child => _depth(child));
    }(this));

    return nodes;
  },

  findAll(fn) {
    return this.traverse().filter(node => fn(node));
  },

  findFirst(fn) {
    return this.findAll(fn).shift();
  },

  findLast(fn) {
    return this.findAll(fn).pop();
  },

  get isLeaf() {
    return this.children.length === 0;
  },

  init() {
    this.initTime = moment();

    return this;
  },

  end(status, data_) {
    this.endTime = moment();
    this.status = status;
    this.data = _.merge(this.data, data_ || {});

    return this;
  }

});

// Execution tree

const execution = {
  _tree: null,

  set tree(node) {
    this._tree = node;

    return this;
  },

  get tree() {
    return this._tree;
  },

  runningNode(type) {
    return this.tree.findLast(node => node.endTime === null && node.type === type);
  },

  lastFinished(type) {
    return this.tree.findLast(node => node.status >= 0 && node.endTime !== null && node.type === type);
  },

  report(reporters) {
    return reporters.map(reporter => {
      let reporterModule;
      try {
        reporterModule = require(`./reporters/${reporter}`);
      } catch (e) {
        logger.error(`Reporter module [${reporter}] not found`);
      }
      if (reporterModule) {
        return reporterModule.write(this.tree);
      }
      return null;
    });
  }
};

// Triggered functions

const onCommandStart = payload => {
  execution.tree = (Node(payload.name, 'command').init());
};

const onCommandEnd = payload => {
  execution.tree.end(payload.status, payload.data);

  logger.debug('#magenta', 'Execution tree');
  logger.debug(execution.tree);

  if (params.junitReport) {
    const report = execution.report([ 'junit' ]).pop();
    const _config = config.get();
    process.chdir(_config.rootDir);
    const file = path.join(_config.junitDir, _config.junitPiscoFile);

    logger.info('#magenta', 'Write results in junit format at', file);

    fsUtils.createDir(_config.junitDir);
    fs.writeFileSync(file, report);
  }
  logger.info('Total time', '-', '#duration', moment() - execution.tree.initTime);
};

const onFlowStart = payload => {
  const nodeId = payload.name;
  const nodeData = {
    description: `${payload.context.join(',')}:${payload.name}`,
    order: execution.tree.findAll(child => child.type === 'flow').length + 1
  };
  const runningNode = (execution.runningNode('flow') || execution.tree);

  runningNode.append(Node(nodeId, 'flow', nodeData).init());
};

const onFlowEnd = payload => {
  execution.runningNode('flow').end(payload.status, payload.data);
};

const onStepStart = payload => {
  const nodeId = `${payload.name}`;
  const nodeData = {
    description: payload.params.description,
    order: execution.tree.findAll(child => child.type === 'step').length + 1,
    context: payload.context,
    flowName: payload.flowName || null
  };
  const runningNode = (execution.runningNode('flow') || execution.tree);

  runningNode.append(Node(nodeId, 'step', nodeData).init());
};

const onStepEnd = payload => {
  execution.runningNode('step').end(payload.status, payload.data);
};

const onStageStart = payload => {
  if (!execution.runningNode('stage')) {
    execution.runningNode('step').append(Node(payload.name, 'stage').init());
  }
};

const onStageEnd = payload => {
  const data = Object.assign({}, payload.content, { order: payload.order });
  const runningNode = execution.runningNode('stage');

  if (runningNode) {
    runningNode.end(payload.status, data);
  }
};

// Event listeners

bus.on('command:start', payload => onCommandStart(payload));
bus.on('command:end', payload => onCommandEnd(payload));

bus.on('flow:start', payload => onFlowStart(payload));
bus.on('flow:end', payload => onFlowEnd(payload));

bus.on('step:start', payload => onStepStart(payload));
bus.on('step:end', payload => onStepEnd(payload));

bus.on('stage:start', payload => onStageStart(payload));
bus.on('stage:end', payload => onStageEnd(payload));


module.exports = execution;
