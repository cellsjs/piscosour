'use strict';

const _ = require('lodash');
const xml = require('xml');

const templates = {
  testcase: () => ({
    testcase: [
      {
        _attr: {
          time: 0
        }
      }
    ]
  }),
  testsuite: () => ({
    testsuite: [
      {
        _attr: {
          tests: 0,
          failures: 0,
          errors: 0,
          warnings: 0,
          time: 0
        }
      }
    ]
  }),
  testsuites: () => ({
    testsuites: [
      {
        _attr: {
          tests: 0,
          errors: 0,
          failures: 0,
          warnings: 0,
          time: 0
        }
      }
    ]
  })
};

const xmlNodeType = node => {
  if (node.type === 'command') {
    return { node: templates.testsuites(), key: 'testsuites' };
  } else if (node.children.length > 0) {
    return { node: templates.testsuite(), key: 'testsuite' };
  } else if (node.children.length === 0) {
    return { node: templates.testcase(), key: 'testcase' };
  }
};

const xmlNodeDescription = node => {
  let description = '';
  switch (node.type) {
    case 'command':
      description = `command: ${node.id}`;
      break;

    case 'flow':
      description = `flow: ${node.data.description}`;
      break;

    case 'step':
      description = node.data.description
        ? `step: ${node.data.context}::${node.id} (${node.data.description})`
        : `step: ${node.data.context}::${node.id}`;
      break;

    case 'stage':
      description = `stage: ${node.data.order} (${node.id})`;
      break;
  }
  return description;
};

const xmlNodeData = node => ({
  name: xmlNodeDescription(node),
  time: (node.endTime - node.initTime) / 1000,
  timestamp: Date(node.initTime)
});

const xmlNodeStats = node => node.isLeaf ?
{} :
{
  tests: node.stats.executed(),
  warnings: node.stats.warnings(),
  failures: node.stats.failures(),
  errors: node.stats.errors()
};

const xmlNodeClassname = node => node.isLeaf ?
{
  classname: `${_.padStart(node.parent.data.order, 3, '0')} ${node.parent.data.context}::${node.parent.id}`
} :
{};

const xmlNodeOutput = node => {
  const outputNodes = {
    systemOut: 'system-out',
    warning: 'warning',
    failure: 'failure',
    error: 'error'
  };

  if (node.output && node.isLeaf) {
    let outputNode;
    switch (node.status) {
      case 0:
        outputNode = {
          [outputNodes.systemOut]: {
            _cdata: node.output
          }
        };
        break;

      case 1:
        outputNode = {
          [node.data.keep ? outputNodes.failure : outputNodes.error]: {
            _cdata: node.output
          }
        };
        break;

      case 2:
        outputNode = {
          [outputNodes.warning]: {
            _cdata: node.output
          }
        };
        break;
    }

    return outputNode;
  }

  return null;
};

const XmlNode = node => {
  const xmlNode = xmlNodeType(node);
  const data = xmlNodeData(node);
  const stats = xmlNodeStats(node);
  const className = xmlNodeClassname(node);
  const outputNode = xmlNodeOutput(node);

  Object.assign(xmlNode.node[xmlNode.key][0]._attr, data, stats, className);

  if (outputNode) {
    xmlNode.node[xmlNode.key].push(outputNode);
  }

  return xmlNode;
};

const xmlNodeTransform = node => {
  const xmlNode = XmlNode(node);
  node.children
    .map(child => xmlNodeTransform(child))
    .forEach(child => xmlNode.node[xmlNode.key].push(child));

  return xmlNode.node;
};

const write = tree => {
  const xmlTree = xml(xmlNodeTransform(tree), { indent: '  ' });
  return xmlTree;
};

module.exports = {
  write: write
};
