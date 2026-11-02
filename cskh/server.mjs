import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const here = path.dirname(fileURLToPath(import.meta.url));
const docs = path.resolve(here, "../..");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".md": "text/plain; charset=utf-8",
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://127.0.0.1");
      const pathname = decodeURIComponent(url.pathname);
      const rooted =
        pathname.startsWith("/Design/") || pathname.startsWith("/CSKH/");
      const root = rooted ? docs : here;
      const file = path.resolve(
        root,
        "." + (pathname === "/" ? "/index.html" : pathname),
      );
      if (!file.startsWith(root + path.sep) || pathname.includes("..")) {
        res.writeHead(403);
        return res.end("Forbidden");
      }
      if (!(await stat(file)).isFile()) throw new Error("not file");
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(Number(process.env.CSKH_PORT || 4809), "127.0.0.1", () =>
    console.log(
      "CSKH PoC: http://127.0.0.1:" + (process.env.CSKH_PORT || 4809),
    ),
  );
