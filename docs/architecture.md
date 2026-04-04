# T-Claw Architecture

## Overview

T-Claw integrates TSP identity into OpenClaw agents via the skill system. The core flow is:

```
Agent receives trigger phrase
        │
        ▼
OpenClaw loads tsp-identity skill (SKILL.md)
        │
        ▼
Agent calls tsp.js with appropriate command
        │
   ┌────┴────┐
whoami    sign/verify
   │          │
   ▼          ▼
identity.json  Ed25519 crypto (Node built-in)
```

## Components

**SKILL.md** — The OpenClaw skill manifest. Defines trigger phrases and plain-English instructions for the agent on when and how to invoke `tsp.js`.

**tsp.js** — Stateless CLI tool implementing three TSP operations:
- `whoami` — loads or generates the agent's Ed25519 keypair and returns the VID + public key
- `sign` — signs a message and wraps it in a TSP envelope (sender VID, base64 payload, hex signature, timestamp)
- `verify` — parses a TSP envelope, reconstructs the public key from the `did:key` VID, and verifies the signature

**identity.json** — Persisted keypair (DER-encoded, hex). Generated on first run. The private key never leaves this file.

## VID scheme

T-Claw uses a simplified `did:key` scheme: `did:key:<hex-encoded SPKI DER public key>`. This is self-contained — the public key is embedded in the VID itself, so verification requires no external registry lookup.

In a production TSP deployment, the VID would be a registered DID resolved via a VID registry, enabling key rotation and revocation.

## TEA Protocol

The TEA (TSP-Enabled AI Agent) pattern demonstrated here:

1. Agent generates identity on first use
2. Agent signs all outgoing messages with its private key
3. Receiving agent verifies the signature against the sender's VID
4. Trust is established without a central authority
