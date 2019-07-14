# unwrap-npm-cmd

Unwrap npm's node.js bin CMD batch for js files on Windows.

[Sample](./test/fixtures/sample.js):

```js
const unwrapNpmCmd = require("unwrap-npm-cmd");
console.log(unwrapNpmCmd("npm test"));
console.log(unwrapNpmCmd("npx mocha"));
console.log(unwrapNpmCmd("mocha test"));
console.log(unwrapNpmCmd(`find "name" package.json`));
console.log(unwrapNpmCmd("hello", { path: __dirname }));
```

Output:

```cmd
"C:\Users\userid\nvm\nodejs\bin\node.exe" "C:\Users\userid\nvm\nodejs\bin\node_modules\npm\bin\npm-cli.js" test
"C:\Users\userid\nvm\nodejs\bin\node.exe" "C:\Users\userid\nvm\nodejs\bin\node_modules\npm\bin\npx-cli.js" mocha
"C:\Users\userid\nvm\nodejs\bin\node.exe" "C:\Users\userid\project\node_modules\mocha\bin\_mocha" test
"C:\WINDOWS\system32\find.EXE" "name" package.json
"C:\Users\userid\project\test\fixtures\hello.CMD" world
```

## Usage

```js
child.spawnSync(unwrapNpmCmd("mocha test"));
```

Would effectivly be doing:

```js
child.spawnSync(
  `"C:\\Users\\userid\\nvm\\nodejs\\bin\\node.exe" "C:\\Users\\userid\\project\\node_modules\\mocha\\bin\\_mocha" test`
);
```

# License

Licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
