#!/usr/bin/env node
const meow = require('meow');
const parseConfig = require('../lib/parse-config');
const GithubPages = require('../lib');

const cli = meow({
  help: `
  Usage
    $ github-pages [options] [src]

    Options
    -r, --repo
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
    $ github-pages -r user/repo -t $GH_TOKEN ./data
      > github-pages commit
      > github-pages push to user/repo
` }, {
  alias: {
    r: 'repo',
    t: 'token',
    m: 'commit-message',
    a: 'commit-author'
  }
});

const config = parseConfig(cli.flags, cli.input[0]);

if (!config) {
  console.log('Please provide the user, repo and token.');
  console.log(cli.help);
  process.exit(1);
}

const ghpages = new GithubPages(config);

console.log('GithubPages:run.');
console.log(`GithubPages:publish ${config.remote.ref}`);
ghpages.publish().then((res)=> {
  console.log('GithubPages:done');
}).catch((err)=> {
  console.error('GithubPages:error updating remote ref.');
  process.exit(1);
});
