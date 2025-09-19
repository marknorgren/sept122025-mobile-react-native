#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const artifactsDir = path.join(root, "artifacts");
const maestroTestRoots = [
  process.env.MAESTRO_TESTS_DIR,
  path.join(os.homedir(), ".maestro", "tests"),
  path.join(root, ".maestro", "tests"),
].filter(Boolean);
const appId = process.env.MAESTRO_APP_ID;

if (!appId) {
  throw new Error(
    "MAESTRO_APP_ID environment variable is required (e.g. 'com.example.app'). " +
      "Set it to the bundle identifier of the installed dev build before running screenshots.",
  );
}

function listAvailableTestDirs() {
  for (const candidate of maestroTestRoots) {
    if (!candidate || !existsSync(candidate)) {
      continue;
    }
    const dirs = readdirSync(candidate)
      .map((entry) => path.join(candidate, entry))
      .filter((entry) => {
        try {
          return statSync(entry).isDirectory();
        } catch (_error) {
          return false;
        }
      });
    if (dirs.length > 0) {
      return dirs;
    }
  }
  return [];
}

function ensureMaestro() {
  const result = spawnSync("maestro", ["--version"], { stdio: "pipe" });
  if (result.error || result.status !== 0) {
    throw new Error(
      "Maestro CLI not found. Install with `brew install maestro` or see https://maestro.mobile.dev/getting-started/installation",
    );
  }
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

  const before = listAvailableTestDirs();
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

  const after = listAvailableTestDirs();
  const newDirs = after.filter((dir) => !before.includes(dir));
  const latest = newestDir(newDirs.length ? newDirs : after);
  if (!latest) {
    const searchHints = maestroTestRoots.length
      ? maestroTestRoots.join(", ")
      : "(no search paths available)";
    throw new Error(`Could not locate Maestro artifacts directory (searched: ${searchHints})`);
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
