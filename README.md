# Indoqa Webpack

## Motivation

[Webpack](https://webpack.github.io/) is a low-level build tool for Javascript web applications. In [our](https://indoqa.com) opinion too low-level to be maintained in each of our projects. Since we found out that our webpack configurations are in huge parts identical, we started indoqa-webpack which can be configured delcaratively.

## Goals

The goal of indoqa-webpack is supporting following use cases:

 * create production-ready release artifacts (Javascript, CSS)
 * provide a hot-reloadable development server using [express](http://expressjs.com)
 * support for Javascript libraries and make use of [externals](https://webpack.github.io/docs/library-and-externals.html)
 * out-of-the-box usage for [Jest](https://facebook.github.io/jest/) tests
 * out-of-the-box configuration of [ESLint](http://eslint.org/) using [eslint-config-indoqa](https://github.com/Indoqa/eslint-config-indoqa)
 * hide webpack configurations and provide a declarative configuration
 * simple upgrade path to newer versions of indoqa-webpack

## Usage

### Production build

TBD (es6, pollyfills, css extraction, usage, ref to sample)

### Dev mode

TBD (dev server, hot-reload, usage, ref to sample)

### Building libraries

TBD (externals, peer dependencies, .npmignore, usage, ref to sample)

### Setting up a playground (usually for libraries)

TBD (usage, ref to sample)

### Jest

TBD (directory structure, usage, ref to sample)

### ESLint configuration

TBD (usage, ref to sample)

## Todos

 * Webpack 4 support
 * preset env
 * [Error Overlay Webpack Plugin](https://github.com/smooth-code/error-overlay-webpack-plugin/blob/master/README.md)
