export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Ensure pathname starts with /
    if (!pathname.startsWith('/')) {
      pathname = '/' + pathname;
    }

    // Try to serve the requested file
    try {
      const response = await env.ASSETS.fetch(request.clone());

      if (response.status === 404) {
        // If the file is not found and it's not a file with an extension,
        // serve index.html for SPA routing
        if (!pathname.includes('.')) {
          const indexResponse = await env.ASSETS.fetch(
            new Request(new URL('/index.html', url.origin).toString(), request)
          );
          return new Response(indexResponse.body, {
            status: 200,
            headers: {
              ...Object.fromEntries(indexResponse.headers.entries()),
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          });
        }
      }

      return response;
    } catch (err) {
      console.error('Error fetching asset:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
