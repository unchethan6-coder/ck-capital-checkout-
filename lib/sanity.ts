// Dependency-free Sanity client for CK Capital.
// Reads from the public "ck website" dataset (project 86rj27x5) over HTTP.
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '86rj27x5'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const API_VERSION = '2022-03-07'

export async function sanityFetch<T = unknown>(query: string, revalidate = 60): Promise<T | null> {
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, { next: { revalidate } })
    if (!res.ok) return null
    const json = (await res.json()) as { result?: T }
    return (json.result ?? null) as T | null
  } catch {
    return null
  }
}
