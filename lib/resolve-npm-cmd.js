"use strict";

const Fs = require("fs");
const which = require("which");
const Path = require("path");

const { quote, relative } = require("./utils");

module.exports = function resolveNpmCmd(exe, options) {
  const makeRelative = x => {
    if (options && options.relative) {
      return relative(x, options.cwd);
    }

    return x;
  };

  try {
    // look for the windows CMD batch npm generates for JS
    const resolvedExe = which.sync(exe, options);
    if (Path.extname(resolvedExe).toLowerCase() !== ".cmd") {
      // since we already did the work to find it, use found full path
      return quote(makeRelative(resolvedExe));
    }

    // read the batch and find the node.exe execution line
    const script = Fs.readFileSync(resolvedExe)
      .toString()
      .split("\n")
      .map(x => x.trim());

    const binName = Path.basename(resolvedExe).toLowerCase();
    const resolvedDir = Path.dirname(resolvedExe);
    // handle npm
    let nodeCmd;
    if (binName === "npm.cmd") {
      nodeCmd = script.find(l => l.startsWith(`SET "NPM_CLI_JS=`)).replace(/NPM_CLI_JS=/, "");
    } else if (binName === "npx.cmd") {
      nodeCmd = script.find(l => l.startsWith(`SET "NPX_CLI_JS=`)).replace(/NPX_CLI_JS=/, "");
    } else {
      nodeCmd = script.find(l => l.startsWith(`"%~dp0\\node.exe"`));
    }

    if (!nodeCmd) {
      return quote(makeRelative(resolvedExe));
    }
    // update exe with process node binary and JS script from batch file
    const jsFile = makeRelative(
      Path.normalize(
        nodeCmd
          .split(" ")
          .filter(x => x)[1]
          .replace(`%~dp0`, resolvedDir)
      )
    );

    return options && options.jsOnly ? jsFile : [quote(process.execPath), jsFile].join(" ");
  } catch (err) {
    return exe;
  }
};
