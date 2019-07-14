"use strict";

const resolveNmpCmd = require("./resolve-npm-cmd");
const { quote, relative } = require("./utils");

const RESOLVE_CACHE = {};

function unwrapExe(exe, options) {
  let pathCache = RESOLVE_CACHE[options.path];

  if (!pathCache) {
    pathCache = RESOLVE_CACHE[options.path] = {};
  }

  let newExe;

  if (pathCache[exe]) {
    newExe = pathCache[exe];
  } else {
    try {
      newExe = resolveNmpCmd(exe, options);
      pathCache[exe] = newExe;
    } catch (err) {
      pathCache[exe] = exe;
      return exe;
    }
  }

  if (typeof newExe === "string") {
    return newExe;
  }

  let { jsFile } = newExe;

  if (options && options.relative) {
    jsFile = relative(jsFile, options.cwd);
  }

  if (options && options.jsOnly) {
    return quote(jsFile);
  }

  return [quote(process.execPath), quote(jsFile)].join(" ");
}

module.exports = function(cmd, options = { path: process.env.PATH }) {
  /* istanbul ignore next */
  if (process.platform !== "win32") {
    return cmd;
  }

  const cmdParts = cmd.split(" ");
  const exe = unwrapExe(cmdParts[0], options);
  if (exe !== cmdParts[0]) {
    return [exe].concat(cmdParts.slice(1)).join(" ");
  } else {
    return cmd;
  }
};
