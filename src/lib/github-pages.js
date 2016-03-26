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

  latestCommitSHA() {
    return new Promise((resolve, reject)=> {
      const { user, repo } = this.config;
      const ref = 'heads/master';
      const msg = { user, repo, ref };
      this.api.gitdata.getReference(msg, (err, data)=> {
        if (err) {
          reject(err);
        } else {
          this._commitSHA = data.object.sha;
          resolve(data.object.sha);
        }
      });
    });
  }

  latestTreeSHA() {
    return this.latestCommitSHA().then((sha)=> {
      const { user, repo } = this.config;
      const msg = { user, repo, sha };
      return new Promise((resolve, reject)=> {
        this.api.gitdata.getCommit(msg, (err, data)=> {
          if (err) {
            reject(err);
          } else {
            resolve(data.tree.sha);
          }
        });
      });
    });
  }

  //TODO remove this.
  getTree(sha) {
    const { user, repo } = this.config;
    const msg = { user, repo, sha, recursive: true };
    return new Promise((resolve, reject)=> {
      this.api.gitdata.getTree(msg, (err, data)=> {
        if (err) {
          reject(err);
        } else {
          resolve(data.tree);
        }
      });
    });
  }

  listFolderFiles() {
    const { src } = this.config;

    return list([src], { recurse: true, flatten: true }).then((files)=> {
      files.shift(); //remove root data
      //TODO filter out all folders
      return files.map((file)=> {
        let mode;
        let type;
        if (file.mode.dir) {
          type = 'tree';
          mode = '040000';
        } else {
          mode = file.mode.exec ? '100755' : '100644';
          type = 'blob';
        }

        return {
          fullPath: file.path,
          path: relativePath(src, file.path),
          mode,
          type
        };
      });

    });
  }

  //TODO remove this
  getTreeDiff(sha) {
    return Promise.all([
      this.getTree(sha),
      this.listFolderFiles()
    ]).then((result)=> {
      const treeGit = result[0];
      const treeLocal = result[1];

      return treeLocal.filter((file)=>file.type !== 'tree').map((fileLocal)=> {
        const fileGit = treeGit.filter((fileGit)=>fileGit.path === fileLocal.path)[0];

        return {
          fullPath: fileLocal.fullPath,
          path: fileLocal.path,
          type: fileLocal.type,
          mode: fileLocal.mode,
          encoding
        };
      });
    });
  }

  createBlob(filePath) {
    const { user, repo } = this.config;
    const msg = {
      user,
      repo,
      encoding,
      content: new Buffer(fs.readFileSync(filePath)).toString(encoding)
    };

    return new Promise((resolve, reject)=> {
      this.api.gitdata.createBlob(msg, (err, data)=> {
        if (err) {
          reject(err);
        } else {
          resolve(data.sha);
        }
      });
    });
  }

  createBlobs(files) {
    return Promise.all(files.map((file)=>
      this.createBlob(file.fullPath)
        .then((sha)=> Object.assign({}, file, { sha }))
    ));
  }

  createTree(tree, sha) {
    const { user, repo } = this.config;
    const msg = { user, repo, tree };
    return new Promise((resolve, reject)=> {
      this.api.gitdata.createTree(msg, (err, data)=> {
        if (err) {
          reject(err);
        } else {
          resolve(data.sha);
        }
      });
    });
  }

  createCommit(tree) {
    const { user, repo } = this.config;
    const msg = {
      user,
      repo,
      message: 'Commit from github-pages',
      author: {
        name:'cantidio fontes',
        email: 'aniquilatorbloody@gmail.com'
      },
      parents:[this._commitSHA],
      tree
    };
    return new Promise((resolve, reject)=> {
      this.api.gitdata.createCommit(msg, (err, data)=> {
        if (err) {
          reject(err);
        } else {
          resolve(data.sha);
        }
      });
    });
  }

  createRef(sha) {
    const { user, repo } = this.config;
    const msg = { user, repo, sha, ref: 'heads/master' };
    return new Promise((resolve, reject)=> {
      this.api.gitdata.updateReference(msg, (err, data)=> {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  run() {
    this.auth();
    this.latestTreeSHA()
      .then((sha)=> this.getTreeDiff(sha)
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
