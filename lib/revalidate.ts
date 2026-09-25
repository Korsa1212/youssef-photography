export function revalidateNow() {
  if (typeof window === "undefined") return;
  void fetch("/api/revalidate", { method: "POST" }).catch(() => {});
}