# T-Claw

T-Claw adds **TSP (Trust Spanning Protocol)** identity to [OpenClaw](https://github.com/openclaw), an open source AI agent framework.

It is a reference implementation of the **TEA (TSP-Enabled AI Agent)** protocol — demonstrating how an AI agent can sign outgoing messages and verify incoming ones using a cryptographic identity anchored to a Verified Identity (VID).

---

## What problem does it solve?

AI agents increasingly communicate with each other and with humans across trust boundaries. Without identity, there is no way to know:

- Did this message actually come from the agent it claims to be from?
- Has the message been tampered with in transit?
- Which agent is accountable for this action?

TSP solves this by giving each agent a **VID (Verified Identity)** backed by an Ed25519 keypair. Every outgoing message is signed; every incoming message can be verified. T-Claw wires this into OpenClaw's skill system so any agent can opt in with a single skill install.

---

## Project structure

```
t-claw/
├── skills/
│   └── tsp-identity/
│       ├── SKILL.md      ← OpenClaw skill definition
│       └── tsp.js        ← TSP sign/verify/whoami logic
├── docs/
│   └── architecture.md
├── examples/
│   └── demo.md
└── README.md
```

---

## Installing the skill into OpenClaw

1. Clone this repo into your OpenClaw skills directory:

```bash
git clone https://github.com/your-org/t-claw
cp -r t-claw/skills/tsp-identity /path/to/openclaw/skills/
```

2. No npm install needed — `tsp.js` uses only Node.js built-in modules.

3. OpenClaw will auto-discover the skill via `SKILL.md`. Restart your agent to load it.

---

## Using the skill

Once installed, the agent responds to these trigger phrases:

| Phrase | Action |
|---|---|
| `show my identity` | Prints the agent's VID and public key |
| `sign this message` | Signs the provided message and returns a TSP envelope |
| `verify this message` | Verifies a TSP envelope and reports validity |

You can also call `tsp.js` directly from the command line:

```bash
# Generate identity and print VID
node skills/tsp-identity/tsp.js whoami

# Sign a message
node skills/tsp-identity/tsp.js sign "Hello from T-Claw"

# Verify a signed envelope (paste the JSON output from sign)
node skills/tsp-identity/tsp.js verify '{"tsp":"1.0","sender":"did:key:...","payload":"...","signature":"...","timestamp":"..."}'
```

---

## TSP SDK note

This implementation uses Node.js built-in `crypto` (Ed25519) to demonstrate TSP concepts. The official `@trustoverip/tsp-sdk` package from the [Trust over IP Foundation](https://trustoverip.org) is in active development. When it ships, `tsp.js` can be updated to use it as a drop-in replacement — the interface (sign, verify, whoami) stays the same.

---

## License

Apache 2.0
