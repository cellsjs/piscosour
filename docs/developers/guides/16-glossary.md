

## Recipe

- Executable
- Functional tests (with framework, node, docker)
- General Configuration: (piscosour.json) Implementation of all steps, dependencies to flows.
- No steps, no plugins, no contexts
- Dockerizable
- Implementation of same step of same context is forbidden.
- Multi-domain. Can execute a command , if command es the same in more than one domain then shows a list to choose the right one.
- Two plugins with the same name in a recipe should give an error.

## Plugins

- NO tag domain
- Only implementation of one or more plugins
- Unit tests with framework
- Dependency to piscosour on devDependency
- No general configuration (piscosour.json)

## Steps (commands)

- Tag domain
- Only implementation of one or more steps
- Unit tests with framework
- Dependency to piscosour on devDependency
- Dependency to definition of contexts on devDependency

## Contexts

- Tag domain
- Only implementation of one or more contexts
- Unit tests with framework
- Only definition of contexts
- Could have other contexts as a dependency and is possible to extend individual contexts.

## Flows

- Tag domain
- Only definition of flows

## Domain

- Domain is a tag on every steps, contexts and flows repositories.

In same domain:

- Repeated names of contexts and flows is forbidden

 
## Configuration

- Only General configuration (piscosour.json) 
- And dockerfiles directory for Dockerfile implementation for requirements.


