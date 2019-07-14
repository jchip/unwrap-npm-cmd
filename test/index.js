"use strict";

const { expect } = require("chai");
const unwrapNmpCmd = require("../lib");
const Path = require("path");
const which = require("which");

describe("unwrap-npm-cmd", function() {
  const saveWhich = which.sync;
  this.afterEach(() => {
    which.sync = saveWhich;
  });

  it("should unwrap mocha", () => {
    const mochaExe = unwrapNmpCmd("mocha test");
    expect(mochaExe).contains(process.execPath);
  });

  it("should unwrap npm", () => {
    const npmExe = unwrapNmpCmd("npm test");
    expect(npmExe).contains(process.execPath);
  });

  it("should unwrap npx", () => {
    const npxExe = unwrapNmpCmd("npx test");
    expect(npxExe).contains(process.execPath);
  });

  it("should not translate non-cmd files", () => {
    const e = unwrapNmpCmd("find this");
    expect(e.toLowerCase()).to.equal(`"c:\\windows\\system32\\find.exe" this`);
  });

  it("should cache results", () => {
    const e = unwrapNmpCmd("cmd script");
    expect(e.toLowerCase()).to.equal(`"c:\\windows\\system32\\cmd.exe" script`);
    let called = false;
    which.sync = () => {
      called = true;
      throw new Error("which.sync should not be called");
    };
    const e2 = unwrapNmpCmd("cmd script");
    expect(e2.toLowerCase()).to.equal(`"c:\\windows\\system32\\cmd.exe" script`);
    expect(called, "which.sync should not be called").to.equal(false);
  });

  it("should do nothing for unknown command", () => {
    const e = unwrapNmpCmd("blah blah blah");
    expect(e).to.equal("blah blah blah");
  });

  it("should not translate non-npm cmd file", () => {
    const e = unwrapNmpCmd("hello", {
      path: [Path.join(__dirname, "fixtures"), process.env.PATH].join(Path.delimiter)
    });
    expect(e.toLowerCase()).contains(`test\\fixtures\\hello.cmd`);
  });
});
