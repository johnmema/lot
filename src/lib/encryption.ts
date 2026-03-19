import { createCipheriv, createDecipheriv, randomBytes } from "crypto"

const ALGORITHM = "aes-256-cbc"
const KEY_LENGTH = 32
const IV_LENGTH = 16

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) throw new Error("ENCRYPTION_KEY env var is not set")
  const keyBytes = Buffer.from(key)
  if (keyBytes.byteLength !== KEY_LENGTH) {
    throw new Error(
      `ENCRYPTION_KEY must be exactly ${KEY_LENGTH} bytes, got ${keyBytes.byteLength}`
    )
  }
  return keyBytes
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  // Store as iv:encrypted (both hex encoded)
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`
}

export function decrypt(ciphertext: string): string {
  const [ivHex, encryptedHex] = ciphertext.split(":")
  if (!ivHex || !encryptedHex) throw new Error("Invalid ciphertext format")
  const iv = Buffer.from(ivHex, "hex")
  const encrypted = Buffer.from(encryptedHex, "hex")
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString("utf8")
}
