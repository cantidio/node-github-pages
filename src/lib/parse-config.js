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
  const slug = (repoSlug || '').split('/');
  const [user, repo] = slug;
  return {
    user,
    repo
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
      author: flags.commitAuthor
    },
    remote: {
      repo: flags.repo,
      ref: flags.remoteRef
    },
    src: src && src.length > 0 ? src : undefined
  };
}

function normalizeConfig(config) {
  const { remote, commit } = config;
  if (remote && remote.repo) {
    Object.assign(remote, parseRepo(remote.repo));
  }

  if (commit && commit.author) {
    commit.author = parseAuthor(commit.author);
  }

  return Object.assign({}, config, { remote, commit });
}

function isConfigValid(config) {
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
  const config = normalizeConfig(objectMerge(defaultCfg, fileCfg, cliCfg));

  if (!isConfigValid(config)) {
    return null;
  }

  return config;
};

module.exports.default = defaultCfg;
