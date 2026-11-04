/**
 * @file run-all-tests.js
 * Master Automated Test Orchestrator for Blinkit Mobile
 * Runs all tiers, layout audits, responsive metrics, and toolchain diagnostics.
 * Produces structured console output and pass/fail summary.
 */

const responsiveMetrics = require('./responsive-metrics.test.js');
const layoutAudit = require('./layout-audit.test.js');
const tier1Contracts = require('./tier1-feature-contracts.test.js');
const tier2Boundary = require('./tier2-boundary-matrix.test.js');
const tier3CrossFeature = require('./tier3-cross-feature.test.js');
const tier4Workloads = require('./tier4-workload-scenarios.test.js');
const diagnostics = require('./diagnostics.test.js');
const adversarialM1 = require('./adversarial-m1.test.js');

function runAll() {
  console.log('================================================================');
  console.log('       BLINKIT MOBILE: MASTER TEST SUITE RUNNER');
  console.log('================================================================\n');

  const suites = [
    { name: 'Responsive Layout Metrics', runner: responsiveMetrics.runTests },
    { name: 'Static Layout & Accessibility Audit', runner: layoutAudit.runTests },
    { name: 'Tier 1: Feature Coverage (21 Features)', runner: tier1Contracts.runTests },
    { name: 'Tier 2: Boundary & Corner Cases (21 Features)', runner: tier2Boundary.runTests },
    { name: 'Tier 3: Cross-Feature Interactions', runner: tier3CrossFeature.runTests },
    { name: 'Tier 4: Real-World Workload Scenarios', runner: tier4Workloads.runTests },
    { name: 'Challenger Adversarial & Stress Suite (Milestone 1)', runner: adversarialM1.runTests },
    { name: 'Toolchain & Expo Diagnostics', runner: diagnostics.runTests },
  ];

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  const failureList = [];

  for (const { name, runner } of suites) {
    const startTime = Date.now();
    process.stdout.write(`Executing: ${name}... `);
    const { results } = runner();
    const duration = Date.now() - startTime;

    const passed = results.filter((r) => r.pass).length;
    const failed = results.filter((r) => !r.pass);

    totalTests += results.length;
    totalPassed += passed;
    totalFailed += failed.length;

    if (failed.length === 0) {
      console.log(`[PASS] (${passed}/${results.length} tests in ${duration}ms)`);
    } else {
      console.log(`[FAIL] (${passed}/${results.length} passed, ${failed.length} failed in ${duration}ms)`);
      failed.forEach((f) => {
        failureList.push({ suite: name, id: f.id || f.name, desc: f.desc || f.name, error: f.error });
      });
    }
  }

  console.log('\n================================================================');
  console.log('                       TEST RUN SUMMARY');
  console.log('================================================================');
  console.log(`Total Test Suites : ${suites.length}`);
  console.log(`Total Test Cases  : ${totalTests}`);
  console.log(`Passed            : ${totalPassed}`);
  console.log(`Failed            : ${totalFailed}`);
  console.log(`Success Rate      : ${((totalPassed / totalTests) * 100).toFixed(1)}%`);

  if (failureList.length > 0) {
    console.log('\nFailures Detected:');
    failureList.forEach((f, idx) => {
      console.error(`  ${idx + 1}. [${f.suite}] ${f.id} (${f.desc}): ${f.error}`);
    });
    console.log('================================================================');
    process.exit(1);
  } else {
    console.log('================================================================');
    console.log('ALL VERIFICATION GATES PASSED CLEANLY (Exit Code: 0)');
    console.log('================================================================\n');
  }
}

if (require.main === module) {
  runAll();
}

module.exports = { runAll };
