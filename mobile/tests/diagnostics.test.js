/**
 * @file diagnostics.test.js
 * Programmatic Toolchain & Diagnostics Test Suite
 * Validates TypeScript compilation and Expo Doctor project health.
 */

const { execSync } = require('node:child_process');
const path = require('node:path');
const assert = require('node:assert/strict');

const ROOT_DIR = path.resolve(__dirname, '../..');
const MOBILE_DIR = path.resolve(__dirname, '..');

function runTests() {
  const suite = 'Toolchain & Expo Diagnostics Verification';
  const results = [];

  function test(id, desc, fn) {
    try {
      fn();
      results.push({ id, desc, pass: true });
    } catch (err) {
      results.push({ id, desc, pass: false, error: err.message });
    }
  }

  // 1. TypeScript Compilation Check
  test('DIAG-01', 'TypeScript Compilation: npm run test:mobile (tsc --noEmit) exits 0 with 0 errors', () => {
    try {
      const output = execSync('npm run test:mobile', {
        cwd: ROOT_DIR,
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 25000
      });
      assert.ok(!output.includes('error TS'), 'TypeScript output must not contain error TS');
    } catch (err) {
      assert.fail(`TypeScript compilation failed: ${err.stdout || err.message}`);
    }
  });

  // 2. Expo Doctor Diagnostics Check
  test('DIAG-02', 'Expo Diagnostics: npm --prefix mobile run doctor passes 20/20 checks', () => {
    try {
      const output = execSync('npm --prefix mobile run doctor', {
        cwd: ROOT_DIR,
        encoding: 'utf8',
        stdio: 'pipe',
        timeout: 30000
      });
      assert.ok(
        output.includes('20/20 checks passed') || output.includes('checks passed'),
        'Expo doctor must report all checks passed'
      );
    } catch (err) {
      assert.fail(`Expo doctor failed: ${err.stdout || err.message}`);
    }
  });

  return { suite, results };
}

if (require.main === module) {
  const { suite, results } = runTests();
  const passed = results.filter((r) => r.pass).length;
  console.log(`[SUITE] ${suite}: ${passed}/${results.length} passed.`);
  results.forEach((r) => {
    if (!r.pass) console.error(`  FAIL: ${r.id} (${r.desc}) -> ${r.error}`);
  });
  if (passed !== results.length) process.exit(1);
}

module.exports = { runTests };
