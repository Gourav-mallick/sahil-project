export function assetPath(filename: string): string {
  if (!filename) {
    return "";
  }

  if (filename.startsWith("http") || filename.startsWith("/")) {
    return filename;
  }

  return `/assets/${filename}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
