"use client";

import { useEffect } from "react";
import type { ModuleName, EventType } from "@/lib/analytics";

function getFingerprint(): string {
  if (typeof window === "undefined") return "";
  const nav = window.navigator;
  const raw = [
    nav.language,
    nav.languages?.join(","),
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    nav.hardwareConcurrency,
  ].join("|");
  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function track(event: EventType, module: ModuleName, meta?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const fingerprint = getFingerprint();
  // Fire and forget - never block UI
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, module, meta, fingerprint }),
  }).catch(() => {
    // Silently ignore tracking failures
  });
}

export function AnalyticsTracker({ module }: { module: ModuleName }) {
  useEffect(() => {
    track("page_view", module);
  }, [module]);

  return null;
}
