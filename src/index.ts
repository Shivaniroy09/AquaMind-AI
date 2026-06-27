export default {
  async fetch(request: Request, env: any): Promise<Response> {
    try {
      const url = new URL(request.url);
      let pathname = url.pathname;

      // For root path, serve index.html
      if (pathname === '/' || pathname === '') {
        const response = await env.ASSETS.fetch(
          new Request(new URL('/index.html', url.origin).toString(), request)
        );
        return new Response(response.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }

      // Try to serve the requested file
      let response = await env.ASSETS.fetch(request.clone());

      // If the file is not found and it doesn't have an extension,
      // serve index.html for SPA routing
      if (response.status === 404 && !pathname.includes('.')) {
        const indexResponse = await env.ASSETS.fetch(
          new Request(new URL('/index.html', url.origin).toString(), request)
        );
        return new Response(indexResponse.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      }

      // Ensure JavaScript files have the correct MIME type
      if (pathname.endsWith('.js')) {
        const headers = new Headers(response.headers);
        headers.set('Content-Type', 'application/javascript; charset=utf-8');
        headers.set('X-Content-Type-Options', 'nosniff');
        return new Response(response.body, {
          status: response.status,
          headers,
        });
      }

      // Add security headers
      if (response.status === 200 && pathname.endsWith('.css')) {
        const headers = new Headers(response.headers);
        headers.set('Content-Type', 'text/css; charset=utf-8');
        return new Response(response.body, {
          status: response.status,
          headers,
        });
      }

      return response;
    } catch (err) {
      console.error('Error fetching asset:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
