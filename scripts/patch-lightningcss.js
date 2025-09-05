#!/usr/bin/env node
/*
  Workaround for Vercel build failing with:
  Error: Cannot find module '../lightningcss.linux-x64-gnu.node'
  Cause: lightningcss native binary not placed in lightningcss package root even though optional platform package installs it.
  Fix: detect platform-specific lightningcss-* package and copy its .node binary into node_modules/lightningcss/ with the filename lightningcss.<platform>.node that index.js expects.
*/
const fs = require('fs');
const path = require('path');

function log(msg){ console.log(`[patch-lightningcss] ${msg}`); }

try {
  const projectRoot = path.resolve(__dirname, '..');
  const nm = path.join(projectRoot, 'node_modules');
  const lightningPkg = path.join(nm, 'lightningcss');
  if (!fs.existsSync(lightningPkg)) {
    log('lightningcss package not present, skipping.');
    process.exit(0);
  }
  const entries = fs.readdirSync(nm).filter(d => d.startsWith('lightningcss-'));
  if (!entries.length) {
    log('No platform-specific lightningcss-* packages found; nothing to patch.');
    process.exit(0);
  }
  for (const dir of entries) {
    const variantDir = path.join(nm, dir);
    const files = fs.readdirSync(variantDir).filter(f => f.endsWith('.node') && f.startsWith('lightningcss.'));
    if (!files.length) continue;
    for (const file of files) {
      const target = path.join(lightningPkg, file);
      if (fs.existsSync(target)) {
        log(`Binary already present: ${file}`);
        continue;
      }
      fs.copyFileSync(path.join(variantDir, file), target);
      log(`Copied ${file} into lightningcss package root.`);
    }
  }
  log('Patch completed.');
} catch (e) {
  log(`Patch failed (non-fatal): ${e.message}`);
  process.exit(0); // do not fail install
}
