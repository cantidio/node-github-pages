#!/usr/bin/env node
const meow = require('meow');
var parseArgs = require('minimist');

const githubPages = require('../lib');
const cli = meow({
  help: `
  Usage
    $ github-pages [options]

    Options
    -g, --github
    -t, --token
    -u, --user
    -r, --repository

  Examples
    $ github-pages -t $GH_TOKEN -u cantidio -r github-pages
      > github-pages commit
      > github-pages push to cantidio/github-pages
` }, {
  alias: {
    g: 'github',
    t: 'token',
    u: 'user',
    r: 'repository'
  },
  default: {
    g: 'github.com'
  }
});

githubPages(cli.flags);
