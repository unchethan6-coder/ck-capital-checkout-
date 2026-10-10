/**
 * Temporary hero takeover.
 *
 * Until `until`, the homepage hero plays this video as its full background in
 * place of the mascot artwork. After that the hero goes back to normal on its
 * own: the homepage re-renders every five minutes, so no deploy is needed.
 *
 * To extend the run, move `until`. To end it early, set it to a past date.
 */

export interface HeroVideoSource {
  src: string;
  type: string;
  /** Media query limiting which screens load this file. */
  media?: string;
}

export interface HeroVideo {
  /** In order of preference: the browser plays the first one it can. */
  sources: HeroVideoSource[];
  poster: string;
}

const DESKTOP = "(min-width: 1024px)";

const TAKEOVER = {
  sources: [
    // 1080p for large screens: HEVC where supported (same picture, 40% smaller), else H.264.
    { src: "/videos/hero-coin-1080-hevc.mp4", type: 'video/mp4; codecs="hvc1"', media: DESKTOP },
    { src: "/videos/hero-coin-1080.mp4", type: "video/mp4", media: DESKTOP },
    // 720p for phones and tablets, where the extra pixels would not show.
    { src: "/videos/hero-coin-720.mp4", type: "video/mp4" },
  ],
  poster: "/images/hero-coin-poster.jpg",
  until: "2026-10-18T00:00:00Z",
};

export function activeHeroVideo(now: number = Date.now()): HeroVideo | null {
  return now < Date.parse(TAKEOVER.until) ? { sources: TAKEOVER.sources, poster: TAKEOVER.poster } : null;
}
