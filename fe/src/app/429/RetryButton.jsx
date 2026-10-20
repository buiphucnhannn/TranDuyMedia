"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@/components/icons";
import { safeNext } from "@/lib/safe-next";

const MAX_WAIT = 15 * 60; // giây

/** Nút "Thử lại" — đếm ngược theo ?retry= rồi mới bấm được, quay về đúng trang định vào (?next=). */
function Inner({ next = "/admin", wait = 0 }) {
  const [left, setLeft] = useState(wait);

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const ready = left <= 0;
  const label = ready
    ? "Thử lại"
    : `Thử lại sau ${left >= 60 ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : `${left}s`}`;

  return (
    <a
      href={ready ? next : undefined}
      aria-disabled={!ready}
      className={`group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-6 text-sm font-semibold text-ink tabular-nums transition ${
        ready ? "hover:bg-paper-100" : "pointer-events-none opacity-60"
      }`}
    >
      {label}
      <span className="flex size-9 items-center justify-center rounded-full bg-orange-500 text-white transition-transform group-hover:rotate-180">
        <Icon name="refresh" className="size-4" />
      </span>
    </a>
  );
}

function WithParams() {
  const params = useSearchParams();
  const wait = Math.min(MAX_WAIT, Math.max(0, parseInt(params.get("retry") ?? "0", 10) || 0));
  return <Inner next={safeNext(params.get("next"))} wait={wait} />;
}

export function RetryButton({ withParams = false }) {
  return withParams ? <WithParams /> : <Inner />;
}
