"use client";

import { TraderStories } from "@/components/sections/TraderStories";

/** Known video metadata — matched 1-to-1 to each YouTube video ID and thumbnail artwork */
export const VIDEO_META: Record<string, { reward: string; desc: string; thumbnail: string; title: string }> = {
  bZq8jtD9acY: {
    reward: "$38,200",
    desc: "He Quit College to Trade… Here's What Happened • Sander Blaas",
    thumbnail: "/images/testimonials/hqdefault-88f16d731b.jpg",
    title: "I DROPPED OUT OF COLLEGE FOR TRADING",
  },
  "8NQAWtlh_ws": {
    reward: "$84,120",
    desc: "CK Propfirm 1 Year Review • Dan Cheung",
    thumbnail: "/images/testimonials/hqdefault-308afdd2f9.jpg",
    title: "BEST PROP? I TRUST CK PROPFIRM",
  },
  "5RjtGHPcuMM": {
    reward: "$15,995",
    desc: "From Failing Challenges to a $65K Payout • Pedro Perez",
    thumbnail: "/images/testimonials/hqdefault-9c0405cb37.jpg",
    title: "MY PERCEPTION ABOUT TRADING WAS WRONG...",
  },
  LNXpq8_PwxU: {
    reward: "$22,400",
    desc: "The Reality Of Trading 10 Minutes a Week • Paul Schulz",
    thumbnail: "/images/testimonials/hqdefault-ae10a042fa.jpg",
    title: "THIS IS HOW ALGO TRADING CHANGED IT ALL",
  },
};

export const FALLBACK_VIDEOS: VideoItem[] = [
  {
    id: "bZq8jtD9acY",
    thumbnail: VIDEO_META["bZq8jtD9acY"].thumbnail,
    reward: VIDEO_META["bZq8jtD9acY"].reward,
    title: VIDEO_META["bZq8jtD9acY"].title,
    desc: VIDEO_META["bZq8jtD9acY"].desc,
  },
  {
    id: "8NQAWtlh_ws",
    thumbnail: VIDEO_META["8NQAWtlh_ws"].thumbnail,
    reward: VIDEO_META["8NQAWtlh_ws"].reward,
    title: VIDEO_META["8NQAWtlh_ws"].title,
    desc: VIDEO_META["8NQAWtlh_ws"].desc,
  },
  {
    id: "5RjtGHPcuMM",
    thumbnail: VIDEO_META["5RjtGHPcuMM"].thumbnail,
    reward: VIDEO_META["5RjtGHPcuMM"].reward,
    title: VIDEO_META["5RjtGHPcuMM"].title,
    desc: VIDEO_META["5RjtGHPcuMM"].desc,
  },
  {
    id: "LNXpq8_PwxU",
    thumbnail: VIDEO_META["LNXpq8_PwxU"].thumbnail,
    reward: VIDEO_META["LNXpq8_PwxU"].reward,
    title: VIDEO_META["LNXpq8_PwxU"].title,
    desc: VIDEO_META["LNXpq8_PwxU"].desc,
  },
];

export interface VideoItem {
  id: string;
  title: string;
  thumbnail?: string;
  reward?: string | null;
  desc?: string | null;
}

export function Testimonials({ videos = FALLBACK_VIDEOS }: { videos?: VideoItem[] }) {
  return <TraderStories videos={videos} />;
}


