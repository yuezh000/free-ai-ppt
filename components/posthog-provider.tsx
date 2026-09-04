"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ??
  "phc_tUtU6DwAs7oZF2sWrh3DD3Mw2aVcyrV3sCv3GPLmJEwv";
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!posthog.__loaded) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        defaults: "2025-11-30",
        capture_pageview: true,
        capture_pageleave: true,
      });
    }
  }, []);

  return <Provider client={posthog}>{children}</Provider>;
}
