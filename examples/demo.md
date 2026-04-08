# T-Claw Demo

## Prerequisites

- Node.js v18+
- OpenClaw installed

## Install the skill

```bash
git clone https://github.com/rid325/t-claw
cp -r t-claw/skills/tsp-identity ~/.openclaw/workspace/skills/
```

## Run directly

```bash
# See your agent's identity
node skills/tsp-identity/tsp.js whoami

# Sign a message
node skills/tsp-identity/tsp.js sign "Hello from T-Claw"

# Verify a signed message
node skills/tsp-identity/tsp.js verify '<paste envelope json>'
```

## Expected output

`whoami` returns your agent's VID and public key.

`sign` returns a TSP envelope with sender, payload, signature and timestamp.

`verify` returns `valid: true` if the signature is genuine.

## Via OpenClaw chat

Once installed, tell your agent:

- "sign this message: hello world"
- "show my identity"
- "verify this message: \<paste envelope\>"
