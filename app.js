const DEFAULT_TEXT = "Deploying in 5 minutes";

const messageEl = document.querySelector("#message");
const stageEl = document.querySelector(".stage");

function bytesToBase64Url(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

function decodePackedState(value) {
  const json = new TextDecoder().decode(base64UrlToBytes(value));
  const parsed = JSON.parse(json);
  return typeof parsed?.m === "string" ? parsed.m : "";
}

function readText() {
  const params = new URLSearchParams(window.location.search);

  if (params.has("text")) return params.get("text");
  if (params.has("m")) return params.get("m");
  if (params.has("message")) return params.get("message");

  if (params.has("d")) {
    try {
      return decodePackedState(params.get("d"));
    } catch {
      return "";
    }
  }

  return DEFAULT_TEXT;
}

function canonicalUrl(text) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("text", text);
  return url.toString();
}

function fitText() {
  const content = messageEl.textContent.trim() || " ";
  const lines = content.split("\n");
  const longest = Math.max(...lines.map(line => line.length), 1);
  const rect = stageEl.getBoundingClientRect();
  const maxWidth = Math.max(rect.width - 12, 20);
  const maxHeight = Math.max(rect.height - 12, 20);
  let low = 1;
  let high = Math.min(maxHeight / Math.max(lines.length * 0.58, 1), (maxWidth / longest) * 1.95, 900);

  for (let i = 0; i < 22; i += 1) {
    const mid = (low + high) / 2;
    messageEl.style.fontSize = `${mid}px`;

    if (messageEl.scrollWidth <= maxWidth && messageEl.scrollHeight <= maxHeight) {
      low = mid;
    } else {
      high = mid;
    }
  }

  messageEl.style.fontSize = `${Math.max(1, low)}px`;
}

const text = (readText() || DEFAULT_TEXT).slice(0, 500);
messageEl.textContent = text;
messageEl.dataset.url = canonicalUrl(text);
document.title = text;

requestAnimationFrame(fitText);
new ResizeObserver(fitText).observe(stageEl);
