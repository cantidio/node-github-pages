'use strict';
var pkgConf = require('pkg-conf');

const defaultCfg = {
  api: {
    version: '3.0.0',
    protocol: 'https',
    host: 'api.github.com',
    pathPrefix: '',
    timeout: 5000,
  }
};

function splitRepoSlug(repoSlug) {
  if (repoSlug) {
    const slug = repoSlug.split('/');
    return {
      user: slug[0],
      repo: slug[1]
    };
  }

  return {};
}

function flagsToCfg(flags, src) {
  const { user, repo } = splitRepoSlug(flags.repo);
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
    user,
    repo,
    src: src && src.length > 0 ? src : undefined
  };
}

function mergeObjects(...objs) {
  return objs.filter((obj)=>obj !== undefined).reduce((a, b)=> {
    const obj = Object.assign({}, a);
    const keys = Object.keys(b).filter((k)=> b[k] !== undefined);
    keys.forEach((k)=> obj[k] = b[k]);
    return obj;
  }, {});
}

function getEnvAuth() {
  return {
    type: 'token',
    token: process.env.GH_TOKEN
  };
}

module.exports =  (flags, src)=> {
  const fileCfg = pkgConf.sync('github-pages');
  const cliCfg = flagsToCfg(flags, src);

  const cfg = {
    api: mergeObjects(defaultCfg.api, fileCfg.api, cliCfg.api),
    auth: mergeObjects(getEnvAuth(), fileCfg.auth, cliCfg.auth),
    user: cliCfg.user || fileCfg.user,
    repo: cliCfg.repo || fileCfg.repo,
    src:  cliCfg.src  || fileCfg.src
  };

  if (!(
    cfg.repo && cfg.user &&
    cfg.auth && cfg.auth.token &&
    cfg.src  && cfg.src.length > 0
  )) {
    return null;
  }

  return cfg;
};
