---
name: tsp-identity
description: Adds TSP (Trust Spanning Protocol) identity to the agent. Enables signing outgoing messages and verifying incoming ones using a cryptographic keypair tied to a Verified Identity (VID).
metadata: >
  {
    "openclaw": {
      "always": true,
      "skillKey": "tsp-identity",
      "emoji": "🔐",
      "userInvocable": true
    }
  }
---

# TSP Identity Skill

This skill gives the agent a TSP (Trust Spanning Protocol) identity. Use it to sign outgoing messages and verify incoming ones using a cryptographic keypair.

## When to use this skill

Use this skill whenever the user asks about:
- Their identity, VID, or public key
- Signing a message
- Verifying a signed message
- TSP, Trust Spanning Protocol, or cryptographic identity

## How to invoke

This skill works by running `tsp.js` via the shell. The script is at:
`~/.openclaw/workspace/skills/tsp-identity/tsp.js`

### Show identity (whoami)

When the user says "show my identity", "who am i", "what is my VID", or similar:

Run this shell command and show the output:
```
node ~/.openclaw/workspace/skills/tsp-identity/tsp.js whoami
```

### Sign a message

When the user says "sign this message: <text>" or "sign <text>":

Run this shell command and show the output:
```
node ~/.openclaw/workspace/skills/tsp-identity/tsp.js sign "<message text>"
```

### Verify a message

When the user says "verify this message: <envelope>" or pastes a TSP envelope JSON:

Run this shell command and show the output:
```
node ~/.openclaw/workspace/skills/tsp-identity/tsp.js verify '<envelope json>'
```

## Output format

- `whoami` returns the agent's VID (did:key:...) and public key hex
- `sign` returns a TSP envelope with sender, payload, signature, and timestamp
- `verify` returns valid: true/false, the sender VID, and the original message

## Notes

- The keypair is generated on first run and saved to `identity.json` in the skill directory
- This is a TEA (TSP-Enabled AI Agent) demonstration — not production-hardened
