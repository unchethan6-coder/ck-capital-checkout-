/**
 * Temporary hero takeover.
 *
 * Until `until`, the homepage hero plays this video as its full background in
 * place of the mascot artwork. After that the hero goes back to normal on its
 * own: the homepage re-renders every five minutes, so no deploy is needed.
 *
 * To extend the run, move `until`. To end it early, set it to a past date.
 */

export interface HeroVideo {
  src: string;
  poster: string;
}

const TAKEOVER = {
  src: "/videos/hero-coin.mp4",
  poster: "/images/hero-coin-poster.jpg",
  until: "2026-10-18T00:00:00Z",
};

export function activeHeroVideo(now: number = Date.now()): HeroVideo | null {
  return now < Date.parse(TAKEOVER.until) ? { src: TAKEOVER.src, poster: TAKEOVER.poster } : null;
}
