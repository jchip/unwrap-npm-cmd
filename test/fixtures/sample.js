const unwrapNpmCmd = require("../..");
console.log(unwrapNpmCmd("npm test"));
console.log(unwrapNpmCmd("npx mocha"));
console.log(unwrapNpmCmd("mocha"));
console.log(unwrapNpmCmd(`find "name" package.json`));
console.log(unwrapNpmCmd("hello world", { path: __dirname }));
