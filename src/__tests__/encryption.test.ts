import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { encrypt, decrypt } from "@/lib/encryption"

const VALID_KEY = "a".repeat(32) // 32 ASCII bytes = 32 bytes exactly

describe("encryption", () => {
  const originalKey = process.env.ENCRYPTION_KEY

  beforeEach(() => {
    process.env.ENCRYPTION_KEY = VALID_KEY
  })

  afterEach(() => {
    process.env.ENCRYPTION_KEY = originalKey
  })

  it("roundtrip: encrypt then decrypt returns original plaintext", () => {
    const plaintext = "my-secret-password-123"
    const ciphertext = encrypt(plaintext)
    expect(decrypt(ciphertext)).toBe(plaintext)
  })

  it("produces different ciphertexts for the same input (random IV)", () => {
    const plaintext = "same-password"
    const a = encrypt(plaintext)
    const b = encrypt(plaintext)
    expect(a).not.toBe(b)
  })

  it("throws if ENCRYPTION_KEY is missing", () => {
    delete process.env.ENCRYPTION_KEY
    expect(() => encrypt("test")).toThrow("ENCRYPTION_KEY env var is not set")
  })

  it("throws if ENCRYPTION_KEY is wrong byte length (32-char non-ASCII = >32 bytes)", () => {
    // 'é' is a 2-byte UTF-8 character — 32 of them = 64 bytes, not 32
    process.env.ENCRYPTION_KEY = "é".repeat(32)
    expect(() => encrypt("test")).toThrow(/must be exactly 32 bytes/)
  })

  it("throws on malformed ciphertext (missing IV separator)", () => {
    expect(() => decrypt("notvalidciphertext")).toThrow("Invalid ciphertext format")
  })
})
