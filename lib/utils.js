"use strict";

const Path = require("path");

const unquote = (x) => x.trim().replace(/^['"]+|['"]+$/g, "");
const quote = (x) => (!x.startsWith(`"`) ? `"${x}"` : x);
const relative = (x, cwd) => {
  const r = Path.relative(cwd || process.cwd(), unquote(x));
  return r.startsWith(".") ? r : `.\\${r}`;
};

module.exports = { unquote, quote, relative };
