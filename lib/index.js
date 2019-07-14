"use strict";

const resolveNmpCmd = require("./resolve-npm-cmd");

const RESOLVE_CACHE = {};

function unwrapExe(exe, options) {
  let pathCache = RESOLVE_CACHE[options.path];
  if (!pathCache) {
    pathCache = RESOLVE_CACHE[options.path] = {};
  }

  if (pathCache[exe]) {
    return pathCache[exe];
  }

  const newExe = resolveNmpCmd(exe, options.path);
  pathCache[exe] = newExe;

  return newExe;
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
