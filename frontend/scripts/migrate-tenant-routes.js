#!/usr/bin/env node
/*
  Migration: Move Next.js tenant-scoped dashboard to clean routes

  - Copies app/[tenant]/dashboard -> app/dashboard (preserves subtree)
  - Rewrites imports/links that include `/${tenant}/` to clean paths
  - Skips existing files by default unless --overwrite is passed
  - Dry run by default; use --commit to write changes

  Usage:
    node scripts/migrate-tenant-routes.js --dry
    node scripts/migrate-tenant-routes.js --commit
    node scripts/migrate-tenant-routes.js --commit --overwrite
*/

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const appDir = path.join(projectRoot, 'app');
const tenantDashboardDir = path.join(appDir, '[tenant]', 'dashboard');
const cleanDashboardDir = path.join(appDir, 'dashboard');

const args = process.argv.slice(2);
const commit = args.includes('--commit');
const overwrite = args.includes('--overwrite');

function log(action, rel, extra = '') {
  console.log(`${action.padEnd(10)} ${rel} ${extra}`.trim());
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      ensureDirSync(destPath);
      copyRecursive(srcPath, destPath);
    } else {
      const rel = path.relative(projectRoot, destPath).replace(/\\/g, '/');
      if (!overwrite && fs.existsSync(destPath)) {
        log('SKIP', rel, '(exists)');
        continue;
      }

      if (commit) {
        fs.copyFileSync(srcPath, destPath);
      }
      log(commit ? 'COPY' : 'PLAN', rel);
    }
  }
}

function rewriteFile(filePath) {
  const rel = path.relative(projectRoot, filePath).replace(/\\/g, '/');
  const original = fs.readFileSync(filePath, 'utf8');
  const rewritten = original
    // Replace path-based tenant links to clean paths
    .replace(/\`\/\$\{tenant\}\/dashboard\//g, '`/dashboard/')
    .replace(/"\/(?:\$\{tenant\}|\[tenant\])\/dashboard\//g, '"/dashboard/')
    .replace(/'\/(?:\$\{tenant\}|\[tenant\])\/dashboard\//g, "'/dashboard/")
    // Redirects like `/${tenant}/login` -> `/login`
    .replace(/\`\/\$\{tenant\}\/login\`/g, '`/login`')
    .replace(/"\/(?:\$\{tenant\}|\[tenant\])\/login"/g, '"/login"')
    .replace(/'\/(?:\$\{tenant\}|\[tenant\])\/login'/g, "'/login'");

  if (rewritten !== original) {
    if (commit) {
      fs.writeFileSync(filePath, rewritten, 'utf8');
    }
    log(commit ? 'REWRITE' : 'PLAN', rel);
  }
}

function rewriteTree(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) rewriteTree(full);
    else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) rewriteFile(full);
  }
}

function main() {
  if (!fs.existsSync(tenantDashboardDir)) {
    console.error('Source dashboard not found at', tenantDashboardDir);
    process.exit(1);
  }

  ensureDirSync(cleanDashboardDir);
  copyRecursive(tenantDashboardDir, cleanDashboardDir);
  rewriteTree(cleanDashboardDir);

  console.log('\nDone. Run with --commit to apply changes, or inspect the plan above.');
}

main();


