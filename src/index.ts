type Env = {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Check if ASSETS is available
      if (!env.ASSETS) {
        return new Response('ASSETS binding not found', { status: 500 });
      }

      // Check if it has fetch
      if (typeof env.ASSETS.fetch !== 'function') {
        return new Response('ASSETS.fetch is not a function', { status: 500 });
      }

      // Try to serve root index.html
      if (pathname === '/' || pathname === '') {
        const req = new Request('https://example.com/index.html');
        return env.ASSETS.fetch(req);
      }

      // Try the requested path
      const req = new Request('https://example.com' + pathname);
      let res = await env.ASSETS.fetch(req);

      // Fallback to index.html for SPA
      if (res.status === 404 && !pathname.includes('.')) {
        const indexReq = new Request('https://example.com/index.html');
        return env.ASSETS.fetch(indexReq);
      }

      return res;
    } catch (err) {
      return new Response(`Error: ${err instanceof Error ? err.message : String(err)}`, { status: 500 });
    }
  },
};
