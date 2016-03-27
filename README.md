[![NPM](https://nodei.co/npm/github-pages.png)](https://nodei.co/npm/github-pages/)

[![Build Status](https://travis-ci.org/cantidio/node-github-pages.svg?branch=master)](https://travis-ci.org/cantidio/node-github-pages)
[![Code Climate](https://codeclimate.com/github/cantidio/node-github-pages/badges/gpa.svg)](https://codeclimate.com/github/cantidio/node-github-pages)
[![Test Coverage](https://codeclimate.com/github/cantidio/node-github-pages/badges/coverage.svg)](https://codeclimate.com/github/cantidio/node-github-pages/coverage)
[![Dependencies](https://david-dm.org/cantidio/node-github-pages.svg)](https://david-dm.org/cantidio/node-github-pages)
[![devDependencies Status](https://david-dm.org/cantidio/node-github-pages/dev-status.svg)](https://david-dm.org/cantidio/node-github-pages#info=devDependencies)

# Github Pages
> Tool for publishing gh-pages the pro way.
> WIP

## Install
```
  npm install --save-dev github-pages
```
## Usage

### CLI Usage
```
Publishes your github pages using the github API

Usage
  $ github-pages [options] [src]

  Options
  -r, --repository
  -t, --token
  -m  --commit-message
  -a  --commit-author
      --remote-ref
      --api-version
      --api-protocol
      --api-host
      --api-path
      --api-timeout

Examples
  $ github-pages -r cantidio/node-github-pages -t $GH_TOKEN ./data
    > github-pages commit
    > github-pages push to cantidio/node-github-pages
```
*Not that the CLI arguments will always overwrite your github-pages configuration in your package.json file.*

You only need to provide the **repository**, the **token** data and the **src**. The other arguments are optional.

  **WARNING**
  The GithubPages will replace all the content of the given ref (heads/gh-pages by default) with the provided content.
  **EVERYTHING** that is not present in the *src* folder will be deleted in your branch.
  Have you made any mistake? Don't panic, GithubPages does not mess up with you git story. Just revert the commit. ;)

## Configuration
All of the CLI options can be configured in the GithubPages section of your package.json. This allows you to modify the default behavior of the GithubPages command.

```json
{
  "github-pages": {
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
}
```
Arguments passed to the CLI will always take precedence over the configuration in package.json.

**$GH_TOKEN**: By default the token value is read from the environment var $GH_TOKEN. So if you don't want to set it in the configurations/cli, it will be read from $GH_TOKEN.

### API Usage
```js
  const GithubPages = require('github-pages');
  const config = require('package.json')['github-pages'];

  const pages = new GithubPages(config);
  pages.publish().then((res)=> {
    console.log('published');
    console.log(JSON.stringify(res, null, 2));
  }).catch((err)=> {
    console.error('error while publishing');
    console.error(JSON.stringify(err, null, 2));
  });
```
The GithubPages needs the complete configuration to be used. If you don't want to provide all the configuration you can use the support file *parse-config*.
```js
  const GithubPages = require('github-pages');
  const parseConfig = require('github-pages').parseConfig;
  const config = parseConfig({
    repo: 'cantidio/node-github-pages',
    token: 'MY-SUPER-SECRET-TOKEN'
  }, './dist');

  const pages = new GithubPages(config);
```
The *parseConfig* method receives as a input the same structure used in the cli, which is a plain object with the cli params using camelCase, different from the one used in the package.json. Besides that, *parseConfig* method will try to preload the configuration from your *package.json*. If you want to get the default configuration and change it yourself, then use if directly:
```js
  const config = require('github-pages').parseConfig.default;
  /* => {
    api: {
      version: '3.0.0',
      protocol: 'https',
      host: 'api.github.com',
      pathPrefix: '',
      timeout: 5000
    },
    auth: { type: 'token' },
    remote: { ref: 'heads/gh-pages' },
    commit: { message: 'github-pages publish.' }
  } */
```
To get more information about the config object, look at the './src/lib/parse-config.js' file.

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
