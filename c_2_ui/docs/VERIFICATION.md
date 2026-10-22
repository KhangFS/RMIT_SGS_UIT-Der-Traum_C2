# Verification record — 22 October 2026

## Automated checks

`node --test tests/workflow.test.mjs`: **4/4 passed**. Coverage: execution before/after approval, role denial, rejection, missing identity, amount validation, immutable returned snapshots, receipt idempotency, HTTP status contract, malformed JSON and absence of a payment-edit route.

Initial localhost HTTP test was blocked by the execution sandbox (EACCES); rerunning with localhost access allowed passed. This was an environment failure, not a test assertion bypass.

`node --check` passed for app.js, api.js and server.mjs. README overview word count checked below the 300-word limit.

## Browser checks actually performed

Desktop preview in the in-app browser:

1. Loaded Requester empty state and form.
2. Submitted a VND 15,000,000 request.
3. Tried execution: visible denial and audit event; status remained pending.
4. Opened Approver workspace, reviewed exact amount/recipient/request ID in confirmation dialog.
5. Confirmed rehearsal approval; status APPROVED with no receipt.
6. Refreshed Requester and executed; status COMPLETED and one simulated receipt displayed.
7. Inspected desktop layout screenshot; saved `screenshots/requester.png`.

## Not verified / still outstanding

Real TideCloak login, signatures/ceremony, protected execution, separate real accounts, mobile viewport behavior, another physical computer, public GitHub access, final MP4 recording and submission. No claim of decentralized enforcement is based on the rehearsal tests. The Next.js wrapper is a handoff source file; it has not been built inside A's absent repository.
