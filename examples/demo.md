# T-Claw Demo

A quick walkthrough of the tsp-identity skill from the command line.

## 1. Generate identity

```bash
$ node skills/tsp-identity/tsp.js whoami
New identity generated and saved to identity.json
{
  "vid": "did:key:302a300506032b6570032100...",
  "publicKey": "302a300506032b6570032100..."
}
```

Run it again — same identity is returned from `identity.json`.

## 2. Sign a message

```bash
$ node skills/tsp-identity/tsp.js sign "Hello from T-Claw"
{
  "tsp": "1.0",
  "sender": "did:key:302a300506032b6570032100...",
  "payload": "SGVsbG8gZnJvbSBULUNsYXc=",
  "signature": "a3f9c2...",
  "timestamp": "2026-04-04T12:00:00.000Z"
}
```

## 3. Verify the envelope

Copy the JSON output from step 2 and pass it to verify:

```bash
$ node skills/tsp-identity/tsp.js verify '{"tsp":"1.0","sender":"did:key:302a...","payload":"SGVsbG8gZnJvbSBULUNsYXc=","signature":"a3f9c2...","timestamp":"2026-04-04T12:00:00.000Z"}'
{
  "valid": true,
  "sender": "did:key:302a300506032b6570032100...",
  "message": "Hello from T-Claw",
  "timestamp": "2026-04-04T12:00:00.000Z"
}
```

## 4. Tamper detection

If you modify the payload or signature, verify returns `"valid": false`.

## 5. In-agent usage

With the skill installed in OpenClaw, just say:

> "sign this message: Hello from T-Claw"

The agent will call `tsp.js sign` and return the signed envelope inline.

> "verify this message: { ... envelope json ... }"

The agent will call `tsp.js verify` and report the result.

> "show my identity"

The agent will call `tsp.js whoami` and display the VID.
