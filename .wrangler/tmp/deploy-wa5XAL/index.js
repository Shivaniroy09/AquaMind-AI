// src/index.ts
var index_default = {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      if (!env.ASSETS) {
        return new Response("ASSETS binding not found", { status: 500 });
      }
      if (typeof env.ASSETS.fetch !== "function") {
        return new Response("ASSETS.fetch is not a function", { status: 500 });
      }
      if (pathname === "/" || pathname === "") {
        const req2 = new Request("https://example.com/index.html");
        return env.ASSETS.fetch(req2);
      }
      const req = new Request("https://example.com" + pathname);
      let res = await env.ASSETS.fetch(req);
      if (res.status === 404 && !pathname.includes(".")) {
        const indexReq = new Request("https://example.com/index.html");
        return env.ASSETS.fetch(indexReq);
      }
      return res;
    } catch (err) {
      return new Response(`Error: ${err instanceof Error ? err.message : String(err)}`, { status: 500 });
    }
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
