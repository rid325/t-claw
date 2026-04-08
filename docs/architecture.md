# T-Claw Architecture

## The Problem

OpenClaw is a powerful AI agent but has no cryptographic identity. When it sends a message, there is no way to verify it actually came from your agent and not an impersonator or a tampered version.

## The Solution

T-Claw adds a TSP (Trust Spanning Protocol) identity layer as an OpenClaw skill. Every message the agent sends is signed with a private key tied to a Verifiable Identifier (VID). Anyone receiving the message can verify the signature using the public key embedded in the VID.

## How it works

```
User installs tsp-identity skill
        ↓
Agent generates Ed25519 keypair on first run
        ↓
Agent gets a VID (did:key:...)
        ↓
Outgoing messages → signed with private key → TSP envelope
        ↓
Receiving agent → verifies signature with public key → trusted
```

## Components

- SKILL.md — OpenClaw skill definition and trigger phrases
- tsp.js — Core TSP logic (sign, verify, whoami)
- identity.json — Agent's keypair and VID (generated locally)

## Future work

- Integrate official @trustoverip/tsp-sdk
- Add relationship table (track verified agents)
- Deploy to Telegram and Discord
- Package as standalone npm library
