# unwrap-npm-cmd

Unwrap npm's node.js bin CMD batch for js files on Windows.

[Sample](./test/fixtures/sample.js):

```js
const unwrapNpmCmd = require("unwrap-npm-cmd");
console.log(unwrapNpmCmd("npm test"));
console.log(unwrapNpmCmd("npx mocha", { relative: true }));
console.log(unwrapNpmCmd("mocha test", { jsOnly: true }));
console.log(unwrapNpmCmd(`find "name" package.json`));
console.log(unwrapNpmCmd("hello world", { path: __dirname }));
```

Output:

```cmd
"C:\Users\userid\nvm\nodejs\bin\node.exe" "C:\Users\userid\nvm\nodejs\bin\node_modules\npm\bin\npm-cli.js" test
"C:\Users\userid\nvm\nodejs\bin\node.exe" "..\nvm\nodejs\bin\node_modules\npm\bin\npx-cli.js" mocha
"C:\Users\userid\unwrap-npm-cmd\node_modules\mocha\bin\mocha" test
"C:\WINDOWS\system32\find.EXE" "name" package.json
"C:\Users\userid\unwrap-npm-cmd\test\fixtures\hello.CMD" world
```

## Usage

```js
child.spawnSync(unwrapNpmCmd("mocha test", { relative: true }));
```

Would effectivly be doing:

```js
child.spawnSync(
  `"C:\\Users\\userid\\nvm\\nodejs\\bin\\node.exe" ".\\node_modules\\mocha\\bin\\_mocha" test`
);
```

## API

```js
unwrapNpmCmd(cmd, options);
```

`options`:

| name       | description                                                |
| ---------- | ---------------------------------------------------------- |
| `path`     | Use instead of the `PATH` environment variable.            |
| `jsOnly`   | Return only the JS file as command without node exe.       |
| `relative` | Convert JS file to relative path from CWD.                 |
| `cwd`      | Use instead of `process.cwd()` to find relative path from. |

# License

Licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
