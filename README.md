[![NPM](https://nodei.co/npm/github-pages.png)](https://nodei.co/npm/github-pages/)

[![Build Status](https://travis-ci.org/cantidio/node-github-pages.svg?branch=master)](https://travis-ci.org/cantidio/node-github-pages)
[![Code Climate](https://codeclimate.com/github/cantidio/node-github-pages/badges/gpa.svg)](https://codeclimate.com/github/cantidio/node-github-pages)
[![Test Coverage](https://codeclimate.com/github/cantidio/node-github-pages/badges/coverage.svg)](https://codeclimate.com/github/cantidio/node-github-pages/coverage)
[![Dependencies](https://david-dm.org/cantidio/node-github-pages.svg)](https://david-dm.org/cantidio/node-github-pages)
[![devDependencies Status](https://david-dm.org/cantidio/node-github-pages/dev-status.svg)](https://david-dm.org/cantidio/node-github-pages#info=devDependencies)

# Github Pages
> Tool for publishing gh-pages.
> This is not ready for usage yet

## Install
```
  npm install --save-dev github-pages
```
## Usage
```
  github-pages --help
```

```
  Publishes your github pages using the github API

  Usage
    $ github-pages [options] [src]

    Options
    -r, --repository
    -t, --token
        --api-version
        --api-protocol
        --api-host
        --api-path
        --api-timeout

  Examples
    $ github-pages -r cantidio/github-pages -t $GH_TOKEN ./data
      > github-pages commit
      > github-pages push to cantidio/github-pages
```

# Configuration
```json
{
  "api": {
    "version": "3.0.0",
    "protocol": "https",
    "host": "api.github.com",
    "pathPrefix": "",
    "timeout": 5000
  },
  "auth": {
    "type": "token",
    "token": "GH_TOKEN"
  },
  "remote": {
    "repo": "my-user/my-repo",
    "ref": "heads/gh-pages"
  },
  "commit": {
    "message": "commit made by me",
    "author": "my-name <my-email@prod.com>"
  },
  "src": [
    "./data"
  ]
}
```

# Roadmap
 * Support multiple src folders
 * .github-pagesrc ?

# stack

* [meow](https://www.npmjs.com/package/meow) for cli
* [github](https://www.npmjs.com/package/github) use of github api
* [babel](https://babeljs.io) for transpiling es6 code to es5
* [ava](https://www.npmjs.com/package/ava) for testing
* [nyc](https://www.npmjs.com/package/nyc) for code-coverage
* [jscs](https://www.npmjs.com/package/jscs) lint
* [eslint](https://www.npmjs.com/package/eslint) lint
* [travis](https://travis-ci.org) Continous integration
* [codeclimate](https://codeclimate.com) for resports on coverage & code analysis
