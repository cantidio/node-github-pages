'use strict';
const relativePath = require('path').relative;
const GitHubApi = require('github');
const list = require('ls-all');
const fs = require('fs');
const encoding = 'base64';

module.exports = class GithubPages {
  constructor(config) {
    this.config = config;
    this.api = new GitHubApi(this.config.api);
  }

  auth() {
    this.api.authenticate(this.config.auth);
  }

  runApi(msg, method, extract) {
    return new Promise((resolve, reject)=> {
      method(this.api)(msg, (err, data)=> {
        if (err) {
          reject(err);
        } else {
          const res = extract ? extract(data) : data;
          resolve(res);
        }
      });
    });
  }

  latestCommitSHA() {
    const { user, repo, ref } = this.config.remote;
    const msg = { user, repo, ref };

    return this.runApi(
      msg,
      (api)=> api.gitdata.getReference,
      (res)=> {
        this._commitSHA = res.object.sha;
        return res.object.sha;
      }
    );
  }

  latestTreeSHA() {
    return this.latestCommitSHA().then((sha)=> {
      const { user, repo } = this.config.remote;
      const msg = { user, repo, sha };
      return this.runApi(
        msg,
        (api)=> api.gitdata.getCommit,
        (res)=> res.tree.sha
      );
    });
  }

  listFolderFiles() {
    const { src } = this.config;

    return list([src], { recurse: true, flatten: true }).then((files)=>
      files.filter((file)=> !file.mode.dir).map((file)=> {
        let mode = file.mode.exec ? '100755' : '100644';
        let type = 'blob';

        return {
          fullPath: file.path,
          path: relativePath(src, file.path),
          mode,
          type,
          encoding
        };
      })
    );
  }

  readFile(filePath) {
    return new Buffer(fs.readFileSync(filePath)).toString(encoding);
  }

  createBlob(filePath) {
    const { user, repo } = this.config.remote;
    const msg = { user, repo, encoding, content: this.readFile(filePath) };
    return this.runApi(
      msg,
      (api)=> api.gitdata.createBlob,
      (res)=> res.sha
    );
  }

  createBlobs(files) {
    return Promise.all(files.map((file)=>
      this.createBlob(file.fullPath)
        .then((sha)=> Object.assign({}, file, { sha }))
    ));
  }

  createTree(tree, sha) {
    const { user, repo } = this.config.remote;
    const msg = { user, repo, tree };

    return this.runApi(
      msg,
      (api)=> api.gitdata.createTree,
      (res)=> res.sha
    );
  }

  createCommit(tree) {
    //TODO pass this._commitSHA as a param
    const { user, repo } = this.config.remote;
    const { message, author } = this.config.commit;
    const msg = {
      user,
      repo,
      message,
      author,
      parents:[this._commitSHA],
      tree
    };
    return this.runApi(
      msg,
      (api)=> api.gitdata.createCommit,
      (res)=> res.sha
    );
  }

  createRef(sha) {
    const { user, repo, ref } = this.config.remote;
    const msg = { user, repo, sha, ref };

    return this.runApi(
      msg,
      (api)=> api.gitdata.updateReference
    );
  }

  run() {
    this.auth();
    this.latestTreeSHA()
      .then((sha)=> this.listFolderFiles()
        .then((tree)=> this.createBlobs(tree))
        .then((tree)=> this.createTree(tree, sha))
        .then((sha)=> this.createCommit(sha))
        .then((sha)=> this.createRef(sha))
      ).then((data)=> {
        console.log(JSON.stringify(data, null, 2));
      }).catch((err)=> {
        console.log(err);
      });
  }
};
