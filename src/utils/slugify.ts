export function slugifyTenantName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '') // remove special chars
    .replace(/\s+/g, '_');       // replace spaces with _
}
