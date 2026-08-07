export function assetPath(filename: string): string {
  if (!filename) {
    return "";
  }

  if (filename.startsWith("/")) {
    return filename;
  }

  if (filename.startsWith("http")) {
    return toDriveImageUrl(filename);
  }

  return `/assets/${filename}`;
}

function toDriveImageUrl(url: string): string {
  const patterns = [/\/file\/d\/([^/]+)/, /[?&]id=([^&]+)/, /\/d\/([^/]+)/];
  const match = patterns.map((pattern) => url.match(pattern)).find(Boolean);
  const id = match?.[1];

  if (!id || !url.includes("drive.google.com")) {
    return url;
  }

  return `https://drive.google.com/uc?export=view&id=${id}`;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
