'use strict';

const moment = require('moment');

const bus = require('./bus');
const logger = require('./logger');

// Node prototype
const children = Symbol();
const Node = (id, type) => ({

  id: id,

  type: type,

  initTime: null,

  endTime: null,

  status: -1,

  parent: null,

  data: {},

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
    this.children.push(child);
    return this;
  },

  get stats() {
    const traversed = this.traverse();
    const stats = {
      warnings: traversed.filter(child => child.status === 2).length,
      failures: traversed.filter(child => child.status === 1 && child.data.keep).length,
      errors: traversed.filter(child => child.status === 1 && !child.data.skipped).length,
      softOk: () => stats.errors === 0 && stats.failures === 0,
      hardOk: () => stats.errors === 0 && stats.failures === 0 && stats.warnings === 0
    };

    return stats;
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

  init() {
    this.initTime = moment();
    return this;
  },

  end(status, data) {
    this.endTime = moment();
    this.status = status;
    this.data = Object.assign({}, data || {});

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
    reporters.forEach(reporter => {
      try {
        require(`./reporters/${reporter}`).write(this.tree);
      } catch (e) {
        logger.error(`Reporter module [${reporter}] not found`);
      }
    });
  }
};

// Starting listeners

bus.on('command:start', payload => {
  execution.tree = (Node(`${payload.context.join(',')}${payload.isStep ? '::' : ':'}${payload.name}`, 'command').init());
});

bus.on('command:end', payload => {
  execution.tree.end(payload.status, payload.data);
});

bus.on('flow:start', payload => {
  const nodeId = `${payload.context.join(',')}:${payload.name}`;
  (execution.runningNode('flow') || execution.tree).append(Node(nodeId, 'flow').init());
});

bus.on('flow:end', payload => {
  execution.runningNode('flow').end(payload.status, payload.data);
});

bus.on('step:start', payload => {
  const nodeId = `${payload.context}::${payload.name}`;
  execution.runningNode('flow').append(Node(nodeId, 'step').init());
});

bus.on('step:end', payload => {
  execution.runningNode('step').end(payload.status, payload.data);
});

bus.on('stage:start', payload => {
  execution.runningNode('step').append(Node(payload.name, 'stage').init());
});

bus.on('stage:end', payload => {
  const data = Object.assign({}, payload.content, { description: payload.message });
  execution.runningNode('stage').end(payload.status, data);
  console.log(execution.lastFinished('stage'));
});


module.exports = execution;
