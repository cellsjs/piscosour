---
title: What is Piscosour
layout: doc_page.html
order: 1
---

# What is Piscosour

***DevOps with Superpowers***

It is a framework to manage processes workflows or pipelines. Gets all command line (CLI) development tools wrapped-up, creating command line pipelines.

- Keeps all sets of recipes ordered under a domain with predefined [contexts](../developers/guides/01-contexts.md) and [flows](../developers/guides/03-flows.md).
- Pipeline’s [steps](../developers/guides/02-steps.md) are implementation of a [flow]
- Recipes are easy and reusable components based on a [npm](https://www.npmjs.com) dependency.
- Does not replace other tools (like yeoman, gulp or grunt), coexists with them.
- Pisco is built over [nodejs](https://nodejs.org/) language.

## Why Piscosour

### Composite Pattern

Piscosour uses composite pattern. The composite pattern is a partitioning design pattern and describes that a group of objects is to be treated in the same way as a single instance of an object. The intent of a composite is to "compose" objects into tree structures to represent part-whole hierarchies.

### Multi development

It support large projects with a large number of developers working at the same time. It is a modular organization where every module is independent of each other. The same processes are shared between the same domain.

### Reusability

Code reuse with common principles with code modularity, loose coupling, high cohesion, information hiding and separation of concerns in libraries or plugins.

### Decoupled

From any continuous integration environment like [travis](https://travis-ci.org), [jenkins](https://jenkins.io), or bamboo.
- Allow to use different continuous integration environment for different processes according to the needs (ex. private code repository we can use jenkins and public repository with can use travis)
- This allow developers to don‚Äôt develop in CI environment. Developers can execute the pipeline in his local environment and solve a fix or develop a new features.

### Easy Development

- Develop in your local environment with a suites of stack of libraries and plugins.
- Declarative configuration with `json` files.

### Testing

- Allow developers to add a full suite of tests for every process [flow](./guides/03-flows.md) or step

# Installation & Get Started

Install with [npm](https://npmjs.org) globally

```bash
$ npm install -g piscosour
```

Go to [get started](get_started.md) to build your first recipe with piscosour.