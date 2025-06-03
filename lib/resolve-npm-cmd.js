"use strict";

const Fs = require("fs");
const which = require("which");
const Path = require("path");

const { quote, unquote } = require("./utils");
const nodeJsVer = parseInt(process.versions.node.split(".")[0]);

module.exports = function resolveNpmCmd(exe, options) {
  // look for the windows CMD batch npm generates for JS
  const resolvedExe = which.sync(exe, options);
  if (Path.extname(resolvedExe).toLowerCase() !== ".cmd") {
    // since we already did the work to find it, use found full path
    return quote(resolvedExe);
  }

  // read the batch and find the node.exe execution line
  const script = Fs.readFileSync(resolvedExe)
    .toString()
    .split("\n")
    .map((x) => x.trim());

  const binName = Path.basename(resolvedExe).toLowerCase();
  const resolvedDir = Path.dirname(resolvedExe);
  // handle npm
  let nodeCmd;
  if (binName === "npm.cmd") {
    nodeCmd = script.find((l) => l.startsWith(`SET "NPM_CLI_JS=`)).replace(/NPM_CLI_JS=/, "");
  } else if (binName === "npx.cmd") {
    nodeCmd = script.find((l) => l.startsWith(`SET "NPX_CLI_JS=`)).replace(/NPX_CLI_JS=/, "");
  } else {
    nodeCmd =
      script.find((l) => l.startsWith(`"%~dp0\\node.exe"`)) ||
      script.find((l) => l.startsWith(`"%_prog%"`));
  }

  if (!nodeCmd) {
    return quote(resolvedExe);
  }
  // update JS script from batch file
  const a = nodeCmd.split(" ").filter((x) => x)[1];
  const b = a.replace(`%~dp0`, resolvedDir).replace(`%dp0%`, resolvedDir);
  let jsFile;
  if (nodeJsVer < 18) {
    jsFile = Path.normalize(b);
  } else {
    // starting with version 18, the behavior changed when there're escaping quotes
    jsFile = quote(Path.normalize(unquote(b)));
  }

  return { jsFile };
};
