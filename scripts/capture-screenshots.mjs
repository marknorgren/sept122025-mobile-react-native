#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const maestroTestsDir = path.join(root, ".maestro", "tests");
const artifactsDir = path.join(root, "artifacts");

function ensureMaestro() {
  const result = spawnSync("maestro", ["--version"], { stdio: "pipe" });
  if (result.error || result.status !== 0) {
    throw new Error(
      "Maestro CLI not found. Install with `brew install maestro` or see https://maestro.mobile.dev/getting-started/installation",
    );
  }
}

function listTestDirs() {
  if (!existsSync(maestroTestsDir)) {
    return [];
  }
  return readdirSync(maestroTestsDir)
    .map((entry) => path.join(maestroTestsDir, entry))
    .filter((entry) => statSync(entry).isDirectory());
}

function newestDir(dirs) {
  if (!dirs.length) return null;
  return dirs
    .map((dir) => ({ dir, mtime: statSync(dir).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0].dir;
}

function copyArtifacts(src, dest) {
  if (!existsSync(src)) {
    throw new Error(`Expected Maestro artifacts at ${src}`);
  }
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
}

function runFlow({ platform, flow, defaultDeviceEnv, skipEnv }) {
  if (process.env[skipEnv] === "1") {
    console.log(`⚠️  Skipping ${platform} screenshots (env ${skipEnv}=1)`);
    return;
  }
  const device = process.env[defaultDeviceEnv];
  const artifactsTarget = path.join(artifactsDir, platform);
  rmSync(artifactsTarget, { recursive: true, force: true });
  mkdirSync(artifactsTarget, { recursive: true });

  const before = listTestDirs();
  const args = ["test"];
  if (device) {
    args.push("--device", device);
  }
  args.push(flow);
  const result = spawnSync("maestro", args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`Maestro flow failed for ${platform}`);
  }
  const hasDirectOutput = existsSync(artifactsTarget) && readdirSync(artifactsTarget).length > 0;
  if (hasDirectOutput) {
    console.log(`✅ Saved ${platform} screenshots to ${artifactsTarget}`);
    return;
  }

  const after = listTestDirs();
  const newDirs = after.filter((dir) => !before.includes(dir));
  const latest = newestDir(newDirs.length ? newDirs : after);
  if (!latest) {
    throw new Error("Could not locate Maestro artifacts directory");
  }
  const artifactsSource = path.join(latest, "artifacts");
  copyArtifacts(artifactsSource, artifactsTarget);
  console.log(`✅ Saved ${platform} screenshots to ${artifactsTarget}`);
}

try {
  ensureMaestro();
  const flows = [
    {
      platform: "ios",
      flow: path.join("maestro", "flows", "screenshots-ios.yaml"),
      defaultDeviceEnv: "IOS_SIMULATOR",
      skipEnv: "SKIP_IOS",
    },
    {
      platform: "android",
      flow: path.join("maestro", "flows", "screenshots-android.yaml"),
      defaultDeviceEnv: "ANDROID_EMULATOR",
      skipEnv: "SKIP_ANDROID",
    },
  ];

  flows.forEach(runFlow);
  console.log("\nAll screenshots captured.");
} catch (error) {
  console.error(`\n❌ ${error.message}`);
  process.exit(1);
}
