"use strict";

const { expect } = require("chai");
const unwrapNmpCmd = require("../lib");
const Path = require("path");
const which = require("which");
const utils = require("../lib/utils");

describe("utils", function() {
  describe("quote", function() {
    it("should quote string", () => {
      expect(utils.quote("abc")).to.equal(`"abc"`);
      expect(utils.quote(`"abc"`)).to.equal(`"abc"`);
    });
  });

  describe("unquote", function() {
    it("should unquote string", () => {
      expect(utils.unquote(`"abc"`)).to.equal(`abc`);
      expect(utils.unquote(`abc`)).to.equal(`abc`);
    });
  });

  describe("relative", function() {
    it("should make relative path from cwd", () => {
      const r = utils.relative(`C:\\Users`, `C:\\Temp`);
      expect(r).to.equal(`..\\Users`);
    });
  });
});

describe("unwrap-npm-cmd", function() {
  const saveWhich = which.sync;
  this.afterEach(() => {
    which.sync = saveWhich;
  });

  it("should unwrap mocha", () => {
    const mochaExe = unwrapNmpCmd("mocha test");
    expect(mochaExe).contains(process.execPath);
  });

  it("should unwrap mocha as relative path", () => {
    const mochaExe = unwrapNmpCmd("mocha test", { relative: true });
    expect(mochaExe).contains(process.execPath);
    expect(mochaExe).contains(`.\\node_modules\\mocha`);
  });

  it("should unwrap npm", () => {
    const npmExe = unwrapNmpCmd("npm test");
    expect(npmExe).contains(process.execPath);
  });

  it("should unwrap npm without node exe if jsOnly is set", () => {
    const npmExe = unwrapNmpCmd("npm test", { jsOnly: true });
    expect(npmExe).not.contains(process.execPath);
    expect(npmExe).contains("npm-cli.js");
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
