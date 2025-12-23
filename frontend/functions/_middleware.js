export async function onRequest({ request, next }) {
  const url = new URL(request.url);

  // IMPORTANT: use the original request pathname
  const pathname = url.pathname;

  const response = await next();

  const shouldIsolate =
    pathname.startsWith('/dashboard/my-docs') ||
    pathname.startsWith('/zetajs') ||
    pathname.startsWith('/zetaoffice');

  const isDocument =
    response.headers.get('content-type')?.includes('text/html');

  headers.set('X-Debug-Isolation', 'applied');

  if (shouldIsolate && isDocument) {
    const headers = new Headers(response.headers);

    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  
  return response;
}
