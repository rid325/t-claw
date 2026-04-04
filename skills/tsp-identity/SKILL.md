---
name: tsp-identity
version: 1.0.0
description: Adds TSP (Trust Spanning Protocol) identity to the agent. Enables signing outgoing messages and verifying incoming ones using a cryptographic keypair tied to a Verified Identity (VID).
triggers:
  - "sign this message"
  - "sign message"
  - "verify this message"
  - "verify message"
  - "show my identity"
  - "who am i"
  - "what is my VID"
  - "my identity"
dependencies:
  - tsp.js
---

# TSP Identity Skill

This skill gives the agent a TSP identity. It can sign outgoing messages so recipients can verify they came from this agent, and verify incoming messages to confirm they came from a trusted sender.

## What is TSP?

The Trust Spanning Protocol (TSP) is a ToIP (Trust over IP) standard for secure, identity-bound messaging between agents. Each agent has a Verified Identity (VID) backed by a cryptographic keypair. Messages are signed with the private key and verified with the public key.

## Behavior

When the user says something matching a trigger phrase, the agent should:

### "sign this message" / "sign message"
1. Take the message content provided by the user (or the last message in context).
2. Call `tsp.js sign "<message>"` to produce a signed TSP envelope.
3. Return the signed envelope to the user, explaining that it is now cryptographically bound to this agent's VID.

### "verify this message" / "verify message"
1. Take the signed envelope provided by the user.
2. Call `tsp.js verify "<signed_envelope>"` to check the signature.
3. Report whether the signature is valid or invalid, and which VID it belongs to.

### "show my identity" / "who am i" / "what is my VID" / "my identity"
1. Call `tsp.js whoami` to retrieve the agent's public VID and public key.
2. Present the VID and public key to the user in a readable format.

## Notes

- The keypair is generated once and stored in `identity.json` in the skill directory. Do not share the private key.
- This is a demonstration implementation of the TEA (TSP-Enabled AI Agent) protocol. It is not production-hardened.
- In a full TSP deployment, the VID would be registered with a VID registry and the public key published for discovery.
