#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const config = require("../config");

const tool = process.platform === "win32" ? "DistributionTool.exe" : "DistributionTool";
const toolPath = path.join(__dirname, tool);

const buildDir = `build/${config.appName}.sdPlugin`;
const packageFile = `build/${config.appName}.streamDeckPlugin`;

if (fs.existsSync(packageFile)) {
  fs.unlinkSync(packageFile);
}

spawn(toolPath, ['-b', '-i', buildDir, '-o', 'build'], { stdio: "inherit" }).on("exit", process.exit);
