export function slugifyInput(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-");
}

export function trimSlugEdges(value: string): string {
  return value.replace(/^-+|-+$/g, "");
}
