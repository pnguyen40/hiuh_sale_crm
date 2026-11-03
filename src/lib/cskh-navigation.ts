// The offline CRM and CSKH handoff files are distributed side by side.
export function cskhUrl(
  surface: "portal" | "review",
  frame?: string,
  protocol = typeof window === "undefined" ? "https:" : window.location.protocol,
) {
  const query = new URLSearchParams();
  if (protocol === "file:") query.set("surface", surface);
  if (frame) query.set("frame", frame);
  const page =
    protocol === "file:"
      ? "./cskh-prototype.html"
      : `/cskh/${surface === "portal" ? "index" : "review-ai"}.html`;
  return page + (query.size ? `?${query}` : "");
}
