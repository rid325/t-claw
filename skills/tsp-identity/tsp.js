#!/usr/bin/env node
/**
 * tsp.js — TSP Identity for T-Claw
 *
 * Implements core TSP (Trust Spanning Protocol) concepts using Node.js built-in
 * crypto (Ed25519). This serves as a stand-in for @trustoverip/tsp-sdk, which
 * is the forthcoming official SDK from the Trust over IP Foundation.
 *
 * Usage:
 *   node tsp.js whoami
 *   node tsp.js sign "Hello, world"
 *   node tsp.js verify "<signed_envelope_json>"
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const IDENTITY_FILE = path.join(__dirname, "identity.json");

// ---------------------------------------------------------------------------
// Identity management
// ---------------------------------------------------------------------------

/**
 * Load existing identity or generate a new one.
 * The identity contains an Ed25519 keypair and a VID (Verified Identity).
 * In real TSP the VID would be a DID or similar resolvable identifier.
 */
function loadOrCreateIdentity() {
  if (fs.existsSync(IDENTITY_FILE)) {
    const raw = JSON.parse(fs.readFileSync(IDENTITY_FILE, "utf8"));
    return {
      vid: raw.vid,
      publicKey: crypto.createPublicKey({ key: Buffer.from(raw.publicKeyDer, "hex"), format: "der", type: "spki" }),
      privateKey: crypto.createPrivateKey({ key: Buffer.from(raw.privateKeyDer, "hex"), format: "der", type: "pkcs8" }),
    };
  }

  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const publicKeyDer = publicKey.export({ format: "der", type: "spki" }).toString("hex");
  const privateKeyDer = privateKey.export({ format: "der", type: "pkcs8" }).toString("hex");

  // VID: "did:key:" prefix + hex-encoded public key (simplified — real TSP uses multibase/multicodec)
  const vid = `did:key:${publicKeyDer}`;

  fs.writeFileSync(IDENTITY_FILE, JSON.stringify({ vid, publicKeyDer, privateKeyDer }, null, 2));
  console.error("New identity generated and saved to identity.json");

  return { vid, publicKey, privateKey };
}

// ---------------------------------------------------------------------------
// TSP envelope helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal TSP-style signed envelope.
 * Structure mirrors the TSP spec: sender VID, payload, and detached signature.
 */
function buildEnvelope(vid, message, signature) {
  return {
    tsp: "1.0",
    sender: vid,
    payload: Buffer.from(message).toString("base64"),
    signature: signature.toString("hex"),
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function cmdWhoami() {
  const identity = loadOrCreateIdentity();
  const pubKeyHex = identity.publicKey.export({ format: "der", type: "spki" }).toString("hex");
  console.log(JSON.stringify({ vid: identity.vid, publicKey: pubKeyHex }, null, 2));
}

function cmdSign(message) {
  if (!message) {
    console.error("Usage: node tsp.js sign \"<message>\"");
    process.exit(1);
  }

  const identity = loadOrCreateIdentity();
  const msgBuffer = Buffer.from(message, "utf8");
  const signature = crypto.sign(null, msgBuffer, identity.privateKey);
  const envelope = buildEnvelope(identity.vid, message, signature);

  console.log(JSON.stringify(envelope, null, 2));
}

function cmdVerify(envelopeJson) {
  if (!envelopeJson) {
    console.error("Usage: node tsp.js verify '<envelope_json>'");
    process.exit(1);
  }

  let envelope;
  try {
    envelope = JSON.parse(envelopeJson);
  } catch {
    console.error("Error: envelope must be valid JSON");
    process.exit(1);
  }

  // Extract the public key from the VID (our simplified did:key scheme)
  const pubKeyHex = envelope.sender.replace("did:key:", "");
  const publicKey = crypto.createPublicKey({
    key: Buffer.from(pubKeyHex, "hex"),
    format: "der",
    type: "spki",
  });

  const message = Buffer.from(envelope.payload, "base64");
  const signature = Buffer.from(envelope.signature, "hex");

  const valid = crypto.verify(null, message, publicKey, signature);

  console.log(JSON.stringify({
    valid,
    sender: envelope.sender,
    message: message.toString("utf8"),
    timestamp: envelope.timestamp,
  }, null, 2));
}

// ---------------------------------------------------------------------------
// CLI dispatch
// ---------------------------------------------------------------------------

const [, , command, ...args] = process.argv;

switch (command) {
  case "whoami":
    cmdWhoami();
    break;
  case "sign":
    cmdSign(args.join(" "));
    break;
  case "verify":
    cmdVerify(args.join(" "));
    break;
  default:
    console.error("Commands: whoami | sign \"<message>\" | verify '<envelope_json>'");
    process.exit(1);
}
