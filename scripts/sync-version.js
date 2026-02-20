const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

console.log(`🔄 Syncing version ${version} to Cargo.toml and pyproject.toml...`);

// 1. Update Cargo.toml
const cargoPath = path.join(rootDir, 'Cargo.toml');
let cargo = fs.readFileSync(cargoPath, 'utf8');
// Replace the first occurrence of version = "..." (package version)
cargo = cargo.replace(/^version = "[^"]+"/m, `version = "${version}"`);
fs.writeFileSync(cargoPath, cargo);

// 2. Update pyproject.toml
const pyPath = path.join(rootDir, 'pyproject.toml');
let pyproject = fs.readFileSync(pyPath, 'utf8');
// Replace the first occurrence of version = "..."
pyproject = pyproject.replace(/^version = "[^"]+"/m, `version = "${version}"`);
fs.writeFileSync(pyPath, pyproject);

// 3. Stage files for git commit (npm version does the commit automatically)
try {
    execSync('git add Cargo.toml pyproject.toml');
} catch (e) {
    console.warn('⚠️  Could not stage files. Are you in a git repo?');
}

console.log('✅ Version synced.');