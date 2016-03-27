'use strict';
var pkgConf = require('pkg-conf');
var objectMerge = require('./object-merge');

const defaultCfg = {
  api: {
    version: '3.0.0',
    protocol: 'https',
    host: 'api.github.com',
    pathPrefix: '',
    timeout: 5000,
  },
  auth: {
    type: 'token',
    token: process.env.GH_TOKEN
  },
  remote: {
    ref: 'heads/gh-pages'
  },
  commit: {
    message: 'github-pages publish.'
  }
};

function parseRepo(repoSlug) {
  const slugExp = /^([^\/]+)\/([^\/]+)$/;
  const slug = slugExp.exec(repoSlug);
  if (!slug) {
    return {};
  }

  return {
    user: slug[1],
    repo: slug[2]
  };
}

function parseAuthor(author) {
  let emailExp = /^.*<(.+)>.*$/;
  let nameExp = /^(.*\S).*<.*$/;

  try {
    return {
      name: nameExp.exec(author)[1],
      email: emailExp.exec(author)[1]
    };
  } catch (e) {
    return undefined;
  }
}

function flagsToCfg(flags, src) {
  const { user, repo } = parseRepo(flags.repo);
  const author = parseAuthor(flags.commitAuthor);

  return {
    api: {
      version: flags.apiVersion,
      protocol: flags.apiProtocol,
      host: flags.apiHost,
      pathPrefix: flags.apiPath,
      timeout: flags.apiTimeout,
    },
    auth: {
      type: flags.token ? 'token' : undefined,
      token: flags.token
    },
    commit: {
      message: flags.commitMessage,
      author
    },
    remote: {
      user,
      repo,
      ref: flags.remoteRef
    },
    src: src && src.length > 0 ? src : undefined
  };
}

function isValid(config) {
  const { remote, auth, src } = config || {};
  return (
    remote && remote.repo && remote.user &&
    auth   && auth.type   && auth.token  &&
    src    && src.length > 0
  );
}

module.exports =  (flags, src)=> {
  const fileCfg = pkgConf.sync('github-pages');
  const cliCfg = flagsToCfg(flags, src);
  const config = objectMerge(defaultCfg, fileCfg, cliCfg);

  if (!isValid(config)) {
    return null;
  }

  return config;
};

module.exports.default = defaultCfg;
module.exports.isValid = isValid;
