const unwrapNpmCmd = require("../..");
console.log(unwrapNpmCmd("npm test"));
console.log(unwrapNpmCmd("npx mocha", { relative: true }));
console.log(unwrapNpmCmd("mocha test", { jsOnly: true }));
console.log(unwrapNpmCmd(`find "name" package.json`));
console.log(unwrapNpmCmd("hello world", { path: __dirname }));
