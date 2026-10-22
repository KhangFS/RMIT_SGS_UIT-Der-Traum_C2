# Project overview

Action Guard separates an AI agent’s payment proposal from the authority to execute it.

**1. Vision & originality**
Agents prepare work; people authorize sensitive actions. Two workspaces make the boundary visible: Requester proposes a payment, and Approver reviews its exact recipient and amount.

**2. Trust constraint insight**
A compromised or mistaken agent could request an unwanted payment. Organisations cannot safely delegate financial work if that same agent can independently authorize every action.

**3. Value & impact**
Finance teams could automate preparation while retaining independent approval. Our example is a synthetic VND 15 million supplier invoice, flagged above a VND 10 million threshold.

**4. Why TideCloak matters**
The intended integration uses TideCloak to protect identity and authorization for sensitive execution. This member-B package currently provides the UI and API contract; its local server only simulates approval. Actual TideCloak enforcement must be integrated and verified by member A before claiming decentralized authorization.

**5. Prototype & storytelling**
The rehearsal demonstrates a denied execution attempt, independent role review, explicit execution after approval, rejection, and a simulated receipt. Requests remain unchanged after creation, and repeated execution returns the same receipt. All data and payments are synthetic. The rehearsal role header is not authentication and this package alone is not a completed TideCloak challenge submission.

## Run locally

Requires Node.js 20+; no dependency installation needed.

```powershell
cd D:\Codex\Hackathon\B_ActionGuard
node server.mjs
```

Open http://127.0.0.1:4317/?role=requester and http://127.0.0.1:4317/?role=approver in separate tabs. They share the in-memory rehearsal server. Restarting or resetting clears rehearsal records. The server listens only on loopback.

```powershell
node --test tests/workflow.test.mjs
```

## What is implemented

- Responsive English Requester and Approver UI; keyboard-operable forms and confirmation dialogs.
- Synthetic invoice, request queue, exact payment review, rejection, denied execution and simulated receipt.
- Cross-tab updates via polling; errors, disabled controls during requests, and loading/authentication failure state.
- Escaping of API-provided text. No secrets in the sample dataset.
- A separate fetch adapter and integration contract for A.

## Integration status and limitations

**TideCloak integration: not connected.** The demo header `X-Demo-Role` is intentionally forgeable. This server does not prove protection against a server administrator. Its audit timeline is an ordinary mutable in-memory demonstration, not cryptographic evidence. No actual LLM, bank service or external account is connected. All payments require approval; amounts above VND 10 million are labelled high value. This is an explicit demo policy, not a claimed BTC requirement.

Do not deploy `server.mjs` as a real authorization backend. See [API contract](docs/API_CONTRACT.md) and [Next.js integration](integration/NEXTJS.md). After A supplies authentication and protected execution, replace the adapter integration and re-run the acceptance checklist. Never just remove the rehearsal label to present the mock as TideCloak.

## Demo and delivery

- [120-second script and bilingual narration](docs/DEMO_SCRIPT.md)
- [Acceptance and public-repository checklist](docs/ACCEPTANCE.md)
- [Member-B handoff](docs/HANDOFF_VI.md)
- [Synthetic seed data](demo/demo-data.json)
- `demo/final-demo.mp4`: **not yet recorded**. Record the integrated app, not the mock as a final submission.

## Source requirements

Challenge: https://tide.org/unlocked/ ; submission form: https://forms.gle/HRHYjnqB86j1LFS97 . Required deliverables described in the supplied challenge: public repository, project overview of at most 300 words answering five prompts, and a two-minute MP4 below 100 MB. Check the event page for current submission availability; this local package does not submit a form or publish a repository.
