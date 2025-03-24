import bcrypt from "bcrypt"

// Número de rounds para o salt do bcrypt
const SALT_ROUNDS = 10

// Função para criptografar um email
export async function hashEmail(email: string): Promise<string> {
  // Normaliza o email para lowercase antes de criptografar
  const normalizedEmail = email.toLowerCase()
  // Gera o hash do email
  return bcrypt.hash(normalizedEmail, SALT_ROUNDS)
}

// Função para comparar um email com um hash
export async function compareEmailWithHash(email: string, hash: string): Promise<boolean> {
  // Normaliza o email para lowercase antes de comparar
  const normalizedEmail = email.toLowerCase()
  // Compara o email com o hash
  return bcrypt.compare(normalizedEmail, hash)
}