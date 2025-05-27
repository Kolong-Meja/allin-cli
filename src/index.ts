#!/usr/bin/env node
import { runner } from "./core/runner";
import "tsconfig-paths/register";

function executable() {
  runner();
}

function main() {
  executable();
}

main();
