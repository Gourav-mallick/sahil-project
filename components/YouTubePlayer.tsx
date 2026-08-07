"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

type YouTubePlayerProps = {
  url: string;
  title: string;
};

export function YouTubePlayer({ url, title }: YouTubePlayerProps) {
  const embedUrl = useMemo(() => toYouTubeEmbedUrl(url), [url]);
  const [playerKey, setPlayerKey] = useState(0);

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-secondary shadow-soft">
      <iframe
        key={playerKey}
        src={embedUrl}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      <button
        type="button"
        onClick={() => setPlayerKey((key) => key + 1)}
        className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 text-xs font-bold text-secondary shadow-lg transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Stop
      </button>
    </div>
  );
}

function toYouTubeEmbedUrl(url: string): string {
  const id = getYouTubeId(url);

  if (!id) {
    return "";
  }

  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}

function getYouTubeId(url: string): string {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/
  ];

  const match = patterns.map((pattern) => url.match(pattern)).find(Boolean);
  return match?.[1] || "";
}
