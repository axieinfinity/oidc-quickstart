export function generateQueryString(
  params: Record<string, undefined | number | string>,
): string {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([k, v]) => v !== undefined),
    ) as Record<string, string>,
  ).toString()
}
