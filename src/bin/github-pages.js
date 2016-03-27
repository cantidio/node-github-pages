#!/usr/bin/env node
const meow = require('meow');
const parseConfig = require('../lib/parse-config');
const GithubPages = require('../lib');
const cli = meow({
  help: `
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
    $ github-pages -r cantidio/github-pages -t $GH_TOKEN ./data
      > github-pages commit
      > github-pages push to cantidio/github-pages
` }, {
  alias:{
    r: 'repo',
    t: 'token',
    m: 'commit-message',
    a: 'commit-author'
  }
});

const cfg = parseConfig(cli.flags, cli.input[0]);

if (!cfg) {
  console.log('provide the user, repo and token.');
  console.log(cli.help);
  process.exit(1);
}

const ghpages = new GithubPages(cfg);
ghpages.run();
