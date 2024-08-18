export function getIdFromUrl(url: string): string {
  const urlWithoutQuery = url.split("?")[0];
  const parts = urlWithoutQuery.split("/");
  return parts[parts.length - 1];
}
