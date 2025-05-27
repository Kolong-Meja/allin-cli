#!/usr/bin/env node
import { runner } from "./core/runner.js";
import "tsconfig-paths/register.js";

function executable() {
  runner();
}

function main() {
  executable();
}

main();
