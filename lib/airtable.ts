const AIRTABLE_API_URL = "https://api.airtable.com/v0"

export function getAirtableEnv(tableNameEnvKey?: string, defaultTableName?: string) {
  const baseId = process.env.AIRTABLE_BASE_ID
  const apiKey = process.env.AIRTABLE_API_KEY
  const tableName = (tableNameEnvKey ? process.env[tableNameEnvKey] : undefined) || defaultTableName || "Contactos"
  if (!baseId || !apiKey) {
    return { ok: false as const, error: "Missing AIRTABLE_BASE_ID or AIRTABLE_API_KEY" }
  }
  return { ok: true as const, baseId, apiKey, tableName }
}

export function getAirtableUrl(baseId: string, tableName: string) {
  return `${AIRTABLE_API_URL}/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}`
}

export function maskBaseId(baseId: string) {
  return `${baseId.slice(0, 3)}…${baseId.slice(-3)}`
}
